import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify admin token on page load
    const verifyAdminToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin'); // Redirect to login if no token
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/verify`, { // Correct API URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });

        if (res.ok) {
          setIsVerified(true); // Token is valid
        } else {
          setIsVerified(false); // Token is invalid or expired
          localStorage.removeItem('adminToken'); // Remove invalid token
          navigate('/admin'); // Redirect to login
        }
      } catch (error) {
        setIsVerified(false);
        localStorage.removeItem('adminToken'); // In case of any errors, remove the token
        navigate('/admin'); // Redirect to login
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    verifyAdminToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  if (loading) return <p>Loading...</p>; // Show a loading state while verifying the token

  return (
    <div className="p-6 max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Dashboard</h1>

      {isVerified ? (
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => navigate('/admin/upload')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
          >
            Upload Excel
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>You are not authorized to view this page.</p>
      )}
    </div>
  );
}
