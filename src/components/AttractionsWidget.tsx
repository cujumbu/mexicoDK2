import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader, MapPin, Star, Navigation, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useCityStore } from '../store/cityStore';
import type { Attraction } from '../types';
import { fetchAttractions } from '../utils/api';

const ATTRACTIONS_PER_PAGE = 12;

export default function AttractionsWidget() {
  const { selectedCity } = useCityStore();
  const [currentPage, setCurrentPage] = useState(0);

  const { data: attractions = [], isLoading, isError } = useQuery({
    queryKey: ['attractions', selectedCity.lat, selectedCity.lng],
    queryFn: () => fetchAttractions(selectedCity.lat, selectedCity.lng),
    staleTime: 3600000,
    retry: 2,
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    setCurrentPage(0);
  }, [selectedCity]);

  const totalPages = Math.ceil(attractions.length / ATTRACTIONS_PER_PAGE);
  const startIndex = currentPage * ATTRACTIONS_PER_PAGE;
  const visibleAttractions = attractions.slice(startIndex, startIndex + ATTRACTIONS_PER_PAGE);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-center">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <p className="text-red-500">Kunne ikke hente seværdigheder. Prøv igen senere.</p>
      </div>
    );
  }

  if (!attractions || attractions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <p className="text-gray-600">Ingen seværdigheder fundet i området.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Seværdigheder i {selectedCity.displayName}
        </h3>
        {totalPages > 1 && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Side {currentPage + 1} af {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`p-1 rounded-full transition-colors ${
                  currentPage === 0
                    ? 'text-gray-300'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Forrige side"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className={`p-1 rounded-full transition-colors ${
                  currentPage === totalPages - 1
                    ? 'text-gray-300'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Næste side"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {visibleAttractions.map((attraction) => (
          <div
            key={attraction.id}
            className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {attraction.photo && (
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={attraction.photo}
                  alt={attraction.name}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{attraction.name}</h4>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Star className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{attraction.category}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{attraction.address}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Navigation className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>{attraction.distance} væk</span>
                </div>
                {attraction.wikipediaUrl && (
                  <a
                    href={attraction.wikipediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>Læs mere</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}