import { type Metadata } from "next";

import { Blog } from "@/components/blog";

export const metadata: Metadata = {
  title: "CoachBot Blog | AI Coaching Tips & Growth Insights",
  description: "Stay ahead in coaching with tips, strategies, and insights on AI, personal growth, and scalable coaching solutions.",
};

export default function BlogPage() {
  return <Blog />;
}
