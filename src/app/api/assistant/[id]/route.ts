import { NextRequest, NextResponse } from 'next/server';

import logger from 'lib/logger';
import { mapAssistantsData } from '@/utils/mapping.utils';
import { upsertAssistant } from '@/server/dbAssistant';
import { revalidateTag } from 'next/cache';
import { Assistant } from '@models/data.models';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let assistant_id;
  try {
    const { id } = await params;

    if (!id) {
      throw new Error('[assistantAPI] Assistant id is not provided!');
    }
    assistant_id = id;
    const assistantData: Assistant = await request.json();
    const [mappedAssistant] = mapAssistantsData([assistantData], process.env.DEFAULT_ASSISTANT_ID || '');
    const { id: assistantId, ...assistant } = mappedAssistant;

    await upsertAssistant(assistantId, assistant);
    revalidateTag('userAssistants');

    return NextResponse.json({ updated: true }, { status: 200 });
  } catch (error: any) {
    logger.error(`[assistantAPI] Error during updating assistant ${assistant_id} data:`, error);

    return NextResponse.json({ error: `Assistant update error: ${error.message}` }, { status: 400 });
  }
}
