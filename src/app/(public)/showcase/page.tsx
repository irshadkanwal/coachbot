'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/shared/Container';
import { SearchBar } from '@/components/showcase/SearchBar';
import { ShowcaseFilters } from '@/components/showcase/ShowcaseFilters';
import { CoachCard, Coach } from '@/components/showcase/CoachCard';
import { PrivacyIcons } from '@/components/showcase';
import { showcaseImages } from 'public/images/showcase/index';

const mockCoaches: Coach[] = [
  {
    id: '1',
    name: 'JonathanBot',
    avatar: showcaseImages[0],
    tagline: 'Your AI Coaching Partner',
    creator: {
      name: 'Jonathan Reitz',
      avatar: showcaseImages[0],
      verified: true,
    },
    description: 'A reflective practice partner for you and your coaching workflow. Instant expert-level feedback on coaching scenarios.',
    capabilities: [
      { icon: 'individual', label: 'Individuals' },
      { icon: 'org', label: 'Organization' },
      { icon: 'coach', label: 'Coach' },
      { icon: 'human', label: 'Machine Led AI' },
      { icon: 'human1', label: 'Human 1:1s' },
      { icon: 'lock', label: 'Confidential' },
      { icon: 'anonymous', label: 'Anonymized' },
      { icon: 'shared', label: 'Shared' },
    ],
    metrics: {
      users: 181,
      messages: 2660,
      rating: 4.8,
      reviewCount: 19,
    },
    badge: 'BETA',
    linkedInUrl: 'https://www.linkedin.com/in/jonathanreitz/',
    botUrl: 'https://try.coachbot.ai/jonathanbot',
  },
  {
    id: '2',
    name: 'Aliza',
    avatar: showcaseImages[1],
    tagline: 'AI Supervisor',
    creator: {
      name: 'Rebecca Rutschmann',
      avatar: showcaseImages[1],
      verified: true,
    },
    description: 'Aliza is the first AI Supervisor introduced to the coaching world in 2024 — a bold step toward expanding reflective practice. She offers a structured, thoughtful space where coaches sharpen their self-awareness, question their patterns, and strengthen their professional maturity. Aliza opens a fresh path for those committed to becoming the strongest version of themselves, standing guard over quality, ethics, and personal growth in coaching.',
    capabilities: [
      { icon: 'org', label: 'Organization' },
      { icon: 'coach', label: 'Coach' },
      { icon: 'human', label: 'Machine Led AI' },
      { icon: 'human_plus', label: 'Human Groups' },
      { icon: 'lock', label: 'Confidential' },
      { icon: 'anonymous', label: 'Anonymized' },
      { icon: 'shared', label: 'Shared' },
    ],
    metrics: {
      users: 23,
      messages: 397,
      rating: 4.8,
      reviewCount: 5,
    },
    linkedInUrl: 'https://www.linkedin.com/in/rebeccarutschmann/',
    botUrl: 'https://try.coachbot.ai/Aliza',
  },
  {
    id: '3',
    name: 'Enzo 2.0',
    avatar: showcaseImages[2],
    tagline: 'Creative AI Coach',
    creator: {
      name: 'Edward Temple',
      avatar: showcaseImages[2],
      verified: false,
    },
    description: 'Your creative AI coach designed to help you build your dreams and grow your confidence.',
    capabilities: [
      { icon: 'individual', label: 'Individuals' },
      { icon: 'human', label: 'Machine Led AI' },
      { icon: 'human1', label: 'Human 1:1s' },
      { icon: 'lock', label: 'Confidential' },
      { icon: 'anonymous', label: 'Anonymized' },
      { icon: 'shared', label: 'Shared' },
    ],
    metrics: {
      users: 17,
      messages: 161,
      rating: 4.6,
      reviewCount: 9,
    },
    linkedInUrl: 'https://www.linkedin.com/in/edward-temple/',
    botUrl: 'https://try.coachbot.ai/jonathanbot',
  },
  {
    id: '4',
    name: 'AI Coach Garry',
    avatar: showcaseImages[3],
    tagline: 'Transformational Coaching',
    creator: {
      name: 'Garry Schleifer',
      avatar: showcaseImages[3],
      verified: true,
    },
    description: 'AI Coach Garry delivers transformational, strengths-focused coaching using ICF Core Competencies methodology, integrating both personal.',
    capabilities: [
      { icon: 'individual', label: 'Individuals' },
      { icon: 'org', label: 'Organization' },
      { icon: 'human', label: 'Machine Led AI' },
      { icon: 'human1', label: 'Human 1:1s' },
      { icon: 'lock', label: 'Confidential' },
      { icon: 'anonymous', label: 'Anonymized' },
      { icon: 'shared', label: 'Shared' },
    ],
    metrics: {
      users: 42,
      messages: 541,
      rating: 4.8,
      reviewCount: 8,
    },
    linkedInUrl: 'https://www.linkedin.com/in/garryschleifer/',
    botUrl: 'https://coachbot.ai/chat?cbsas=69efe691-fb2b-492a-ad83-f687c0e46c3f',
  },
  {
    id: '5',
    name: 'aiDTK: Laser Coaching',
    avatar: showcaseImages[4],
    tagline: 'Precision Coaching',
    creator: {
      name: 'David Taylor-Klaus, MCC',
      avatar: showcaseImages[4],
      verified: true,
    },
    description: 'Laser Coaching for successful entrepreneurs and maverick leaders seeking to build profitable businesses, raise thriving families, and live wildly fulfilling lives. aiDTK was created and trained by a Master Certified Coach on his coaching, his body of knowledge, and his nearly 40 years of leadership. Get to know aiDTK and meet your future!',
    capabilities: [
      { icon: 'individual', label: 'Individuals' },
      { icon: 'coach', label: 'Coach' },
      { icon: 'human', label: 'Machine Led AI' },
      { icon: 'human1', label: 'Human 1:1s' },
      { icon: 'lock', label: 'Confidential' },
      { icon: 'anonymous', label: 'Anonymized' },
      { icon: 'shared', label: 'Shared' },
    ],
    metrics: {
      users: 37,
      messages: 402,
      rating: 4.8,
      reviewCount: 23,
    },
    linkedInUrl: 'https://www.linkedin.com/in/davidtaylorklaus/',
    botUrl: 'https://try.coachbot.ai/aidtk',
  },
  {
    id: '6',
    name: 'AI Roger',
    avatar: showcaseImages[5],
    tagline: 'Expert ADHD Coaching',
    creator: {
      name: 'Roger DeWitt',
      avatar: showcaseImages[5],
      verified: true,
    },
    description: 'Meet Roger DeWitt, M.C.Ac, PCC, MHFA - a passionate coach helping people with ADHD harness their unique strengths.',
    capabilities: [
      { icon: 'individual', label: 'Individuals' },
      { icon: 'org', label: 'Organization' },
      { icon: 'coach', label: 'Coach' },
      { icon: 'human', label: 'Machine Led AI' },
      { icon: 'human1', label: 'Human 1:1s' },
      { icon: 'lock', label: 'Confidential' },
      { icon: 'anonymous', label: 'Anonymized' },
      { icon: 'shared', label: 'Shared' },
    ],
    metrics: {
      users: 15,
      messages: 317,
      rating: 4.8,
      reviewCount: 7,
    },
    linkedInUrl: 'https://www.linkedin.com/in/rogerdewitt/',
    botUrl: null,
  },
  {
    id: '7',
    name: 'Alpina',
    avatar: showcaseImages[6],
    tagline: 'AI Senior Coach',
    creator: {
      name: 'Rebecca Rutschmann',
      avatar: showcaseImages[6],
      verified: true,
    },
    description: 'Alpina stands as one of the most advanced AI coaching companions crafted by Rebecca Rutschmann — designed for research, rigor, and the pursuit of what coaching with AI can truly become. She supports in stretching their thinking, challenge assumptions, and test the outer boundaries of coaching intelligence.',
    capabilities: [
      { icon: 'org', label: 'Organization' },
      { icon: 'coach', label: 'Coach' },
      { icon: 'human', label: 'Machine Led AI' },
      { icon: 'human_plus', label: 'Human Groups' },
      { icon: 'lock', label: 'Confidential' },
      { icon: 'anonymous', label: 'Anonymized' },
      { icon: 'shared', label: 'Shared' },
    ],
    metrics: {
      users: 23,
      messages: 397,
      rating: 4.8,
      reviewCount: 5,
    },
    linkedInUrl: 'https://www.linkedin.com/in/rebeccarutschmann/',
    botUrl: 'https://try.coachbot.ai/Alpina',
  },
  {
    id: '8',
    name: 'AI RKarl - Baseline',
    avatar: showcaseImages[7],
    tagline: 'Professional Coaching AI',
    creator: {
      name: 'R. Karl Hebenstreit',
      avatar: showcaseImages[7],
      verified: true,
    },
    description: 'A professional coaching conversational AI that draws upon proven leadership/management development coaching techniques.',
    capabilities: [
      { icon: 'individual', label: 'Individuals' },
      { icon: 'human', label: 'Machine Led AI' },
      { icon: 'human1', label: 'Human 1:1s' },
      { icon: 'lock', label: 'Confidential' },
      { icon: 'anonymous', label: 'Anonymized' },
      { icon: 'shared', label: 'Shared' },
    ],
    metrics: {
      users: 6,
      messages: 211,
      rating: 4.8,
      reviewCount: 2,
    },
    linkedInUrl: 'https://linkedin.com',
    botUrl: 'https://coachbot.ai/chat?cbsas=f71f6f4b-77e5-4035-8b44-b73b3824b83d',
  },
   {
    id: '9',
    name: 'Laurie AI',
    avatar: showcaseImages[8],
    tagline: 'Professional Coaching AI',
    creator: {
      name: 'Paul Wilson',
      avatar: showcaseImages[8],
      verified: true,
    },
    description: 'Your guide to navigating career change, breaking big transitions into small experiments,',
    capabilities: [
      { icon: 'individual', label: 'Individuals' },
      { icon: 'human', label: 'Machine Led AI' },
      { icon: 'human1', label: 'Human 1:1s' },
      { icon: 'lock', label: 'Confidential' },

    ],
    metrics: {
      users: 6,
      messages: 211,
      rating: 4.8,
      reviewCount: 2,
    },
    linkedInUrl: 'https://www.linkedin.com/in/paul-wilson-274350/',
    botUrl: 'https://coachbot.ai/chat?cbsas=34f403a8-db3e-41b0-9f69-08ddeb353706',
  },
];

