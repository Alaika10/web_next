import React from 'react';
import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import './globals.css';

const VercelAnalytics = dynamic(() => import('../components/VercelAnalytics'), { 
  ssr: false 
});

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: true, // Mencegah Layout Shift saat font dimuat
});

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
};

const deploymentUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alexdatalabs.vercel.app';
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : '';

export const metadata: Metadata = {
  metadataBase: new URL(deploymentUrl),
  title: {
    default: 'DataLabs by Alaika Izatul Ilmi',
    template: '%s | DataLabs',
  },
  description: 'Alaika digital Labs website showcasing projects, technical skills, and professional experience in web development and computer science. Built with a focus on performance, clean architecture, and scalability, this site highlights real-world projects, technical blogs, and certifications while delivering a fast, responsive, and user-friendly experience.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧬</text></svg>',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        {/* Preconnect ke domain kritikal untuk memangkas waktu DNS lookup & handshake */}
        {supabaseHost && <link rel="preconnect" href={`https://${supabaseHost}`} crossOrigin="anonymous" />}
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="data-grid-bg font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 antialiased">
        <Navbar />
        <main className="flex-grow pt-20 min-h-screen relative z-10">
          {children}
        </main>
        <Footer />
        <VercelAnalytics />
      </body>
    </html>
  );
}