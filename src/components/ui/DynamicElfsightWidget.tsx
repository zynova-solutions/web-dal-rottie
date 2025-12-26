'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

interface DynamicElfsightWidgetProps {
  widgetId: string;
  className?: string;
}

export default function DynamicElfsightWidget({ widgetId, className = '' }: DynamicElfsightWidgetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    const element = document.getElementById(`elfsight-${widgetId}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [widgetId, isVisible]);

  return (
    <div id={`elfsight-${widgetId}`} className={className}>
      {isVisible && (
        <>
          {!scriptLoaded && (
            <Script
              src="https://static.elfsight.com/platform/platform.js"
              strategy="lazyOnload"
              onLoad={() => setScriptLoaded(true)}
            />
          )}
          <div className={`elfsight-app-${widgetId}`} data-elfsight-app-lazy />
        </>
      )}
      {!isVisible && (
        <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Loading widget...</span>
        </div>
      )}
    </div>
  );
}
