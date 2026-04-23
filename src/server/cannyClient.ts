import { CreatePost, CreatePostsResponse, CreateVote, FeedbackFilters, PostsResponse, VotesResponse } from '@models/feedback.models';
import logger from 'lib/logger';

export enum CannyApiPath {
  listBoards = '/boards/list',
  listPosts = '/posts/list',
  createPost = '/posts/create',
  createVote = '/votes/create',
  deleteVote = '/votes/delete',
  getUser = '/users/create_or_update',
  getVotes = '/votes/list'
}

export enum ResponseContentType {
  text = 'text/plain',
  json = 'application/json'
}

export class CannyIoClient {
  private readonly config: any;

  constructor() {
    this.config = {
      apiKey: process.env.CANNY_API_KEY || '',
      boardId: process.env.CANNY_BOARD_ID || '',
      baseUrl: 'https://canny.io/api/v1',
    };
  }

  private async makePostRequest<T>(endpoint: string, data: T, tag?: string): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json', },
        body: JSON.stringify({ ...data, apiKey: this.config.apiKey }),
        next: { tags: [tag || endpoint] }
      });

      if (!response.ok) {
        throw new Error(`[cannyAPI] POST Request failed with status ${response.status}`, await response.json());
      }

      return response.headers.get('content-type') === ResponseContentType.json ? response.json() : response.text();
    } catch (error: any) {
      logger.error(`[cannyAPI] ${endpoint} error:`, error);
      throw new Error(`[cannyAPI] Failed to make POST request to ${endpoint}`);
    }
  }

  public async getPosts({ search, sort }: FeedbackFilters = {}): Promise<PostsResponse> {
    return this.makePostRequest(CannyApiPath.listPosts, { limit: 1000, search, sort, boardID: this.config.boardId });
  }

  public async createPosts(postData: CreatePost): Promise<CreatePostsResponse> {
    return this.makePostRequest(CannyApiPath.createPost, { ...postData, boardID: this.config.boardId });
  }

  public async createVote(vote: CreateVote): Promise<void> {
    return this.makePostRequest(CannyApiPath.createVote, { ...vote });
  }

  public async deleteVote(vote: CreateVote): Promise<void> {
    return this.makePostRequest(CannyApiPath.deleteVote, { ...vote });
  }

  public async getUser(userID: string, name: string): Promise<{ id: string }> {
    return this.makePostRequest(CannyApiPath.getUser, { userID, name });
  }

  public async getUserVotes(userID: string): Promise<VotesResponse> {
    return this.makePostRequest(CannyApiPath.getVotes, { userID, limit: 1000, });
  }
}

export const cannyIoAPI = new CannyIoClient();
