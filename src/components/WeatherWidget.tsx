import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cloud, Sun, CloudRain, Loader, Droplets, CloudSnow, CloudLightning, Wind } from 'lucide-react';
import { useCityStore } from '../store/cityStore';
import type { WeatherData, ForecastData } from '../types';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const fetchWeather = async (city: string): Promise<{ current: WeatherData; forecast: ForecastData[] }> => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city},mx&units=metric&appid=${OPENWEATHER_API_KEY}`
  );
  const currentData = await response.json();

  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city},mx&units=metric&appid=${OPENWEATHER_API_KEY}`
  );
  const forecastData = await forecastResponse.json();

  const current: WeatherData = {
    temperature: Math.round(currentData.main.temp),
    condition: currentData.weather[0].main,
    icon: currentData.weather[0].icon,
    location: currentData.name,
    humidity: currentData.main.humidity,
    windSpeed: Math.round(currentData.wind.speed)
  };

  const forecast: ForecastData[] = forecastData.list
    .filter((_: any, index: number) => index % 8 === 0)
    .slice(0, 5)
    .map((item: any) => ({
      date: new Date(item.dt * 1000),
      temperature: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: item.weather[0].icon
    }));

  return { current, forecast };
};

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return <Sun className="w-8 h-8 text-yellow-500" />;
    case 'clouds':
      return <Cloud className="w-8 h-8 text-gray-500" />;
    case 'rain':
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    case 'snow':
      return <CloudSnow className="w-8 h-8 text-blue-200" />;
    case 'thunderstorm':
      return <CloudLightning className="w-8 h-8 text-purple-500" />;
    default:
      return <Sun className="w-8 h-8 text-yellow-500" />;
  }
};

export default function WeatherWidget() {
  const { selectedCity } = useCityStore();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['weather', selectedCity.name],
    queryFn: () => fetchWeather(selectedCity.name),
    refetchInterval: 300000 // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-center">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <p className="text-red-500">Kunne ikke hente vejrdata</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{data.current.location}</h3>
          <p className="text-3xl font-bold text-gray-900">{data.current.temperature}°C</p>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <Droplets className="w-4 h-4 mr-1" />
            <span>{data.current.humidity}%</span>
            <Wind className="w-4 h-4 ml-3 mr-1" />
            <span>{data.current.windSpeed} m/s</span>
          </div>
        </div>
        <WeatherIcon condition={data.current.condition} />
      </div>
      
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">5-dages prognose</h4>
        <div className="grid grid-cols-5 gap-2">
          {data.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-gray-600">
                {day.date.toLocaleDateString('da-DK', { weekday: 'short' })}
              </p>
              <WeatherIcon condition={day.condition} />
              <p className="text-sm font-medium">{day.temperature}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}