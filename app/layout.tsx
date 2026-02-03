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
  preload: true,
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
};

// PENTING: Ganti dengan domain produksi Anda. 
// WhatsApp/Telegram memerlukan URL absolut https://
const deploymentUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://datalab.alex.studio';

export const metadata: Metadata = {
  metadataBase: new URL(deploymentUrl),
  title: {
    default: 'DataLab | Alex Sterling Portfolio',
    template: '%s | DataLab',
  },
  description: 'Building intelligent systems with rigor and precision. Expert in Deep Learning and Predictive Analytics.',
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: deploymentUrl,
    siteName: 'DataLab Studio',
    images: [
      {
        url: '/og-main.png', // Pastikan file ini ada di /public/og-main.png
        width: 1200,
        height: 630,
        alt: 'DataLab Alex Sterling',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@alexsterling',
    creator: '@alexsterling',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <meta charSet="UTF-8" />
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