import { Navigation2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Station } from '../types';

interface StationCardProps {
  station: Station;
}

export default function StationCard({ station }: StationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{station.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{station.address}</p>
        </div>
        <Link
          to={`/stations/${station.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          <Navigation2 className="h-5 w-5" />
        </Link>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Gazoil</p>
          <p className="text-lg font-bold text-gray-900">€{station.gazoilPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Diesel</p>
          <p className="text-lg font-bold text-gray-900">€{station.dieselPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}