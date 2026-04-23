'use client';

import { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { 
  UserIcon, 
  ShareIcon
} from '@heroicons/react/24/outline';
import { ICONS } from './icons';
import { useTranslations } from 'next-intl';

export interface CoachCapability {
  icon: string;
  label: string;
}

export interface Coach {
  id: string;
  name: string;
  avatar?: string | StaticImageData;
  tagline?: string;
  creator: {
    name: string;
    avatar?: string | StaticImageData;
    verified?: boolean;
  };
  description: string;
  capabilities: CoachCapability[];
  metrics: {
    users: number;
    messages: number;
    rating: number;
    reviewCount: number;
  };
  badge?: string;
  linkedInUrl?: string;
  botUrl?: string | null;
}

interface CoachCardProps {
  coach: Coach;
  className?: string;
  onStartCoaching?: (coachId: string) => void;
}

export function CoachCard({ coach, className, onStartCoaching }: CoachCardProps) {
  const t = useTranslations('Landing.ShowcasePage');
  const { name, creator, description, capabilities, linkedInUrl, botUrl } = coach;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const audienceCapabilities = capabilities.filter(c => c.label === 'Individuals' || c.label === 'Coach' || c.label === 'Organization');
  const formatsCapabilities = capabilities.filter(c => c.label === 'Machine Led AI' || c.label === 'Human 1:1s');
  const privacyCapabilities = capabilities.filter(c => c.label === 'Confidential' || c.label === 'Anonymized' || c.label === 'Shared');

  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      
      // Wait for layout to complete
      const checkOverflow = () => {
        if (!element.offsetWidth) {
          requestAnimationFrame(checkOverflow);
          return;
        }
        
        // Create a temporary hidden element to measure actual content height
        const tempElement = document.createElement('p');
        tempElement.style.visibility = 'hidden';
        tempElement.style.position = 'absolute';
        tempElement.style.width = `${element.offsetWidth}px`;
        tempElement.style.fontSize = getComputedStyle(element).fontSize;
        tempElement.style.lineHeight = getComputedStyle(element).lineHeight;
        tempElement.style.fontFamily = getComputedStyle(element).fontFamily;
        tempElement.style.padding = getComputedStyle(element).padding;
        tempElement.textContent = description;
        
        document.body.appendChild(tempElement);
        
        // Check if content overflows 2 lines
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
        const maxHeight = lineHeight * 2;
        const needsExpansion = tempElement.scrollHeight > maxHeight;
        
        document.body.removeChild(tempElement);
        
        setShowMoreButton(needsExpansion);
      };
      
      requestAnimationFrame(checkOverflow);
    }
  }, [description]);

  return (
    <div 
      className={twMerge(
        'group relative flex h-full flex-col rounded-2xl border border-gray-border bg-gradient-to-br from-white-opacity-2 to-white-opacity-1 backdrop-blur-sm p-5 transition-all duration-300 hover:border-aquamarine dark:from-gunmetal/40 dark:to-dark-gray/40',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between rounded-full border border-gray-border px-4 py-2 bg-white-opacity-2">
        <h3 className="text-medium font-medium text-main">{name}</h3>
        <button 
          className="rounded-full bg-white-opacity-1 p-2 opacity-60 transition-opacity hover:opacity-100 border border-gray-border"
          onClick={(e) => {
            e.stopPropagation(); 
          }}
        >
          <ShareIcon className="h-4 w-4 text-light-gray" />
        </button>
      </div>

      <div className="mb-4 flex items-start gap-3">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-white-opacity-2">
          {creator.avatar ? (
            <Image
              src={creator.avatar}
              alt={creator.name}
              width={54}
              height={54}
              className="h-full w-full object-contain object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-aquamarine/30 to-primary-green/30">
              <UserIcon className="h-6 w-6 text-aquamarine" />
            </div>
          )}
        </div>
        <div className="flex flex-1 items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-light-gray">{t('card.createdBy')}</span>
            <span className="text-sm font-medium text-main">{creator.name}</span>
            {/* <Link 
              href={linkedInUrl || '#'}
              className="text-xs text-aquamarine hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              View profile
            </Link> */}
          </div>
          <div className="flex items-center gap-2">
            {linkedInUrl && (
              <Link 
                href={linkedInUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-light-gray transition-colors hover:text-aquamarine"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="cbi-social-linkedin text-lg" />
              </Link>
            )}
            {/* <button className="text-light-gray">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button> */}
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <p 
          ref={descriptionRef}
          className={twMerge(
            "text-sm leading-relaxed text-light-gray",
            !isExpanded && "line-clamp-2"
          )}
        >
          {description}
        </p>
        {showMoreButton && (
          <div className="flex justify-end">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-xs text-aquamarine hover:underline"
            >
              {isExpanded ? t('card.showLess') : t('card.showMore')}
            </button>
          </div>
        )}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl border border-gray-border bg-white-opacity-2 p-1.5 h-min-[260px]">
        <div className="flex flex-col">
          <span className="mb-2 text-center text-xs font-medium text-light-gray">{t('card.audience')}</span>
          <div className="flex flex-col rounded-lg border border-gray-border bg-[#55BEF91C]">
            {audienceCapabilities.length > 0 ? (
              audienceCapabilities.map((capability, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center gap-1.5 border-b border-gray-border py-3 px-2 last:border-b-0 dark:border-aquamarine/10"
                >
                  {ICONS[capability.icon as keyof typeof ICONS]}
                  <span className="text-center text-[10px] leading-tight text-[#55BEF9]">{t(`capabilities.${capability.label}`) || capability.label}</span>
                </div>
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center py-3 px-2 text-[10px] text-light-gray">
                {t('card.noData')}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="mb-2 text-center text-xs font-medium text-light-gray">{t('card.formats')}</span>
          <div className="flex flex-col rounded-lg border border-gray-border bg-[#FFFFFF14]">
            {formatsCapabilities.length > 0 ? (
              formatsCapabilities.map((capability, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center gap-1.5 border-b border-gray-border py-3 px-2 last:border-b-0"
                >
                  <div className="format-icon-wrapper text-main dark:text-white">
                    {ICONS[capability.icon as keyof typeof ICONS]}
                  </div>
                  <span className="text-center text-[10px] leading-tight text-main dark:text-white">{t(`capabilities.${capability.label}`) || capability.label}</span>
                </div>
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center py-3 px-2 text-[10px] text-light-gray">
                {t('card.noData')}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="mb-2 text-center text-xs font-medium text-light-gray">{t('card.privacy')}</span>
          <div className="flex flex-col rounded-lg border border-gray-border bg-[#3ABEB81C]">
            {privacyCapabilities.length > 0 ? (
              privacyCapabilities.map((capability, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center gap-1.5 border-b border-gray-border py-3 px-2 last:border-b-0"
                >
                  {ICONS[capability.icon as keyof typeof ICONS]}
                  <span className="text-center text-[10px] leading-tight text-[#3ABEB8]">{t(`capabilities.${capability.label}`) || capability.label}</span>
                </div>
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center py-3 px-2 text-[10px] text-light-gray">
                {t('card.noData')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics */}
      {/* <div className="mb-4 flex w-full items-center">
        <div className="flex flex-1 items-center justify-center gap-1.5">
          <UserIcon className="h-4 w-4 fill-main text-main" />
          <span className="text-sm font-medium text-main">{metrics.users}</span>
        </div>
        <div className="h-6 w-px bg-gray-border"></div>
        <div className="flex flex-1 items-center justify-center gap-1.5">
          <ChatBubbleLeftRightIcon className="h-4 w-4 fill-blue-400 text-aquamarine dark:fill-blue-400 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-400 dark:text-blue-400">{metrics.messages}</span>
        </div>
        <div className="h-6 w-px bg-gray-border"></div>
        <div className="flex flex-1 items-center justify-center gap-1">
          <StarIconSolid className="h-4 w-4 fill-yellow text-yellow" />
          <span className="text-sm font-medium text-yellow">{metrics.rating.toFixed(1)}</span>
          <span className="text-sm text-yellow">({metrics.reviewCount})</span>
        </div>
      </div> */}

      <button
        onClick={() => onStartCoaching?.(coach.id)}
        disabled={botUrl === null}
        className={twMerge(
          "mt-auto w-full rounded-xl border-2 py-3 text-base font-medium transition-all",
          botUrl !== null
            ? "border-aquamarine bg-transparent text-aquamarine hover:bg-aquamarine/10"
            : "border-gray-border bg-white-opacity-1 text-light-gray cursor-not-allowed opacity-60"
        )}
      >
        <div className="flex items-center justify-center gap-2">
          {botUrl !== null && (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span>{botUrl !== null ? (name === 'Aliza' ? 'Start Reflecting' : t('card.startCoaching')) : t('card.comingSoon')}</span>
        </div>
      </button>
    </div>
  );
}

