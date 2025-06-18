# Flight Search Application

This is a [Next.js](https://nextjs.org) project that provides a flight search interface using the Amadeus API.

## Features

- Search flights with flexible date options
- Airport autocomplete with city and country information
- Real-time flight pricing
- Responsive design
- Integration with Amadeus API

## Getting Started

First, set up your environment variables by creating a `.env.local` file:

```bash
AMADEUS_CLIENT_ID=your_client_id_here
AMADEUS_CLIENT_SECRET=your_client_secret_here
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is configured for deployment on [Vercel](https://vercel.com). To deploy:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure the following environment variables in Vercel:
   - `AMADEUS_CLIENT_ID`
   - `AMADEUS_CLIENT_SECRET`
4. Deploy!

## Environment Variables

The following environment variables are required:

- `AMADEUS_CLIENT_ID`: Your Amadeus API Client ID
- `AMADEUS_CLIENT_SECRET`: Your Amadeus API Client Secret

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Amadeus for Developers](https://developers.amadeus.com/)
- [Vercel Platform](https://vercel.com)
