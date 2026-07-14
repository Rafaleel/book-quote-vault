import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setMessage(''); setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'If the email is registered, you will receive a recovery link shortly.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while trying to send the email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-[60%] relative flex-col items-center justify-center p-14 overflow-hidden bg-gradient-to-br from-indigo-950 via-brand-700 to-violet-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.06)_0%,transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.2)_0%,transparent_55%)] pointer-events-none" />

        <div className="absolute top-10 left-12 flex items-center gap-2.5">
          <div className="bg-white/15 p-2 rounded-lg border border-white/20">
            <BookOpen className="text-white w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-base text-white tracking-tight">
            Quote<span className="text-indigo-300">Vault</span>
          </span>
        </div>

        <div className="relative text-center max-w-lg">
          <span
            className="block text-white/15 font-serif leading-none select-none mb-2 -ml-2"
            style={{ fontSize: '120px', lineHeight: 1, fontFamily: 'Georgia, serif' }}
          >
            "
          </span>
          <blockquote className="font-serif text-3xl text-white/90 italic leading-relaxed -mt-8">
            It does not matter how slowly you go as long as you do not stop.
          </blockquote>
          <p className="mt-6 text-sm text-indigo-300 font-semibold">— Confucius</p>
        </div>

        <p className="absolute bottom-10 text-xs text-white/30 tracking-wide">
          Your personal library of quotes and highlights.
        </p>
      </div>

      <div className="flex-1 lg:w-[40%] flex items-center justify-center bg-[#f9f8f6] px-8 py-14">
        <div className="w-full max-w-[360px]">
          <div className="mb-8">
            <h1 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">Recover your account</h1>
            <p className="text-sm text-slate-400 mt-1.5">Enter your email to receive a recovery link.</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 flex gap-2.5 text-red-700 text-xs font-medium items-start">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="mb-5 p-3.5 rounded-lg bg-green-50 border border-green-200 flex gap-2.5 text-green-700 text-xs font-medium items-start">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-green-500" />
              <span>{message}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-500 mb-1.5">Email address</label>
              <input
                id="email" name="email" type="email" autoComplete="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                placeholder="name@example.com"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60">
              {loading ? 'Sending…' : 'Send recovery link'}
            </button>
          </form>

          <p className="mt-6 text-center">
            <Link to="/login" className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              ← Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
