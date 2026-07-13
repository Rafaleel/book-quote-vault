import { BookOpen, UserCircle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

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
            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:block">{user.email}</span>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block">Exit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
