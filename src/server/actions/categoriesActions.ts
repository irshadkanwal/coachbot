'use server';

import { getCategories } from '../prismaDB';
import { getTranslatedCategories } from '@/utils/locale-utils';

export const getAllCategories = async () => {
  const categories = await getCategories();

  return getTranslatedCategories(categories);
};
