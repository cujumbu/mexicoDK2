import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Shield, Info } from 'lucide-react';
import type { TravelAlert } from '../types';

const fetchTravelAlerts = async (): Promise<TravelAlert[]> => {
  // In production, replace with actual API call to a travel advisory service
  const alerts = [
    {
      id: '1',
      level: 'info',
      message: 'Husk at medbringe gyldigt pas og visum ved indrejse.',
      date: new Date().toISOString(),
      region: 'Hele Mexico'
    },
    {
      id: '2',
      level: 'warning',
      message: 'Vær opmærksom på øget sikkerhed omkring turistområder i Cancun.',
      date: new Date().toISOString(),
      region: 'Cancun'
    }
  ] as TravelAlert[];

  return alerts;
};

const AlertIcon = ({ level }: { level: TravelAlert['level'] }) => {
  switch (level) {
    case 'danger':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Shield className="h-5 w-5 text-gray-500" />;
  }
};

const AlertBadge = ({ level }: { level: TravelAlert['level'] }) => {
  const colors = {
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-amber-100 text-amber-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const labels = {
    danger: 'Høj Risiko',
    warning: 'Vær Opmærksom',
    info: 'Information'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
      {labels[level]}
    </span>
  );
};

export default function TravelAlertsWidget() {
  const { data: alerts = [], isLoading, isError } = useQuery({
    queryKey: ['travelAlerts'],
    queryFn: fetchTravelAlerts,
    refetchInterval: 3600000, // Refetch every hour
    staleTime: 1800000, // Consider data stale after 30 minutes
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="text-red-500">
          Der opstod en fejl ved hentning af rejseopdateringer. Prøv igen senere.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center mb-4">
        <Shield className="h-6 w-6 text-blue-500" />
        <h3 className="ml-2 text-lg font-semibold">Rejseopdateringer</h3>
      </div>
      
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="border-l-4 border-l-blue-500 bg-blue-50 p-4 rounded-r-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <AlertIcon level={alert.level} />
                  <span className="ml-2 font-medium text-gray-900">{alert.region}</span>
                </div>
                <AlertBadge level={alert.level} />
              </div>
              <p className="text-gray-600 text-sm">{alert.message}</p>
              <p className="text-gray-400 text-xs mt-2">
                Opdateret: {new Date(alert.date).toLocaleDateString('da-DK')}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Ingen aktuelle rejseopdateringer.</p>
        )}
      </div>
    </div>
  );
}