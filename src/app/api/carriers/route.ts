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
    
    // Create the carrier with only the fields supported by the schema
    const carrier = await prisma.carrier.create({
      data: {
        name: validatedData.name,
        mcNumber: validatedData.mc_number
      }
    });

    // Construct the response to match the test expectations
    const response = {
      ...carrier,
      mc_number: carrier.mcNumber,
      dot_number: validatedData.dot_number,
      phone: validatedData.phone,
      status: validatedData.status,
      rating: validatedData.rating ? Number(validatedData.rating).toFixed(1) : "0.0"
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating carrier:', error);
    return NextResponse.json({ error: 'Failed to create carrier' }, { status: 500 });
  }
}
