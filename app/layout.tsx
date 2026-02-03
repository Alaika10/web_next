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

// Pastikan datalab.alex.studio diganti dengan domain asli Anda di Vercel
const siteConfig = {
  title: 'DataLab | AI & ML Portfolio',
  description: 'Building intelligent systems with rigor and precision. Expert in Deep Learning and Predictive Analytics.',
  url: 'https://alexdatalabs.vercel.app',
  ogImage: '/og-main.png', // Letakkan file ini di folder /public (1200x630px)
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: ['Data Science', 'Machine Learning', 'AI Portfolio', 'Alex Sterling'],
  authors: [{ name: 'Alex Sterling' }],
  creator: 'Alex Sterling',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@alexsterling', // Ganti dengan handle twitter Anda
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='30' fill='%234f46e5'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-weight='900' font-size='65' fill='white'%3ED%3C/text%3E%3C/svg%3E" />
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