import logger from "lib/logger";
import crypto from 'crypto';
import { NextRequest, NextResponse } from "next/server";
import { Auth0User } from "@models/account.models";
import { AssistantChat } from "@models/studio.models";
import { getAssistantChats } from "@/server/actions/assistantActions";
import { runUsersExport } from "@/server/actions/authActions";
import { filterAuth0UserByNameOrEmail, mapDataWithAuth0User } from "@/utils/user-data";
import { Prisma } from "@prisma/client";

const getHashedId = (userId: string) => crypto.createHash('sha256').update(userId).digest('hex');
const getUserName = (user?: Auth0User) => user?.username || user?.given_name || user?.nickname || user?.user_metadata.username || user?.name;

enum SortBySlug {
  RECENT = 'newer',
  OLDEST = 'oldest',
  MOST_MESSAGES = 'most-messages',
  FEWEST_MESSAGES = 'less-messages',
};

const SortBy: Record<SortBySlug, Prisma.ChatOrderByWithRelationInput> = {
  [SortBySlug.RECENT]: {
    created_at: 'desc',
  },
  [SortBySlug.OLDEST]: {
    created_at: 'asc',
  },
  [SortBySlug.MOST_MESSAGES]: {
    messages: {
      _count: 'desc',
    },
  },
  [SortBySlug.FEWEST_MESSAGES]: {
    messages: {
      _count: 'asc',
    },
  },
} as const;


const DEFAULT_SORT_BY = SortBySlug.RECENT;
const DEFAULT_LIMIT = 5;
const DEFAULT_PAGE = 1;

enum SearchParams {
  USER = 'user',
  SORT_BY = 'orderBy',
  LIMIT = 'limit',
  PAGE = 'page',
}

const EMPTY_CHATS_RESPONSE = { items: [], count: 0, hasMore: false };

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: assistantId } = await params;

    const { searchParams } = req.nextUrl;
    const user = searchParams.get(SearchParams.USER);
    const limit = Number(searchParams.get(SearchParams.LIMIT) ?? DEFAULT_LIMIT);
    const page = Number(searchParams.get(SearchParams.PAGE) ?? DEFAULT_PAGE);
    const sortBy = searchParams.get(SearchParams.SORT_BY) ?? DEFAULT_SORT_BY;

    if (!assistantId) {
      throw new Error('[assistantChatsAPI] Assistant id is not provided!');
    }

    const auth0Users = await runUsersExport();
    let userIds: string[] = [];

    if (user) {
      const foundedAuthUsers = filterAuth0UserByNameOrEmail(auth0Users ?? [], user, user);

      if (foundedAuthUsers.length) {
        userIds = foundedAuthUsers.map(({ user_id }) => getHashedId(user_id));
      } else {
        logger.warn(`[assistantChatsAPI] User ${user} not found!`);
        return NextResponse.json({...EMPTY_CHATS_RESPONSE, limit, page});
      }
    }
    
    const sortByValue = SortBy[sortBy as SortBySlug || DEFAULT_SORT_BY];
    const offset = (page - 1) * limit;
    const limitWithOffset = limit + 1;
    
    const query = { assistantId, userId: userIds.length ? { in: userIds } : undefined };
    const chatsData = await getAssistantChats('', query, { messages: true }, sortByValue, limitWithOffset, offset);

    if (!chatsData.chats.length) {
      return NextResponse.json({...EMPTY_CHATS_RESPONSE, limit, page});
    }

    const chatsWithUserData: AssistantChat[] = mapDataWithAuth0User(chatsData.chats, auth0Users, getHashedId);
    const sessionsChats = chatsWithUserData?.filter(Boolean)?.slice(0, limit) ?? [];
    
    return NextResponse.json({
      ...EMPTY_CHATS_RESPONSE, 
      limit, 
      page, 
      total: chatsData.total, 
      count: sessionsChats.length, 
      hasMore: chatsWithUserData.length > limit, 
      items: sessionsChats
    });
  } catch (error: any) {
    logger.error(`[assistantChatsAPI] Error during GET assistant's chats request:`, error);

    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
