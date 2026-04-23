import { withoutTrailingSlash } from "@/utils/formatter";
import { Assistant, AssistantWithConfig } from "@models/data.models";
import { InitialMessagePayload, InitialMessageResponse, SendMessagePayload, SendMessageResponse } from "@models/message.models";

export enum ApiPath {
  coaching = '/coaching',
  assistant = '/api/assistant',
  initiateConversation = '/initiate-conversation',
}

class StudioClient {
  private static _instance: StudioClient;
  private _aiApiEndpoint: string = '';
  private _studioApiEndpoint: string = '';
  private _aiApiKey: string = '';

  private constructor() { }

  private get aiApiEndpoint(): string {
    if (!process.env.AI_API_BASE_URL) {
      throw new Error('AI_API_BASE_URL environment variable is not set.');
    }

    if (!this._aiApiEndpoint) {
      this._aiApiEndpoint = process.env.AI_API_BASE_URL || '';
    }

    return this._aiApiEndpoint;
  }

  private get aiApiKey(): string {
    if (!this._aiApiKey) {
      this._aiApiKey = process.env.AI_API_KEY || '';
    }

    return this._aiApiKey;
  }

  private get studioApiEndpoint(): string {
    if (!process.env.STUDIO_API_BASE_URL) {
      throw new Error('STUDIO_API_URL environment variable is not set.');
    }

    if (!this._studioApiEndpoint) {
      this._studioApiEndpoint = process.env.STUDIO_API_BASE_URL || '';
    }

    return this._studioApiEndpoint;
  }


  public static getInstance(): StudioClient {
    if (!StudioClient._instance) {
      StudioClient._instance = new StudioClient();
    }
    return StudioClient._instance;
  }

  private async makeGetRequest<T>(endpoint: string, baseUrl: string = this.studioApiEndpoint, tag?: string): Promise<T> {
    try {
      const response = await fetch(`${withoutTrailingSlash(baseUrl)}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { tags: [tag || endpoint] },
      });

      if (!response.ok) {
        const error = await response.json();

        console.error('[studioClient] GET ', error);
        throw new Error(`[studioClient] GET Request failed with status ${response.status}`, error);
      }

      return await response.json();
    } catch (error: any) {
      const errorMessage = `[studioClient] Failed to make GET request to ${endpoint}`;
      throw new Error(errorMessage, { cause: error });
    }
  }

  private async makePostRequest<T>(
    endpoint: string,
    data: T,
    baseUrl: string,
    apiKey?: string,
    tag?: string,
    cache?: RequestCache
  ): Promise<any> {
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }

      const response = await fetch(`${withoutTrailingSlash(baseUrl)}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        next: { tags: [tag || ''], revalidate: 300 },
        cache: cache || 'no-cache'
      });

      if (!response.ok) {
        const error = await response.json();

        console.error('[studioClient] POST ', JSON.stringify(error));
        throw new Error(`[studioClient] POST Request failed with status ${response.status}`, error);
      }

      return await response.json();
    } catch (error: any) {
      const errorMessage = `[studioClient] Failed to make POST request to ${endpoint}`;
      throw new Error(errorMessage, { cause: error });
    }
  }

  public async getAssistantsData(ids: string[]): Promise<Assistant[]> {
    try {
      const res = await this.makePostRequest(ApiPath.assistant, ids, this.studioApiEndpoint);

      return res.assistants;
    } catch (error: any) {
      console.error(`[studioClient] Error getting assistants:`, error);

      return [];
    }
  }

  public async getAssistant(id: string): Promise<AssistantWithConfig | null> {
    try {
      const assistantData = await this.makeGetRequest(`${ApiPath.assistant}/${id}`);

      return assistantData as AssistantWithConfig;
    } catch (error: any) {
      console.error(`[studioClient] Error getting assistant ${id} data:`, error);

      return null;
    }
  }

  public async sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
    try {
      return this.makePostRequest(ApiPath.coaching, payload, this.aiApiEndpoint, this.aiApiKey);
    } catch (error: any) {
      console.error(`[studioClient] Error during post messages with ${payload.assistant_id} assistant:`, error);
      throw new Error('[studioClient] Could not post message.');
    }
  }

  public async generateInitialMessage(payload: InitialMessagePayload): Promise<InitialMessageResponse> {
    try {
      return this.makePostRequest(ApiPath.initiateConversation, payload, this.aiApiEndpoint, this.aiApiKey);
    } catch (error: any) {
      console.error(`[studioClient] Error during generating initial message for assistant ${payload.assistant_id}:`, error);
      throw new Error('[studioClient] Could not generating initial message.');
    }
  }
}

export const studioClient = StudioClient.getInstance();
