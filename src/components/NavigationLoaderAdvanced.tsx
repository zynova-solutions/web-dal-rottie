'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function NavigationLoaderAdvanced() {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Handle pathname changes
  useEffect(() => {
    if (isInitialLoad) {
      setPreviousPathname(pathname);
      setIsInitialLoad(false);
      return;
    }

    if (pathname !== previousPathname) {
      setIsLoading(true);
      setShowLoader(true);
      setPreviousPathname(pathname);

      // Hide loader when content is loaded
      const hideLoader = () => {
        setIsLoading(false);
        setTimeout(() => setShowLoader(false), 300);
      };

      // Use multiple strategies to detect when loading is complete
      const timer = setTimeout(hideLoader, 1000); // Fallback timeout

      // Check if document is already loaded
      if (document.readyState === 'complete') {
        hideLoader();
      } else {
        // Wait for load event
        const handleLoad = () => {
          clearTimeout(timer);
          hideLoader();
        };
        window.addEventListener('load', handleLoad, { once: true });
        
        // Also check for DOMContentLoaded in case images are still loading
        if (document.readyState === 'loading') {
          const handleDOMLoaded = () => {
            setTimeout(() => {
              clearTimeout(timer);
              hideLoader();
            }, 200);
          };
          document.addEventListener('DOMContentLoaded', handleDOMLoaded, { once: true });
        }
      }

      return () => {
        clearTimeout(timer);
      };
    }
  }, [pathname, previousPathname, isInitialLoad]);

  // Handle link clicks for immediate feedback
  useEffect(() => {
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href && !link.target && !link.download && !link.href.includes('#')) {
        try {
          const url = new URL(link.href);
          const currentUrl = new URL(window.location.href);
          
          // Only show loader for internal navigation to different pages
          if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
            setIsLoading(true);
            setShowLoader(true);
          }
        } catch {
          // Ignore invalid URLs
        }
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => document.removeEventListener('click', handleLinkClick, true);
  }, []);

  if (!showLoader) return null;

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-200/80">
          <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary animate-loading-bar"></div>
        </div>
      </div>
      
      {/* Full screen loader with smooth transitions */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          isLoading ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ pointerEvents: isLoading ? 'auto' : 'none' }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
        
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-gradient-to-br from-primary/30 via-transparent to-secondary/30"></div>
        </div>

        {/* Loading content */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            {/* Logo with enhanced animation */}
            <div className="mb-6">
              <div className="relative mx-auto w-16 h-16">
                {/* Pulsing background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-ping"></div>
                
                {/* Logo container */}
                <div className="relative w-full h-full rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-gray-100">
                  <Image
                    src="/images/primary-version.png"
                    alt="Dal Rotti"
                    width={40}
                    height={40}
                    className="rounded-full"
                    priority
                  />
                </div>
                
                {/* Spinning border */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
              </div>
            </div>

            {/* Loading text */}
            <div className="mb-4">
              <div className="text-sm text-gray-700 font-medium mb-1">Dal Rotti</div>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-xs text-gray-500">Loading</span>
                <div className="flex space-x-1 ml-1">
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
