import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

// Schema for show creation/update
const showSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  venue: z.string().min(1, 'Venue is required'),
  ticketUrl: z.string().url().optional().or(z.literal('')),
});

// GET /api/shows - Fetch all shows
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const shows = await prisma.show.findMany({
      skip,
      take: limit,
      orderBy: {
        date: 'asc',
      },
    });

    const total = await prisma.show.count();

    return NextResponse.json({
      shows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching shows:', error);
    return NextResponse.json({ error: 'Failed to fetch shows' }, { status: 500 });
  }
}

// POST /api/shows - Create new show
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received show request body:', body);

    const validatedData = showSchema.parse(body);

    const show = await prisma.show.create({
      data: {
        date: new Date(validatedData.date),
        country: validatedData.country,
        city: validatedData.city,
        venue: validatedData.venue,
        ticketUrl: validatedData.ticketUrl || null,
      },
    });

    console.log('Show created successfully:', show);
    return NextResponse.json(show, { status: 201 });
  } catch (error) {
    console.error('Error creating show:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create show' }, { status: 500 });
  }
}
