import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

// Schema for music updates
const musicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  releaseDate: z.string().optional(),
  duration: z.number().optional(),
  coverImageUrl: z.string().optional(),
  label: z.string().optional(),
});

// GET /api/music/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const music = await prisma.music.findUnique({
      where: { id: resolvedParams.id },
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

    if (!music) {
      return NextResponse.json({ error: 'Music not found' }, { status: 404 });
    }

    return NextResponse.json(music);
  } catch (error) {
    console.error('Error fetching music:', error);
    return NextResponse.json({ error: 'Failed to fetch music' }, { status: 500 });
  }
}

// PUT /api/music/[id] - Update existing music
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const validatedData = musicSchema.parse(body);

    const music = await prisma.music.update({
      where: { id: resolvedParams.id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        releaseDate: validatedData.releaseDate ? new Date(validatedData.releaseDate) : null,
        duration: validatedData.duration,
        coverImageUrl: validatedData.coverImageUrl,
        label: validatedData.label,
      },
    });

    return NextResponse.json(music);
  } catch (error) {
    console.error('Error updating music:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to update music' }, { status: 500 });
  }
}
