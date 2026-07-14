import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Recovery token not found in the URL.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/reset-password', { 
        token, 
        newPassword: password 
      });
      setMessage(response.data.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while resetting your password. The link might have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f6] via-[#f7f5f0] to-[#f0edf7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">
          Create New Password
        </h2>
        <p className="mt-2 text-sm text-slate-450 font-medium">
          Enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/85 backdrop-blur-xl py-8 px-4 border border-slate-200/50 shadow-[0_15px_35px_rgba(0,0,0,0.015)] sm:rounded-2xl sm:px-10">
          {!token ? (
            <div className="text-center py-4">
              <p className="text-red-500 text-sm mb-4 font-semibold">Invalid link or missing token.</p>
              <Link to="/forgot-password" className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">
                Request a new link
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="new-password" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  New Password
                </label>
                <input
                  id="new-password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-405 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-405 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-105 text-red-750 text-xs font-semibold">
                  {error}
                </div>
              )}
              
              {message && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-xs font-semibold text-center">
                  {message}<br/>Redirecting to sign in...
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-500/15 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/30 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
