// import { createSharedPathnamesNavigation } from 'next-intl/navigation'; // Removed unused import
import { getRequestConfig } from 'next-intl/server';

// Define supported locales explicitly (must match middleware locales)
const locales = ['en', 'de'];

// NOTE: In this next-intl version, requestLocale() isn't available. We keep using the deprecated
// ({ locale }) parameter for compatibility. When upgrading, switch to:
//   const currentLocale = await requestLocale();
// and remove the parameter.
export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale && locales.includes(locale) ? locale : 'en';
  const messages = (await import(`../messages/${currentLocale}.json`)).default;
  return {
    locale: currentLocale,
    messages,
    timeZone: 'Europe/Berlin',
    now: new Date()
  };
});
