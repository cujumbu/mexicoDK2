import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { da } from 'date-fns/locale/da';
import { Calendar, MapPin, Ticket, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useCityStore } from '../store/cityStore';
import type { Event } from '../types';

const TICKETMASTER_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;
const EVENTS_PER_PAGE = 3;

const fetchEvents = async (city: string): Promise<Event[]> => {
  try {
    // Use keyword search instead of city parameter for better results
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&keyword=${encodeURIComponent(city)}&countryCode=MX&size=30&locale=*&sort=date,asc`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.statusText}`);
    }
    
    const data = await response.json();

    if (!data._embedded || !data._embedded.events) {
      console.log('No events found for:', city);
      return [];
    }

    return data._embedded.events.map((event: any) => ({
      id: event.id,
      title: event.name,
      description: event.info || event.description || 'Ingen beskrivelse tilgængelig',
      date: event.dates.start.dateTime || event.dates.start.localDate,
      location: event._embedded?.venues?.[0]?.name || 'Placering ikke angivet',
      image: event.images?.[0]?.url,
      url: event.url
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export default function EventsWidget() {
  const { selectedCity } = useCityStore();
  const [currentPage, setCurrentPage] = useState(0);

  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: ['events', selectedCity.name],
    queryFn: () => fetchEvents(selectedCity.name),
    staleTime: 3600000,
    refetchInterval: 3600000,
    retry: 2
  });

  // Reset page when city changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [selectedCity]);

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const startIndex = currentPage * EVENTS_PER_PAGE;
  const visibleEvents = events.slice(startIndex, startIndex + EVENTS_PER_PAGE);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
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
        <div className="text-red-500">
          Der opstod en fejl ved hentning af begivenheder. Prøv igen senere.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Ticket className="h-6 w-6 text-purple-500" />
          <h3 className="ml-2 text-lg font-semibold truncate">Begivenheder i {selectedCity.displayName}</h3>
        </div>
        {events.length > EVENTS_PER_PAGE && (
          <div className="flex space-x-2">
            <button
              onClick={prevPage}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous events"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={nextPage}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next events"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {visibleEvents.length > 0 ? (
          <div className="grid gap-4">
            {visibleEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-gray-50 rounded-lg p-3 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start space-x-3">
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">{event.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {format(new Date(event.date), 'PPP', { locale: da })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-purple-600 hover:text-purple-800"
                      >
                        Køb billetter →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Ingen kommende begivenheder fundet i {selectedCity.displayName}.</p>
        )}
      </div>
    </div>
  );
}