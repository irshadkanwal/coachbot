import { NextResponse } from 'next/server';
import { getSessionUser } from '@/server/actions/userActions';

export async function GET() {
  try {
    try {
      await getSessionUser();
    } catch (error) {
      console.error('[API] Error getting session user:', error);
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 'https://studiosweden.openai.azure.com';
    const deployment = process.env.AZURE_OPENAI_REALTIME_DEPLOYMENT || 'gpt-realtime';
    const apiVersion = process.env.AZURE_OPENAI_REALTIME_API_VERSION || '2024-10-01-preview';

    if (!apiKey) {
      console.error('[API] AZURE_OPENAI_API_KEY is not configured');
      return new NextResponse('API key not configured', { status: 500 });
    }

    const wsUrl = `${endpoint.replace('https://', 'wss://')}/openai/realtime?api-version=${apiVersion}&deployment=${deployment}&api-key=${apiKey}`;

    return NextResponse.json({ wsUrl });
  } catch (error) {
    console.error('[API] Error getting realtime session:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
