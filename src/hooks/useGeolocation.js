import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(false);
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      setIsGeolocationAvailable(true);

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsGeolocationEnabled(true);
        },
        (err) => {
          setIsGeolocationEnabled(false);
          const errorMessage = err?.message || "Geolocation is denied or not available.";
          setError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      // Clean up the watcher when component unmounts
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setIsGeolocationAvailable(false);
    }
  }, []);

  return { coordinates, isGeolocationAvailable, isGeolocationEnabled, error };
};

export default useGeolocation;
