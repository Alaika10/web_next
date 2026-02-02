'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';
import { LayoutDashboard, User as UserIcon, Menu, X, Globe, ChevronRight } from 'lucide-react';

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
      
      // Auto-hide navbar on scroll down, show on scroll up
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

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // Close menu on route change
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
        className={`fixed top-0 left-0 right-0 z-[150] transition-all duration-500 transform ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled || isMenuOpen
          ? 'py-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50' 
          : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 h-14">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-[160]">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg group-hover:rotate-12 transition-transform">
              D
            </div>
            <span className="font-black text-lg tracking-tighter uppercase dark:text-white">
              DataLab
            </span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Action Area */}
          <div className="flex items-center gap-3 relative z-[160]">
            <div className="hidden sm:flex">
              {mounted && (
                isAuth ? (
                  <Link href="/admin" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <LayoutDashboard size={14} /> Dash
                  </Link>
                ) : (
                  <Link href="/login" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Login
                  </Link>
                )
              )}
            </div>

            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-slate-900 dark:text-white md:hidden transition-transform active:scale-90"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - High Z-Index but below Nav Toggle */}
      <div 
        className={`fixed inset-0 z-[140] md:hidden transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-white/98 dark:bg-slate-950/98 backdrop-blur-3xl" onClick={() => setIsMenuOpen(false)}></div>
        
        {/* Scrollable Content Container */}
        <div className="relative h-full overflow-y-auto flex flex-col pt-32 pb-12 px-8">
          <div className="space-y-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-indigo-500 font-black mb-6 animate-in fade-in">System_Menu</p>
            <nav className="flex flex-col gap-4">
              {links.map((link, idx) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center justify-between py-2 text-4xl font-black tracking-tighter ${
                    pathname === link.path ? 'text-indigo-600' : 'text-slate-900 dark:text-slate-100'
                  } animate-in slide-in-from-left-4`}
                  style={{ animationDelay: `${idx * 75}ms` }}
                >
                  {link.name}
                  <ChevronRight size={28} className={pathname === link.path ? 'opacity-100' : 'opacity-20'} />
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-8">
            <div className="grid grid-cols-2 gap-4">
              {mounted && (
                isAuth ? (
                  <Link href="/admin" className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800">
                    <LayoutDashboard className="text-indigo-600 mb-2" size={24} />
                    <p className="font-black text-sm dark:text-white">Admin Console</p>
                  </Link>
                ) : (
                  <Link href="/login" className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem]">
                    <UserIcon className="text-slate-400 mb-2" size={24} />
                    <p className="font-black text-sm dark:text-white">Login</p>
                  </Link>
                )
              )}
              <Link href="https://github.com" className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem]">
                <Globe className="text-slate-400 mb-2" size={24} />
                <p className="font-black text-sm dark:text-white">GitHub</p>
              </Link>
            </div>
            <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest mt-8">
              DataLab Studio © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;