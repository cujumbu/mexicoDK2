export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
  humidity: number;
  windSpeed: number;
}

export interface ForecastData {
  date: Date;
  temperature: number;
  condition: string;
  icon: string;
}

export interface TravelAlert {
  id: string;
  level: 'info' | 'warning' | 'danger';
  message: string;
  date: string;
  region: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  location: string;
  images?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  url?: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  type?: 'attraction' | 'restaurant' | 'hotel' | 'beach';
  rating?: number;
}

export interface Attraction {
  id: string;
  name: string;
  category: string;
  address: string;
  distance: string;
  photo?: string;
  description?: string;
  lat?: string;
  lng?: string;
  wikipediaUrl?: string;
}