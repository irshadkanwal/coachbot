import { getAssistantUsers } from "@/server/actions/assistantActions";
import { getAssistantUsersCount } from "@/server/dbAssistant";
import logger from "lib/logger";
import crypto from 'crypto';
import { NextRequest, NextResponse } from "next/server";
import { PrismaUser } from "@models/data.models";
import { Auth0User } from "@models/account.models";
import { AssistantUser } from "@models/studio.models";
import { parseDate } from "@/utils/date-utils";
import { runUsersExport } from "@/server/actions/authActions";
import { getUserName } from "@/utils/user-data";
import { PAGINATION } from "@/constants/pagination";

const getHashedId = (userId: string) => crypto.createHash('sha256').update(userId).digest('hex');

interface Params {
  id: string;
}

enum SearchParams {
  NEEDLE = 'needle',
  LIMIT = 'limit',
  PAGE = 'page',
}

const EMPTY_USER_RESPONSE = { users: [], count: 0, hasMore: false };

export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const { id: assistantId } = await params;
    const { searchParams } = req.nextUrl;
    const needle = searchParams.get(SearchParams.NEEDLE);
    const limit = Number(searchParams.get(SearchParams.LIMIT) ?? PAGINATION.ITEMS_PER_PAGE);
    const page = Number(searchParams.get(SearchParams.PAGE) ?? PAGINATION.DEFAULT_PAGE);

    if (!assistantId) {
      throw new Error('[assistantUsersAPI] Assistant id is not provided!');
    }

    const auth0Users = await runUsersExport();

    if (!auth0Users) {
      logger.warn(`[assistantUsersAPI] No Auth0 users found.`);
      return NextResponse.json({...EMPTY_USER_RESPONSE, limit, page});
    }
    
    let usersByParams: Auth0User[] | undefined;

    if (needle) {
      usersByParams = auth0Users.filter(({ email, username }) => email.includes(needle) || username?.toLowerCase().includes(needle.toLowerCase()));

      if (!usersByParams) {
        logger.warn(`[assistantUsersAPI] No user found with email ${needle}.`);
        return NextResponse.json({...EMPTY_USER_RESPONSE, limit, page});
      }
    }

    const offset = (page - 1) * limit;
    const limitWithOffset = limit + 1;

    // Parallelize database queries for better performance
    const [dbUsers, totalCount] = await Promise.all([
      getAssistantUsers(assistantId, { userIds: usersByParams?.map(({ user_id }) => getHashedId(user_id)), limit: limitWithOffset, offset }),
      getAssistantUsersCount(assistantId)
    ]);

    if (!dbUsers?.length || !auth0Users?.length) {
      logger.warn(`[assistantUsersAPI] No DB or Auth0 users found for assistant ${assistantId}.`);

      return NextResponse.json({...EMPTY_USER_RESPONSE, limit, page});
    }

    const usersFounded: (AssistantUser | null)[] = dbUsers.map(({ chats = [], id }: PrismaUser) => {
      const authUser = auth0Users.find(({ user_id }: Auth0User) => getHashedId(user_id) === id);

      if (!authUser) return null;
      const assistantChats = chats.filter((chat) => chat.assistantId === assistantId);

      return {
        id,
        name: getUserName(authUser) || 'Name ot found',
        email: authUser?.email ?? 'Email not found',
        session: {
          firstDate: parseDate(assistantChats[assistantChats.length - 1]?.created_at),
          lastDate: parseDate(assistantChats[0]?.created_at), 
          total: assistantChats.length,
        },
      };
    });

    const users = usersFounded?.filter(Boolean)?.slice(0, limit) ?? [];

    return NextResponse.json({ users, count: totalCount, limit, page, hasMore: usersFounded?.length > limit });
  } catch (error: any) {
    logger.error(`[assistantUsersAPI] Error during GET users for assistant request:`, error);

    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
