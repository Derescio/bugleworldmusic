import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import { GET } from '../route';
import { prisma } from '../../../lib/prisma';

// Mock Prisma
vi.mock('../../../lib/prisma', () => ({
  prisma: {
    genre: {
      findMany: vi.fn(),
    },
  },
}));

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn(),
  },
}));

const mockPrisma = vi.mocked(prisma);
const mockNextResponse = vi.mocked(NextResponse);

describe('/api/genres', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all genres ordered by name', async () => {
      // Arrange
      const mockGenres = [
        { id: 1, name: 'Hip Hop', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Reggae', createdAt: new Date(), updatedAt: new Date() },
        { id: 3, name: 'R&B', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrisma.genre.findMany.mockResolvedValue(mockGenres);
      mockNextResponse.json.mockReturnValue(new Response() as unknown as Response);

      // Act
      await GET();

      // Assert
      expect(mockPrisma.genre.findMany).toHaveBeenCalledWith({
        orderBy: {
          name: 'asc',
        },
      });
      expect(mockNextResponse.json).toHaveBeenCalledWith(mockGenres);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockPrisma.genre.findMany.mockRejectedValue(dbError);
      mockNextResponse.json.mockReturnValue(new Response() as unknown as Response);

      // Spy on console.error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      await GET();

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching genres:', dbError);
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Failed to fetch genres' },
        { status: 500 }
      );

      consoleSpy.mockRestore();
    });

    it('should return empty array when no genres exist', async () => {
      // Arrange
      mockPrisma.genre.findMany.mockResolvedValue([]);
      mockNextResponse.json.mockReturnValue(new Response() as unknown as Response);

      // Act
      await GET();

      // Assert
      expect(mockNextResponse.json).toHaveBeenCalledWith([]);
    });
  });
});
