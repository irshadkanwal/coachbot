import { useTranslations } from 'next-intl';

import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/card';

import { Post } from '@models/blog.models';

export function CardList({ cards }: { cards: Post[] }) {
  const t = useTranslations('Landing.Blog');
  return (
    <div className="md:px-10 lg:px-0">
      {cards[0] && <Card {...cards[0]} primary />}
      <div className="mt-16 flex flex-wrap gap-6">
        {cards.slice(1).map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>
      {/* TODO: infinity scroll */}
      <Button className="mx-auto mt-10 block hidden border border-[#FFFFFF14] bg-[#FFFFFF14] px-10">
        {t('viewMoreButton')}
      </Button>
    </div>
  );
}
