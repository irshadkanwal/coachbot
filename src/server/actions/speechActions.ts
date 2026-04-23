'use server';

import { openAIService } from '../aiClient';
import * as fs from 'fs';
import { ensureTmpDir } from '@/utils/fs-utils';
import path from 'path';
import { Readable } from 'stream';
import logger from 'lib/logger';

const pathToFFmpeg = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(pathToFFmpeg);

interface AudioFormat {
  extension: string;
  codec: string;
}

const AUDIO_FORMATS: { [key: string]: AudioFormat } = {
  wav: { extension: 'wav', codec: 'pcm_s16le' },
  mp3: { extension: 'mp3', codec: 'libmp3lame' },
  webm: { extension: 'webm', codec: 'libopus' },
  mp4: { extension: 'mp4', codec: 'aac' },
};

export async function getTextFromSpeech(speechAudioBase: string, mimeType: string): Promise<string> {
  const audioFormat = getAudioFormat(mimeType);
  if (!audioFormat) return '';

  const audio = Buffer.from(speechAudioBase, 'base64');
  const tmpDir = ensureTmpDir();
  const outputPath = path.join(tmpDir, `output.${audioFormat.extension}`);

  try {
    await processAudio(audio, audioFormat, outputPath);
    const text = await transcribeAudio(outputPath);
    return text;
  } catch (error) {
    handleError(error, outputPath);
    return '';
  } finally {
    cleanupFile(outputPath);
  }
}

function getAudioFormat(mimeType: string): AudioFormat | null {
  const regex = /^(?:audio|video)\/(\w+)(?=;|$)/;
  const match = mimeType.match(regex);
  if (!match) {
    logger.error(`[aiActions] Invalid mime type: `, mimeType);
    return null;
  }
  const format = AUDIO_FORMATS[match[1]];
  if (!format) {
    logger.error(`[aiActions] Unsupported audio format: `, match[1]);
    return null;
  }
  return format;
}

async function processAudio(audio: Buffer, format: AudioFormat, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const inputStream = new Readable();
    inputStream.push(audio);
    inputStream.push(null);

    ffmpeg(inputStream)
      .inputFormat(format.extension)
      .toFormat(format.extension)
      .audioCodec(format.codec)
      .on('error', reject)
      .on('end', resolve)
      .save(outputPath);
  });
}

async function transcribeAudio(filePath: string): Promise<string> {
  const readStream = fs.createReadStream(filePath);
  const response = await openAIService.createTranscription(readStream);
  return response.text;
}

function handleError(error: any, filePath: string): void {
  logger.error(`[aiActions] Error processing audio transcription:`, error);
  cleanupFile(filePath);
}

function cleanupFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
