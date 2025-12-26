'use client';

import { useEffect } from 'react';
import { trackMenuView } from '@/utils/analytics';

interface MenuAnalyticsWrapperProps {
  children: React.ReactNode;
  source: string;
}

export default function MenuAnalyticsWrapper({ children, source }: MenuAnalyticsWrapperProps) {
  useEffect(() => {
    // Track menu page view when component mounts
    trackMenuView(source);
  }, [source]);

  return <>{children}</>;
} 