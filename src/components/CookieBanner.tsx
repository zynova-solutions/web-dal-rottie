"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Check if user has already made cookie choices
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setShowBanner(true);
    } else {
      // Parse stored preferences
      try {
        setCookiePreferences(JSON.parse(cookieConsent));
      } catch {
        // If parsing fails, show banner again
        setShowBanner(true);
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setCookiePreferences(allAccepted);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    setCookiePreferences(necessaryOnly);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(cookiePreferences));
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handlePreferenceChange = (key: keyof typeof cookiePreferences) => {
    setCookiePreferences({
      ...cookiePreferences,
      [key]: !cookiePreferences[key]
    });
  };

  if (!showBanner && !showPreferences) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg"> {/* Removed dark:bg-background, dark:border-border */}
      {showPreferences ? (
        <div className="container mx-auto p-4 max-w-4xl">
          <h3 className="text-xl font-bold mb-4 text-text">Cookie Preferences</h3> {/* Removed dark:text-text */}
          <p className="mb-4 text-text-secondary"> {/* Removed dark:text-text-secondary */}
            You can choose which cookies you want to accept. We require technical cookies to ensure our website works properly.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-background-secondary rounded"> {/* Removed dark:bg-background-tertiary */}
              <div>
                <h4 className="font-medium text-text">Necessary Cookies</h4> {/* Removed dark:text-text */}
                <p className="text-sm text-text-secondary">These cookies are required for the website to function properly.</p> {/* Removed dark:text-text-secondary */}
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={cookiePreferences.necessary} 
                  disabled 
                  className="h-5 w-5 text-primary"
                />
                <span className="ml-2 text-sm text-text-tertiary">Always active</span> {/* Removed dark:text-text-tertiary */}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background-secondary rounded"> {/* Removed dark:bg-background-tertiary */}
              <div>
                <h4 className="font-medium text-text">Analytics Cookies</h4> {/* Removed dark:text-text */}
                <p className="text-sm text-text-secondary">
                  Help us improve our website by collecting anonymous usage information and tracking visitor interactions (menu views, reservations, directions, phone calls).
                </p> {/* Removed dark:text-text-secondary */}
              </div>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.analytics} 
                    onChange={() => handlePreferenceChange('analytics')}
                    className="h-5 w-5 text-primary rounded"
                  />
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background-secondary rounded"> {/* Removed dark:bg-background-tertiary */}
              <div>
                <h4 className="font-medium text-text">Marketing Cookies</h4> {/* Removed dark:text-text */}
                <p className="text-sm text-text-secondary">Used to track visitors across websites to display relevant advertisements.</p> {/* Removed dark:text-text-secondary */}
              </div>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.marketing} 
                    onChange={() => handlePreferenceChange('marketing')}
                    className="h-5 w-5 text-primary rounded"
                  />
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background-secondary rounded"> {/* Removed dark:bg-background-tertiary */}
              <div>
                <h4 className="font-medium text-text">Preference Cookies</h4> {/* Removed dark:text-text */}
                <p className="text-sm text-text-secondary">Allow the website to remember choices you make (such as language preferences).</p> {/* Removed dark:text-text-secondary */}
              </div>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.preferences} 
                    onChange={() => handlePreferenceChange('preferences')}
                    className="h-5 w-5 text-primary rounded"
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-end">
            <button 
              onClick={() => setShowPreferences(false)} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              onClick={savePreferences} 
              className="btn btn-primary"
            >
              Save Preferences
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm md:text-base text-text-secondary"> {/* Removed dark:text-text-secondary */}
                We use cookies to enhance your browsing experience, analyze site traffic, and track interactions like menu views, reservations, and contact events. 
                By clicking "Accept All", you consent to our use of cookies. 
                <Link href="/privacy-policy" className="text-primary hover:text-primary-dark ml-1"> {/* Removed dark:hover:text-primary-light */}
                  Read our Privacy Policy
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setShowPreferences(true)} 
                className="btn btn-secondary text-sm"
              >
                Customize
              </button>
              <button 
                onClick={acceptNecessary} 
                className="btn btn-secondary text-sm"
              >
                Reject All
              </button>
              <button 
                onClick={acceptAll} 
                className="btn btn-primary text-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieBanner;
