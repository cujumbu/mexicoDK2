import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { Compass } from 'lucide-react';
import WeatherWidget from './components/WeatherWidget';
import EventsWidget from './components/EventsWidget';
import TravelAlertsWidget from './components/TravelAlertsWidget';
import AttractionsWidget from './components/AttractionsWidget';
import CitySelector from './components/CitySelector';
import Map from './components/Map';
import { useCityStore } from './store/cityStore';
import { fetchAttractions } from './utils/api';

const queryClient = new QueryClient();

function AppContent() {
  const { selectedCity } = useCityStore();
  const { data: attractions = [] } = useQuery({
    queryKey: ['attractions', selectedCity.lat, selectedCity.lng],
    queryFn: () => fetchAttractions(selectedCity.lat, selectedCity.lng),
    staleTime: 3600000,
    retry: 2,
    refetchOnWindowFocus: false
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Compass className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Mexico.dk</span>
            </div>
            <div className="flex space-x-4">
              <a href="/destinations" className="text-gray-700 hover:text-blue-600">Destinationer</a>
              <a href="/experiences" className="text-gray-700 hover:text-blue-600">Oplevelser</a>
              <a href="/planning" className="text-gray-700 hover:text-blue-600">Planlæg Din Rejse</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative h-[600px]">
        <img 
          src="https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=2000&q=80" 
          alt="Mexicos Strande"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Oplev Mexico</h1>
            <p className="text-xl mb-8">Din portal til autentiske mexicanske oplevelser</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* City Selector */}
        <CitySelector />
        
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <WeatherWidget />
          <TravelAlertsWidget />
          <EventsWidget />
        </div>

        {/* Attractions */}
        <div className="mb-12">
          <AttractionsWidget />
        </div>

        {/* Interactive Map */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Udforsk {selectedCity.displayName}</h2>
          <Map 
            locations={[selectedCity]}
            attractions={attractions}
            center={[selectedCity.lat, selectedCity.lng]}
            zoom={12}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Om Mexico.dk</h4>
              <p className="text-gray-400">Din pålidelige kilde til mexicansk rejseinformation og oplevelser.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hurtige Links</h4>
              <ul className="space-y-2">
                <li><a href="/guide" className="text-gray-400 hover:text-white">Rejseguide</a></li>
                <li><a href="/safety" className="text-gray-400 hover:text-white">Sikkerhedsinformation</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white">Kontakt Os</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hold Dig Opdateret</h4>
              <p className="text-gray-400">Tilmeld dig vores nyhedsbrev for at få de seneste opdateringer og rejsetips.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;