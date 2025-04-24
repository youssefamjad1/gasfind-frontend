import { useState, useCallback } from 'react';
import { getNearbyStations } from '../services/api';  // Import the API function

const useStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNearbyStations = useCallback(async (lat, lng) => {
    try {
      setLoading(true);
      setError('');
      const data = await getNearbyStations(lat, lng);  // Use your API function here

      if (!data || data.length === 0) {
        setError('No stations found nearby.');
        setStations([]); // Clear previous data
      } else {
        setStations(data);
      }
    } catch (err) {
      setError(err?.message || 'Error fetching nearby stations.');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array = this function won't change every render

  return { stations, fetchNearbyStations, loading, error };
};

export default useStations;
