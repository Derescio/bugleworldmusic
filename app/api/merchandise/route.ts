import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

// Schema for merchandise creation/update
const merchandiseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string().optional(),
  colors: z.array(z.string().min(1)).min(1, 'At least one color is required'),
  sizes: z.array(z.string().min(1)).min(1, 'At least one size is required'),
  imageUrls: z.array(z.string().url()).min(1, 'At least one image is required'),
  isActive: z.boolean().default(true),
});

// GET /api/merchandise - Fetch all merchandise
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const merchandise = await prisma.merchandise.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.merchandise.count();

    return NextResponse.json({
      merchandise,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching merchandise:', error);
    return NextResponse.json({ error: 'Failed to fetch merchandise' }, { status: 500 });
  }
}

// POST /api/merchandise - Create new merchandise
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received merchandise request body:', body);

    const validatedData = merchandiseSchema.parse(body);

    const merchandise = await prisma.merchandise.create({
      data: {
        name: validatedData.name,
        price: validatedData.price,
        description: validatedData.description,
        colors: validatedData.colors,
        sizes: validatedData.sizes,
        imageUrls: validatedData.imageUrls,
        isActive: validatedData.isActive,
      },
    });

    console.log('Merchandise created successfully:', merchandise);
    return NextResponse.json(merchandise, { status: 201 });
  } catch (error) {
    console.error('Error creating merchandise:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create merchandise' }, { status: 500 });
  }
}
