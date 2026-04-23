import OpenAI from 'openai';
import { Transcription } from 'openai/resources/audio/transcriptions.mjs';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';
import { ReadStream } from 'fs';
import logger from 'lib/logger';

class OpenAIService {
  private static _instance: OpenAIService;
  private _azureOpenAI: OpenAI | null = null;
  private _azureTranscribeClient: OpenAI | null = null;

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!OpenAIService._instance) {
      OpenAIService._instance = new OpenAIService();
    }
    return OpenAIService._instance;
  }

  private get azureOpenAI(): OpenAI {
    if (!this._azureOpenAI) {
      this._azureOpenAI = new OpenAI({
        apiKey: process.env['AZURE_OPENAI_API_KEY'],
        baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments`,
        defaultQuery: { 'api-version': process.env.AZURE_OPENAI_COMPLETIONS_API_VERSION },
        defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
      });
    }

    return this._azureOpenAI;
  }

  private get azureTranscribeClient(): OpenAI {
    if (!this._azureTranscribeClient) {
      const deployment = process.env.AZURE_OPENAI_TRANSCRIBE_DEPLOYMENT || 'gpt-4o-transcribe';
      this._azureTranscribeClient = new OpenAI({
        apiKey: process.env['AZURE_OPENAI_API_KEY'],
        baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${deployment}`,
        defaultQuery: { 'api-version': process.env.AZURE_OPENAI_TRANSCRIBE_API_VERSION },
        defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
      });
    }

    return this._azureTranscribeClient;
  }

  public async createTranscription(readStream: ReadStream): Promise<Transcription> {
    try {
      return await this.azureTranscribeClient.audio.transcriptions.create({
        file: readStream,
        model: 'gpt-4o-transcribe',
      });
    } catch (error: any) {
      logger.error(`[AI] Error during audio transcription:`, error);
      throw new Error('[AI] Could not transcribe audio');
    }
  }

  public async createCompletions(
    messages: ChatCompletionMessageParam[],
    model: string = 'gpt-4o-mini'
  ): Promise<ChatCompletion> {
    try {
      return await this.azureOpenAI.chat.completions.create({
        model: process.env.AZURE_OPENAI_GPT4O_DEPLOYMENT || 'gpt-4o',
        messages,
      });
    } catch (error: any) {
      logger.error(`[AI] Error creating chat completions:`, error);
      throw new Error('[AI] Could not create chat completions.');
    }
  }
}

// Export the singleton instance
export const openAIService = OpenAIService.getInstance();
