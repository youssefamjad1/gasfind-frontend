import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addStation } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddStation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    fuelType: '',
    price: '',
  });

  const {
    mutate: submitStation,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: addStation,
    onSuccess: () => {
      navigate('/'); // Redirect to home after success
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.fuelType || !formData.price) {
      alert('Please fill in all fields.');
      return;
    }
    submitStation(formData);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Add a New Station</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium">Station Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Fuel Type</label>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">-- Select --</option>
            <option value="diesel">Diesel</option>
            <option value="gasoline">Gasoline</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Price (MAD)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isLoading ? 'Submitting...' : 'Add Station'}
        </button>

        {isError && <p className="text-red-500 mt-2">Error: {error.message}</p>}
        {isSuccess && <p className="text-green-600 mt-2">Station added successfully!</p>}
      </form>
    </div>
  );
}