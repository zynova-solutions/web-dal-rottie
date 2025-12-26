"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa';
import { useTranslation } from '@/hooks/useTranslation';
import CartButton from '@/components/cart/CartButton';
import Cookies from 'js-cookie';

interface UserHeaderProps {
  className?: string;
}

export default function UserHeader({ className = '' }: UserHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Language state
  const [lang, setLang] = useState(() => Cookies.get('NEXT_LOCALE') || 'en');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Listen for language changes from other components
  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ language: string }>;
      const newLang = customEvent.detail.language;
      console.log('UserHeader: Received language change event:', newLang);
      setLang(newLang);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);
  
  // Refs for click outside handling
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // User authentication state
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
  ];

  // Check authentication status
  useEffect(() => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push('/user/menu');
  };

  // Handle language selection
  const handleLangSelect = (newLang: string) => {
    console.log('Language changed from', lang, 'to', newLang);
    setLang(newLang);
    Cookies.set('NEXT_LOCALE', newLang, { expires: 365 });
    setDropdownOpen(false);
    
    // Dispatch event to notify components of language change
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: newLang } }));
      
      // Reload page to fetch data with new language
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  // Handle click outside to close menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    
    if (dropdownOpen || userMenuOpen || mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, userMenuOpen, mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`bg-white shadow-md sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Dal Rotti Logo"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#7a1313]"
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#7a1313]">
              Dal Rotti
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-6">
              <Link 
                href="/user/menu" 
                className={`font-semibold hover:underline transition ${
                  pathname === '/user/menu' ? 'text-[#7a1313]' : 'text-gray-700 hover:text-[#7a1313]'
                }`}
              >
                {t('common.menu')}
              </Link>
              <Link 
                href="/user/store-info" 
                className={`font-semibold hover:underline transition ${
                  pathname === '/user/store-info' ? 'text-[#7a1313]' : 'text-gray-700 hover:text-[#7a1313]'
                }`}
              >
                {t('common.about')}
              </Link>

              {/* User Menu or Sign In */}
              {isLoggedIn && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 font-semibold text-[#7a1313] border border-[#7a1313] px-4 py-2 rounded-full hover:bg-[#7a1313] hover:text-white transition"
                  >
                    <FaUser className="text-sm" />
                    <span className="hidden sm:inline">{user.name || 'Account'}</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <ul className="py-1">
                        <li>
                          <Link
                            href="/user/orders"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FaShoppingBag />
                            <span>My Orders</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/user/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <FaUser />
                            <span>Profile</span>
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <FaSignOutAlt />
                            <span>Sign Out</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/user/signin" 
                  className="font-semibold text-[#7a1313] border border-[#7a1313] px-4 py-2 rounded-full hover:bg-[#7a1313] hover:text-white transition"
                >
                  <span className="hidden sm:inline">Sign In / Sign Up</span>
                  <span className="sm:hidden">Sign In</span>
                </Link>
              )}
            </nav>

            {/* Cart Button */}
            <CartButton />

            {/* Language Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="text-sm font-medium">
                  {LANGS.find((l) => l.code === lang)?.label}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <ul className="py-1">
                    {LANGS.map((l) => (
                      <li
                        key={l.code}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                          lang === l.code ? 'font-bold text-[#7a1313] bg-red-50' : ''
                        }`}
                        onClick={() => handleLangSelect(l.code)}
                      >
                        {l.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Controls */}
          <div className="md:hidden flex items-center gap-2">
            <CartButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-[#7a1313] hover:bg-gray-100 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && ( 
          <div 
            ref={mobileMenuRef}
            className="lg:hidden fixed top-[60px] left-0 w-full h-[calc(100vh-60px)] bg-white border-t border-gray-100 shadow-lg overflow-y-auto z-40 animate-slide-down"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Navigation Links */}
              <nav className="py-6 space-y-5">
                <Link
                  href="/user/menu"
                  className={`block px-4 py-3 rounded-lg font-semibold transition ${
                    pathname === '/user/menu' 
                      ? 'text-[#7a1313]' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('common.menu')}
                </Link>
                <Link
                  href="/user/store-info"
                  className={`block px-4 py-3 rounded-lg font-semibold transition ${
                    pathname === '/user/store-info' 
                      ? 'text-[#7a1313]' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('common.about')}
                </Link>
              </nav>

              {/* User Account Section */}
              {isLoggedIn && user ? (
                <div className="border-t pt-4">
                  <div className="px-4 py-2 bg-gray-50 rounded-lg mb-2">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/user/orders"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaShoppingBag />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      href="/user/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUser />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FaSignOutAlt />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 px-4">
                  <Link
                    href="/user/signin"
                    className="block w-full text-center bg-[#7a1313] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#a31a1a] transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In / Sign Up
                  </Link>
                </div>
              )}

              {/* Language Selector */}
              <div className="border-t pt-4 px-4 mt-4">
                <p className="text-sm font-semibold text-gray-600 my-4 px-4">Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        handleLangSelect(l.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        lang === l.code
                          ? 'bg-[#7a1313] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
