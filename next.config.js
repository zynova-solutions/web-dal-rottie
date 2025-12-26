const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Common configuration
  reactStrictMode: true,
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Experimental features for better performance
  experimental: {
    optimizeServerReact: true,
    webpackBuildWorker: true,
  },
  
  images: {
    // Optimize images for better performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'muabuisefbujdsnhnpfe.supabase.co',
        pathname: '/**',
      }
    ],
  },
  
  // Add custom headers for better performance and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development'
              ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.elfsight.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:4000 https://www.google-analytics.com https://dalrotti-backend.onrender.com https://dal-rotti-backend-prod-production.up.railway.app https://static.elfsight.com; frame-src 'self' https://www.opentable.de; worker-src 'self' blob:;"
              : "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.elfsight.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://dalrotti-backend.onrender.com https://dal-rotti-backend-prod-production.up.railway.app https://static.elfsight.com; frame-src 'self' https://www.opentable.de; worker-src 'self' blob:;"
          }
        ]
      },
      {
        source: '/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/(.*)\\.(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  // Custom configuration
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Enable bundle analyzer in development for optimization
  ...(process.env.ANALYZE === 'true' && {
    experimental: {
      ...nextConfig.experimental,
    }
  }),

  // Webpack configuration to handle ResizeObserver errors
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add a plugin to suppress ResizeObserver loop errors
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.done.tap('SuppressResizeObserverErrors', () => {
            if (typeof window !== 'undefined') {
              const originalError = window.console.error;
              window.console.error = (...args) => {
                if (
                  args[0] &&
                  typeof args[0] === 'string' &&
                  args[0].includes('ResizeObserver loop completed with undelivered notifications')
                ) {
                  return;
                }
                originalError.apply(window.console, args);
              };
            }
          });
        }
      });
    }
    return config;
  }
};

module.exports = withNextIntl(nextConfig);