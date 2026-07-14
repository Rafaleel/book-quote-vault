import { BookOpen, UserCircle, LogOut, BookMarked } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-slate-100">
      <div className="w-full px-5 sm:px-8">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-brand-600 p-1.5 rounded-lg group-hover:bg-brand-700 transition-colors duration-200">
              <BookOpen className="text-white w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-[15px] text-slate-900 tracking-tight">
              Quote<span className="text-brand-600">Vault</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors">
              <BookMarked className="w-3.5 h-3.5" />
              My Library
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                  <UserCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">{user.email}</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-slate-200" />
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors duration-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:block">Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
