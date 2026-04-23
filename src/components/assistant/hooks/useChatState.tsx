import { useReducer, useMemo } from "react";
import { ChatState } from "../entitiy/chat";
import { useSearchParams } from "next/navigation";
import { getUniqueObjectsArray, toBoolean } from "@/utils/formatter";
import { Category, Message } from "@models";

export enum ChatStateActionType {
  SET_CHAT_ID = 'SET_CHAT_ID',
  SET_MESSAGES = 'SET_MESSAGES',
  ADD_MESSAGE = 'ADD_MESSAGE',
  UPDATE_MESSAGE = 'UPDATE_MESSAGE',
  SET_STAGE = 'SET_STAGE',
  SET_CATEGORY = 'SET_CATEGORY',
  SET_SHOW_ASSESSMENT_REMINDER = 'SET_SHOW_ASSESSMENT_REMINDER',
  SET_SHOW_OVERLAY = 'SET_SHOW_OVERLAY',
  SET_VOICE_MODE = 'SET_VOICE_MODE',
  SET_INITIAL_MESSAGE = 'SET_INITIAL_MESSAGE',
  SET_ERROR = 'SET_ERROR',
  RESET_STATE = 'RESET_STATE',
  UPDATE_STATE = 'UPDATE_STATE',
}

export type ChatStateAction =
  | { type: ChatStateActionType.SET_CHAT_ID; payload: string | null }
  | { type: ChatStateActionType.SET_MESSAGES; payload: Message[] }
  | { type: ChatStateActionType.ADD_MESSAGE; payload: Message }
  | { type: ChatStateActionType.UPDATE_MESSAGE; payload: { id: string; updates: Partial<Message> } }
  | { type: ChatStateActionType.SET_STAGE; payload: string }
  | { type: ChatStateActionType.SET_CATEGORY; payload: Category | null }
  | { type: ChatStateActionType.SET_SHOW_ASSESSMENT_REMINDER; payload: boolean }
  | { type: ChatStateActionType.SET_SHOW_OVERLAY; payload: boolean }
  | { type: ChatStateActionType.SET_VOICE_MODE; payload: boolean }
  | { type: ChatStateActionType.SET_INITIAL_MESSAGE; payload: Message | null }
  | { type: ChatStateActionType.SET_ERROR; payload: any }
  | { type: ChatStateActionType.RESET_STATE }
  | { type: ChatStateActionType.UPDATE_STATE; payload: Partial<ChatState> };

function chatStateReducer(state: ChatState, action: ChatStateAction): ChatState {
  switch (action.type) {
    case ChatStateActionType.SET_CHAT_ID:
      return { ...state, chatId: action.payload };

    case ChatStateActionType.SET_MESSAGES:
      return { ...state, messages: action.payload };

    case ChatStateActionType.ADD_MESSAGE:
      return {
        ...state,
        messages: getUniqueObjectsArray([...state.messages, action.payload])
      };

    case ChatStateActionType.UPDATE_MESSAGE:
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, ...action.payload.updates }
            : msg
        )
      };

    case ChatStateActionType.SET_STAGE:
      return { ...state, stage: action.payload };

    case ChatStateActionType.SET_CATEGORY:
      return { ...state, category: action.payload };

    case ChatStateActionType.SET_SHOW_ASSESSMENT_REMINDER:
      return { ...state, showAssessmentReminder: action.payload };

    case ChatStateActionType.SET_SHOW_OVERLAY:
      return { ...state, showOverlay: action.payload };

    case ChatStateActionType.SET_VOICE_MODE:
      return { ...state, isVoiceMode: action.payload };

    case ChatStateActionType.SET_INITIAL_MESSAGE:
      return { ...state, initialMessage: action.payload };

    case ChatStateActionType.SET_ERROR:
      return { ...state, error: action.payload };

    case ChatStateActionType.RESET_STATE:
      return {
        chatId: undefined,
        messages: [],
        stage: undefined,
        category: null,
        showAssessmentReminder: false,
        showOverlay: false,
        isVoiceMode: false,
        initialMessage: null,
        error: undefined,
      };

    case ChatStateActionType.UPDATE_STATE:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

export function useChatState(initialChatId?: string, initialCategory?: Category | null) {
  const searchParams = useSearchParams();

  const initialState = useMemo(() => ({
    chatId: initialChatId,
    messages: [],
    stage: undefined,
    category: initialCategory || null,
    showAssessmentReminder: false,
    showOverlay: false,
    isVoiceMode: toBoolean(searchParams?.get('voice')),
    initialMessage: null,
    error: undefined,
  }), [initialChatId, initialCategory?.id, searchParams?.get('voice')]);

  const [state, dispatch] = useReducer(chatStateReducer, initialState);

  const setChatId = (chatId: string | null) =>
    dispatch({ type: ChatStateActionType.SET_CHAT_ID, payload: chatId });

  const setMessages = (messages: Message[]) =>
    dispatch({ type: ChatStateActionType.SET_MESSAGES, payload: messages });

  const addMessage = (message: Message) =>
    dispatch({ type: ChatStateActionType.ADD_MESSAGE, payload: message });

  const updateMessage = (id: string, updates: Partial<Message>) =>
    dispatch({ type: ChatStateActionType.UPDATE_MESSAGE, payload: { id, updates } });

  const setStage = (stage: string) =>
    dispatch({ type: ChatStateActionType.SET_STAGE, payload: stage });

  const setCategory = (category: Category | null) =>
    dispatch({ type: ChatStateActionType.SET_CATEGORY, payload: category });

  const setShowAssessmentReminder = (show: boolean) =>
    dispatch({ type: ChatStateActionType.SET_SHOW_ASSESSMENT_REMINDER, payload: show });

  const setShowOverlay = (show: boolean) =>
    dispatch({ type: ChatStateActionType.SET_SHOW_OVERLAY, payload: show });

  const setVoiceMode = (isVoiceMode: boolean) =>
    dispatch({ type: ChatStateActionType.SET_VOICE_MODE, payload: isVoiceMode });

  const setInitialMessage = (message: Message | null) => {
    dispatch({ type: ChatStateActionType.SET_INITIAL_MESSAGE, payload: message });
    message && setMessages([message]);
  }

  const setError = (error: any) =>
    dispatch({ type: ChatStateActionType.SET_ERROR, payload: error });

  const resetState = () =>
    dispatch({ type: ChatStateActionType.RESET_STATE });

  const updateState = (updates: Partial<ChatState>) =>
    dispatch({ type: ChatStateActionType.UPDATE_STATE, payload: updates });

  return {
    state,
    setChatId,
    setMessages,
    addMessage,
    updateMessage,
    setStage,
    setCategory,
    setShowAssessmentReminder,
    setShowOverlay,
    setVoiceMode,
    setInitialMessage,
    setError,
    resetState,
    updateState,
  };
}