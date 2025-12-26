"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from '@/hooks/useTranslation';

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark'; // light = white text on dark bg, dark = dark text on light bg
}

const LanguageSwitcher = ({ variant = 'dark' }: LanguageSwitcherProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { currentLang } = useTranslation();
  
  const switchLanguage = (lang: string) => {
    if (lang === currentLang) {
      setIsOpen(false);
      return;
    }
    
    // Save language preference in cookie
    Cookies.set('NEXT_LOCALE', lang, { expires: 365 });
    
    // Get the current page path without language prefix
    let pagePath = pathname;
    if (pathname.startsWith('/en/') || pathname.startsWith('/de/')) {
      pagePath = pathname.substring(3); // Remove language prefix
    } else if (pathname === '/en' || pathname === '/de') {
      pagePath = '/';
    }
    
    // Construct the new URL with the selected language
    const newPath = `/${lang}${pagePath === '/' ? '' : pagePath}`;
    
    // Ensure we don't have double slashes
    const cleanPath = newPath.replace(/\/+/g, '/');
    
    router.push(cleanPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        className={`
          flex items-center space-x-0.5 text-sm font-medium
          ${variant === 'light' 
            ? 'text-white/80 hover:text-white' 
            : 'text-text-secondary hover:text-primary'}
          transition-colors
        `}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Current language: ${currentLang === 'en' ? 'English' : 'German'}`}
      >
        <span suppressHydrationWarning>{currentLang === 'en' ? '🇬🇧' : '🇩🇪'}</span>
        <svg 
          className="w-3 h-3" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            <button 
              className={`block px-4 py-2 text-sm w-full text-left text-gray-700
                ${currentLang === 'en' 
                  ? 'bg-gray-100' 
                  : 'hover:bg-gray-50'}`}
              onClick={() => switchLanguage('en')}
            >
              <span suppressHydrationWarning>🇬🇧 English</span>
            </button>
            <button 
              className={`block px-4 py-2 text-sm w-full text-left text-gray-700
                ${currentLang === 'de' 
                  ? 'bg-gray-100' 
                  : 'hover:bg-gray-50'}`}
              onClick={() => switchLanguage('de')}
            >
              <span suppressHydrationWarning>🇩🇪 Deutsch</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
