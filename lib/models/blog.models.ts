import { Category } from './data.models';

export interface Post {
  id: string;
  title: string;
  metaTitle: string;
  description: string;
  imageUrl: string;
  postingDate: string;
  readingTime: number;
  contentUrl: string;
  author: string | null;
  categoryName?: string | null;
  category?: Category | null;
  content?: string;
}
