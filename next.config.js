const withMDX = require('@next/mdx')();
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'md', 'ts', 'tsx'],
  async rewrites() {
    return [
      {
        source: '/_next/static/chunks/pages/_app.js',
        has: [
          {
            type: 'header',
            key: 'x-load-priority',
            value: 'high',
          },
        ],
        destination: '/embed-policy.min.js',
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Set-Cookie',
            value: 'csrf_token; SameSite=Strict; Secure; HttpOnly; Max-Age=2592000'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' app.termly.io cdn.us.heap-api.com *.googletagmanager.com *.google-analytics.com *.stripe.com *.facebook.net *.clarity.ms *.posthog.com",
              "connect-src 'self' app.termly.io *.heap-api.com *.google-analytics.com *.analytics.google.com *.coachbot.ai *.sendgrid.net *.openai.com *.openai.azure.com *.ai.azure.com *.auth0.com *.termly.io *.cloudfunctions.net *.posthog.com *.clarity.ms wss://*.openai.azure.com wss://studiosweden.openai.azure.com",
              "frame-src 'self' app.termly.io *.googletagmanager.com *.stripe.com",
              "img-src 'self' data: *.googleapis.com *.gravatar.com cdn.jsdelivr.net *.googletagmanager.com *.auth0.com",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com",
              "worker-src 'self' blob:",
            ].join('; ')
          }
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { hostname: 's.gravatar.com' },
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'storage.googleapis.com' },
      { hostname: 'drive.google.com' },
      { hostname: 'api.producthunt.com' },
    ],
  },
  serverExternalPackages: ['ffmpeg-static', '@google-cloud/storage'],
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
};

module.exports = withNextIntl(withMDX(nextConfig));