'use server';

import { StudioSignup } from "@models/studio.models";
import { createStudioSignup } from "../prismaDB";
import logger from "lib/logger";

export const addSignup = async (signupForm: StudioSignup): Promise<StudioSignup | null> => {
  try {
    const createdAt = new Date().toISOString().split('T')[0];

    return createStudioSignup({ ...signupForm, createdAt, policyAgreement: undefined } as any);
  } catch (error: any) {
    logger.error(`[goalsActions] Error during creating goal: `, error);

    return null;
  }
};