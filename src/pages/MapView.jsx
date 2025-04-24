import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import userMarkerIcon from '../assets/user-icon.png';
import stationMarkerIcon from '../assets/station-icon.png';

import useGeolocation from '../hooks/useGeolocation';
import useStations from '../hooks/useStations';

// Fix Leaflet's default icon path issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: userMarkerIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const stationIcon = new L.Icon({
  iconUrl: stationMarkerIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to ensure map is fully ready before triggering certain logic
const MapReadyHandler = ({ onReady }) => {
  const map = useMap();

  useEffect(() => {
    if (map && onReady) {
      // Allow a small delay to make sure the DOM is ready
      setTimeout(() => onReady(map), 100);
    }
  }, [map, onReady]);

  return null;
};

// Routing component using OpenRouteService + polyline
const Routing = ({ userCoords, station }) => {
  const map = useMap();
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!map || !userCoords || !station) return;

    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
          {
            method: 'POST',
            headers: {
              'Authorization': import.meta.env.VITE_OPENROUTESERVICE_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coordinates: [
                [userCoords.lng, userCoords.lat],
                [station.location.coordinates[0], station.location.coordinates[1]],
              ],
            }),
          }
        );

        const geojson = await response.json();

        if (polylineRef.current) {
          map.removeLayer(polylineRef.current);
        }

        const coords = geojson.features[0].geometry.coordinates.map(
          (coord) => [coord[1], coord[0]]
        );

        const polyline = L.polyline(coords, {
          color: 'blue',
          weight: 5,
        }).addTo(map);

        polylineRef.current = polyline;
        map.fitBounds(polyline.getBounds());
      } catch (error) {
        console.error('Error fetching route from OpenRouteService:', error);
      }
    };

    fetchRoute();

    return () => {
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
    };
  }, [userCoords, station, map]);

  return null;
};

// Main Map View
const MapView = () => {
  const {
    coordinates,
    isGeolocationAvailable,
    isGeolocationEnabled,
    error: geolocationError,
  } = useGeolocation();

  const {
    stations,
    fetchNearbyStations,
    loading,
    error: stationsError,
  } = useStations();

  const [selectedStation, setSelectedStation] = useState(null);
  const [hoveredStationId, setHoveredStationId] = useState(null);

  useEffect(() => {
    if (coordinates?.lat && coordinates?.lng) {
      fetchNearbyStations(coordinates.lat, coordinates.lng);
    }
  }, [coordinates, fetchNearbyStations]);

  if (!isGeolocationAvailable) return <div>Your browser does not support geolocation.</div>;
  if (!isGeolocationEnabled) return <div>Please enable geolocation in your settings.</div>;
  if (geolocationError || stationsError) return <div>{geolocationError || stationsError}</div>;
  if (loading || !coordinates) return <div>Loading nearby stations...</div>;

  const handleStationClick = (station) => {
    setSelectedStation(station);
  };

  const calculateDistance = (station) => {
    const userPosition = L.latLng(coordinates.lat, coordinates.lng);
    const stationPosition = L.latLng(
      station.location.coordinates[1],
      station.location.coordinates[0]
    );
    return userPosition.distanceTo(stationPosition) / 1000;
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapReadyHandler onReady={(map) => map.invalidateSize()} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Marker */}
        <Marker position={[coordinates.lat, coordinates.lng]} icon={userIcon}>
          <Popup>Your Current Location</Popup>
        </Marker>

        {/* Station Markers */}
        {stations.map((station) => {
  const position = [
    station.location.coordinates[1],
    station.location.coordinates[0],
  ];

  return (
    <Marker
      key={station._id}
      position={position}
      icon={stationIcon}
      eventHandlers={{
        click: () => handleStationClick(station),
      }}
    >
      <Popup>
        <strong>{station.name}</strong><br />
        Address: {station.address}<br />
        Gazoil Price: {station.gazoilPrice} USD<br />
        Diesel Price: {station.dieselPrice} USD<br />
        Distance: {calculateDistance(station).toFixed(2)} km
      </Popup>
    </Marker>
  );
})}

        {/* Route line */}
        {selectedStation && (
          <Routing userCoords={coordinates} station={selectedStation} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
