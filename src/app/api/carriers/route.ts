import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

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
    
    // Transform carriers to match expected response format
    const formattedCarriers = carriers.map(carrier => ({
      ...carrier,
      mc_number: carrier.mcNumber,
      dot_number: carrier.dotNumber,
      rating: Number(carrier.rating).toFixed(1)
    }));

    return NextResponse.json(formattedCarriers);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CarrierSchema.parse(body);
    
    try {
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
    } catch (dbError) {
      // Handle specific database constraint errors
      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (dbError.code === 'P2002') {
          // Determine which unique constraint was violated
          const constraintDetails = dbError.meta?.target as string[] | undefined;
          
          if (constraintDetails?.includes('mc_number')) {
            return NextResponse.json(
              { message: 'MC number must be unique' }, 
              { status: 409 }
            );
          }
          
          // Fallback for other unique constraints
          return NextResponse.json(
            { message: 'A carrier with these unique constraints already exists' }, 
            { status: 409 }
          );
        }
      }
      
      // Re-throw other errors
      throw dbError;
    }
  } catch (error) {
    console.error('Error creating carrier:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Failed to create carrier',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
