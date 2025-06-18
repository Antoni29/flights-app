'use client';

import { useState } from 'react';
import AirportAutocomplete from '../components/AirportAutocomplete';
import axios from 'axios';

interface FormData {
  origin: string;
  originIata: string;
  destination: string;
  destinationIata: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  isRoundTrip: boolean;
}

interface FlightOffer {
  id: string;
  itineraries: Array<{
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
    }>;
  }>;
  price: {
    total: string;
    currency: string;
  };
}

export default function FlightSearch() {
  const [formData, setFormData] = useState<FormData>({
    origin: '',
    originIata: '',
    destination: '',
    destinationIata: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    isRoundTrip: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [flightOffers, setFlightOffers] = useState<FlightOffer[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFlightOffers([]);
    setHasSearched(false);

    // Validación básica
    if (!formData.originIata || !formData.destinationIata) {
      setError('Please select valid airports for both origin and destination');
      return;
    }

    if (!formData.departureDate) {
      setError('Please select a departure date');
      return;
    }

    if (formData.isRoundTrip && !formData.returnDate) {
      setError('Please select a return date for round trip');
      return;
    }

    if (formData.isRoundTrip && new Date(formData.returnDate) < new Date(formData.departureDate)) {
      setError('Return date must be after departure date');
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get('/api/flights/search', {
        params: {
          origin: formData.originIata,
          destination: formData.destinationIata,
          date: formData.departureDate,
          returnDate: formData.isRoundTrip ? formData.returnDate : undefined,
          adults: formData.adults,
        },
      });

      console.log('Flight search response:', response.data); // Para debugging
      setFlightOffers(response.data.data || []);
      setHasSearched(true);
    } catch (error: any) {
      console.error('Error searching flights:', error);
      setError(error.response?.data?.error || 'Failed to search flights. Please try again.');
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Flights</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <AirportAutocomplete
                label="From"
                value={formData.origin}
                onChange={(value, iataCode) => 
                  setFormData({ ...formData, origin: value, originIata: iataCode })
                }
                placeholder="Search departure airport"
              />
              <AirportAutocomplete
                label="To"
                value={formData.destination}
                onChange={(value, iataCode) => 
                  setFormData({ ...formData, destination: value, destinationIata: iataCode })
                }
                placeholder="Search arrival airport"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {formData.isRoundTrip && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    min={formData.departureDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={formData.isRoundTrip}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isRoundTrip}
                  onChange={(e) => setFormData({ ...formData, isRoundTrip: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Round Trip</span>
              </label>
              <div className="flex items-center">
                <label className="text-sm text-gray-700 mr-2">Passengers:</label>
                <select
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
                  className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSearching}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Searching...' : 'Search Flights'}
              </button>
            </div>
          </form>

          {/* Search Results Section */}
          {hasSearched && (
            <div className="mt-8">
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Searching for flights...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : flightOffers.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Found {flightOffers.length} Available Flights
                  </h3>
                  <div className="space-y-4">
                    {flightOffers.map((offer) => (
                      <div
                        key={offer.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            {offer.itineraries[0].segments.map((segment, index) => (
                              <div key={index} className="flex items-center space-x-4">
                                <div>
                                  <div className="font-medium">{formatDate(segment.departure.at)}</div>
                                  <div className="text-sm text-gray-500">
                                    {segment.departure.iataCode}
                                    {segment.departure.terminal && ` Terminal ${segment.departure.terminal}`}
                                  </div>
                                </div>
                                <div className="flex-1 text-center">
                                  <div className="text-sm text-gray-500">
                                    {segment.carrierCode} {segment.number}
                                  </div>
                                  <div className="text-xs text-gray-400">→</div>
                                </div>
                                <div>
                                  <div className="font-medium">{formatDate(segment.arrival.at)}</div>
                                  <div className="text-sm text-gray-500">
                                    {segment.arrival.iataCode}
                                    {segment.arrival.terminal && ` Terminal ${segment.arrival.terminal}`}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              {offer.price.currency} {offer.price.total}
                            </div>
                            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No flights found for your search criteria.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Try adjusting your dates or searching for different routes.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}