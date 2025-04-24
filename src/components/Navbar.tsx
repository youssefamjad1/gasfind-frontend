import { Fuel, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Fuel className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">GasFind</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              List View
            </Link>
            <Link
              to="/map"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/map'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <MapPin className="inline-block h-4 w-4 mr-1" />
              Map View
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}