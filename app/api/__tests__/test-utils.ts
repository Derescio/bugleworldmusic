import { vi } from 'vitest';
import { NextRequest } from 'next/server';

/**
 * Utility functions for API route testing
 */

/**
 * Creates a mock NextRequest with the specified URL and options
 */
export function createMockRequest(url: string, options: RequestInit = {}): NextRequest {
  return new NextRequest(url, options);
}

/**
 * Creates a mock NextRequest with JSON body
 */
export function createMockRequestWithBody(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

/**
 * Mock Prisma client factory for consistent mocking across tests
 */
export function createMockPrisma() {
  return {
    genre: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    tag: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    music: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    musicGenre: {
      create: vi.fn(),
      delete: vi.fn(),
    },
    musicTag: {
      create: vi.fn(),
      delete: vi.fn(),
    },
    musicLink: {
      create: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
}

/**
 * Mock NextResponse for consistent response testing
 */
export function createMockNextResponse() {
  return {
    json: vi.fn().mockImplementation((data: unknown, init?: ResponseInit) => {
      const response = new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      });
      return response;
    }),
  };
}

/**
 * Test data factories
 */
export const testData = {
  genre: {
    create: (overrides: Partial<Record<string, unknown>> = {}) => ({
      id: 1,
      name: 'Hip Hop',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      ...overrides,
    }),
    createMany: (count: number = 3) =>
      Array.from({ length: count }, (_, i) =>
        testData.genre.create({
          id: i + 1,
          name: ['Hip Hop', 'Reggae', 'R&B'][i] || `Genre ${i + 1}`,
        })
      ),
  },

  tag: {
    create: (overrides: Partial<Record<string, unknown>> = {}) => ({
      id: 1,
      name: 'Conscious',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      ...overrides,
    }),
    createMany: (count: number = 3) =>
      Array.from({ length: count }, (_, i) =>
        testData.tag.create({
          id: i + 1,
          name: ['Conscious', 'Love Songs', 'Party'][i] || `Tag ${i + 1}`,
        })
      ),
  },

  music: {
    create: (overrides: Partial<Record<string, unknown>> = {}) => ({
      id: 1,
      title: 'Test Song',
      description: 'A test song',
      releaseDate: new Date('2024-01-01'),
      duration: 180,
      coverImageUrl: 'https://example.com/cover.jpg',
      label: 'Test Label',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      genres: [
        {
          genre: { id: 1, name: 'Hip Hop' },
        },
      ],
      tags: [
        {
          tag: { id: 1, name: 'Conscious' },
        },
      ],
      links: [
        {
          id: 1,
          platform: 'Spotify',
          url: 'https://spotify.com/track/1',
          musicId: 1,
        },
      ],
      ...overrides,
    }),
    createMany: (count: number = 3) =>
      Array.from({ length: count }, (_, i) =>
        testData.music.create({
          id: i + 1,
          title: `Test Song ${i + 1}`,
        })
      ),
  },

  musicInput: {
    valid: () => ({
      title: 'New Song',
      description: 'A new song',
      releaseDate: '2024-01-01',
      duration: 200,
      coverImageUrl: 'https://example.com/cover.jpg',
      label: 'New Label',
      genres: [1, 2],
      tags: [1],
      links: [{ platform: 'Spotify', url: 'https://spotify.com/track/new' }],
    }),
    minimal: () => ({
      title: 'Minimal Song',
    }),
    invalid: () => ({
      title: '', // Invalid: empty title
      description: 'A song without title',
    }),
  },
};

/**
 * Console spy utilities
 */
export function createConsoleSpy(method: 'log' | 'error' | 'warn' = 'error') {
  return vi.spyOn(console, method).mockImplementation(() => {});
}

/**
 * Async test helper for error scenarios
 */
export async function expectAsyncError(
  asyncFn: () => Promise<unknown>,
  expectedError?: string | RegExp
) {
  try {
    await asyncFn();
    throw new Error('Expected function to throw an error');
  } catch (error) {
    if (expectedError) {
      if (typeof expectedError === 'string') {
        expect(error).toHaveProperty('message', expectedError);
      } else {
        expect(error).toHaveProperty('message');
        expect((error as Error).message).toMatch(expectedError);
      }
    }
    return error;
  }
}

/**
 * URL parameter builder for GET requests
 */
export function buildUrlWithParams(baseUrl: string, params: Record<string, string | number>) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value.toString());
  });
  return url.toString();
}
