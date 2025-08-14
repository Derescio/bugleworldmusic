import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { GET, PUT } from '../route';
import { prisma } from '../../../../lib/prisma';

//Execute
//npx vitest watch app/api/music/[id]/__tests__/route.test.ts

// Mock Prisma
vi.mock('../../../../lib/prisma', () => ({
  prisma: {
    music: {
      findUnique: vi.fn(),
      update: vi.fn(),
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

describe('/api/music/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return music by id with all relations', async () => {
      // Arrange
      const mockMusic = {
        id: '1',
        title: 'Test Song',
        description: 'A test song',
        releaseDate: new Date('2024-01-01'),
        duration: 180,
        coverImageUrl: 'https://example.com/cover.jpg',
        label: 'Test Label',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        genres: [{ genre: { id: 1, name: 'Hip Hop' } }],
        tags: [{ tag: { id: 1, name: 'Conscious' } }],
        links: [{ id: 1, platform: 'Spotify', url: 'https://spotify.com/track/1' }],
        tracks: [{ id: 1, title: 'Track 1', duration: 180, position: 0, musicId: '1' }],
      };

      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.findUnique.mockResolvedValue(mockMusic);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      const mockRequest = {} as NextRequest;
      const mockParams = Promise.resolve({ id: '1' });

      // Act
      await GET(mockRequest, { params: mockParams });

      // Assert
      expect(mockPrisma.music.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
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

      expect(mockNextResponse.json).toHaveBeenCalledWith(mockMusic);
    });

    it('should return 404 when music is not found', async () => {
      // Arrange
      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.findUnique.mockResolvedValue(null);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      const mockRequest = {} as NextRequest;
      const mockParams = Promise.resolve({ id: '999' });

      // Act
      await GET(mockRequest, { params: mockParams });

      // Assert
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Music not found' },
        { status: 404 }
      );
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.findUnique.mockRejectedValue(dbError);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockRequest = {} as NextRequest;
      const mockParams = Promise.resolve({ id: '1' });

      // Act
      await GET(mockRequest, { params: mockParams });

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching music:', dbError);
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Failed to fetch music' },
        { status: 500 }
      );

      consoleSpy.mockRestore();
    });
  });

  describe('PUT', () => {
    it('should update music with valid data', async () => {
      // Arrange
      const updateData = {
        title: 'Updated Song',
        description: 'An updated song description',
        releaseDate: '2024-02-01',
        duration: 200,
        coverImageUrl: 'https://example.com/updated-cover.jpg',
        label: 'Updated Label',
      };

      const mockUpdatedMusicWithRelations = {
        id: '1',
        ...updateData,
        releaseDate: new Date(updateData.releaseDate),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        genres: [{ genre: { id: 1, name: 'Hip Hop' } }],
        tags: [{ tag: { id: 1, name: 'Conscious' } }],
        links: [{ id: 1, platform: 'Spotify', url: 'https://spotify.com/track/1' }],
        tracks: [{ id: 1, title: 'Track 1', duration: 180, position: 0, musicId: '1' }],
      };

      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.update.mockResolvedValue({}); // Not used in handler's response
      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.findUnique.mockResolvedValue(mockUpdatedMusicWithRelations);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      const mockRequest = {
        json: vi.fn().mockResolvedValue(updateData),
      } as unknown as NextRequest;
      const mockParams = Promise.resolve({ id: '1' });

      // Act
      await PUT(mockRequest, { params: mockParams });

      // Assert
      expect(mockPrisma.music.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          title: updateData.title,
          description: updateData.description,
          releaseDate: new Date(updateData.releaseDate),
          duration: updateData.duration,
          coverImageUrl: updateData.coverImageUrl,
          label: updateData.label,
          isActive: undefined,
        },
      });

      expect(mockNextResponse.json).toHaveBeenCalledWith(mockUpdatedMusicWithRelations);
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
      const mockParams = Promise.resolve({ id: '1' });

      // Spy on console.error to suppress expected error output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      await PUT(mockRequest, { params: mockParams });

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

    it('should handle database errors during update', async () => {
      // Arrange
      const validData = {
        title: 'Valid Song',
        description: 'A valid song',
      };

      const dbError = new Error('Database constraint violation');
      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.music.update.mockRejectedValue(dbError);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockRequest = {
        json: vi.fn().mockResolvedValue(validData),
      } as unknown as NextRequest;
      const mockParams = Promise.resolve({ id: '1' });

      // Act
      await PUT(mockRequest, { params: mockParams });

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Error updating music:', dbError);
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Failed to update music' },
        { status: 500 }
      );

      consoleSpy.mockRestore();
    });

    it('should handle invalid JSON in request body', async () => {
      // Arrange
      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as NextRequest;
      const mockParams = Promise.resolve({ id: '1' });

      mockNextResponse.json.mockReturnValue({} as NextResponse);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      await PUT(mockRequest, { params: mockParams });

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Error updating music:', expect.any(Error));
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Failed to update music' },
        { status: 500 }
      );

      consoleSpy.mockRestore();
    });
  });
});
