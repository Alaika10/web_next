
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * RootLayout: Next.js standard wrapper for all pages.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 antialiased">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
