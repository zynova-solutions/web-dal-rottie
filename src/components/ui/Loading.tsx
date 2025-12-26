'use client';

import { useEffect, useState } from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white' | 'gray';
  delay?: number; // ms to delay showing the spinner
  text?: string;
}

export default function Loading({
  size = 'medium',
  color = 'primary',
  delay = 300,
  text,
}: LoadingProps) {
  const [showSpinner, setShowSpinner] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);

  if (!showSpinner) return null;

  // Size values
  const sizeClass = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  }[size];

  // Color values
  const colorClass = {
    primary: 'text-primary', /* Removed dark:text-primary-light */
    white: 'text-white',
    gray: 'text-text-secondary', /* Removed dark:text-text-secondary */
  }[color];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin ${sizeClass} ${colorClass}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      {text && <p className="mt-2 text-center text-sm text-text">{text}</p>} {/* Removed dark:text-text */}
    </div>
  );
}
