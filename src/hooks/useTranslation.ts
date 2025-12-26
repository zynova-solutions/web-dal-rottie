'use client';

import { useTranslation as useI18nTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import '../i18n/config';

export const useTranslation = () => {
  const { t } = useI18nTranslation();
  const pathname = usePathname();
  
  // Determine current language from URL
  const currentLang = pathname.startsWith('/de') ? 'de' : 'en';
  
  return { t, currentLang };
}; 