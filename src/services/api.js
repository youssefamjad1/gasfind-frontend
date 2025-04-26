import axios from 'axios';

// Use Vite's import.meta.env to access environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


console.log('API Base URL:', API_BASE_URL); // ✅ Should show correct URL

// Create an Axios instance with the dynamic baseURL
const api = axios.create({
  baseURL: API_BASE_URL, // This will use either the local or production API base URL
});

// Function to get nearby stations with optional sorting
export const getNearbyStations = async (lat, lng, sortBy = 'price') => {
  try {
    const { data } = await api.get(`stations?lat=${lat}&lng=${lng}&sortBy=${sortBy}`);
    return data;
  } catch (error) {
    console.error("Error fetching nearby stations:", error.message || error);
    throw new Error("Failed to fetch nearby stations.");
  }
};

// Function to add a new station
export const addStation = async (stationData) => {
  try {
    const { data } = await api.post('stations', stationData);
    return data;
  } catch (error) {
    console.error("Error adding station:", error.message || error);
    throw new Error("Failed to add station.");
  }
};

// Function to get a station by its ID
export const getStationById = async (id) => {
  try {
    const { data } = await api.get(`stations/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching station:", error.message || error);
    throw new Error("Failed to load station details.");
  }
};
