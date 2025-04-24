import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Station, Coordinates } from '../types';
import { Link } from 'react-router-dom';

interface MapComponentProps {
  stations: Station[];
  center: Coordinates;
}

function MapUpdater({ center }: { center: Coordinates }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], 13);
  }, [center, map]);
  
  return null;
}

export default function MapComponent({ stations, center }: MapComponentProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      className="h-[calc(100vh-4rem)] w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} />
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={[station.location.coordinates[1], station.location.coordinates[0]]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{station.name}</h3>
              <p className="text-sm text-gray-600">{station.address}</p>
              <div className="mt-2">
                <p>Gazoil: €{station.gazoilPrice.toFixed(2)}</p>
                <p>Diesel: €{station.dieselPrice.toFixed(2)}</p>
              </div>
              <Link
                to={`/stations/${station.id}`}
                className="mt-2 block text-sm text-blue-600 hover:text-blue-800"
              >
                View Details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}