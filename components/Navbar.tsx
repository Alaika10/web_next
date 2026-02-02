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

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100 && !isMenuOpen) {
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
        className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-500 ease-in-out transform ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled || isMenuOpen
          ? 'py-3 px-6 md:px-12 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg' 
          : 'py-6 px-6 md:px-12 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center h-14">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-[120]">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg transition-transform group-hover:rotate-12 duration-300">
              D
            </div>
            <span className="font-black text-xl tracking-tighter uppercase bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              DataLab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100/50 dark:bg-white/5 backdrop-blur-md px-1.5 py-1.5 rounded-2xl border border-slate-200/30 dark:border-white/10">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
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
          <div className="flex items-center gap-3 relative z-[120]">
            <div className="hidden sm:flex items-center gap-3">
              {!mounted ? (
                <div className="w-24 h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"></div>
              ) : isAuth ? (
                <Link 
                  href="/admin" 
                  className="group flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none uppercase tracking-[0.15em]"
                >
                  <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform" />
                  <span>Console</span>
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-6 py-2.5 rounded-xl text-[10px] font-black hover:opacity-80 transition-all uppercase tracking-[0.15em]"
                >
                  <UserIcon size={14} />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-slate-600 dark:text-slate-300 md:hidden transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20 active:scale-90"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[105] md:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop blur effect */}
        <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl" onClick={() => setIsMenuOpen(false)}></div>
        
        {/* Menu Content */}
        <div className="relative h-full flex flex-col justify-center px-10 space-y-12">
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-indigo-500 font-black mb-4 animate-in slide-in-from-left-4 duration-500">Navigation_System</p>
            <nav className="flex flex-col gap-6">
              {links.map((link, idx) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center justify-between text-4xl font-black tracking-tighter transition-all duration-500 hover:translate-x-4 ${
                    pathname === link.path ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  } animate-in slide-in-from-left-8 fill-mode-forwards`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {link.name}
                  <ChevronRight size={32} className={`transition-opacity ${pathname === link.path ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                </Link>
              ))}
            </nav>
          </div>

          <div className="pt-12 border-t border-slate-100 dark:border-slate-800 space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="grid grid-cols-2 gap-4">
              {!isAuth ? (
                <Link href="/login" className="flex flex-col gap-2 p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] group">
                  <UserIcon className="text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Researcher</span>
                  <p className="font-bold text-sm">Secure Login</p>
                </Link>
              ) : (
                <Link href="/admin" className="flex flex-col gap-2 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] group border border-indigo-100 dark:border-indigo-800">
                  <LayoutDashboard className="text-indigo-600 group-hover:rotate-12 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Authorized</span>
                  <p className="font-bold text-sm">Dashboard</p>
                </Link>
              )}
              <Link href="https://github.com" className="flex flex-col gap-2 p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] group">
                <Globe className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Repositories</span>
                <p className="font-bold text-sm">GitHub Lab</p>
              </Link>
            </div>
            
            <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">
              © {new Date().getFullYear()} Alex Sterling — Vol. 25
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;