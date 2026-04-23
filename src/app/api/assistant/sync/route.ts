import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import logger from 'lib/logger';
import { deleteAssistantFromUsers, softDeleteAssistant } from '@/server/dbAssistant';

/**
 * Webhook endpoint to handle assistant deletion notifications from Studio
 * This endpoint is called when an assistant is deleted in Studio to sync the deletion to CoachBot
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assistantId, action } = body;

    if (!assistantId || !action) {
      logger.error('[assistant/sync] Missing required fields:', body);
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    logger.info(`[assistant/sync] Processing ${action} for assistant ${assistantId}`);

    switch (action) {
      case 'delete':
        // Soft delete the assistant (mark as deleted without removing from DB)
        await softDeleteAssistant(assistantId);

        // Remove the assistant from all users who have it
        await deleteAssistantFromUsers(assistantId);

        // Revalidate the cache to immediately reflect the changes
        revalidateTag('userAssistants');
        revalidateTag('assistants');

        logger.info(`[assistant/sync] Successfully processed deletion for assistant ${assistantId}`);
        break;

      case 'update':
        // For future: handle updates to assistant data
        revalidateTag('userAssistants');
        revalidateTag('assistants');
        break;

      default:
        logger.warn(`[assistant/sync] Unknown action: ${action}`);
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, assistantId, action });
  } catch (error: any) {
    logger.error('[assistant/sync] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
