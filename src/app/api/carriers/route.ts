import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Extend the Zod schema to match the test expectations
const CarrierSchema = z.object({
  name: z.string().min(1),
  mc_number: z.string(),
  dot_number: z.string().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  rating: z.number().or(z.string()).optional()
});

export async function GET() {
  try {
    const carriers = await prisma.carrier.findMany();
    return NextResponse.json(carriers);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CarrierSchema.parse(body);
    
    // Check for existing carrier with the same MC number
    const existingCarrier = await prisma.carrier.findFirst({
      where: { mcNumber: validatedData.mc_number }
    });

    if (existingCarrier) {
      return NextResponse.json(
        { message: 'MC number must be unique' }, 
        { status: 409 }
      );
    }

    // Create the carrier with only the fields supported by the schema
    const carrier = await prisma.carrier.create({
      data: {
        name: validatedData.name,
        mcNumber: validatedData.mc_number,
        dotNumber: validatedData.dot_number,
        phone: validatedData.phone,
        status: validatedData.status || 'Pending',
        rating: validatedData.rating ? Number(validatedData.rating) : 0
      }
    });

    // Construct the response to match the test expectations
    const response = {
      ...carrier,
      mc_number: carrier.mcNumber,
      dot_number: carrier.dotNumber,
      rating: Number(carrier.rating).toFixed(1)
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating carrier:', error);
    return NextResponse.json({ error: 'Failed to create carrier' }, { status: 500 });
  }
}
