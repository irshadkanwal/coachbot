import { MetadataRoute } from 'next'
import { blogPosts } from '../../prisma/blogPosts';
import { withoutTrailingSlash } from '@/utils/formatter';
import { PublicRoutes } from '@models/common.models';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://coachbot.ai'

  const publicRoutes = Object.values(PublicRoutes).map((route: string) =>({
    url: withoutTrailingSlash(baseUrl) + route,
    lastModified: new Date().toISOString(),
  }));

  if (!blogPosts) return publicRoutes;

  const posts = blogPosts.map(post => ({
    url: `${withoutTrailingSlash(baseUrl)}/blog/${post.id}`,
    lastModified: new Date(post.postingDate).toISOString(),
  }))

  return [...publicRoutes, ...posts];
}