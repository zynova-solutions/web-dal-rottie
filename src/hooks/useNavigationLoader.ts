'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function useNavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleRouteChangeComplete = () => {
      // Add a small delay to ensure smooth transition
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    // Handle initial page load
    setIsLoading(true);
    handleRouteChangeComplete();

    // Listen for route changes by watching pathname
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [pathname]);

  return { isLoading, setIsLoading };
}
