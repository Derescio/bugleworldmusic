import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

// Schema for music updates (full, including relations)
const musicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  releaseDate: z.string().optional(),
  duration: z.number().optional(),
  coverImageUrl: z.string().optional(),
  label: z.string().optional(),
  isActive: z.boolean().optional(),
  genres: z.array(z.number()).optional(),
  tags: z.array(z.number()).optional(),
  links: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
  tracks: z
    .array(
      z.object({
        title: z.string(),
        duration: z.number().optional(),
        position: z.number(),
      })
    )
    .optional(),
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

    // 1. Update main music fields only
    await prisma.music.update({
      where: { id: resolvedParams.id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        releaseDate: validatedData.releaseDate ? new Date(validatedData.releaseDate) : null,
        duration: validatedData.duration,
        coverImageUrl: validatedData.coverImageUrl,
        label: validatedData.label,
        isActive: validatedData.isActive,
      },
    });

    // 2. Update genres (delete all, then create new)
    if (validatedData.genres) {
      await prisma.musicGenre.deleteMany({ where: { musicId: resolvedParams.id } });
      await prisma.musicGenre.createMany({
        data: validatedData.genres.map((genreId: number) => ({
          musicId: resolvedParams.id,
          genreId,
        })),
      });
    }

    // 3. Update tags (delete all, then create new)
    if (validatedData.tags) {
      await prisma.musicTag.deleteMany({ where: { musicId: resolvedParams.id } });
      await prisma.musicTag.createMany({
        data: validatedData.tags.map((tagId: number) => ({ musicId: resolvedParams.id, tagId })),
      });
    }

    // 4. Update links (delete all, then create new)
    if (validatedData.links) {
      await prisma.link.deleteMany({ where: { musicId: resolvedParams.id } });
      await prisma.link.createMany({
        data: validatedData.links.map((link: { platform: string; url: string }) => ({
          musicId: resolvedParams.id,
          platform: link.platform,
          url: link.url,
        })),
      });
    }

    // 5. Update tracks (delete all, then create new)
    if (validatedData.tracks) {
      await prisma.track.deleteMany({ where: { musicId: resolvedParams.id } });
      await prisma.track.createMany({
        data: validatedData.tracks.map(
          (track: { title: string; duration?: number; position?: number }, idx: number) => ({
            musicId: resolvedParams.id,
            title: track.title,
            duration: typeof track.duration === 'number' ? track.duration : 0,
            position: typeof track.position === 'number' ? track.position : idx,
          })
        ),
      });
    }

    // 6. Return the updated music with relations
    const music = await prisma.music.findUnique({
      where: { id: resolvedParams.id },
      include: {
        genres: { include: { genre: true } },
        tags: { include: { tag: true } },
        links: true,
        tracks: { orderBy: { position: 'asc' } },
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

// DELETE /api/music/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;

    // Check if music exists
    const music = await prisma.music.findUnique({ where: { id: resolvedParams.id } });
    if (!music) {
      return NextResponse.json({ error: 'Music not found' }, { status: 404 });
    }

    // Delete all related records in a transaction
    await prisma.$transaction([
      prisma.musicGenre.deleteMany({ where: { musicId: resolvedParams.id } }),
      prisma.musicTag.deleteMany({ where: { musicId: resolvedParams.id } }),
      prisma.link.deleteMany({ where: { musicId: resolvedParams.id } }),
      prisma.track.deleteMany({ where: { musicId: resolvedParams.id } }),
      prisma.music.delete({ where: { id: resolvedParams.id } }),
    ]);

    return NextResponse.json({ message: 'Music deleted successfully' });
  } catch (error) {
    console.error('Error deleting music:', error);
    return NextResponse.json({ error: 'Failed to delete music' }, { status: 500 });
  }
}
