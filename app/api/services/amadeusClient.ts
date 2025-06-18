import axios from "axios";

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getToken(): Promise<string> {
    if (accessToken && Date.now() < tokenExpiry) return accessToken;

    const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID!,
        client_secret: process.env.AMADEUS_CLIENT_SECRET!
    });

    console.log("GET TOKEN PARAMS", params);

    const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expired_in * 1000;

    return accessToken ? accessToken : "";
}

export async function amadeusGet(endpoint: string, params: Record<string, string>) {
    
    const token = await getToken();

    const response = await axios.get(`https://test.api.amadeus.com${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params
    })

    return response.data
}