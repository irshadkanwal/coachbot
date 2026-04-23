import { Chat } from './data.models';

export enum Role {
  user = 'user',
  assistant = 'assistant',
}

export enum Thumb {
  like = 'like',
  dislike = 'dislike',
  unknown = 'unknown',
}

export enum MessageStatus {
  inProgress = "in_progress",
  completed = "completed",
  loading = "loading"
}

export type MessageAction = {
  key: keyof Message;
  value?: any;
  reset?: any;
};

export interface Message {
  id: string;
  content: string;
  thumb?: Thumb | string | undefined;
  star?: boolean | null;
  flagged?: boolean | null;
  chat?: Chat;
  chatId?: string | null;
  role: Role | string;
  created_at?: Date | string | null;
  type?: string | null;
  status?: MessageStatus;
}

export interface SendMessagePayload {
  user_id: string;
  assistant_id: string;
  chat_id: string;
  history: Message[];
  newMessage: Message;
  current_stage: string;
  missing_criteria: Record<string, any>[];
  reasoning: string;
  language: string;
}
export interface SendMessageResponse {
  chat_id: string;
  response: string;
}

export interface InitialMessagePayload {
  user_id: string;
  user_name: string;
  assistant_id: string;
  recurring: boolean;
  language: string;
  last_conversation_date?: string;
  conversation_history?: Message[];
}

export interface InitialMessageResponse {
  chat_id: string;
  response: string;
}

export interface TokensData {
  total?: number | null;
  increment?: number | null;
}

export interface AudioMessage {
  id: string;
  object: string;
  role: Role | string;
  status: MessageStatus | string;
  type: string;
  content?: string;
  created_at?: Date | string | null;
  delta?: string;
  transcript?: string;
}
