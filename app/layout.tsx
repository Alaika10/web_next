import React from 'react';
import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';
import { getSiteUrl } from '../lib/site';
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

const deploymentUrl = getSiteUrl();
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : '';

export const metadata: Metadata = {
  metadataBase: new URL(deploymentUrl),
  title: {
    default: 'DataLabs by Alaika Izatul Ilmi',
    template: '%s | DataLabs',
  },
  description: 'Alaika\'s official digital platform focuses on Data Science and Machine Learning Engineering. This website showcases a portfolio of projects based on data analysis, machine learning, and AI, technical articles about data and technology, professional certifications, and contact information for research and industry collaboration.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'DataLabs by Alaika Izatul Ilmi',
    description: 'Alaika\'s official digital platform focuses on Data Science and Machine Learning Engineering. This website showcases a portfolio of projects based on data analysis, machine learning, and AI, technical articles about data and technology, professional certifications, and contact information for research and industry collaboration.',
    url: deploymentUrl,
    siteName: 'DataLabs by Alaika Izatul Ilmi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DataLabs by Alaika Izatul Ilmi',
    description: 'Alaika\'s official digital platform focuses on Data Science and Machine Learning Engineering. This website showcases a portfolio of projects based on data analysis, machine learning, and AI, technical articles about data and technology, professional certifications, and contact information for research and industry collaboration.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', type: 'image/x-icon' },
    ],
    shortcut: [{ url: '/favicon.ico?v=2', type: 'image/x-icon' }],
    apple: [{ url: '/favicon.ico?v=2', type: 'image/x-icon' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        {/* Preconnect ke domain kritikal untuk memangkas waktu DNS lookup & handshake */}
        {supabaseHost && <link rel="preconnect" href={`https://${supabaseHost}`} crossOrigin="anonymous" />}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
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
