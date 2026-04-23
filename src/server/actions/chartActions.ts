'use server';

import { getGcpStorageSignedUrl, getSignedUrlForUpload, deleteGcpStorageFile } from '@/server/gcpClient';
import { getFullUser } from '@/server/actions/userActions';
import logger from 'lib/logger';

export async function getImageDataUrl(filePath: string): Promise<string> {
  return await getGcpStorageSignedUrl(filePath, 'lifeinsights');
}

export const uploadChart = async (svgString: string): Promise<string | null> => {
  try {
    const { id } = await getFullUser();
    const fileName = `history/${id}/chart-${Date.now()}.svg`;
    const { url, fields } = await getSignedUrlForUpload(fileName, 'image/svg+xml', 'lifeinsights');
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    const buffer = new Blob([svgString], { type: 'image/svg+xml' });
    formData.append('file', buffer);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
    });


    if (!response.ok && response.type !== 'opaque') {
      logger.error(`Failed to upload file: ${response.status}`, response.statusText);
    }

    return fileName;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const deleteChart = async (filePath: string): Promise<boolean | null> => {
  try {
    await deleteGcpStorageFile(filePath, 'lifeinsights');

    return true;
  } catch {
    return false;
  }
};
