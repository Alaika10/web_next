
'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, isAuthenticated } from '../../lib/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulasi delay jaringan untuk UX
    setTimeout(() => {
      const success = loginAdmin(username, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Username atau Password salah.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6">
      {/* Background Ornaments */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto shadow-xl shadow-indigo-200 dark:shadow-none mb-6 transform hover:rotate-12 transition-transform cursor-default">
              Z
            </div>
            <h1 className="text-3xl font-black tracking-tight">Admin Access</h1>
            <p className="text-slate-500 text-sm">Masuk untuk mengelola portofolio digital Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Username</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:ring-0 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-600 focus:ring-0 outline-none transition-all font-mono"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-shake">
                <span>⚠️</span> {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In to Console</>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-slate-50 dark:border-slate-800 text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl inline-block text-[10px] text-slate-500 font-medium">
              <p className="uppercase tracking-widest mb-1 opacity-60">Credentials untuk Testing:</p>
              <p>User: <span className="text-indigo-600 font-bold">admin</span> / Pass: <span className="text-indigo-600 font-bold">admin123</span></p>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-xs font-medium">
          Zenith Portfolio Management System • Secure Session Layer
        </p>
      </div>
    </div>
  );
}
