import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { GET, POST } from '../route';
import { prisma } from '../../../lib/prisma';

// Mock Prisma
vi.mock('../../../lib/prisma', () => ({
  prisma: {
    music: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn(),
  },
  NextRequest: vi.fn(),
}));

const mockPrisma = vi.mocked(prisma);
const mockNextResponse = vi.mocked(NextResponse);

describe('/api/music', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return paginated music with default pagination', async () => {
      // Arrange
      const mockMusic = [
        {
          id: 1,
          title: 'Test Song',
          description: 'A test song',
          releaseDate: new Date('2024-01-01'),
          duration: 180,
          coverImageUrl: 'https://example.com/cover.jpg',
          label: 'Test Label',
          createdAt: new Date(),
          updatedAt: new Date(),
          genres: [{ genre: { id: 1, name: 'Hip Hop' } }],
          tags: [{ tag: { id: 1, name: 'Conscious' } }],
          links: [{ id: 1, platform: 'Spotify', url: 'https://spotify.com/track/1' }],
        },
      ];

      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.findMany.mockResolvedValue(mockMusic);
      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.count.mockResolvedValue(1);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      const mockRequest = {
        url: 'http://localhost:3000/api/music',
      } as NextRequest;

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockPrisma.music.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
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
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(mockNextResponse.json).toHaveBeenCalledWith({
        music: mockMusic,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      });
    });

    it('should handle custom pagination parameters', async () => {
      // Arrange
      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.findMany.mockResolvedValue([]);
      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.count.mockResolvedValue(25);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      const mockRequest = {
        url: 'http://localhost:3000/api/music?page=2&limit=5',
      } as NextRequest;

      // Act
      await GET(mockRequest);

      // Assert
      expect(mockPrisma.music.findMany).toHaveBeenCalledWith({
        skip: 5, // (page 2 - 1) * limit 5
        take: 5,
        include: expect.any(Object),
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(mockNextResponse.json).toHaveBeenCalledWith({
        music: [],
        pagination: {
          page: 2,
          limit: 5,
          total: 25,
          pages: 5,
        },
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.findMany.mockRejectedValue(dbError);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockRequest = {
        url: 'http://localhost:3000/api/music',
      } as NextRequest;

      // Act
      await GET(mockRequest);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching music:', dbError);
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Failed to fetch music' },
        { status: 500 }
      );

      consoleSpy.mockRestore();
    });
  });

  describe('POST', () => {
    it('should create new music with valid data', async () => {
      // Arrange
      const mockMusicData = {
        title: 'New Song',
        description: 'A new song',
        releaseDate: '2024-01-01',
        duration: 200,
        coverImageUrl: 'https://example.com/cover.jpg',
        label: 'New Label',
        genres: [1, 2],
        tags: [1],
        links: [{ platform: 'Spotify', url: 'https://spotify.com/track/new' }],
      };

      const mockCreatedMusic = {
        id: 2,
        ...mockMusicData,
        releaseDate: new Date(mockMusicData.releaseDate),
        createdAt: new Date(),
        updatedAt: new Date(),
        genres: [{ genre: { id: 1, name: 'Hip Hop' } }],
        tags: [{ tag: { id: 1, name: 'Conscious' } }],
        links: mockMusicData.links,
      };

      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.create.mockResolvedValue(mockCreatedMusic);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      const mockRequest = {
        json: vi.fn().mockResolvedValue(mockMusicData),
      } as unknown as NextRequest;

      // Act
      await POST(mockRequest);

      // Assert
      expect(mockPrisma.music.create).toHaveBeenCalledWith({
        data: {
          title: mockMusicData.title,
          description: mockMusicData.description,
          releaseDate: new Date(mockMusicData.releaseDate),
          duration: mockMusicData.duration,
          coverImageUrl: mockMusicData.coverImageUrl,
          label: mockMusicData.label,
          genres: {
            create: mockMusicData.genres.map(genreId => ({
              genre: { connect: { id: genreId } },
            })),
          },
          tags: {
            create: mockMusicData.tags.map(tagId => ({
              tag: { connect: { id: tagId } },
            })),
          },
          links: {
            create: mockMusicData.links,
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
        },
      });

      expect(mockNextResponse.json).toHaveBeenCalledWith(mockCreatedMusic, { status: 201 });
    });

    it('should handle validation errors', async () => {
      // Arrange
      const invalidData = {
        title: '', // Invalid: empty title
        description: 'A song without title',
      };

      mockNextResponse.json.mockReturnValue({} as NextResponse);

      const mockRequest = {
        json: vi.fn().mockResolvedValue(invalidData),
      } as unknown as NextRequest;

      // Spy on console.error to suppress expected error output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      await POST(mockRequest);

      // Assert
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          error: 'Validation failed',
          details: expect.any(Array),
        },
        { status: 400 }
      );

      consoleSpy.mockRestore();
    });

    it('should handle database errors during creation', async () => {
      // Arrange
      const validData = {
        title: 'Valid Song',
        description: 'A valid song',
      };

      const dbError = new Error('Database constraint violation');
      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.create.mockRejectedValue(dbError);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockRequest = {
        json: vi.fn().mockResolvedValue(validData),
      } as unknown as NextRequest;

      // Act
      await POST(mockRequest);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Error creating music:', dbError);
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Failed to create music' },
        { status: 500 }
      );

      consoleSpy.mockRestore();
    });

    it('should create music with minimal required data', async () => {
      // Arrange
      const minimalData = {
        title: 'Minimal Song',
      };

      const mockCreatedMusic = {
        id: 3,
        title: minimalData.title,
        description: null,
        releaseDate: null,
        duration: null,
        coverImageUrl: null,
        label: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        genres: [],
        tags: [],
        links: [],
      };

      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.create.mockResolvedValue(mockCreatedMusic);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      const mockRequest = {
        json: vi.fn().mockResolvedValue(minimalData),
      } as unknown as NextRequest;

      // Act
      await POST(mockRequest);

      // Assert
      expect(mockPrisma.music.create).toHaveBeenCalledWith({
        data: {
          title: minimalData.title,
          description: undefined,
          releaseDate: null,
          duration: undefined,
          coverImageUrl: undefined,
          label: undefined,
          genres: undefined,
          tags: undefined,
          links: undefined,
        },
        include: expect.any(Object),
      });

      expect(mockNextResponse.json).toHaveBeenCalledWith(mockCreatedMusic, { status: 201 });
    });

    it('should handle invalid JSON in request body', async () => {
      // Arrange
      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as NextRequest;

      mockNextResponse.json.mockReturnValue({} as NextResponse);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      await POST(mockRequest);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Error creating music:', expect.any(Error));
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Failed to create music' },
        { status: 500 }
      );

      consoleSpy.mockRestore();
    });
  });
});
