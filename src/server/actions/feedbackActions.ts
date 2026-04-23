'use server';

import { CreatePost, Feedback, FeedbackFilters } from "@models/feedback.models";
import { CannyApiPath, cannyIoAPI } from "../cannyClient";
import logger from "lib/logger";
import { revalidateTag } from "next/cache";
import { auth0 } from "lib/auth0";

export const getCannyUser = async (): Promise<string | null> => {
  try {
    const session = await auth0.getSession();
    const response = await cannyIoAPI.getUser(session?.user.sub || '', session?.user.metadata.username || session?.user.name);

    return response.id;
  } catch (error: any) {
    logger.error(`[feedbackActions] Error during getting user: `, error);

    return null;
  }
};

export const getFeedbacks = async (filters?: FeedbackFilters): Promise<Feedback[] | null> => {
  try {
    const [postsResponse, userID] = await Promise.all([cannyIoAPI.getPosts(filters), getCannyUser()]);
    const { votes } = userID ? await cannyIoAPI.getUserVotes(userID) : { votes: [] };

    return postsResponse.posts.map((post) => ({
      ...post,
      votedByUser: votes.some((vote) => vote.post.id === post.id),
    }));
  } catch (error: any) {
    logger.error(`[feedbackActions] Error during getting feedbacks: `, error);

    return null;
  }
};

export const createFeedback = async (postData: CreatePost): Promise<void> => {

  try {
    const authorID = await getCannyUser() || '';
    await cannyIoAPI.createPosts({ ...postData, authorID });
    revalidateTag(CannyApiPath.listPosts);
  } catch (error: any) {
    logger.error(`[feedbackActions] Error during creting feedbacks: `, error);
  }
};

export const votePost = async ({ id, votedByUser }: Feedback): Promise<void> => {
  try {
    const voterID = await getCannyUser() || '';
    votedByUser
      ? await cannyIoAPI.deleteVote({ postID: id, voterID })
      : await cannyIoAPI.createVote({ postID: id, voterID });

    revalidateTag(CannyApiPath.listPosts);
  } catch (error: any) {
    logger.error(`[feedbackActions] Error during voting feedback: `, error);
  }
};

