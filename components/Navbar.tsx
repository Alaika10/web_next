'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';
import { LayoutDashboard, User as UserIcon, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  // Pre-calculate to avoid re-renders
  const isAdminPath = useMemo(() => pathname?.startsWith('/admin'), [pathname]);

  useEffect(() => {
    // Jalankan segera setelah mount untuk sinkronisasi state login
    setMounted(true);
    setIsAuth(isAuthenticated());

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Threshold untuk efek glassmorphism
      setScrolled(currentScrollY > 20);

      // Logika Hide/Show yang lebih responsif
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateNavbar();
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Jika di halaman admin, kita tidak merender navbar publik
  if (isAdminPath) return null;

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled 
        ? 'py-3 px-6 md:px-12 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg' 
        : 'py-6 px-6 md:px-12 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center h-14">
        {/* Brand Logo - Rendered immediately via SSR */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg transition-transform group-hover:rotate-12 duration-300">
            D
          </div>
          <span className="font-black text-xl tracking-tighter hidden sm:block uppercase bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            DataLab
          </span>
        </Link>

        {/* Navigation Links - Rendered immediately via SSR */}
        <div className="flex items-center gap-1 sm:gap-2 bg-slate-100/50 dark:bg-white/5 backdrop-blur-md px-1.5 py-1.5 rounded-2xl border border-slate-200/30 dark:border-white/10">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-4 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                pathname === link.path 
                ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons - Partically hydrated to prevent layout shift */}
        <div className="flex items-center gap-3 min-w-[100px] justify-end">
          {!mounted ? (
            // Placeholder selama hidrasi agar tidak ada lompatan layout (CLS)
            <div className="w-24 h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"></div>
          ) : isAuth ? (
            <Link 
              href="/admin" 
              className="group flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none uppercase tracking-[0.15em]"
            >
              <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform" />
              <span className="hidden md:inline">Console</span>
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-6 py-2.5 rounded-xl text-[10px] font-black hover:opacity-80 transition-all uppercase tracking-[0.15em]"
            >
              <UserIcon size={14} />
              <span className="hidden md:inline">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;