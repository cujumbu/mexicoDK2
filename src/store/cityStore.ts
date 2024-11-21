import { create } from 'zustand';

export interface City {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
}

export const MEXICAN_CITIES: City[] = [
  { id: 'cancun', name: 'Cancun', displayName: 'Cancún', lat: 21.1619, lng: -86.8515 },
  { id: 'tulum', name: 'Tulum', displayName: 'Tulum', lat: 20.2114, lng: -87.4654 },
  { id: 'mexico-city', name: 'Mexico City', displayName: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  { id: 'cabo', name: 'Cabo San Lucas', displayName: 'Cabo San Lucas', lat: 22.8905, lng: -109.9167 },
  { id: 'puerto-vallarta', name: 'Puerto Vallarta', displayName: 'Puerto Vallarta', lat: 20.6534, lng: -105.2253 }
];

interface CityStore {
  selectedCity: City;
  customCities: City[];
  setSelectedCity: (city: City) => void;
  addCustomCity: (city: City) => void;
}

export const useCityStore = create<CityStore>((set) => ({
  selectedCity: MEXICAN_CITIES[0],
  customCities: [],
  setSelectedCity: (city) => set({ selectedCity: city }),
  addCustomCity: (city) => set((state) => ({
    customCities: [...state.customCities, city]
  }))
}));