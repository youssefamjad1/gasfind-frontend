import { Navigation2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StationCard({ station, distance }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800">{station.name}</h3>
      <p className="text-gray-600 text-sm">{station.address}</p>
      <div className="mt-2 text-sm">
        <p>🟡 Gazoil: <strong>{station.gazoilPrice} DH</strong></p>
        <p>🟢 Diesel: <strong>{station.dieselPrice} DH</strong></p>
        {distance && <p>Distance: <strong>{distance} km</strong></p>} {/* Display the distance */}
      </div>
      <Link to={`/map`} className="text-blue-500 hover:text-blue-700">
        <Navigation2 className="h-5 w-5" />
      </Link>
    </div>
  );
}
