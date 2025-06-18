import { NextResponse } from 'next/server';

export async function GET() {
  // Headers para evitar caché en desarrollo
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store');
  
  return new NextResponse(
    JSON.stringify({ message: "¡Funciona en Next 15.3.3!" }),
    { headers }
  );
}