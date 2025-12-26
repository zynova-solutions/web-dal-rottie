import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'de'],

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Redirect to default locale if no locale is found
  localePrefix: 'always'
});

export const config = {
  // Match all pathnames except for
  // - API routes (/api/*)
  // - Static files (/_next/*, /images/*, /favicon.ico, etc.)
  // - Admin panel (/admin and all subpaths) are excluded from locale and public layout
  // - Auth routes (/auth/* for OAuth callbacks)
  // - User routes (/user/* for user pages)
  //   This allows /admin to have its own layout, menu bar, and no site header/footer
  matcher: ['/((?!api|_next|.*\\.|images|favicon.ico|admin|user|auth).*)']
};