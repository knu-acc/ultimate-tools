'use client';

import React, { useEffect } from 'react';
import { Logger } from '@/src/utils/logging';
import { usePerformanceMetrics } from '@/src/utils/performance';

/**
 * Client-side provider for logging and performance monitoring
 * Initialize Logger and performance metrics collection
 */
export function RootClientProvider({ children }: { children: React.ReactNode }) {
  // Initialize Logger
  useEffect(() => {
    Logger.info('Application initialized', {
      env: process.env.NODE_ENV,
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Collect Core Web Vitals
  usePerformanceMetrics((metrics) => {
    Logger.info('Core Web Vitals collected', {
      lcp: `${metrics.lcp?.toFixed(0) || 'N/A'}ms`,
      fcp: `${metrics.fcp?.toFixed(0) || 'N/A'}ms`,
      ttfb: `${metrics.ttfb?.toFixed(0) || 'N/A'}ms`,
    });

    // Optional: Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      Object.entries(metrics).forEach(([key, value]) => {
        if (value) {
          (window as any).gtag('event', key, { value });
        }
      });
    }
  });

  return <>{children}</>;
}
