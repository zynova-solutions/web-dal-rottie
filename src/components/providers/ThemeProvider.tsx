'use client';

import { createContext, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  // toggleTheme is removed as per requirement
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default theme is now always 'light'
  const theme: Theme = 'light'; 

  useEffect(() => {
    // Always apply the light theme on mount
    updateTheme('light');
    // Remove theme from local storage if it exists
    localStorage.removeItem('theme'); 
  }, []);

  const updateTheme = (newTheme: Theme) => {
    // Simplified updateTheme, only handles light theme application
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  };

  // toggleTheme function is removed

  return (
    // Provide only the theme, which is always 'light'
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
