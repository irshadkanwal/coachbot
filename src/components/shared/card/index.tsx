import clsx from 'clsx';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { ArrowRightCircleIcon as ArrowRightCircleIconOutline } from '@heroicons/react/24/outline';
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid';

import { Post } from '@models/blog.models';

import { CardDetails } from './CardDetails';
import { PublicRoutes } from '@models/common.models';
import { twMerge } from 'tailwind-merge';

const getClassNames = (primary: boolean, isStatic: boolean) => {
  return {
    card: clsx(
      'group relative basis-full md:basis-[48%] lg:basis-[30%] flex flex-col h-auto items-center rounded-3xl shadow border border-transparent min-h-0 ',
      primary ? 'h-full xl:h-[20vh] xl:max-h-[30rem] lgH:h-[35vh] xl:min-h-96 md:flex-row sm:w-full' : 'md:max-w-full pb-3',
      isStatic ? 'cursor-default' : 'hover:border hover:border-white-opacity-3 hover:bg-white-opacity-3 transition-colors dark:hover:border-gray-border dark:hover:bg-white-opacity-2',
    ),
    imgContainer: twMerge('relative rounded-3xl w-full  max-h-48 h-full', primary ? 'md:w-full md:h-full max-h-full ' : 'shrink-0'),
    category: 'bg-green-yellow-gradient absolute top-3 left-3 px-3.5 py-1 rounded-full text-xs text-dark-blue',
    rightInfo: clsx('flex flex-col h-full justify-between p-3 w-full leading-normal gap-y-7'),
    submitBtn: clsx(
      'relative text-dark-aquamarine text-right md:mt-7 md:mb-3',
      { 'md:mt-0 lg:mt-7': primary },
      { hidden: isStatic }
    ),
    arrowRightIcon: 'absolute inset-0 size-12 transition-opacity top-1/2 -translate-y-1/2 left-full -ml-12',
  }
};

export interface CardProps extends Post {
  primary?: boolean;
  isStatic?: boolean;
}

export function Card({
  id,
  title,
  postingDate,
  readingTime,
  author,
  category,
  imageUrl,
  primary,
  isStatic,
}: CardProps) {
  const t = useTranslations();

  const classNames = getClassNames(!!primary, !!isStatic);

  return (
    <Link href={`${PublicRoutes.blog}/${id}`} className={classNames.card}>
      <div className={classNames.imgContainer}>
        <div className={clsx(classNames.category, { hidden: !category })}>
          {category?.translateKey ? t(category?.translateKey) : category?.name}
        </div>
        <img className="h-full w-full rounded-3xl object-cover max-h-full" src={imageUrl} alt="" />
      </div>
      <div className={classNames.rightInfo}>
        <CardDetails title={title} date={postingDate} readingTime={readingTime} author={author} primary={primary} />
        <div className={classNames.submitBtn}>
          <span className="relative pr-16 text-lg text-dark-aquamarine">{t('Landing.Blog.card.startReading')}</span>
          <ArrowRightCircleIcon className={clsx(classNames.arrowRightIcon, 'opacity-0 group-hover:opacity-100')} />
          <ArrowRightCircleIconOutline
            className={clsx(classNames.arrowRightIcon, 'opacity-100 group-hover:opacity-0')}
          />
        </div>
      </div>
    </Link>
  );
}
