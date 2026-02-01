
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';
import { Activity, LayoutDashboard, User as UserIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  
  const isAdminPath = pathname?.startsWith('/admin');

  useEffect(() => {
    setMounted(true);
    setIsAuth(isAuthenticated());

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update background style
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide/Show logic
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, pathname]);

  if (!mounted || isAdminPath) return null;

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled 
        ? 'py-3 px-6 md:px-12 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-slate-200/20 dark:shadow-none' 
        : 'py-6 px-6 md:px-12 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center h-14">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:rotate-12 group-hover:scale-110 duration-300">D</div>
          <span className="font-black text-xl tracking-tighter hidden sm:block uppercase bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">DataLab</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2 bg-slate-100/50 dark:bg-white/5 backdrop-blur-md px-1.5 py-1.5 rounded-2xl border border-slate-200/30 dark:border-white/10">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-4 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                pathname === link.path 
                ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuth ? (
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
