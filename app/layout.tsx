import React from 'react';
import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import './globals.css';

// Defer heavy monitoring scripts
const VercelAnalytics = dynamic(() => import('../components/VercelAnalytics'), { ssr: false });

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'DataLab | AI & Machine Learning Portfolio',
  description: 'Building intelligent systems with rigor and precision. Portfolio and research journal of Alex Sterling.',
  metadataBase: new URL('https://datalab.alex.studio'),
  openGraph: {
    title: 'DataLab | AI & Machine Learning Portfolio',
    description: 'Specialized in turning high-dimensional data into predictive power.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='30' fill='%234f46e5'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-weight='900' font-size='65' fill='white'%3ED%3C/text%3E%3C/svg%3E" />
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://picsum.photos" />
      </head>
      <body className="data-grid-bg font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 antialiased">
        <Navbar />
        <main className="flex-grow pt-24 min-h-screen">
          {children}
        </main>
        <Footer />
        <VercelAnalytics />
      </body>
    </html>
  );
}