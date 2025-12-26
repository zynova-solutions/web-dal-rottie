// import { Pathnames } from 'next-intl/navigation'; // Removed unused import

export const locales = ['en', 'de'] as const;
export type Locale = (typeof locales)[number];

export const pathnames = {
  '/': '/',
  '/menu': '/menu',
  '/reservation': '/reservation',
  '/contact': '/contact',
  '/about': '/about',
  '/catering': '/catering',
  '/order': '/order',
  '/privacy-policy': '/privacy-policy',
  '/terms': '/terms'
} as const;

export type AppPathnames = typeof pathnames;
