import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

export default function UploadExcel() {
  const [stations, setStations] = useState([]);
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);
    setStations(json);
    setFileName(file.name);
  };

  const handleUpload = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const res = await fetch('/api/stations/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stations }),
    });

    if (res.ok) {
      alert('Upload successful!');
      setStations([]);
      setFileName('');
    } else {
      alert('Upload failed!');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Upload Excel File</h1>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
        className="block mb-4"
      />

      {fileName && (
        <div className="mb-2 text-sm text-gray-600">
          Selected File: <strong>{fileName}</strong><br />
          Entries: {stations.length}
        </div>
      )}

      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        disabled={!stations.length}
      >
        Upload
      </button>
    </div>
  );
}
