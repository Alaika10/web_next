import React from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VercelAnalytics from '../components/VercelAnalytics';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'DataLab | AI & Machine Learning Portfolio',
  description: 'Building intelligent systems with rigor and precision. Portfolio and research journal of Alex Sterling.',
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
      </head>
      <body className="data-grid-bg font-sans">
        <Navbar />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
        <VercelAnalytics />
      </body>
    </html>
  );
}