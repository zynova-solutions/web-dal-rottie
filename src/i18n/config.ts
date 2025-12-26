'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';

// Import translation files
import enTranslation from './en.json';
import deTranslation from './de.json';

// Define available languages
export const languages = ['en', 'de'];
export type Language = (typeof languages)[number];

// Get the current language from cookie or default to English
export const getCurrentLanguage = (): Language => {
  const cookieLanguage = Cookies.get('NEXT_LOCALE') as Language;
  return cookieLanguage && languages.includes(cookieLanguage) ? cookieLanguage : 'en';
};

// Initialize i18next
i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      de: {
        translation: deTranslation
      }
    },
    lng: getCurrentLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false
    }
  });

export default i18next; 