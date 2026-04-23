import logger from 'lib/logger';
import { HeapConfig, HeapEvent, HeapUserProperty } from 'lib/models';

class HeapAnalyticsError extends Error {
  constructor(
    message: string,
    public readonly context?: any
  ) {
    super(message);
    this.name = 'HeapAnalyticsError';
  }
}

export class HeapAnalyticsClient {
  private readonly config: HeapConfig;
  private readonly headers: HeadersInit = {
    accept: 'application/json',
    'content-type': 'application/json',
  };

  constructor() {
    const appId = process.env.HEAP_APP_ID;

    this.config = {
      appId: appId || '',
      baseUrl: 'https://heapanalytics.com/api/',
    };
  }

  private async makeRequest<T>(endpoint: string, data: T): Promise<void> {
    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          ...data,
          app_id: this.config.appId,
        }),
      });

      if (!response.ok) {
        throw new HeapAnalyticsError(`Request failed with status ${response.status}`, await response.json());
      }
    } catch (error: any) {
      logger.error(`[HeapAnalytics] ${endpoint} error:`, error);
      throw new HeapAnalyticsError(`Failed to make request to ${endpoint}`, error);
    }
  }

  /**
   * Tracks an event in Heap Analytics
   * @param event Event name to track
   * @param identity User identity
   * @param properties Additional properties for the event
   */
  public async trackEvent(
    event: string,
    identity: string,
    properties: Record<string, string | number> = {}
  ): Promise<void> {
    await this.makeRequest<HeapEvent>('track', {
      event,
      identity,
      properties,
    });
  }

  /**
   * Identifies a user in Heap Analytics
   * @param identity User identity string
   * @param userId User ID number
   * @param properties Additional user properties
   */
  public async identifyUser(
    identity: string,
    userId: number,
    properties: Record<string, string | number> = {}
  ): Promise<void> {
    await this.makeRequest<HeapEvent>('identify', {
      identity,
      user_id: userId,
      properties,
    });
  }

  /**
   * Adds properties to a user in Heap Analytics
   * @param identity User identity string
   * @param properties Properties to add to the user
   */
  public async addUserProperties(identity: string, properties: Record<string, string | number>): Promise<void> {
    await this.makeRequest<HeapUserProperty>('add_user_properties', {
      identity,
      property: properties,
    });
  }
}

export const heapAnalyticsAPI = new HeapAnalyticsClient();
