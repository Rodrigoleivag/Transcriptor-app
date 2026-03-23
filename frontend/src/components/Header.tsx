import { Mic } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AudioResume</h1>
            <p className="text-sm text-gray-600">Transcribe & Resume</p>
          </div>
        </Link>

        <nav className="hidden sm:flex gap-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Upload
          </Link>
          <Link
            to="/history"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            History
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
