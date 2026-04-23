export enum FeedbackSorting {
  trending = 'trending',
  top = 'score',
  new = 'newest'
}

export interface FeedbackFilters {
  sort?: FeedbackSorting;
  search?: string;
}

export enum FeedbackStatus {
  open = 'open',
  underReview = 'under review',
  planned = 'planned',
  inProgress = 'in progress',
  complete = 'complete',
  closed = 'closed'
}

export interface Board {
  id: string;
  url: string;
  name: string;
  created: Date | string;
  postCount: number
}

export interface Author {
  id: string;
  created: Date | string;
  email: string;
  isAdmin: boolean;
  name: string;
  url: string;
  userID: string;
}

export interface Feedback {
  id: string;
  author: Author;
  board: Board;
  created: Date | string;
  by?: Author;
  owner?: Author;
  category: any;
  commentCount: number;
  clickup: any;
  details: string;
  eta: string;
  imageURLs: string[];
  score: number;
  status: FeedbackStatus | string;
  tags: any[];
  title: string;
  url: string;
  votedByUser?: boolean;
}

export interface Vote {
  board: Board;
  by: Author | null;
  created: string | Date;
  id: string;
  post: Feedback;
  voter: Author;
  votePriority: string;
}

export interface CreatePost {
  details: string;
  title: string;
  authorID?: string;
}

export interface CreateVote {
  postID: string;
  voterID?: string;
}

export type PostsResponse = { hasMore: boolean, posts: Feedback[] }
export type VotesResponse = { hasMore: boolean, votes: Vote[] }
export type CreatePostsResponse = { id: string }