import { BookOpen, Globe, Share2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="w-full px-5 sm:px-8">
        <div className="py-8 grid grid-cols-1 sm:grid-cols-3 gap-8 border-b border-slate-100">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 p-1.5 rounded-lg">
                <BookOpen className="text-white w-3.5 h-3.5" />
              </div>
              <span className="font-serif font-bold text-sm text-slate-900">
                Quote<span className="text-brand-600">Vault</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[220px]">
              Your personal archive of literary highlights, quotes, and meaningful passages.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Navigate</p>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-xs text-slate-500 hover:text-brand-600 transition-colors font-medium">
                  My Library
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">About</p>
            <ul className="space-y-2">
              <li>
                <span className="text-xs text-slate-500 font-medium">Personal Quote Manager</span>
              </li>
              <li>
                <span className="text-xs text-slate-400">Built with React &amp; Spring Boot</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            Made with <Heart size={10} className="text-red-400 fill-red-400" /> &nbsp;&copy; {year} QuoteVault
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="text-slate-300 hover:text-slate-500 transition-colors" aria-label="Website">
              <Globe size={14} />
            </a>
            <a href="#" className="text-slate-300 hover:text-slate-500 transition-colors" aria-label="Share">
              <Share2 size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
