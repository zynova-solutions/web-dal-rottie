// Prevent ResizeObserver errors from being thrown
// This script should be loaded as early as possible

(function() {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  // Store original console.error to avoid suppressing all errors
  const originalConsoleError = console.error;
  
  // Override console.error to filter ResizeObserver errors
  console.error = function(...args) {
    const message = args[0];
    
    if (
      typeof message === 'string' &&
      (message.includes('ResizeObserver loop completed with undelivered notifications') ||
       message.includes('ResizeObserver loop limit exceeded'))
    ) {
      // Silently ignore ResizeObserver errors
      return;
    }
    
    // Log all other errors normally
    originalConsoleError.apply(console, args);
  };

  // Also handle the error event
  const originalOnError = window.onerror;
  
  window.onerror = function(message, source, lineno, colno, error) {
    if (
      typeof message === 'string' &&
      message.includes('ResizeObserver loop completed with undelivered notifications')
    ) {
      return true; // Prevent the error from being thrown
    }
    
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    
    return false;
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    if (
      event.reason &&
      typeof event.reason === 'object' &&
      event.reason.message &&
      event.reason.message.includes('ResizeObserver')
    ) {
      event.preventDefault();
    }
  });
})();
