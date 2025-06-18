import { amadeusGet } from './amadeusClient';

export async function searchFlights(
    origin: string, 
    destination: string, 
    departureDate: string,
    returnDate?: string | null,
    passengers: number = 1
) {
    const params = {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: departureDate,
        adults: passengers.toString(),
        currencyCode: 'USD',
        max: '5'
    };

    if (returnDate) {
        Object.assign(params, { returnDate });
    }

    const data = await amadeusGet('/v2/shopping/flight-offers', params);

    return data.data.map((flight: any) => ({
        id: flight.id,
        price: flight.price.total,
        airlines: flight.validatingAirlineCodes,
        itinerary: flight.itineraries.flatMap((itinerary: any) => 
            itinerary.segments.map((segment: any) => ({
                from: segment.departure.iataCode,
                to: segment.arrival.iataCode,
                departure: segment.departure.at,
                arrival: segment.arrival.at
            }))
        )
    }));
}