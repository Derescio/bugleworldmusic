import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

// Schema for music creation/update
const musicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  releaseDate: z.string().optional(),
  duration: z.number().optional(),
  coverImageUrl: z.string().optional(),
  label: z.string().optional(),
  genres: z.array(z.number()).optional(),
  tags: z.array(z.number()).optional(),
  links: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().url(),
      })
    )
    .optional(),
});

// GET /api/music - Fetch all music
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const music = await prisma.music.findMany({
      skip,
      take: limit,
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

    const total = await prisma.music.count();

    return NextResponse.json({
      music,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching music:', error);
    return NextResponse.json({ error: 'Failed to fetch music' }, { status: 500 });
  }
}

// POST /api/music - Create new music
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = musicSchema.parse(body);

    const music = await prisma.music.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        releaseDate: validatedData.releaseDate ? new Date(validatedData.releaseDate) : null,
        duration: validatedData.duration,
        coverImageUrl: validatedData.coverImageUrl,
        label: validatedData.label,
        genres: validatedData.genres
          ? {
              create: validatedData.genres.map(genreId => ({
                genre: { connect: { id: genreId } },
              })),
            }
          : undefined,
        tags: validatedData.tags
          ? {
              create: validatedData.tags.map(tagId => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
        links: validatedData.links
          ? {
              create: validatedData.links,
            }
          : undefined,
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

    return NextResponse.json(music, { status: 201 });
  } catch (error) {
    console.error('Error creating music:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create music' }, { status: 500 });
  }
}
