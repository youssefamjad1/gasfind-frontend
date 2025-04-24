import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { Link } from 'react-router-dom';

// Fix default marker icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], 13);
  }, [center, map]);

  return null;
}

function Routing({ from, to }) {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    return () => map.removeControl(control);
  }, [from, to, map]);

  return null;
}

export default function MapComponent({ stations, center }) {
  // Best station = lowest diesel price (can be updated to gazoil)
  const bestStation = stations.reduce((best, station) =>
    !best || station.dieselPrice < best.dieselPrice ? station : best,
  null);

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

      {/* Current Location Marker */}
      <Marker position={[center.lat, center.lng]}>
        <Popup>
          <span className="text-sm font-medium">You are here</span>
        </Popup>
      </Marker>

      {/* Station Markers */}
      {stations.map((station) => {
        const isBest =
          bestStation && station._id === bestStation._id; // _id or id
        return (
          <Marker
            key={station._id}
            position={[
              station.location.coordinates[1],
              station.location.coordinates[0],
            ]}
            icon={
              isBest
                ? new L.Icon({
                    iconUrl:
                      'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=B|2ecc71|000000',
                    iconSize: [21, 34],
                    iconAnchor: [10, 34],
                    popupAnchor: [1, -34],
                  })
                : undefined
            }
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
                  to={`/stations/${station._id}`}
                  className="mt-2 block text-sm text-blue-600 hover:text-blue-800"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Routing line from current location to best station */}
      {bestStation && (
        <Routing
          from={center}
          to={{
            lat: bestStation.location.coordinates[1],
            lng: bestStation.location.coordinates[0],
          }}
        />
      )}
    </MapContainer>
  );
}
