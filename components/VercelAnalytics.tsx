'use client';

import React from 'react';
// @ts-ignore
import { Analytics } from '@vercel/analytics/react';
// @ts-ignore
import { SpeedInsights } from '@vercel/speed-insights/next';

/**
 * VercelAnalytics Component
 * Menambahkan @ts-ignore untuk mengatasi masalah resolusi modul di editor lokal
 * yang sering terjadi jika node_modules belum sepenuhnya terindeks oleh TS Server.
 */
export default function VercelAnalytics() {
  // Hanya jalankan di production untuk menghindari tracking sampah saat development
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