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
          ? 'py-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm' 
          : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 h-14">
          <Link href="/" className="flex items-center gap-3 group relative z-[160] active:scale-95 transition-transform">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg group-hover:rotate-6 transition-transform">
              D
            </div>
            <span className="font-black text-lg tracking-tighter uppercase dark:text-white">
              DataLab
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-white/5 backdrop-blur-md p-1 rounded-xl border border-slate-200/30 dark:border-white/10">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  pathname === link.path 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-indigo-600'
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
                  <Link href="/admin" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-colors active:scale-95">
                    <LayoutDashboard size={14} /> Dash
                  </Link>
                ) : (
                  <Link href="/login" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-80 active:scale-95 transition-all">
                    Login
                  </Link>
                )
              )}
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-slate-900 dark:text-white md:hidden transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/30 active:scale-90"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={22} className="rotate-0 transition-transform duration-300" /> : <Menu size={22} className="rotate-0 transition-transform duration-300" />}
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
        {/* Backdrop with fade-in blur */}
        <div 
          className={`absolute inset-0 bg-white/95 dark:bg-slate-950/98 backdrop-blur-2xl transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Animated Container */}
        <div className={`relative h-full flex flex-col pt-32 pb-12 px-10 ${isMenuOpen ? 'animate-premium-in' : ''}`}>
          <div className="flex-1 space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-indigo-500 font-black mb-6 opacity-60">
              Lab_System_Index
            </p>
            <nav className="flex flex-col gap-6">
              {links.map((link, idx) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center justify-between py-1 group ${
                    isMenuOpen ? 'nav-item-stagger' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${150 + (idx * 60)}ms` }}
                >
                  <span className={`text-5xl font-black tracking-tighter transition-all duration-300 group-active:scale-95 ${
                    pathname === link.path ? 'text-indigo-600' : 'text-slate-900 dark:text-slate-100'
                  }`}>
                    {link.name}
                  </span>
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${
                    pathname === link.path 
                    ? 'border-indigo-600 bg-indigo-600 text-white' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600'
                  }`}>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          <div className={`mt-auto space-y-8 ${isMenuOpen ? 'nav-item-stagger' : 'opacity-0'}`} style={{ animationDelay: '450ms' }}>
            <div className="grid grid-cols-2 gap-4">
              {mounted && (
                isAuth ? (
                  <Link href="/admin" className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800 active:scale-95 transition-transform">
                    <LayoutDashboard className="text-indigo-600 mb-2" size={24} />
                    <p className="font-black text-xs uppercase tracking-widest dark:text-white">Admin Console</p>
                  </Link>
                ) : (
                  <Link href="/login" className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] active:scale-95 transition-transform">
                    <UserIcon className="text-slate-400 mb-2" size={24} />
                    <p className="font-black text-xs uppercase tracking-widest dark:text-white">Researcher Login</p>
                  </Link>
                )
              )}
              <Link href="https://github.com" className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] active:scale-95 transition-transform">
                <Globe className="text-slate-400 mb-2" size={24} />
                <p className="font-black text-xs uppercase tracking-widest dark:text-white">Open Source</p>
              </Link>
            </div>
            <div className="flex justify-between items-center px-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Alex Sterling / Vol. 25
              </p>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-75"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;