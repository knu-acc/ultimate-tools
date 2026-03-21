/**
 * Environment & Configuration Management
 * Centralized configuration for the application
 */

export interface AppConfig {
  environment: 'development' | 'production' | 'staging';
  siteUrl: string;
  apiUrl: string;
  cdnUrl?: string;
  analytics: AnalyticsConfig;
  security: SecurityConfig;
  performance: PerformanceConfig;
  features: FeatureFlags;
}

export interface AnalyticsConfig {
  gtmId?: string;
  sentryDsn?: string;
  vercelAnalytics: boolean;
  customDomain?: string;
}

export interface SecurityConfig {
  enableCSP: boolean;
  enableTrustedTypes: boolean;
  allowedOrigins: string[];
  rateLimitPerMinute: number;
  sessionTimeout: number; // minutes
}

export interface PerformanceConfig {
  enableCompression: boolean;
  enableCache: boolean;
  cacheTTL: number; // seconds
  maxBundleSize: number; // kb
}

export interface FeatureFlags {
  darkMode: boolean;
  multiLanguage: boolean;
  search: boolean;
  userAccounts: boolean;
  exportFeatures: boolean;
  apiEndpoint: boolean;
}

/**
 * Get App Configuration based on environment
 */
export function getAppConfig(): AppConfig {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';

  return {
    environment: isProd ? 'production' : isDev ? 'development' : 'staging',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
    analytics: {
      gtmId: process.env.NEXT_PUBLIC_GTM_ID,
      sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      vercelAnalytics: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS !== 'false',
      customDomain: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN,
    },
    security: {
      enableCSP: true,
      enableTrustedTypes: isProd,
      allowedOrigins: [
        process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
      ],
      rateLimitPerMinute: isProd ? 60 : 1000,
      sessionTimeout: 30,
    },
    performance: {
      enableCompression: true,
      enableCache: !isDev,
      cacheTTL: isDev ? 0 : 3600,
      maxBundleSize: 400, // kb
    },
    features: {
      darkMode: true,
      multiLanguage: true,
      search: true,
      userAccounts: false,
      exportFeatures: true,
      apiEndpoint: false,
    },
  };
}

/**
 * Validate Configuration
 */
export function validateConfig(config: AppConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!config.siteUrl) errors.push('siteUrl is required');
  if (!config.apiUrl) errors.push('apiUrl is required');

  // URL validation
  try {
    new URL(config.siteUrl);
  } catch {
    errors.push('siteUrl must be a valid URL');
  }

  try {
    new URL(config.apiUrl);
  } catch {
    errors.push('apiUrl must be a valid URL');
  }

  // Security config
  if (config.security.rateLimitPerMinute < 1) {
    errors.push('rateLimitPerMinute must be at least 1');
  }

  if (config.security.sessionTimeout < 5) {
    errors.push('sessionTimeout must be at least 5 minutes');
  }

  // Performance config
  if (config.performance.cacheTTL < 0) {
    errors.push('cacheTTL cannot be negative');
  }

  if (config.performance.maxBundleSize < 50) {
    errors.push('maxBundleSize is too small (minimum 50kb)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Environment Variables Schema
 * Define expected environment variables for type safety
 */
export const ENV_SCHEMA = {
  // Public
  NEXT_PUBLIC_SITE_URL: 'string|required',
  NEXT_PUBLIC_API_URL: 'string|optional',
  NEXT_PUBLIC_CDN_URL: 'string|optional',
  NEXT_PUBLIC_GTM_ID: 'string|optional',
  NEXT_PUBLIC_SENTRY_DSN: 'string|optional',
  NEXT_PUBLIC_ANALYTICS_DOMAIN: 'string|optional',
  NEXT_PUBLIC_VERCEL_ANALYTICS: 'boolean|optional',

  // Private (server-only)
  DATABASE_URL: 'string|optional',
  AUTH_SECRET: 'string|optional',
  API_KEY: 'string|optional',
} as const;

/**
 * Type-safe Environment Variable Getter
 */
export function getEnvVar<T = string>(
  key: keyof typeof ENV_SCHEMA,
  defaultValue?: T
): T | undefined {
  const value = process.env[key];

  if (!value && defaultValue !== undefined) {
    return defaultValue;
  }

  return value as T;
}

/**
 * Build-time Configuration
 * These values are baked into the build
 */
export const BUILD_CONFIG = {
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  buildTime: new Date().toISOString(),
  buildId: process.env.VERCEL_GIT_COMMIT_SHA || 'dev',
  buildRef: process.env.VERCEL_GIT_COMMIT_REF || 'dev',
} as const;

/**
 * Feature Detection
 */
export const BROWSER_FEATURES = {
  supportsWebP: () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  },
  supportsIntersectionObserver: () => 'IntersectionObserver' in globalThis,
  supportsResizeObserver: () => 'ResizeObserver' in globalThis,
  supportsPerformanceAPI: () => 'performance' in globalThis,
  supportsLazyLoading: () => {
    return typeof HTMLImageElement !== 'undefined' && 'loading' in HTMLImageElement.prototype;
  },
};

/**
 * Configuration Debug Helper
 * Only logs in development
 */
export function debugConfig(label: string, config: any): void {
  if (process.env.NODE_ENV === 'development') {
    console.group(`[Config Debug] ${label}`);
    console.table(config);
    console.groupEnd();
  }
}

/**
 * Export complete configuration
 */
export const AppConfigInstance = getAppConfig();

// Validate on initialization
if (typeof window === 'undefined') {
  // Server-side
  const validation = validateConfig(AppConfigInstance);
  if (!validation.valid) {
    console.warn('[Config Warning] Configuration errors:', validation.errors);
  }
}