export default function ShowcasePage() {
  const t = useTranslations('Landing.ShowcasePage');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort coaches based on search and filters
  const filteredCoaches = useMemo(() => {
    let filtered = mockCoaches;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (coach) =>
          coach.name.toLowerCase().includes(query) ||
          coach.description.toLowerCase().includes(query) ||
          coach.creator.name.toLowerCase().includes(query) ||
          coach.tagline?.toLowerCase().includes(query) ||
          coach.capabilities.some((cap) => cap.label.toLowerCase().includes(query))
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'popular':
        sorted.sort((a, b) => b.metrics.users - a.metrics.users);
        break;
      case 'rating':
        sorted.sort((a, b) => b.metrics.rating - a.metrics.rating);
        break;
      case 'newest':
      default:
        // Keep original order for newest
        break;
    }

    return sorted;
  }, [searchQuery, sortBy]);

  const handleStartCoaching = (coachId: string) => {
    const coach = mockCoaches.find(c => c.id === coachId);
    if (coach && coach.botUrl !== null) {
      window.open(coach.botUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="relative min-h-screen w-full py-12">
      <Container className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
          {/* Left Column - Title and Description */}
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold md:text-4xl text-primary-green">
                {t('title')}
              </h1>
              {/* <div className="flex items-center gap-2 rounded-lg border border-gray-border px-3 py-1.5 bg-[#3ABEB81C]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.0007 15.5552C12.7367 15.5552 13.334 16.1526 13.334 16.8886C13.334 17.6246 12.7367 18.2219 12.0007 18.2219C11.2647 18.2219 10.6673 17.6246 10.6673 16.8886C10.6673 16.1526 11.2647 15.5552 12.0007 15.5552ZM12.8895 13.7775C12.8895 13.2788 13.2522 12.6886 13.7144 12.4335C15.0478 11.6983 15.7651 10.1908 15.5002 8.68056C15.2487 7.2459 14.0709 6.06901 12.6371 5.81834C11.59 5.63612 10.5224 5.91612 9.71532 6.59434C8.90821 7.27256 8.4451 8.26456 8.4451 9.3179C8.4451 9.80856 8.84332 10.2068 9.33398 10.2068C9.82465 10.2068 10.2229 9.80856 10.2229 9.3179C10.2229 8.79167 10.4549 8.29479 10.8584 7.95523C11.2682 7.61034 11.7909 7.47345 12.3304 7.56856C13.03 7.69123 13.6264 8.28767 13.7491 8.98723C13.8851 9.76056 13.5349 10.5019 12.8567 10.8761C11.8291 11.4423 11.1118 12.6352 11.1118 13.7775C11.1118 14.269 11.51 14.6663 12.0007 14.6663C12.4913 14.6663 12.8895 14.269 12.8895 13.7775ZM22.6673 18.2219V5.77745C22.6673 3.32679 20.6735 1.33301 18.2229 1.33301H5.77843C3.32776 1.33301 1.33398 3.32679 1.33398 5.77745V18.2219C1.33398 20.6726 3.32776 22.6663 5.77843 22.6663H18.2229C20.6735 22.6663 22.6673 20.6726 22.6673 18.2219ZM18.2229 3.11079C19.6931 3.11079 20.8895 4.30723 20.8895 5.77745V18.2219C20.8895 19.6921 19.6931 20.8886 18.2229 20.8886H5.77843C4.30821 20.8886 3.11176 19.6921 3.11176 18.2219V5.77745C3.11176 4.30723 4.30821 3.11079 5.77843 3.11079H18.2229Z" fill="#3ABEB8"/>
                </svg>
                <span className="text-xs font-medium text-primary-green">
                  How it works
                </span>
              </div> */}
            </div>
            <p className="text-base text-light-gray">
              {t('description')}
            </p>
          </div>

          {/* Right Column - Privacy Container */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto rounded-xl border border-gray-border bg-[#3ABEB81C] p-3 sm:p-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs sm:text-sm text-main">{t('privacy.title')}</p>
              <p className="text-xs sm:text-sm font-semibold text-main">{t('privacy.compliance')}</p>
              {/* <p className="text-xs text-light-gray">Learn more in our Trust & Privacy Center.</p> */}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <PrivacyIcons/>
    
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery}
          placeholder={t('searchPlaceholder')}
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <ShowcaseFilters
            sortBy={sortBy}
            onSortChange={setSortBy}
            onRefresh={handleRefresh}
            onAddFilters={() => console.log('Add filters')}
            className="w-full"
          />
          {/* <div className="text-sm text-light-gray">
            Showing {filteredCoaches.length} {filteredCoaches.length === 1 ? 'coach' : 'coaches'}
          </div> */}
        </div>

        {/* Coach Cards Grid */}
        {filteredCoaches.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredCoaches.map((coach) => (
              <CoachCard
                key={coach.id}
                coach={coach}
                onStartCoaching={handleStartCoaching}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl border border-gray-border bg-white-opacity-2 p-12">
            <i className="cbi-search-normal text-6xl text-light-gray"></i>
            <h3 className="text-2xl font-semibold text-main">{t('noResults.title')}</h3>
            <p className="text-center text-light-gray">
              {t('noResults.description')}
            </p>
            <button
              onClick={handleRefresh}
              className="mt-4 rounded-lg bg-gradient-to-r from-aquamarine to-primary-green px-6 py-3 font-semibold text-dark-blue transition-all hover:opacity-90"
            >
              {t('noResults.resetButton')}
            </button>
          </div>
        )}
      </Container>

      {/* Background Gradient */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-3/4 w-3/4 -translate-x-1/2 rotate-[170deg] rounded-full bg-aquamarine opacity-15 blur-4xl xl:max-w-7xl"></div>
    </div>
  );
}
