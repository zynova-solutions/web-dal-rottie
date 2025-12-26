"use client";

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocale, useTranslations } from 'next-intl'; 
import { useTheme } from '@/components/providers/ThemeProvider';
import { trackPhoneCall, trackOrderOnline } from '@/utils/analytics';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('common');
  useTheme();
  
  const langPrefix = `/${locale}`;

  // Determine if we're on a page that should have a transparent header when at the top
  // (only pages with proper hero image backgrounds)
  useEffect(() => {
    // List of pages that have proper dark hero images (without leading slash)
    // Only include pages that have dark hero images with good contrast for white text
    const pagesWithDarkHero = ['', '/', 'about', 'catering', 'contact', 'blog', 'menu', 'reservation'];
    
    // Extract the path without the locale prefix
    let pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    // Remove leading slash for comparison (except for home page)
    if (pathWithoutLocale !== '/' && pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = pathWithoutLocale.substring(1);
    }
    
    // Check if the path (without locale and without leading slash) is in our list
    const hasTransparentHeader = pagesWithDarkHero.includes(pathWithoutLocale);
    
    setIsTransparent(hasTransparentHeader);
  }, [pathname, locale]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle document body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prevState => !prevState);
  }, []);

  const isActivePath = (path: string) => {
    // Exact match for home page
    if (path === `/${locale}` && pathname === `/${locale}`) {
      return true;
    }
    
    // For other pages, ensure we're not matching parent paths
    if (path !== `/${locale}`) {
      // Check if the current path exactly matches the nav item path
      // or if it's a direct child of the path (like /en/menu/category)
      const pathWithoutLang = pathname.replace(`/${locale}`, '');
      const navPathWithoutLang = path.replace(`/${locale}`, '');
      
      // Match exact path or direct child paths
      return pathWithoutLang === navPathWithoutLang || 
             (pathWithoutLang.startsWith(navPathWithoutLang + '/') && 
              navPathWithoutLang !== '');
    }
    
    return false;
  };

  const navItems = [
    { name: 'Home', path: `${langPrefix}` },
    { name: 'About', path: `${langPrefix}/about` },
    { name: 'Menu', path: `${langPrefix}/menu` },
    { name: 'Reservation', path: `${langPrefix}/reservation` },
    { name: 'Catering', path: `${langPrefix}/catering` }
  ].map(item => ({
    ...item,
    name: t(item.name.toLowerCase())
  }));

  // Determine header theme based on scroll position and if we're on a transparent page
  const useTransparentHeader = isTransparent && !isScrolled && !isMenuOpen;
  const headerVariant = useTransparentHeader ? 'light' : 'dark';
  
  // Dynamic classes based on header variant
  const headerBgClass = useTransparentHeader
    ? 'bg-transparent' 
    : 'bg-white shadow-lg shadow-black/5';
  
  const navItemColorClass = useTransparentHeader
    ? 'text-white/90 hover:text-white'
    : 'text-gray-700 hover:text-primary';
  
  const activeNavItemColorClass = useTransparentHeader
    ? 'text-white'
    : 'text-primary';
  
  const navItemUnderlineClass = useTransparentHeader
    ? 'bg-white'
    : 'bg-primary';

  const phoneColor = useTransparentHeader
    ? 'text-white/90 hover:text-white'
    : 'text-gray-700 hover:text-primary';
    
  const dividerColor = useTransparentHeader
    ? 'border-white/20'
    : 'border-gray-200';

  return (
    <header 
      className={`
        fixed w-full top-0 z-50 
        ${headerBgClass}
        transition-all duration-300 ease-in-out
      `}
    >
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <Logo variant={headerVariant} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  relative py-2 text-sm font-medium whitespace-nowrap
                  ${navItemColorClass}
                  transition-colors duration-200
                  group
                  ${isActivePath(item.path) ? activeNavItemColorClass : ''}
                `}
              >
                {item.name}
                <span className={`
                  absolute bottom-0 left-0 w-full h-0.5
                  ${navItemUnderlineClass}
                  transform origin-left scale-x-0
                  transition-transform duration-200 ease-out
                  group-hover:scale-x-100
                  ${isActivePath(item.path) ? 'scale-x-100' : ''} 
                `} />
              </Link>
            ))}
            {/* Phone number with onClick event */}
            <a
              href="tel:06930036126"
              className={`flex items-center text-sm font-medium ${phoneColor} transition-colors duration-200 group`}
              onClick={() => {
                trackPhoneCall('header');
                if (typeof window !== 'undefined') {
                  window.location.href = 'tel:06930036126';
                }
              }}
              style={{ whiteSpace: 'nowrap' }}
            >
              <span role="img" aria-label="Phone" className={`mr-2 ${useTransparentHeader ? 'bg-white/20' : 'bg-primary/10'} p-1.5 rounded-full ${useTransparentHeader ? 'text-white' : 'text-primary'} group-hover:bg-opacity-30 transition-all`}>📞</span>
              069 30036126
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/user/menu"
              className={`
                ${useTransparentHeader 
                  ? 'bg-white text-primary hover:bg-white/90' 
                  : 'bg-primary text-white hover:bg-primary-dark'}
                px-3 py-1.5 rounded-full
                transform hover:scale-105
                transition-all duration-200 ease-out
                shadow-sm hover:shadow-md
                font-medium text-xs sm:text-sm whitespace-nowrap
              `}
              onClick={() => trackOrderOnline('header')}
            >
              {t('orderOnline')} 
            </Link>
            <div className={`flex items-center space-x-3 border-l pl-4 ${dividerColor}`}>
              <LanguageSwitcher variant={headerVariant} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`
              lg:hidden p-2 rounded-full
              ${useTransparentHeader 
                ? 'text-white hover:bg-white/20'
                : 'text-primary hover:bg-primary/10'}
              transition-all duration-200
              focus:outline-none focus:ring-2 ${useTransparentHeader ? 'focus:ring-white' : 'focus:ring-primary'}
              relative z-50
              flex items-center justify-center
              w-8 h-8
            `}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div 
          className="
            lg:hidden 
            fixed top-[60px] left-0 w-full h-[calc(100vh-60px)]
            bg-white 
            border-t border-gray-100
            shadow-lg
            overflow-y-auto
            z-40
            animate-slide-down
          "
        >
          <nav className="container mx-auto px-4 py-6 space-y-5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  block text-lg font-medium py-3 px-4
                  rounded-lg transition-all duration-200
                  ${isActivePath(item.path) 
                    ? 'text-primary bg-primary/10 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'}
                `}
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="tel:06930036126"
              className="flex items-center text-lg font-medium py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-200"
              onClick={() => {
                trackPhoneCall('mobile_header');
                if (typeof window !== 'undefined') {
                  window.location.href = 'tel:06930036126';
                }
                toggleMenu();
              }}
            >
              <span role="img" aria-label="Phone" className="mr-3 bg-primary/10 p-1.5 rounded-full text-primary">📞</span>
              069 30036126
            </a>
            <Link
              href="/user/menu"
              className="
                block w-full text-center
                bg-primary hover:bg-primary-dark text-white
                px-6 py-3 mt-6 rounded-xl
                transition-all duration-200
                shadow-md hover:shadow-lg
                font-semibold
              "
              onClick={() => {
                trackOrderOnline('mobile_header');
                toggleMenu();
              }}
            >
              {t('orderOnline')}
            </Link>
            <div className="pt-6 mt-6 border-t border-gray-100 flex justify-center">
              <LanguageSwitcher variant="dark" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
