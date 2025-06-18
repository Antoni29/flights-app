import { NextResponse } from 'next/server';
import { searchAirports } from '@/app/services/amadeus';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
  }

  try {
    const airports = await searchAirports(keyword);
    return NextResponse.json({ data: airports });
  } catch (error: any) {
    console.error('Error in airports API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch airports' },
      { status: error.response?.status || 500 }
    );
  }
} 