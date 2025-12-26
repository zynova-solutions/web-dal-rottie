'use client';

import { useEffect } from 'react';

interface Metric {
  name: string;
  id: string;
  value: number;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function WebVitals() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('web-vitals').then((webVitals) => {
        function sendToGoogleAnalytics(metric: Metric) {
          // Only send to GA if it's available
          if (window.gtag) {
            window.gtag('event', metric.name, {
              event_category: 'Web Vitals',
              event_label: metric.id,
              value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
              non_interaction: true,
            });
          }
        }

        // Use the functions available in web-vitals
        if (webVitals.onCLS) webVitals.onCLS(sendToGoogleAnalytics);
        if (webVitals.onINP) webVitals.onINP(sendToGoogleAnalytics);
        if (webVitals.onFCP) webVitals.onFCP(sendToGoogleAnalytics);
        if (webVitals.onLCP) webVitals.onLCP(sendToGoogleAnalytics);
        if (webVitals.onTTFB) webVitals.onTTFB(sendToGoogleAnalytics);
      });
    }
  }, []);

  return null;
}
