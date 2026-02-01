'use client';

import React from 'react';
// Menggunakan @ts-ignore karena IDE lokal sering gagal mendeteksi subpath modul Vercel 
// meskipun saat runtime/build modul tersebut tersedia.
// @ts-ignore
import { Analytics } from '@vercel/analytics/react';
// @ts-ignore
import { SpeedInsights } from '@vercel/speed-insights/next';

/**
 * VercelAnalytics Component
 * Komponen ini memaksimalkan monitoring performa (LCP, FID, CLS) dan 
 * statistik pengunjung tanpa membebani performa saat development.
 */
export default function VercelAnalytics() {
  // Hanya render di production untuk menjaga akurasi data di dashboard Vercel
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}