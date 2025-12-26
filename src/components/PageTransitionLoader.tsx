'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function PageTransitionLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show loader when pathname changes
    setIsLoading(true);
    setShowLoader(true);
    
    // Hide loader after content loads
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Keep showing for smooth exit animation
      setTimeout(() => setShowLoader(false), 300);
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  if (!showLoader) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${
      isLoading ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm"></div>
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-br from-primary/30 via-transparent to-secondary/30"></div>
      </div>

      {/* Loading content */}
      <div className="flex items-center justify-center min-h-screen relative">
        <div className="text-center">
          {/* Dal Rotti Logo */}
          <div className="mb-8">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary animate-spin-slow opacity-20"></div>
              <div className="relative w-full h-full rounded-full bg-white shadow-lg flex items-center justify-center">
                <Image
                  src="/images/primary-version.png"
                  alt="Dal Rotti"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              {/* Rotating ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
            </div>
          </div>

          {/* Loading text */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 animate-pulse">
              Dal Rotti
            </h2>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-gray-600 text-sm">Preparing your experience</span>
              <div className="flex space-x-1 ml-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-72 mx-auto mb-8">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full animate-loading-bar"></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">Loading content...</div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 text-2xl animate-float" style={{animationDelay: '0s'}}>
            <span className="text-primary/20">🌶️</span>
          </div>
          <div className="absolute top-1/3 right-1/4 text-2xl animate-float" style={{animationDelay: '1s'}}>
            <span className="text-secondary/20">🧄</span>
          </div>
          <div className="absolute bottom-1/3 left-1/3 text-2xl animate-float" style={{animationDelay: '2s'}}>
            <span className="text-primary/20">🌿</span>
          </div>
          <div className="absolute bottom-1/4 right-1/3 text-2xl animate-float" style={{animationDelay: '0.5s'}}>
            <span className="text-secondary/20">⭐</span>
          </div>
          <div className="absolute top-2/3 left-1/5 text-xl animate-float" style={{animationDelay: '1.5s'}}>
            <span className="text-primary/15">🍛</span>
          </div>
          <div className="absolute top-1/5 right-1/5 text-xl animate-float" style={{animationDelay: '2.5s'}}>
            <span className="text-secondary/15">🔥</span>
          </div>
        </div>
      </div>
    </div>
  );
}
