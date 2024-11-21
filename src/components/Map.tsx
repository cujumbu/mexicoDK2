import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, MapPin } from 'lucide-react';
import type { Location, Attraction } from '../types';

// Fix Leaflet default marker icon issue
import L from 'leaflet';

// Create custom icons for city and attractions
const cityIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const attractionIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtc3RhciI+PHBvbHlnb24gcG9pbnRzPSIxMiAyIDEzLjggOC42IDE5LjggOC42IDE1IDEzLjIgMTYuOCAyMCAxMiAxNS40IDcuMiAyMCA5IDEzLjIgNC4yIDguNiAxMC4yIDguNiAxMiAyIi8+PC9zdmc+',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
  className: 'bg-blue-500 rounded-full p-1'
});

interface MapProps {
  locations: Location[];
  attractions?: Attraction[];
  center: [number, number];
  zoom: number;
}

// Component to handle map center updates
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

export default function Map({ locations, attractions = [], center, zoom }: MapProps) {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      className="h-[600px] w-full rounded-lg shadow-lg"
    >
      <MapUpdater center={center} zoom={zoom} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* City markers */}
      {locations.map((location) => (
        <Marker 
          key={location.id} 
          position={[location.lat, location.lng]}
          icon={cityIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{location.name}</h3>
              <p className="text-sm">{location.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Attraction markers */}
      {attractions.map((attraction) => (
        <Marker
          key={attraction.id}
          position={[
            parseFloat(attraction.lat || '0'),
            parseFloat(attraction.lng || '0')
          ]}
          icon={attractionIcon}
        >
          <Popup>
            <div className="p-2 max-w-xs">
              {attraction.photo && (
                <img
                  src={attraction.photo}
                  alt={attraction.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              <h3 className="font-semibold text-gray-800 mb-1">{attraction.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Star className="w-4 h-4 mr-1 flex-shrink-0" />
                <span>{attraction.category}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span>{attraction.address}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {attraction.distance} fra centrum
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}