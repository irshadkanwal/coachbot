import { runUsersExport } from "@/server/actions/authActions";
import { getAssistantSubscriptions } from "@/server/dbSubscription";
import { getHashedId } from "@/server/prismaDB";
import { getQueryParam } from "@/utils/common.utils";
import { mapDataWithAuth0User } from "@/utils/user-data";
import { AssistantUserData } from "@models/studio.models";
import { Subscription } from "@prisma/client";
import logger from "lib/logger";
import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_QUERY_PARAMS = ['interval', 'sort', 'from'];

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      throw new Error('[assistantSubscriptionsAPI] Assistant id is not provided!');
    }

    const searchParams = req.nextUrl.searchParams;
    const queryParams = SUPPORTED_QUERY_PARAMS.reduce((params: Record<string, string>, name: string) => (
      { ...params, [name]: getQueryParam(searchParams, name) } as Record<string, string>
    ), {})
    const subscriptions = await getAssistantSubscriptions(id, queryParams);

    if (!subscriptions.length) NextResponse.json([]);

    const auth0Users = await runUsersExport();
    const subscriptionsWithUserData = mapDataWithAuth0User(subscriptions, auth0Users, getHashedId);
    const mappedSubscriptionsData = subscriptionsWithUserData.map((subscription: Subscription & AssistantUserData) => {
      const { userId, userEmail, userName, interval, created_at, canceled_at, status } = subscription;

      return { userId, userEmail, userName, interval, created_at, canceled_at, status };
    })

    return NextResponse.json(mappedSubscriptionsData.filter(Boolean));
  } catch (error: any) {
    logger.error(`[assistantSubscriptionsAPI] Error during GET assistant's subscriptions request:`, error);

    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
