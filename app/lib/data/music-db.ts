import { prisma } from '../prisma';
import type { MusicRelease } from './music';

// Types for database models
interface DbMusic {
  id: string;
  title: string;
  description: string | null;
  releaseDate: Date | null;
  duration: number | null;
  coverImageUrl: string | null;
  label: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  genres: Array<{
    genre: {
      id: number;
      name: string;
    };
  }>;
  tags: Array<{
    tag: {
      id: number;
      name: string;
    };
  }>;
  links: Array<{
    id: number;
    platform: string;
    url: string;
  }>;
  tracks: Array<{
    id: number;
    title: string;
    duration: number | null;
    position: number;
  }>;
}

// Transform database models to match the existing MusicRelease interface
function transformMusicToRelease(music: DbMusic): MusicRelease {
  return {
    id: music.id,
    title: music.title,
    type: music.tags?.[0]?.tag?.name?.toLowerCase() as 'album' | 'single' | 'ep',
    releaseDate: music.releaseDate?.toISOString() || new Date().toISOString(),
    image: music.coverImageUrl || '/images/Albums/default-album.png',
    description: music.description || '',
    tracks: music.tracks?.map(track => track.title) || [],
    duration: music.duration ? formatDuration(music.duration) : undefined,
    label: music.label || undefined,
    producers: [], // You might want to add a producers field to your schema
    streamingLinks: {
      spotify: music.links?.find(link => link.platform.toLowerCase() === 'spotify')?.url,
      appleMusic: music.links?.find(link => link.platform.toLowerCase() === 'apple music')?.url,
      youtube: music.links?.find(link => link.platform.toLowerCase() === 'youtube')?.url,
      amazonMusic: music.links?.find(link => link.platform.toLowerCase() === 'amazon music')?.url,
      tidal: music.links?.find(link => link.platform.toLowerCase() === 'tidal')?.url,
    },
    features: [], // You might want to add a features field to your schema
    genre: music.genres?.map(genre => genre.genre.name) || [],
  };
}

// Helper function to format duration from seconds to MM:SS format
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Get all music releases from database
export async function getAllMusicReleases(): Promise<MusicRelease[]> {
  try {
    const music = await prisma.music.findMany({
      where: {
        isActive: true,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        links: true,
        tracks: {
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        releaseDate: 'desc',
      },
    });

    return music.map(transformMusicToRelease);
  } catch (error) {
    console.error('Error fetching music releases:', error);
    return [];
  }
}

// Get music release by ID from database
export async function getMusicReleaseById(id: string): Promise<MusicRelease | undefined> {
  try {
    const music = await prisma.music.findUnique({
      where: { id },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        links: true,
        tracks: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!music) return undefined;
    return transformMusicToRelease(music);
  } catch (error) {
    console.error('Error fetching music release by ID:', error);
    return undefined;
  }
}

// Get music releases by type from database
export async function getMusicReleasesByType(type: MusicRelease['type']): Promise<MusicRelease[]> {
  try {
    const music = await prisma.music.findMany({
      where: {
        isActive: true,
        tags: {
          some: {
            tag: {
              name: {
                mode: 'insensitive',
                in: [
                  type.charAt(0).toUpperCase() + type.slice(1), // "Album", "Single", "Ep"
                  type.toUpperCase(), // "ALBUM", "SINGLE", "EP"
                  type.toLowerCase(), // "album", "single", "ep"
                ],
              },
            },
          },
        },
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        links: true,
        tracks: {
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        releaseDate: 'desc',
      },
    });

    return music.map(transformMusicToRelease);
  } catch (error) {
    console.error('Error fetching music releases by type:', error);
    return [];
  }
}

// Get featured music releases (you can customize this logic)
export async function getFeaturedMusicReleases(limit: number = 6): Promise<MusicRelease[]> {
  try {
    const music = await prisma.music.findMany({
      where: {
        isActive: true,
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        links: true,
        tracks: {
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: [{ releaseDate: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });

    return music.map(transformMusicToRelease);
  } catch (error) {
    console.error('Error fetching featured music releases:', error);
    return [];
  }
}

// Search music releases by title or description
export async function searchMusicReleases(query: string): Promise<MusicRelease[]> {
  try {
    const music = await prisma.music.findMany({
      where: {
        isActive: true,
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        links: true,
        tracks: {
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        releaseDate: 'desc',
      },
    });

    return music.map(transformMusicToRelease);
  } catch (error) {
    console.error('Error searching music releases:', error);
    return [];
  }
}
