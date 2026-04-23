'use client';

import { useCallback, useEffect, useState } from 'react';

import { CategoriesFilter, CategoryBaseOption } from '@/components/blog/elements/CategoriesFilter';
import { Container } from '@/components/shared/Container';

import { getAllBlogPosts } from '@/server/actions/blogPostActions';

import { Post } from '@models/blog.models';

import { SearchInput, Title, CardList } from './elements';
import { Category } from '@models/data.models';
import { getUniqueObjectsArray } from '@/utils/formatter';

interface BlogState {
  search: string;
  cards: Post[];
  categories: CategoryBaseOption[];
  selectedCategory?: CategoryBaseOption;
}

export function Blog() {
  const [state, setState] = useState<BlogState>({
    search: '',
    cards: [],
    categories: [],
  });

  const handleSubmit = useCallback(async (search: string) => {
    const filter = state.selectedCategory && { categoryName: state.selectedCategory.name };
    const searchedPosts = await getAllBlogPosts(filter, search);

    setState((prev) => ({
      ...prev,
      search,
      cards: searchedPosts,
    }));
  }, []);

  const handleSelectCategory = useCallback(
    async (categoryId: string | null) => {
      const selectedCategory = state.categories.find((c) => c.id === categoryId);
      const filteredCards = await getAllBlogPosts(
        selectedCategory && { categoryName: selectedCategory.name },
        state.search
      );

      setState((prev) => {
        const updatedCategories = prev.categories.map((cat) => ({
          ...cat,
          selected: cat.id === categoryId,
        }));

        return {
          ...prev,
          categories: updatedCategories,
          cards: filteredCards,
          selectedCategory,
        };
      });
    },
    [state.categories, state.search]
  );

  const fetchBlogPosts = useCallback(async () => {
    const cards = (await getAllBlogPosts()) || ([] as Post[]);
    const categories = cards.reduce(
      (acc: Category[], { category }: Post) =>
        category ? [...acc, { ...category, key: category.id, selected: false }] : acc,
      [] as CategoryBaseOption[]
    );

    setState((prev) => ({
      ...prev,
      cards,
      categories: getUniqueObjectsArray(categories),
    }));
  }, []);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  return (
    <div className="max-xl:mx-10 relative mx-auto w-full px-4 md:my-5 md:px-0 lg:my-8 lg:max-w-4xl lg:px-0 xl:max-w-6xl 2xl:max-w-7xl">
      <Container className="flex flex-col items-center">
        <Title />
        <SearchInput onSearchSubmit={handleSubmit} className="max-w-[566px]" />
        <CategoriesFilter categories={state.categories} handleSelection={handleSelectCategory} />
      </Container>
      <CardList cards={state.cards} />
    </div>
  );
}
