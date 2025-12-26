'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import i18next from 'i18next';
import '../../i18n/config';

interface I18nProviderProps {
  children: ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const pathname = usePathname();
  
  // Update language based on URL
  useEffect(() => {
    const isGerman = pathname.startsWith('/de');
    const language = isGerman ? 'de' : 'en';
    
    // Change language only if different
    if (i18next.language !== language) {
      i18next.changeLanguage(language);
      
      // Update cookie
      Cookies.set('NEXT_LOCALE', language, { expires: 365 });
    }
    
    // Update HTML lang attribute to ensure server/client match
    // First check if we're in a browser environment
    if (typeof document !== 'undefined' && document.documentElement.lang !== language) {
      document.documentElement.lang = language;
    }
  }, [pathname]);
  
  return <>{children}</>;
} 