import logger from 'lib/logger';
import { prisma } from '../../lib/prisma';
import { Post } from '@models/blog.models';
import { Prisma } from '@prisma/client';

export const getAllPosts = async (filter?: Prisma.PostWhereInput, searchTerm?: string): Promise<Post[]> => {
  try {
    const where: Prisma.PostWhereInput = {
      ...filter,
      ...(searchTerm
        ? {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { author: { contains: searchTerm, mode: 'insensitive' } },
          ],
        }
        : {}),
    };

    return prisma.post.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        postingDate: 'desc',
      },
    });
  } catch (error: any) {
    logger.error(`[blogPostDB] Error during getting all blog posts:`, error);

    throw new Error('[blogPostDB] Could not get blog posts');
  }
};

export const getPost = async (id: string): Promise<Post | null> => {
  try {
    return prisma.post.findFirst({
      where: { id },
      include: {
        category: true,
      },
    });
  } catch (error: any) {
    logger.error(`[blogPostDB] Error during getting blog post:`, error);

    throw new Error('[blogPostDB] Could not get blog post');
  }
};
