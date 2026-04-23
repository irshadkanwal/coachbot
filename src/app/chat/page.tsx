import { AssistantComponent } from '@/components/assistant/AssistantComponent';
import AssistantSelect from '@/components/assistant/AssistantSelect';
import { AssistantChatProvider } from '@/components/assistant/context/AssistantChatContext';
import { MessagesSkeleton } from '@/components/skeletons';
import AssistantSelectSkeleton from '@/components/skeletons/AssistantSelectSkeleton';
import { getUserAssistants, updateUserAssistants } from '@/server/actions/assistantActions';
import { getFullUser } from '@/server/actions/userActions';
import { getCategories } from '@/server/prismaDB';
import { Category } from '@models/data.models';
import { revalidateTag } from 'next/cache';
import { after } from 'next/server';
import { Suspense } from 'react';
export interface ChatCategoryProps {
  searchParams?: Promise<{ category: string; cbsas: string }>;
}

function findCategory(categories: Category[], categoryName: string): Category | null {
  const lowerCaseName = categoryName.toLowerCase();

  for (const category of categories) {
    if (category.name.toLowerCase() === lowerCaseName) return category;

    if (category.subcategories) {
      const targetCategory = findCategory(category.subcategories, lowerCaseName);

      if (targetCategory) return targetCategory;
    }
  }

  return null;
}

export default async function Chat(props: ChatCategoryProps) {
  const [searchParams, user] = await Promise.all([props.searchParams, getFullUser(null, true)]);
  let assistantId = null, selectedCategory: Category | null = null;

  if (searchParams?.category) {
    const categories = await getCategories();
    selectedCategory = findCategory(categories, searchParams.category);
  }

  if (searchParams?.cbsas && user) {
    assistantId = await updateUserAssistants(user, searchParams?.cbsas);

    after(() => revalidateTag('userAssistants'));
  }

  return (
    <>
      <Suspense fallback={<AssistantSelectSkeleton />}>
        <AssistantSelect assistantId={assistantId} />
      </Suspense>
      <AssistantChatProvider initialCategory={selectedCategory}>
        <AssistantComponent key={'new-assistant'} user={user} selectedCategory={selectedCategory}>
          <MessagesSkeleton />
        </AssistantComponent>
      </AssistantChatProvider>
    </>
  );
}