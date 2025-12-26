'use client';

import { useEffect, useState } from 'react';
import Container from './Container';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      // Filter out ResizeObserver errors as they are non-critical
      if (error.message.includes('ResizeObserver loop completed with undelivered notifications')) {
        // Silently ignore this error as it's a known browser issue
        return;
      }
      
      // Filter out other non-critical errors
      if (error.message.includes('ResizeObserver loop limit exceeded')) {
        return;
      }

      console.error('Caught in error boundary:', error);
      setHasError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Only set error state for critical issues
      if (event.reason && typeof event.reason === 'object' && event.reason.critical) {
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <Container>
        <div className="mx-auto max-w-lg rounded-lg bg-error/10 p-6 text-center"> {/* Removed dark:bg-error/20 */}
          <h2 className="mb-3 text-xl font-semibold text-error"> {/* Removed dark:text-error-light */}
            Something went wrong
          </h2>
          <p className="mb-4 text-text"> {/* Removed dark:text-text */}
            We apologize for the inconvenience. Please try refreshing the page or contact us if the problem persists.
          </p>
          <button
            className="rounded bg-error hover:bg-error/90 px-4 py-2 text-white transition" /* Removed dark: classes */
            onClick={() => {
              setHasError(false);
              window.location.reload();
            }}
          >
            Refresh Page
          </button>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
}
