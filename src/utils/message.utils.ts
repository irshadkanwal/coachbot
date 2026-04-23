import { Message, Role } from '@models/message.models';
import { ThreadCreateParams } from 'openai/resources/beta/threads/threads.mjs';
import { ChatCompletion, Moderation } from 'openai/resources/index.mjs';
import { generateUUID } from './common.utils';

export const mapThreadMessages = (initialMessages: any[]): ThreadCreateParams.Message[] => {
  return initialMessages.map(({ content, role = 'user' }) => ({ content, role })) as any[];
};

export const getFlaggedCategories = (categories: Moderation.Categories): string[] => Object.entries(categories)
  .filter(([_, isFlagged]) => isFlagged)
  .map(([category]) => category);


export const getMessage = (content: string, role: Role, stage: string = '') => ({
  id: generateUUID(),
  content,
  stage,
  role,
  created_at: new Date().toISOString(),
});