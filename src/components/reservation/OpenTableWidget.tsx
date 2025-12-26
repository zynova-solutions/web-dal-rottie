"use client";
import { useEffect, useState } from 'react';
import Script from 'next/script';

interface OpenTableWidgetProps {
  widgetSrc: string;
  fallbackHref: string;
  bookLabel: string;
  unavailableMsg: string;
}

export default function OpenTableWidget({ widgetSrc, fallbackHref, bookLabel, unavailableMsg }: OpenTableWidgetProps) {
  const [showFallbackNotice, setShowFallbackNotice] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const iframe = document.querySelector('iframe[src*="opentable"]');
      if (!iframe) setShowFallbackNotice(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <a href={fallbackHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          {bookLabel}
        </a>
        {showFallbackNotice && (
          <span className="text-sm text-error">{unavailableMsg}</span>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 border border-border min-h-40 flex items-start" id="opentable-widget">
        <Script src={widgetSrc} strategy="afterInteractive" />
        <noscript>
          <a className="text-primary underline" href={fallbackHref} target="_blank" rel="noopener noreferrer">{bookLabel}</a>
        </noscript>
      </div>
    </div>
  );
}
