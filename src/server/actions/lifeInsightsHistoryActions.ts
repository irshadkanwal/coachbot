'use server';

import {
  createHistoryItem,
  deleteHistoryItem,
  getAllHistoryItems,
  getLatestHistoryItem,
  updateHistoryItem,
} from '@/server/prismaDB';
import { Area, HistoryItem } from '@models';
import { getFullUser } from '@/server/actions/userActions';
import { getImageDataUrl } from './chartActions';

export const getHistory = async (): Promise<HistoryItem[]> => {
  const { id } = await getFullUser();
  const historyItems = await getAllHistoryItems(id);

  return Promise.all(
    historyItems.map(async (item: HistoryItem) => {
      return item.id
        ? {
          ...item,
          image: item.imageUrl ? await getImageDataUrl(item.imageUrl) : '/images/empty-chart.svg',
        }
        : item;
    })
  );
};

export const getLastHistory = async (): Promise<HistoryItem | null> => {
  const { id } = await getFullUser();
  return getLatestHistoryItem(id);
};

export const addHistoryItem = async (historyItem: HistoryItem): Promise<HistoryItem> => {
  const { id } = await getFullUser();
  const item = {
    ...historyItem,
    areas: historyItem.areas.map(({ id, name, value, desiredValue, monthsPeriod }: Area) => ({ id, name, value, desiredValue, monthsPeriod } as Area))
  };

  return createHistoryItem(id, item);
};

export const modifyHistoryItem = async (id: string, updateData: HistoryItem): Promise<HistoryItem | null> => {
  return updateHistoryItem(id, { ...updateData, image: undefined });
};

export const removeHistoryItem = async (id: string): Promise<void> => {
  return deleteHistoryItem(id);
};
