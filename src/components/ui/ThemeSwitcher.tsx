'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="p-2 rounded-md text-text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {theme === 'dark' ? (
        <FaSun className="h-5 w-5 text-primary" />
      ) : (
        <FaMoon className="h-5 w-5 text-primary" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
