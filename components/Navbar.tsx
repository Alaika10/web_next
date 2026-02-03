'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';
import { LayoutDashboard, User as UserIcon, Menu, X, Globe, ChevronRight, ArrowRight } from 'lucide-react';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isAdminPath = useMemo(() => pathname?.startsWith('/admin'), [pathname]);

  useEffect(() => {
    setMounted(true);
    setIsAuth(isAuthenticated());

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      if (currentScrollY > 100 && !isMenuOpen) {
        setIsVisible(currentScrollY < (window as any).lastScrollY);
      } else {
        setIsVisible(true);
      }
      (window as any).lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (isAdminPath) return null;

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[150] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled || isMenuOpen
          ? 'py-3 bg-white dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200/60 dark:border-indigo-500/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none' 
          : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 h-14">
          <Link href="/" className="flex items-center gap-3 group relative z-[160] active:scale-95 transition-transform">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-[0_8px_16px_-4px_rgba(79,70,229,0.4)] group-hover:rotate-6 transition-transform">
              D
            </div>
            <span className="font-black text-lg tracking-tighter uppercase text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              DataLab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/60 dark:bg-slate-900/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  pathname === link.path 
                  ? 'bg-white dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 shadow-sm border border-slate-200/80 dark:border-indigo-500/30' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 relative z-[160]">
            <div className="hidden sm:flex">
              {mounted && (
                isAuth ? (
                  <Link href="/admin" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-colors active:scale-95 shadow-lg shadow-indigo-500/20">
                    <LayoutDashboard size={14} /> Dash
                  </Link>
                ) : (
                  <Link href="/login" className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-white active:scale-95 transition-all shadow-md shadow-slate-200 dark:shadow-none">
                    Login
                  </Link>
                )
              )}
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white md:hidden transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 border border-slate-200/40 dark:border-white/5"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu */}
      <div 
        className={`fixed inset-0 z-[140] md:hidden transition-all duration-500 ${
          isMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop - Made Solid White for Light Mode */}
        <div 
          className={`absolute inset-0 bg-white dark:bg-slate-950 transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Animated Container */}
        <div className={`relative h-full flex flex-col pt-32 pb-12 px-10 overflow-y-auto ${isMenuOpen ? 'animate-premium-in' : ''}`}>
          <div className="flex-1 space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400 font-black mb-8 opacity-90">
              Lab_System_Index
            </p>
            <nav className="flex flex-col gap-4">
              {links.map((link, idx) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center justify-between py-2 group ${
                    isMenuOpen ? 'nav-item-stagger' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${150 + (idx * 60)}ms` }}
                >
                  <span className={`text-5xl font-black tracking-tighter transition-all duration-300 group-active:scale-95 ${
                    pathname === link.path 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-900 dark:text-slate-100'
                  }`}>
                    {link.name}
                  </span>
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
                    pathname === link.path 
                    ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500/50 dark:bg-indigo-500/20 dark:text-indigo-300 shadow-md shadow-indigo-100 dark:shadow-none' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 group-hover:border-indigo-600 dark:group-hover:border-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-500/5'
                  }`}>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          <div className={`mt-12 space-y-8 ${isMenuOpen ? 'nav-item-stagger' : 'opacity-0'}`} style={{ animationDelay: '450ms' }}>
            <div className="grid grid-cols-2 gap-4">
              {mounted && (
                isAuth ? (
                  <Link href="/admin" className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 active:scale-95 transition-transform group shadow-sm">
                    <LayoutDashboard className="text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                    <p className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-slate-200">Admin Console</p>
                  </Link>
                ) : (
                  <Link href="/login" className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 active:scale-95 transition-transform group shadow-sm">
                    <UserIcon className="text-slate-400 dark:text-slate-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                    <p className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-slate-200">Researcher Login</p>
                  </Link>
                )
              )}
              <Link href="https://github.com" className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 active:scale-95 transition-transform group shadow-sm">
                <Globe className="text-slate-400 dark:text-slate-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <p className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-slate-200">Open Source</p>
              </Link>
            </div>
            
            <div className="flex justify-between items-center px-2 pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Alex Sterling / Lab.v25
              </p>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-600 animate-pulse delay-75"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 dark:bg-indigo-800 animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;