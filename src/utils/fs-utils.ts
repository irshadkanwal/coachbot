import fs from 'fs';
import path from 'path';
import os from 'os';
import { gunzipSync } from 'zlib';

export function ensureTmpDir() {
  let localTmpDir;

  if (os.platform() === 'win32') {
    localTmpDir = path.join(process.cwd(), 'tmp');

    if (!fs.existsSync(localTmpDir)) {
      fs.mkdirSync(localTmpDir);
    }
  } else {
    localTmpDir = '/tmp/';
  }

  return localTmpDir
}

export function chartsPath(): string {
  return path.join(ensureTmpDir(), 'chart');
}

export async function parseGzData(data: any): Promise<any[]> {
  const buffer = Buffer.from(data);
  const decompressed = gunzipSync(buffer).toString('utf-8');
  const parsedData = decompressed
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  return parsedData;
}