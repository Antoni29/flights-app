import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'SoaAPI Vuelos',
  description: 'Encuentra los mejores vuelos para tu próximo viaje',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold text-blue-600">SoaAPI Vuelos</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/flights" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Buscar Vuelos
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
