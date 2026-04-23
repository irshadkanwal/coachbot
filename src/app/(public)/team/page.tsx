import { EmailSubscription } from "@/components/landing/EmailSubscription";
import { Container } from "@/components/shared/Container";
import { getGcpStorageSignedUrl } from "@/server/gcpClient";
import { getTranslations } from "next-intl/server";
import Image from 'next/image';
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Team, TeamProfile, teams } from "./_team-structure";
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meet the Team | CoachBot\'s AI Coaching Experts',
  description: 'Discover the team behind CoachBot.ai, committed to transforming coaching with scalable, GDPR-compliant AI tools for growth professionals.',
};

const getTeamsWithImages = async (t: any): Promise<Team[]> => {
  try {
    const mappedData = await Promise.all(teams.map(async (team: Team) => {
      const teamProfiles = await t.raw(team.profilesKey);

      return {
        ...team,
        profiles: team.profiles.map((profile: TeamProfile) => {
          return { ...profile, ...(Object.values(teamProfiles).find((textProfile: any) => textProfile.id === profile.id) || {}) };
        })
      }
    }));

    return Promise.all(mappedData.map(async (item: Team) => {
      const updatedProfiles = await Promise.all(
        item.profiles.map(async (profile: TeamProfile) => {
          const image = await getGcpStorageSignedUrl(profile.image, 'lifeinsights/coachbot_avatars/team');

          return { ...profile, image, };
        })
      );

      return { ...item, profiles: updatedProfiles, };
    }));
  } catch (err) {
    console.error('[getTeamsWithImages] Error fetching teams with images:', err);
    throw err;
  }
};

export default async function TeamPage() {
  const t = await getTranslations();
  const teams = await getTeamsWithImages(t);

  return (
    <Container className="relative isolate flex h-full flex-col w-full pt-3 lg:pt-16 gap-y-16">
      <Image src={'/images/coachbot-logo-md.svg'} alt="hero-logo" className={'-rotate-12 opacity-20 blur-lg w-2/5 min-w-64 absolute right-10 top-16 -z-10'} width={1000} height={1000} />
      {teams.map((team, index) => (
        <div key={index} className="flex flex-col gap-y-11 lg:gap-y-16 border-b border-storm-gray pb-8 lg:pb-16">
          <div className="flex flex-col gap-y-6 lg:gap-y-10">
            <h3 className="text-3xl lg:text-6xl text-saffron uppercase">{t(team.title)}</h3>
            <p className="text-lg text-text-main">{t(team.description)}</p>
          </div>

          <ul className="flex flex-row flex-wrap gap-y-5 lg:gap-y-16 gap-x-3">
            {team.profiles.map((profile: TeamProfile, i: number) => (
              <li key={'member-' + i} className="flex justify-center shrink-1 basis-[24%]">
                <div className="flex flex-col border border-transparent rounded-3xl hover:bg-white-opacity-2 hover:border-gray-border w-full">
                  <div className="flex flex-col w-full">
                    <Image src={profile.image} alt={profile.name} width={300} height={300} className="w-full rounded-3xl aspect-square object-cover" />
                  </div>
                  <div className="flex flex-col flex-grow justify-between gap-y-4 p-4">
                    <h4 className="text-text-main text-medium lg:text-xl font-medium text-wrap">{profile.name}</h4>
                    <p className="text-light-gray text-base text-wrap">{profile.role}</p>
                    <div className="flex gap-x-3 items-center">
                      {profile.socialProfiles.map((social, i) => (
                        social.url
                          ? <Link key={i} href={social.url} target="_blank" className={twMerge('text-text-main text-3xl hover:text-light-gray', social.className)} title={social.name}>
                            {social.image && <Image alt={social.name || profile.name} src={social.image} />}
                          </Link>
                          : social.image && <Image alt={social.name || profile.name} key={i} src={social.image} />
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <EmailSubscription className="mt-10 py-20 border-none" />
    </Container>
  );
}
