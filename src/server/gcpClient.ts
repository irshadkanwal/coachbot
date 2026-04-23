'use server';

type SignedPostPolicyV4Output = {
  url: string;
  fields: Record<string, string>;
};

let storageInstance: any = null;

async function getStorage() {
  if (!storageInstance) {
    const { Storage } = await import('@google-cloud/storage');
    storageInstance = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
  },
});
  }
  return storageInstance;
}

const getGcpBucket = async (bucketName: string) => {
  const storage = await getStorage();
  return storage.bucket(bucketName);
};

export async function getGcpStorageSignedUrl(filename: string, bucketName: string): Promise<string> {
  const options = {
    version: 'v4' as const,
    action: 'read' as const,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const bucket = await getGcpBucket(bucketName || '');
  const [url] = await bucket.file(filename).getSignedUrl(options);

  return url;
}

export async function getSignedUrlForUpload(
  targetFile: string,
  contentType: string = 'image/jpeg',
  bucketName: string
): Promise<SignedPostPolicyV4Output> {
  const bucket = await getGcpBucket(bucketName || '');
  const file = bucket.file(targetFile);
  const options = {
    expires: Date.now() + 10 * 60 * 1000, //  10 minute,
    fields: {
      'Content-Type': contentType,
      'x-goog-meta-source': 'coachbot-project',
    },
  };

  const [response] = await file.generateSignedPostPolicyV4(options);
  return response;
}

export const deleteGcpStorageFile = async (filename: string, bucketName: string): Promise<void> => {
  const bucket = await getGcpBucket(bucketName || '');
  await bucket.file(filename).delete();
};
