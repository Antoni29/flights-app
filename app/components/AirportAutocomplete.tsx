import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Airport {
  iataCode: string;
  name: string;
  address: {
    cityName: string;
    countryName: string;
  };
  subtype: string;
}

interface AirportAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string, iataCode: string) => void;
  placeholder?: string;
}

export default function AirportAutocomplete({
  label,
  value,
  onChange,
  placeholder = 'Search airports...',
}: AirportAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAirports = async (keyword: string) => {
    if (!keyword || keyword.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/airports?keyword=${encodeURIComponent(keyword)}`);
      setSuggestions(response.data.data || []);
    } catch (error) {
      console.error('Error searching airports:', error);
      setError('Failed to search airports. Please try again.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue, ''); // Clear IATA code when input changes

    // Show suggestions immediately when typing
    setShowSuggestions(true);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchAirports(newValue);
    }, 300); // Debounce for 300ms
  };

  const handleSuggestionClick = (airport: Airport) => {
    // Format the display value to include all relevant information
    const displayValue = `${airport.name} - ${airport.address.cityName}, ${airport.address.countryName} (${airport.iataCode})`;
    onChange(displayValue, airport.iataCode);
    setShowSuggestions(false);
  };

  const getAirportType = (subtype: string) => {
    return subtype === 'AIRPORT' ? 'Airport' : 'City';
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setShowSuggestions(true);
            if (value.length >= 2) {
              searchAirports(value);
            }
          }}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((airport, index) => (
            <div
              key={`${airport.iataCode}-${index}`}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(airport)}
            >
              <div className="font-medium">
                {airport.name}
                <span className="ml-2 text-xs text-gray-400">
                  {getAirportType(airport.subtype)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {airport.address.cityName}, {airport.address.countryName}
                <span className="ml-2 font-semibold text-blue-600">
                  {airport.iataCode}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 