import React from 'react';
import { BookOpen, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Quote<span className="text-indigo-600">Vault</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <UserCircle className="w-6 h-6" />
              <span className="text-sm font-medium hidden sm:block">My Library</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
