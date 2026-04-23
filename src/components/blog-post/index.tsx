'use client';

import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { Card } from '@/components/shared/card';

import { getBlogPost, getAllBlogPosts } from '@/server/actions/blogPostActions';
import { Post } from '@models/blog.models';

import { FreshArticles, Content } from './elements';

export function BlogPost() {
  const [blogPost, setBlogPost] = useState<Post | null>(null);
  const [blogCardList, setBlogCardList] = useState<Post[]>([]);
  const { id } = useParams();

  const fetchBlogPost = useCallback(async () => {
    const post = await getBlogPost(id as string);
    setBlogPost(post);
  }, [id]);

  const getFreshBlogCards = useCallback(async () => {
    const blogPostList = await getAllBlogPosts() || [];
    const freshBlogPostList = blogPostList.slice(0, 3);
    setBlogCardList(freshBlogPostList);
  }, []);

  useEffect(() => {
    fetchBlogPost();
    getFreshBlogCards();
  }, [fetchBlogPost, getFreshBlogCards]);

  if (!blogPost) return null;

  return (
    <div className="w-full md:my-5 md:px-10 lg:my-8 lg:px-0">
      <Card {...blogPost} primary isStatic />
      <Content markdownData={blogPost.content || ''} title={blogPost.title} />
      <FreshArticles cardList={blogCardList} />
    </div>
  );
}
