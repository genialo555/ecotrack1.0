import { NextResponse } from 'next/server';
import { z } from 'zod';
import { VehicleType } from '@/types/vehicle';

type ApiError = {
  message: string;
  code?: string;
  details?: unknown;
};

// Validation schema for vehicle data
const vehicleSchema = z.object({
  type: z.nativeEnum(VehicleType),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  co2_rate: z.number().min(0),
  specs: z.record(z.any()).optional()
});

// Helper function to handle errors
function handleError(err: unknown): NextResponse {
  console.error('API Error:', err);
  
  if (err instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation Error', details: err.errors },
      { status: 400 }
    );
  }

  const error = err as Error;
  const apiError: ApiError = {
    message: error.message || 'Internal Server Error',
    code: error.name || 'UnknownError'
  };

  return NextResponse.json(
    { error: apiError },
    { status: 500 }
  );
}

// GET: Fetch vehicles for authenticated user
export async function GET(request: Request) {
  try {
    // The middleware has already validated the auth token
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles`, {
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vehicles');
    }

    const vehicles = await response.json();
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Failed to fetch vehicles:', error);
    return handleError(error);
  }
}

// POST: Create a new vehicle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = vehicleSchema.parse(body);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error('Failed to create vehicle');
    }

    const vehicle = await response.json();
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Failed to create vehicle:', error);
    return handleError(error);
  }
}

// PUT: Update a vehicle
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = vehicleSchema.partial().parse(body);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error('Failed to update vehicle');
    }

    const vehicle = await response.json();
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Failed to update vehicle:', error);
    return handleError(error);
  }
}

// DELETE: Soft delete a vehicle
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete vehicle');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete vehicle:', error);
    return handleError(error);
  }
}
