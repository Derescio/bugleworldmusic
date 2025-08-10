import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import { GET } from '../route';
import { prisma } from '../../../lib/prisma';

// Mock Prisma
vi.mock('../../../lib/prisma', () => ({
  prisma: {
    tag: {
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

describe('/api/tags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all tags ordered by name', async () => {
      // Arrange
      const mockTags = [
        { id: 1, name: 'Conscious', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Love Songs', createdAt: new Date(), updatedAt: new Date() },
        { id: 3, name: 'Party', createdAt: new Date(), updatedAt: new Date() },
      ];

      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.tag.findMany.mockResolvedValue(mockTags);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      // Act
      await GET();

      // Assert
      expect(mockPrisma.tag.findMany).toHaveBeenCalledWith({
        orderBy: {
          name: 'asc',
        },
      });
      expect(mockNextResponse.json).toHaveBeenCalledWith(mockTags);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.tag.findMany.mockRejectedValue(dbError);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      // Spy on console.error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      await GET();

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching tags:', dbError);
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Failed to fetch tags' },
        { status: 500 }
      );

      consoleSpy.mockRestore();
    });

    it('should return empty array when no tags exist', async () => {
      // Arrange
      // @ts-expect-error - Vitest mock typing issue
      mockPrisma.tag.findMany.mockResolvedValue([]);
      mockNextResponse.json.mockReturnValue({} as NextResponse);

      // Act
      await GET();

      // Assert
      expect(mockNextResponse.json).toHaveBeenCalledWith([]);
    });
  });
});
