'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [showFullLoader, setShowFullLoader] = useState(false);
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] = useState(pathname);

  useEffect(() => {
    // Only show loading when pathname actually changes (not on initial load)
    if (pathname !== previousPathname && previousPathname !== '') {
      setIsLoading(true);
      setShowFullLoader(true);
      
      // Hide loader when page is ready
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Hide after animation
        setTimeout(() => setShowFullLoader(false), 300);
      }, 500); // Reduced time for faster response

      setPreviousPathname(pathname);

      return () => clearTimeout(timer);
    } else if (previousPathname === '') {
      setPreviousPathname(pathname);
    }
  }, [pathname, previousPathname]);

  // Hide loader when document is ready
  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
      setTimeout(() => setShowFullLoader(false), 300);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Handle link clicks to show loading immediately
  useEffect(() => {
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href && !link.target && !link.download) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        // Only show loader for internal navigation
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          setIsLoading(true);
          setShowFullLoader(true);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  if (!showFullLoader) return null;

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-200">
          <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary animate-loading-bar"></div>
        </div>
      </div>
      
      {/* Full screen loader */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Background overlay */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
        
        {/* Animated background */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
        </div>

        {/* Loading content */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-6">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-ping"></div>
                <div className="relative w-full h-full rounded-full bg-white shadow-lg flex items-center justify-center">
                  <Image
                    src="/images/primary-version.png"
                    alt="Dal Rotti"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                {/* Spinning border */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
              </div>
            </div>

            {/* Loading text */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 font-medium">Dal Rotti</div>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <span className="text-xs text-gray-500">Loading</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements - subtle */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 text-lg animate-float opacity-20" style={{animationDelay: '0s'}}>
            🌶️
          </div>
          <div className="absolute top-1/3 right-1/4 text-lg animate-float opacity-20" style={{animationDelay: '1s'}}>
            🧄
          </div>
          <div className="absolute bottom-1/3 left-1/3 text-lg animate-float opacity-20" style={{animationDelay: '2s'}}>
            🌿
          </div>
          <div className="absolute bottom-1/4 right-1/3 text-lg animate-float opacity-20" style={{animationDelay: '0.5s'}}>
            ⭐
          </div>
        </div>
      </div>
    </>
  );
}
