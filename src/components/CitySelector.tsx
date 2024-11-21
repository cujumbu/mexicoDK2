import React, { useState } from 'react';
import { MapPin, Search, Loader } from 'lucide-react';
import { useCityStore, MEXICAN_CITIES, type City } from '../store/cityStore';
import { useQuery } from '@tanstack/react-query';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const searchCity = async (query: string): Promise<City | null> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query},mx&limit=1&appid=${OPENWEATHER_API_KEY}`
    );
    const data = await response.json();
    
    if (data.length === 0) return null;
    
    return {
      id: data[0].name.toLowerCase().replace(/\s+/g, '-'),
      name: data[0].name,
      displayName: data[0].name,
      lat: data[0].lat,
      lng: data[0].lon
    };
  } catch (error) {
    console.error('Error searching city:', error);
    return null;
  }
};

export default function CitySelector() {
  const { selectedCity, setSelectedCity, addCustomCity } = useCityStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const city = await searchCity(searchQuery);
    setIsSearching(false);

    if (city) {
      addCustomCity(city);
      setSelectedCity(city);
      setSearchQuery('');
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {MEXICAN_CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCity.id === city.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {city.displayName}
              </span>
            </button>
          ))}
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søg efter by..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}