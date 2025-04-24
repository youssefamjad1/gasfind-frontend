import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Navigation2, MapPin } from 'lucide-react';
import { getNearbyStations } from '../services/api';
import useGeolocation from '../hooks/useGeolocation';

export default function StationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { coordinates, error: geoError } = useGeolocation();

  const {
    data: stations,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['stations', coordinates?.lat, coordinates?.lng],
    queryFn: () =>
      coordinates
        ? getNearbyStations(coordinates.lat, coordinates.lng)
        : Promise.resolve([]),
    enabled: !!coordinates,
  });

  const station = stations?.find((s) => s._id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading station details...</p>
        </div>
      </div>
    );
  }

  if (isError || !station || geoError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-red-700">
          <p>Station not found, failed to load data, or geolocation issue.</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-blue-500"
          >
            Retry
          </button>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-blue-500 flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to stations
        </button>
      </div>
    );
  }

  const handleNavigate = () => {
    if (coordinates) {
      // Assuming you want to open navigation in Google Maps or another map service
      const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}&travelmode=driving`;
      window.open(url, '_blank');
    } else {
      alert('Geolocation data is not available.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-blue-500 flex items-center mb-4"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to stations
      </button>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{station.name}</h1>
            <p className="flex items-center text-gray-600 mt-2">
              <MapPin className="h-4 w-4 mr-2" />
              {station.address}
            </p>
          </div>

          <button
            onClick={handleNavigate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center self-start"
          >
            <Navigation2 className="h-5 w-5 mr-2" />
            Navigate
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Fuel Prices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium">Gasoil</h3>
              <p className="text-gray-700">
                {station.gazoilPrice ? `${station.gazoilPrice} MAD` : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium">Diesel</h3>
              <p className="text-gray-700">
                {station.dieselPrice ? `${station.dieselPrice} MAD` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
