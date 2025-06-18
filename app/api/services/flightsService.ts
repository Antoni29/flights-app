type Flight = {
    id: string,
    origin: string,
    destination: string,
    date: string,
    airline: string,
    price: number
}

export async function searchFlights(origin: string, destination: string, date: string): Promise<Flight[]> {
    const flights: Flight[] = [
        {
            id: '1',
            origin,
            destination,
            date,
            airline: 'Avianca',
            price: 300
        },
        {
            id: '2',
            origin,
            destination,
            date,
            airline: 'LATAM',
            price: 280
        }
    ]

    return flights;
}