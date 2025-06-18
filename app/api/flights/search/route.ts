import { NextResponse } from 'next/server';
import { getAmadeusToken } from '@/app/services/amadeus';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults');

  if (!origin || !destination || !date || !adults) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const token = await getAmadeusToken();
    
    const response = await axios.get(
      'https://test.api.amadeus.com/v2/shopping/flight-offers',
      {
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate: date,
          returnDate: returnDate || undefined,
          adults: adults,
          max: 5,
          currencyCode: 'USD',
          nonStop: false,
          travelClass: 'ECONOMY'
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    // Log the response for debugging
    console.log('Amadeus API Response:', {
      status: response.status,
      dataLength: response.data.data?.length,
      meta: response.data.meta
    });

    if (!response.data.data || response.data.data.length === 0) {
      return NextResponse.json(
        { data: [], message: 'No flights found for the given criteria' },
        { status: 200 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error searching flights:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Handle specific Amadeus API errors
    if (error.response?.status === 400) {
      return NextResponse.json(
        { error: 'Invalid search parameters. Please check your input.' },
        { status: 400 }
      );
    }

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Authentication failed. Please try again.' },
        { status: 401 }
      );
    }

    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to search flights. Please try again.' },
      { status: error.response?.status || 500 }
    );
  }
}