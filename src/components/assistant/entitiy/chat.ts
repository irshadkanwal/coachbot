import { Category, Message } from '@models';

export interface ChatState {
    chatId?: string | null;
    messages: Message[];
    stage?: string;
    category?: Category | null;
    showAssessmentReminder: boolean;
    showOverlay: boolean;
    isVoiceMode: boolean;
    initialMessage: Message | null;
    error?: any;
  }