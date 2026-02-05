
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin, isAuthenticated } from '../../lib/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (username.trim().length < 3 || password.trim().length < 8) {
      setError('Input tidak valid.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const success = loginAdmin(username, password);
      if (success) {
        router.push('/admin');
      } else {
        setError('Username atau Password salah.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white dark:bg-slate-900 border p-12 rounded-[3rem] shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6">Z</div>
            <h1 className="text-3xl font-black tracking-tight">Admin Access</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input 
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all"
              required
            />
            <input 
              type="password"
              autoComplete="current-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all"
              required
            />
            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg">
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
