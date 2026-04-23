import { NextRequest, NextResponse } from 'next/server';
import { updateChatData } from '@/server/prismaDB';

import logger from 'lib/logger';

export async function POST(request: NextRequest) {
  let chatId;
  try {
    const { userId, id, stageAnalysis } = await request.json();
    chatId = id;

    if (stageAnalysis) {
      const dataToUpdate: { stage?: string; stageAnalysis?: any } = {
        stageAnalysis,
      };

      if (stageAnalysis.transition_required && stageAnalysis.next_stage) {
        dataToUpdate.stage = stageAnalysis.next_stage;
      }

      await updateChatData(userId, id, dataToUpdate);
    }

    return new NextResponse(JSON.stringify({ updated: true }), { status: 200 });
  } catch (error: any) {
    console.error(`[chatApi] Error during updating chat ${chatId} data:`, error);
    logger.error(`[chatApi] Error during updating chat ${chatId} data:`, error);

    return new NextResponse(JSON.stringify({ error: `Chat update error: ${error.message}` }), { status: 400 });
  }
}
