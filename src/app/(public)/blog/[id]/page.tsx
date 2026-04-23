import { type Metadata } from 'next';

import { BlogPost } from '@/components/blog-post';

export const metadata: Metadata = {
  title: 'CoachBot Blog Post | AI Coaching Tips & Growth Insights',
  description: 'Stay ahead in coaching with tips, strategies, and insights on AI, personal growth, and scalable coaching solutions.',
};

export default function BlogPostPage() {
  return <BlogPost />;
}
