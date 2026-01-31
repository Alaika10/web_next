'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  
  const isAdminPath = pathname?.startsWith('/admin');

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, [pathname]);

  if (isAdminPath) return null;

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b py-4 px-6 md:px-12 flex justify-between items-center h-20">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-transform group-hover:rotate-12">Z</div>
        <span className="font-black text-xl tracking-tighter hidden sm:block uppercase">Zenith</span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-4 bg-slate-100/50 dark:bg-slate-900/50 px-2 py-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
        {links.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              pathname === link.path 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
              : 'text-slate-500 hover:text-indigo-600'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {isAuth ? (
          <Link 
            href="/admin" 
            className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none uppercase tracking-widest"
          >
            Console
          </Link>
        ) : (
          <Link 
            href="/login" 
            className="flex items-center gap-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-6 py-2.5 rounded-2xl text-xs font-black hover:opacity-80 transition-all uppercase tracking-widest"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;