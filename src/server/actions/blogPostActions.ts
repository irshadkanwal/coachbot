'use server';

import { Post } from '@models/blog.models';
import { getAllPosts, getPost } from '../dbPosts';
import { getGcpStorageSignedUrl } from '@/server/gcpClient';
import logger from 'lib/logger';
import { redirect } from 'next/navigation';
import { PublicRoutes } from '@models/common.models';

export const getAllBlogPosts = async (filter?: Partial<Post>, searchTerm?: string) => {
  try {
    const posts = (await getAllPosts(filter as any, searchTerm)) || [];

    if (posts.length > 0) {
      for (const post of posts) {
        try {
          post.imageUrl = await getGcpStorageSignedUrl(post.imageUrl, 'coachbot-blog');
        } catch (error: any) {
          console.error(`Failed to update imageUrl for post ${post.id}:`, error);
        }
      }
    }

    return posts;
  } catch (error: any) {
    console.error('Error fetching posts:', error);

    return redirect(PublicRoutes.error);
  }
};

export const getBlogPost = async (id: string) => {
  const post = await getPost(id);

  if (post) {
    post.imageUrl = await getGcpStorageSignedUrl(post.imageUrl, 'coachbot-blog');
    const content = await getContentPost(post.contentUrl);
    post.content = content !== undefined ? content : '';
  }

  return post;
};

const getContentPost = async (filename: string): Promise<string | undefined> => {
  try {
    const contentPath = await getGcpStorageSignedUrl(filename, 'coachbot-blog');
    const response = await fetch(contentPath);

    if (!response.ok) {
      console.error(`[blogActions] Failed to fetch file: ${response.status} ${response.statusText}`);

      throw new Error('[blogActions] Error fetching post');
    }

    return await response.text();
  } catch (error: any) {
    logger.error('[blogActions] Error fetching the file:', error);

    return redirect(PublicRoutes.blog);
  }
};
