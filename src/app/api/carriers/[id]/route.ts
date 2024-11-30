import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

// Extend the Zod schema to match the test expectations
const CarrierUpdateSchema = z.object({
  name: z.string().min(1),
  mc_number: z.string(),
  dot_number: z.string().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  rating: z.number().or(z.string()).optional()
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid carrier ID' }, { status: 400 });
    }
    
    const carrier = await prisma.carrier.findUnique({
      where: { id }
    });
    
    if (!carrier) {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      ...carrier,
      mc_number: carrier.mcNumber,
      dot_number: carrier.dotNumber,
      rating: Number(carrier.rating).toFixed(1)
    });
  } catch (error) {
    console.error('Error fetching carrier:', error);
    return NextResponse.json({ error: 'Failed to fetch carrier' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Strict ID parsing and validation
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      console.error('Invalid carrier ID:', params.id);
      return NextResponse.json({ 
        error: 'Invalid carrier ID', 
        providedId: params.id 
      }, { status: 400 });
    }

    // Check if carrier exists before update
    const existingCarrier = await prisma.carrier.findUnique({
      where: { id }
    });

    if (!existingCarrier) {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = CarrierUpdateSchema.parse(body);

    // Comprehensive update with all possible fields
    const carrier = await prisma.carrier.update({
      where: { id },
      data: {
        name: validatedData.name,
        mcNumber: validatedData.mc_number,
        dotNumber: validatedData.dot_number,
        phone: validatedData.phone,
        status: validatedData.status,
        rating: validatedData.rating ? Number(validatedData.rating) : existingCarrier.rating
      }
    });

    // Construct response matching test expectations
    const response = {
      ...carrier,
      id: carrier.id,
      mc_number: carrier.mcNumber,
      dot_number: carrier.dotNumber,
      rating: Number(carrier.rating).toFixed(1)
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error updating carrier:', error);
    
    // Detailed error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Failed to update carrier',
      errorDetails: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid carrier ID' }, { status: 400 });
    }
    
    await prisma.carrier.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Carrier deleted successfully' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 });
    }
    console.error('Error deleting carrier:', error);
    return NextResponse.json({ error: 'Failed to delete carrier' }, { status: 500 });
  }
}
