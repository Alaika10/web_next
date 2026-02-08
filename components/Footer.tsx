'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  if (isAdminPath) return null;

  return (
    <footer className="py-12 px-6 border-t mt-12 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div className="space-y-2">
          <p className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">DataLabs by Alaika Izatul Ilmi</p>
          <p className="text-slate-500 text-sm max-w-xs">Building intelligent systems with rigor and precision.</p>
        </div>
        <div className="flex space-x-8">
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">GitHub</a>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">LinkedIn</a>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">HuggingFace</a>
        </div>
        <div className="text-slate-400 text-xs">
          © {new Date().getFullYear()} Alex Sterling. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;