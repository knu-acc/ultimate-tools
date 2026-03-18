import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  // Transform barrel imports into direct file imports — avoids parsing the
  // entire 2000+ icon barrel and improves build + cold-start performance.
  experimental: {
    optimizePackageImports: ['@mui/icons-material', '@mui/material', 'react-colorful'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  async redirects() {
    return [
      {
        source: '/tools/qr-generator',
        destination: '/tools/qr-code-gen',
        permanent: true,
      },
      {
        source: '/tools/barcode-generator',
        destination: '/tools/barcode-gen',
        permanent: true,
      },
      {
        source: '/:locale(ru|en)/tools/qr-generator',
        destination: '/:locale/tools/qr-code-gen',
        permanent: true,
      },
      {
        source: '/:locale(ru|en)/tools/barcode-generator',
        destination: '/:locale/tools/barcode-gen',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
