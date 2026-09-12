import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, Mail, Lock, Building2, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

const AuthModal: React.FC = () => {
  const { authModalOpen, closeAuthModal, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [business, setBusiness] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const res = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password, business || 'My Business');
    setLoading(false);
    if (res.error) setError(res.error);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="relative bg-gradient-to-r from-blue-700 to-emerald-600 px-6 py-6 text-white">
          <button onClick={closeAuthModal} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-white/90">
            <ShieldCheck className="h-4 w-4" /> Secure access
          </div>
          <h2 className="text-xl font-bold mt-1">
            {mode === 'signin' ? 'Sign in to PayFlow' : 'Create your business account'}
          </h2>
          <p className="text-sm text-white/80 mt-1">
            {mode === 'signin' ? 'Access your scoped payroll data.' : 'Your data is isolated to your account.'}
          </p>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-sm font-medium text-slate-700">Business Name</label>
              <div className="relative mt-1">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Acme Corp"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 text-slate-800" />
              </div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 text-slate-800" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 text-slate-800" />
            </div>
            {mode === 'signup' && <p className="text-xs text-slate-400 mt-1">At least 6 characters.</p>}
          </div>

          {error && (
            <p className="text-sm text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="text-sm text-center text-slate-500">
            {mode === 'signin' ? "Don't have an account?" : 'Already registered?'}{' '}
            <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
              className="text-blue-600 font-semibold hover:underline">
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
