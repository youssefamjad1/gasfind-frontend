import { useQuery } from '@tanstack/react-query';
import useGeolocation from '../hooks/useGeolocation';
import { getNearbyStations } from '../services/api';
import StationCard from '../components/StationCard';
import { FiMapPin } from 'react-icons/fi';
import { useState } from 'react';
import { getDistance } from 'geolib';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const { coordinates, error: geoError, loading: geoLoading } = useGeolocation();
  const [sortBy, setSortBy] = useState('price');
  const navigate = useNavigate();

  // Check if the user is logged in as an admin
  const isAdmin = !!localStorage.getItem('adminToken');

  const { data: stations, isLoading, isError } = useQuery({
    queryKey: ['stations', coordinates?.lat, coordinates?.lng, sortBy],
    queryFn: () =>
      coordinates
        ? getNearbyStations(coordinates.lat, coordinates.lng, sortBy)
        : Promise.resolve([]),
    enabled: !!coordinates,
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  if (geoLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Detecting your location...</p>
        </div>
      </div>
    );
  }

  if (geoError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {geoError}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading stations. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Admin Panel & Logout */}
      <div className="flex justify-end gap-4 mb-4">
        {isAdmin && (
          <>
            <Link
              to="/admin/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Admin Panel
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        {coordinates && (
          <div className="flex items-center text-gray-600">
            <FiMapPin className="h-5 w-5 mr-2" />
            <p>Showing stations near you</p>
          </div>
        )}
        <div>
          <select
            className="border rounded px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="price">Sort by Price</option>
            <option value="distance">Sort by Distance</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-40"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stations?.map((station) => {
            const lat1 = coordinates?.lat;
            const lng1 = coordinates?.lng;
            const lat2 = station?.location?.coordinates[1];
            const lng2 = station?.location?.coordinates[0];

            let distance = 'N/A';
            if (lat1 && lng1 && lat2 && lng2) {
              distance = getDistance(
                { latitude: lat1, longitude: lng1 },
                { latitude: lat2, longitude: lng2 }
              ) / 1000;
              distance = distance.toFixed(2);
            }

            return (
              <StationCard
                key={station._id}
                station={station}
                distance={distance}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
