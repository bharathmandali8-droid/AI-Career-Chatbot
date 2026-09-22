import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseClientConfigured } from '../lib/supabaseClient';
import { Sparkles, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);

    try {
      if (!isSupabaseClientConfigured()) {
        loginAsGuest();
        return;
      }

      if (isSignUp) {
        const { error: signUpErr } = await supabase.auth.signUp({ email, password });
        if (signUpErr) throw signUpErr;
      } else {
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) throw signInErr;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 z-10">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/20 dark:bg-slate-900/50 backdrop-blur-2xl border border-white/30 dark:border-white/15 shadow-2xl space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 text-white shadow-glass-glow mb-2">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            {isSignUp ? 'Create Career Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-400">
            AI Career Assistant & Real-Time ATS Studio
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="engineer@careerassistant.ai"
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 hover:brightness-110 text-white font-medium text-sm rounded-xl shadow-glass-glow transition-all duration-200"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode & Guest Demo */}
        <div className="space-y-3 pt-2 text-center border-t border-white/10">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-cyan-400 hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>

          <div>
            <button
              type="button"
              onClick={loginAsGuest}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 dark:bg-slate-800/40 hover:bg-white/20 text-xs font-medium text-slate-200 rounded-xl border border-white/15 backdrop-blur-md transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Explore Instant Demo Mode</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
