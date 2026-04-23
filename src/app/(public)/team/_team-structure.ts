import vivaCoachingImage from 'public/images/badges/viva_coaching.svg';
import AmalieImage from 'public/images/badges/amalie.svg';


export interface TeamProfile {
  id: string;
  name: string;
  role: string;
  image: string;
  socialProfiles: {
    name?: string;
    url?: string;
    className?: string;
    image?: any;
  }[];
}

export interface Team {
  title: string;
  description: string;
  profiles: TeamProfile[];
  profilesKey: string;
}

export const teams: Team[] = [
  {
    title: 'Landing.TeamPage.coreTeam.title',
    description: 'Landing.TeamPage.coreTeam.description',
    profilesKey: 'Landing.TeamPage.coreTeam.profiles',
    profiles: [
      {
        id: '0',
        image: 'lewin_keller.png',
        socialProfiles: [{ className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/lewin-keller/' }],
      },
      {
            id: '1',
            image: 'chris_prahl.png',
            socialProfiles: [{ className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/chrisprahl/' }],
      },
      {
        id: '2',
        image: 'nadina_tyropolis.png',
        socialProfiles: [{ className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/nadina-tyropolis-38170527/' }],
      },
      {
        id: '3',
        image: 'david_meehan.png',
        socialProfiles: [{ className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/davidfmeehan/' }],
      },
      {
        id: '4',
        image: 'azhar_hussain.png',
        socialProfiles: [{ className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/azhar--hussain/' }],
      },
      {
        id: '5',
        image: 'felix.png',
        socialProfiles: [{ className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/exnerfelix/' }],
      },
      {
        id: '6',
        image: 'ihor.png',
        socialProfiles: [{ className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/ihor-balandin-2510412b/' }],
      },
      {
        id: '7',
        image: 'ayushi.png',
        socialProfiles: [{ className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/jhsayushi/' }],
      }
    ] as TeamProfile[],
  },
  {
    title: 'Landing.TeamPage.advisorsTeam.title',
    description: 'Landing.TeamPage.advisorsTeam.description',
    profilesKey: 'Landing.TeamPage.advisorsTeam.profiles',
    profiles: [
      {
        id: '0',
        image: 'anna_travis.png',
        socialProfiles: [
          { className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/annatavis/' },
        ],
      },
      {
        id: '1',
        image: 'jonathan_reitz.png',
        socialProfiles: [
          { className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/eva-sonnenschein/' },
        ],
      },
      {
        id: '2',
        image: 'amir_suissa.png',
        socialProfiles: [
          { className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/amirsuissa/' },
        ],
      },
      {
        id: '3',
        image: 'sheila_b.png',
        socialProfiles: [
          { className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/sheilaboysen-rotelli/' },
        ],
      },
      {
        id: '4',
        image: 'rebecca_rutschmann.png',
        socialProfiles: [{ className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/rebeccarutschmann/' },
          {
            name: 'Viva la Coaching Academy',
            image: vivaCoachingImage,
            url: 'https://vivalacoaching.com/',
            className: 'bg-white p-1'
          },
        ],
      },
      {
        id: '5',
        image: 'jule_deges.png',
        socialProfiles: [{ className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/jule-deges/' }],
      },
      {
        id: '6',
        image: 'david_tylor.png',
        socialProfiles: [{ className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/davidtaylorklaus/' }],
      },
      {
        id: '7',
        image: 'roger_dewits.png',
        socialProfiles: [{ className: 'cbi-social-linkedin', url: 'https://www.linkedin.com/in/rogerdewitt/' }],
      }
    ] as TeamProfile[],
  }
];