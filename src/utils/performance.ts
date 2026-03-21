/**
 * Performance Utilities for Next.js Application
 * Provides hooks and utilities for performance monitoring, caching, and optimization
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Performance Metrics Collector
 * Collects Core Web Vitals (LCP, FID, CLS, TTFB)
 * 
 * Usage:
 * usePerformanceMetrics((metrics) => {
 *   console.log('Core Web Vitals:', metrics);
 *   // Send to analytics service
 * });
 */
export function usePerformanceMetrics(
  callback?: (metrics: PerformanceMetrics) => void
): void {
  const hasReportedRef = useRef(false);

  useEffect(() => {
    if (!callback || hasReportedRef.current) return;
    hasReportedRef.current = true;

    const metrics: PerformanceMetrics = {};

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Navigation Timing API
        if (performance.timing) {
          metrics.ttfb = performance.timing.responseStart - performance.timing.navigationStart;
          metrics.fcp = (performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0);
        }
      } catch (e) {
        console.warn('PerformanceObserver not supported:', e);
      }
    }

    // Wait a bit for all metrics to be collected
    const timeoutId = setTimeout(() => {
      callback(metrics);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [callback]);
}

/**
 * Debounce Hook
 * Delays function execution until user stops interacting
 * 
 * Usage:
 * const debouncedSearch = useDebounce(searchQuery, 500);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Memoization Cache Utility
 * Simple in-memory cache for expensive computations
 * 
 * Usage:
 * const cache = createCache();
 * const result = cache.get('key', () => expensiveComputation());
 */
export function createCache<K extends string | number, V>() {
  const store = new Map<K, V>();

  return {
    get: (key: K, compute: () => V): V => {
      if (store.has(key)) {
        return store.get(key)!;
      }
      const value = compute();
      store.set(key, value);
      return value;
    },
    set: (key: K, value: V) => store.set(key, value),
    clear: () => store.clear(),
    has: (key: K) => store.has(key),
  };
}

/**
 * Lazy Load Image
 * Intersection Observer for image lazy loading with fallback
 * 
 * Usage:
 * <img
 *   ref={useIntersectionObserver((el) => el.src = actualSrc)}
 *   src={placeholderSrc}
 *   loading="lazy"
 * />
 */
export function useIntersectionObserver<T extends HTMLElement>(
  callback: (element: T, entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback(element, entry);
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
}

/**
 * Resource Hint Manager
 * Generates optimal preload, prefetch, and dns-prefetch hints
 */
export class ResourceHintManager {
  static generateLinkHints(resources: ResourceHint[]): string {
    return resources
      .map((resource) => {
        const attributes = [
          `rel="${resource.rel}"`,
          `href="${resource.href}"`,
        ];

        if (resource.as) attributes.push(`as="${resource.as}"`);
        if (resource.type) attributes.push(`type="${resource.type}"`);
        if (resource.crossOrigin) attributes.push(`crossorigin="${resource.crossOrigin}"`);

        return `<link ${attributes.join(' ')} />`;
      })
      .join('\n');
  }

  static optimizeImageHints(): ResourceHint[] {
    return [
      // DNS prefetch for image CDNs
      { rel: 'dns-prefetch', href: 'https://images.example.com' },
      // Preload critical images (above the fold)
      { rel: 'preload', href: 'critical-image.webp', as: 'image' },
    ];
  }
}

/**
 * Bundle Size Analyzer Helper
 * Provides utilities for analyzing and optimizing bundle size
 * Configure in next.config.ts:
 * 
 * import { withBundleAnalyzer } from '@next/bundle-analyzer';
 * const withAnalyzer = withBundleAnalyzer({
 *   enabled: process.env.ANALYZE === 'true',
 * });
 * export default withAnalyzer(nextConfig);
 * 
 * Run: ANALYZE=true npm run build
 */
export const BundleSizeRecommendations = {
  criticalThresholds: {
    nextJs: 170, // kb
    react: 40, // kb
    totalJs: 250, // kb
    totalCss: 50, // kb
  },
  optimization: {
    dynamicImports: 'Split large components with dynamic() or lazy()',
    codeElimination: 'Use tree-shaking with production builds',
    cssOptimization: 'Extract critical CSS, defer non-critical styles',
    imageOptimization: 'Use Next.js Image, WebP format, responsive sizes',
  },
};

/**
 * Monitoring Integration Points
 * Ready to integrate with services like:
 * - Sentry (error tracking)
 * - Vercel Analytics (performance)
 * - Google Analytics (user behavior)
 * - LogRocket (session replay)
 */
export const MonitoringIntegration = {
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  },
  vercelAnalytics: {
    enabled: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS !== 'false',
  },
};

// Types
export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  fid?: number; // First Input Delay (deprecated, use INP)
  cls?: number; // Cumulative Layout Shift
  inp?: number; // Interaction to Next Paint
}

export interface ResourceHint {
  rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch' | 'prerender';
  href: string;
  as?: 'script' | 'style' | 'image' | 'font' | 'fetch' | 'document';
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

// Re-export React for convenience (fixes import in useDebounce)
import React from 'react';
