/**
 * Fix for ResizeObserver loop completed with undelivered notifications error
 * This is a known issue in browsers and is typically non-critical
 */

export function suppressResizeObserverErrors() {
  // Only run on client side
  if (typeof window === 'undefined') return;

  // Store the original error handler
  const originalError = window.onerror;
  
  window.onerror = (message, source, lineno, colno, error) => {
    // Check if it's a ResizeObserver error
    if (
      typeof message === 'string' &&
      message.includes('ResizeObserver loop completed with undelivered notifications')
    ) {
      // Silently ignore this error
      return true;
    }
    
    // Call the original error handler for other errors
    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }
    
    return false;
  };

  // Also handle unhandled rejections that might be related
  const originalUnhandledRejection = window.onunhandledrejection;
  
  window.onunhandledrejection = (event) => {
    if (
      event.reason &&
      typeof event.reason === 'object' &&
      event.reason.message &&
      event.reason.message.includes('ResizeObserver')
    ) {
      event.preventDefault();
      return;
    }
    
    if (originalUnhandledRejection) {
      originalUnhandledRejection.call(window, event);
    }
  };
}

// Debounced ResizeObserver wrapper to prevent excessive notifications
export class DebouncedResizeObserver {
  private observer: ResizeObserver;
  private timeoutId: NodeJS.Timeout | null = null;
  private callback: ResizeObserverCallback;
  private delay: number;

  constructor(callback: ResizeObserverCallback, delay: number = 16) {
    this.callback = callback;
    this.delay = delay;
    
    this.observer = new ResizeObserver((entries, observer) => {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      
      this.timeoutId = setTimeout(() => {
        this.callback(entries, observer);
      }, this.delay);
    });
  }

  observe(target: Element, options?: ResizeObserverOptions) {
    this.observer.observe(target, options);
  }

  unobserve(target: Element) {
    this.observer.unobserve(target);
  }

  disconnect() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.observer.disconnect();
  }
}
