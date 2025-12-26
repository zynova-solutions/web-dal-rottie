'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [, setCurrentLang] = useState('en'); // Removed unused _currentLang

  useEffect(() => {
    setCurrentLang(i18n.language || 'en');
  }, [i18n.language]);

  const switchLanguage = (lang: string) => {
    const path = window.location.pathname;
    const newPath = path.replace(/^\/(en|de)/, `/${lang}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => switchLanguage('en')}
        className="px-3 py-1 rounded-md text-text-secondary hover:text-primary border border-border hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary" /* Removed dark: classes */
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('de')}
        className="px-3 py-1 rounded-md text-text-secondary hover:text-primary border border-border hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary" /* Removed dark: classes */
        aria-label="Switch to German"
      >
        DE
      </button>
    </div>
  );
};

export default LanguageSwitcher;
