'use client';

import React from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

/**
 * VercelAnalytics Component
 * Integrates Vercel Analytics and Speed Insights for Next.js App Router
 * Uses the recommended '@vercel/analytics/next' import for optimal Next.js integration
 */
export default function VercelAnalytics() {
  // Only run in production to avoid tracking during development
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