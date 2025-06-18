import axios from 'axios';

let accessToken: string | null = null;
let tokenExpiration: number | null = null;

export async function getAmadeusToken() {
  // Si el token existe y no ha expirado, lo devolvemos
  if (accessToken && tokenExpiration && Date.now() < tokenExpiration) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID!,
        client_secret: process.env.AMADEUS_CLIENT_SECRET!,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    accessToken = response.data.access_token;
    // El token expira en response.data.expires_in segundos
    tokenExpiration = Date.now() + (response.data.expires_in * 1000);
    
    return accessToken;
  } catch (error) {
    console.error('Error getting Amadeus token:', error);
    throw new Error('Failed to get Amadeus access token');
  }
}

export async function searchAirports(keyword: string) {
  try {
    const token = await getAmadeusToken();
    const response = await axios.get(
      'https://test.api.amadeus.com/v1/reference-data/locations',
      {
        params: {
          subType: 'AIRPORT,CITY',
          keyword: keyword,
          'page[limit]': 10,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error searching airports:', error);
    throw new Error('Failed to search airports');
  }
} 