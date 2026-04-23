'use server';

import { SessionUser } from "@models/data.models";
import logger from "lib/logger";
import { createChat, updateChatData } from "../prismaDB";
import { getChatsByName } from "./chatActions";
import { getManagementApiToken } from "@/utils/token-utils";
import { withoutTrailingSlash } from "@/utils/formatter";
import { poll } from "@/utils/poll-utils";
import { parseGzData } from "@/utils/fs-utils";
import { unstable_cache } from "next/cache";

const updateMessengerChatData = async (userId: string, threadId: string) => {
  const regex = /whatsapp/i;
  const [existingChat] = (await getChatsByName(userId, regex)) || [];
  const id = `thread_${threadId}`;

  if (!existingChat) {
    await createChat(userId, {
      name: 'WhatsApp Chat',
      created_at: `${Date.now()}`,
      updated_at: `${Date.now()}`,
      assistantId: process.env.DEFAULT_ASSISTANT_ID,
      id,
    });
  } else if (existingChat.id !== id) {
    await updateChatData(userId, existingChat.id, { id });
  }
};

export const handleMessengerLogin = async ({ sub, metadata }: SessionUser) => {
  const { whatsappId, threadId } = metadata;
  if (whatsappId) {
    threadId && (await updateMessengerChatData(sub, threadId));

    if (process.env.WHATSAPP_CALLBACK_URL) {
      return fetch(process.env.WHATSAPP_CALLBACK_URL || '', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          userId: whatsappId,
        }),
        redirect: 'manual',
      });
    }
  }
};

export const updateAuth0User = async (userId: string, data: Partial<SessionUser>) => {
  try {
    const token = await getManagementApiToken();
    const updateUrl = `${withoutTrailingSlash(process.env.AUTH0_DOMAIN)}/api/v2/users/${userId}`;

    const res = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return res.json();
  } catch (error: any) {
    logger.error(`[authActions] Error updating Auth0 user ${userId}:`, error);
    throw new Error(`[authActions] Error during updating Auth0 user.`, error);
  }
}

export async function createUsersExportJob(): Promise<string | null> {
  const token = await getManagementApiToken();

  const res = await fetch(`${withoutTrailingSlash(process.env.AUTH0_DOMAIN)}/api/v2/jobs/users-exports`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      format: 'json',
      fields: ['user_id', 'email', 'name', 'username', 'given_name', 'nickname', 'user_metadata'].map(name => ({ name })),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    logger.error(`[authActions] Create export users job error: ${data.message}`);
    return null;
  }

  return data.id;
}

export async function getJobData(jobId: string): Promise<{ status: string; location: string }> {
  const token = await getManagementApiToken();

  const res = await fetch(`${withoutTrailingSlash(process.env.AUTH0_DOMAIN)}/api/v2/jobs/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const job = await res.json();

  return job;
}

export const runUsersExport = unstable_cache(
  async () => {
    try {
      const jobId = await createUsersExportJob();

      if (!jobId) return null;

      const jobData = await poll({
        targetFn: () => getJobData(jobId),
        validateResult: ({ status }) => status === 'completed',
        interval: 1500,
        timeout: 60000,
      });

      if (!jobData.location) return null;

      const res = await fetch(jobData.location);
      const usersBuffer = await res.arrayBuffer();

      return await parseGzData(usersBuffer);
    } catch (error) {
      logger.error(`[authActions] Run users export error: ${error}`);
      return null;
    }
  },
  ['auth0-users'],
  { tags: ['auth0Users'], revalidate: 300 }
);