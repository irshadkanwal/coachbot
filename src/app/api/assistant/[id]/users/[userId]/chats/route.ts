import logger from "lib/logger";
import { NextRequest, NextResponse } from "next/server";

import { getAssistantChats } from "@/server/actions/assistantActions";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string; userId: string }> }) {
  try {
    const { id, userId } = await params;

    if (!id || !userId) {
      throw new Error('[assistantUsersChatsAPI] Assistant or user id is not provided!');
    }

    const userChats = await getAssistantChats(userId, { userId, assistantId: id }, { messages: true });

    return NextResponse.json(userChats);
  } catch (error: any) {
    logger.error(`[assistantUsersChatsAPI] Error during GET assistant's user chat request:`, error);

    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}