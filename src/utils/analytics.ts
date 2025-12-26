/**
 * Analytics utility for tracking user interactions
 * This implementation respects GDPR and only tracks events if user has consented
 */

type EventCategory = 'menu' | 'reservation' | 'contact' | 'directions' | 'order' | 'social';

type EventData = {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
};

/**
 * Check if analytics tracking is allowed based on user's cookie consent
 */
const isTrackingAllowed = (): boolean => {
  try {
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) return false;
    
    const preferences = JSON.parse(cookieConsent);
    return preferences.analytics === true;
  } catch (error) {
    console.error('Error checking tracking consent:', error);
    return false;
  }
};

/**
 * Track an event if the user has given consent
 * This function can be extended to integrate with Google Analytics, Facebook Pixel, etc.
 */
export const trackEvent = (data: EventData): void => {
  if (!isTrackingAllowed()) {
    console.log('Event tracking skipped - user has not provided consent');
    return;
  }

  try {
    // Log event to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('EVENT TRACKED:', data);
    }

    // Google Analytics tracking (GA4)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-expect-error - gtag is added by the GA script and not typed
      window.gtag('event', data.action, {
        event_category: data.category,
        event_label: data.label,
        value: data.value
      });
    }
    
    // Add other analytics providers as needed
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

/**
 * Pre-defined tracking functions for common events
 */
export const trackMenuView = (menuType: string) => {
  trackEvent({
    category: 'menu',
    action: 'view',
    label: menuType
  });
};

export const trackReservation = (source: string) => {
  trackEvent({
    category: 'reservation',
    action: 'click',
    label: source
  });
};

export const trackPhoneCall = (source: string) => {
  trackEvent({
    category: 'contact',
    action: 'call',
    label: source
  });
};

export const trackGetDirections = (source: string) => {
  trackEvent({
    category: 'directions',
    action: 'click',
    label: source
  });
};

export const trackOrderOnline = (source: string) => {
  trackEvent({
    category: 'order',
    action: 'click',
    label: source
  });
};

export const trackSocialMedia = (platform: string, source: string) => {
  trackEvent({
    category: 'social',
    action: 'click',
    label: `${platform}_${source}`
  });
}; 