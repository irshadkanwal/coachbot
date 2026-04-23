import { HistoryDetail } from '@/components/lifeInsights/HistoryDetail';
import { getAllCategories } from '@/server/actions/categoriesActions';

export default async function History() {
  const categories = await getAllCategories();

  return <HistoryDetail categories={categories} />;
}
