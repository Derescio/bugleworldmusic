export interface MusicRelease {
  id: string;
  title: string;
  type: 'album' | 'single' | 'ep';
  releaseDate: string;
  image: string;
  description: string;
  tracks?: string[];
  duration?: string;
  label?: string;
  producers?: string[];
  streamingLinks: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    amazonMusic?: string;
    tidal?: string;
  };
  features?: string[];
  genre: string[];
}

export const musicReleases: MusicRelease[] = [
  {
    id: 'patience-god-and-time',
    title: 'Patience God & Time',
    type: 'album',
    releaseDate: '2023-06-15',
    image: '/images/Albums/Patience-God_And-Time.png',
    description:
      "A powerful collection of conscious reggae tracks that showcase Bugle's spiritual growth and musical maturity. This album explores themes of patience, faith, and divine timing.",
    tracks: [
      'Intro (Patience)',
      "God's Time",
      'Blessed Morning',
      'Righteousness',
      'Jah Love',
      'Patience',
      'Divine Purpose',
      'Outro (Time)',
    ],
    duration: '45:32',
    label: 'Bugle Music',
    producers: ['Bugle', 'Various'],
    streamingLinks: {
      spotify: '#',
      appleMusic: '#',
      youtube: '#',
      amazonMusic: '#',
    },
    genre: ['Reggae', 'Conscious', 'Spiritual'],
  },
  {
    id: 'pull-up',
    title: 'Pull Up',
    type: 'single',
    releaseDate: '2023-03-10',
    image: '/images/Albums/PullUp.png',
    description:
      "An energetic dancehall anthem that showcases Bugle's versatility and ability to create infectious party vibes while maintaining his conscious message.",
    duration: '3:45',
    label: 'Bugle Music',
    producers: ['Bugle', 'Top Ranking Productions'],
    streamingLinks: {
      spotify: '#',
      appleMusic: '#',
      youtube: '#',
      tidal: '#',
    },
    genre: ['Dancehall', 'Reggae', 'Party'],
  },
  {
    id: 'life-span',
    title: 'Life Span',
    type: 'album',
    releaseDate: '2022-11-20',
    image: '/images/Albums/LifeSpan.png',
    description:
      "A reflective album that contemplates life's journey, mortality, and the importance of making every moment count. Features deep lyrics over classic reggae rhythms.",
    tracks: [
      "Life's Journey",
      'Mortal Man',
      'Time Precious',
      'Legacy',
      'Memories',
      'Life Span',
      'Eternal',
    ],
    duration: '38:15',
    label: 'Bugle Music',
    producers: ['Bugle', 'Life Span Productions'],
    streamingLinks: {
      spotify: '#',
      appleMusic: '#',
      youtube: '#',
      amazonMusic: '#',
      tidal: '#',
    },
    genre: ['Reggae', 'Conscious', 'Roots'],
  },
  {
    id: 'toxicity',
    title: 'Toxicity',
    type: 'single',
    releaseDate: '2022-08-05',
    image: '/images/Albums/Toxicity.png',
    description:
      'A hard-hitting track addressing social issues and toxic behaviors in society. Bugle delivers powerful lyrics over a heavy reggae-influenced beat.',
    duration: '4:12',
    label: 'Bugle Music',
    producers: ['Bugle', 'Toxic Riddim Productions'],
    streamingLinks: {
      spotify: '#',
      appleMusic: '#',
      youtube: '#',
    },
    genre: ['Reggae', 'Social Commentary', 'Conscious'],
  },
  {
    id: 'apex',
    title: 'Apex',
    type: 'ep',
    releaseDate: '2022-01-15',
    image: '/images/Albums/Apex.png',
    description:
      'An EP representing Bugle at his creative peak. Five tracks that demonstrate his range from conscious reggae to dancehall, all delivered with his signature style.',
    tracks: ['Apex Intro', 'Peak Performance', 'Mountain Top', 'Higher Levels', 'Summit'],
    duration: '22:30',
    label: 'Bugle Music',
    producers: ['Bugle', 'Apex Productions'],
    streamingLinks: {
      spotify: '#',
      appleMusic: '#',
      youtube: '#',
      amazonMusic: '#',
      tidal: '#',
    },
    genre: ['Reggae', 'Dancehall', 'Conscious'],
  },
];

export function getMusicReleaseById(id: string): MusicRelease | undefined {
  return musicReleases.find(release => release.id === id);
}

export function getAllMusicReleases(): MusicRelease[] {
  return musicReleases;
}

export function getMusicReleasesByType(type: MusicRelease['type']): MusicRelease[] {
  return musicReleases.filter(release => release.type === type);
}
