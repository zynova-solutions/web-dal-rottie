// src/utils/apiUtils.ts
import Cookies from 'js-cookie';

/**
 * Get current language from cookie or default to 'en'
 * This reads from NEXT_LOCALE cookie which is set by the language selector
 */
export function getCurrentLanguage(): string {
  if (typeof window === 'undefined') {
    return 'en'; // Default for SSR
  }
  
  const lang = Cookies.get('NEXT_LOCALE');
  console.log('getCurrentLanguage() called, cookie value:', lang, 'returning:', lang || 'en');
  return lang || 'en';
}

/**
 * Add language parameter to URL
 * @param url - Base URL
 * @param additionalParams - Additional query parameters
 * @returns URL with language parameter
 */
export function addLanguageParam(url: string, additionalParams?: Record<string, string>): string {
  const lang = getCurrentLanguage();
  const urlObj = new URL(url, window.location.origin);
  
  // Add language parameter
  urlObj.searchParams.set('lang', lang);
  
  // Add any additional parameters
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });
  }
  
  return urlObj.toString();
}

/**
 * Build fetch options with language in headers
 * @param options - Original fetch options
 * @returns Fetch options with language header
 */
export function getFetchOptionsWithLanguage(options: RequestInit = {}): RequestInit {
  const lang = getCurrentLanguage();
  
  return {
    ...options,
    headers: {
      ...options.headers,
      'Accept-Language': lang,
      'X-Language': lang,
    },
  };
}
