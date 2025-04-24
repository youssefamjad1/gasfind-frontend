import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} GasFind. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/yourusername/gas-station-finder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}