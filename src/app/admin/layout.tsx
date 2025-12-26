"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';

const NotAuthenticated = dynamic(() => import('./not-authenticated'), { ssr: false });

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/menu', label: 'Menu' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/reports', label: 'Reports' },
  { href: '/admin/coupons', label: 'Coupons' },
  // { href: '/admin/loyalty', label: 'Loyalty' },
  // { href: '/admin/inventory', label: 'Inventory' },
  // { href: '/admin/zones', label: 'Zones' },
  { href: '/admin/settings', label: 'Settings' },
  // { href: '/admin/roles', label: 'Roles' },
  // { href: '/admin/notifications', label: 'Notifications' },
  // { href: '/admin/backup', label: 'Backup/Export' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hideNav = pathname === '/admin' ;
  const isAuthPage = pathname === '/admin';
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dalrotti_admin_token');
      sessionStorage.removeItem('dalrotti_admin_auth');
    }
    router.push('/admin');
  };
  
  useEffect(() => {
    if (!isAuthPage) {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('dalrotti_admin_token') : null;
      setIsAuthenticated(!!token);
      // Get role from sessionStorage
      const auth = typeof window !== 'undefined' ? sessionStorage.getItem('dalrotti_admin_auth') : null;
      if (auth) {
        try {
          const parsed = JSON.parse(auth);
          setRole(parsed.user?.role || null);
        } catch {
          setRole(null);
        }
      } else {
        setRole(null);
      }
    }
  }, [pathname, isAuthPage]);

  // Handle click outside to close mobile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Filter nav items based on role
  let filteredNavItems = navItems;
  if (role === 'staff') {
    filteredNavItems = navItems.filter(item =>
      item.label === 'Orders' || item.label === 'Settings'
    );
  } else if (role === 'manager') {
    filteredNavItems = navItems.filter(item =>
      item.label === 'Dashboard' || 
      item.label === 'Menu' || 
      item.label === 'Orders' || 
      item.label === 'Customers'
    );
  }

  if (!isAuthPage && !isAuthenticated) {
    return <NotAuthenticated />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideNav && (
        <>
          {/* Desktop Navigation */}
          <nav className="relative bg-[#7a1313] text-white px-4 sm:px-6 py-3 shadow-lg rounded-b-2xl border-b-4 border-[#a31e1e]">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3 select-none">
                <Image
                  src="/images/logo.png"
                  alt="Dal Rotti Logo"
                  width={36}
                  height={36}
                  className="rounded-full shadow border-2 border-white bg-white"
                />
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white drop-shadow">
                  <span className="hidden sm:inline">Dal Rotti Admin</span>
                  <span className="sm:hidden">Admin</span>
                </span>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex flex-wrap gap-3">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-300 ${
                      pathname === item.href
                        ? 'bg-white/20 text-yellow-200'
                        : 'text-white/90 hover:bg-white/10 hover:text-yellow-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Right side controls */}
              <div className="flex items-center gap-3">
                {/* Desktop Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden sm:block px-4 py-1.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Logout
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-150"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div 
                ref={mobileMenuRef}
                className="lg:hidden absolute top-[80px] left-0 right-0 bg-[#7a1313] border-t border-white/20 z-50"
              >
                <div className="px-4 py-4 space-y-2">
                  {filteredNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-150 ${
                        pathname === item.href
                          ? 'bg-white/20 text-yellow-200'
                          : 'text-white/90 hover:bg-white/10 hover:text-yellow-200'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {/* Mobile Logout Button */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full mt-4 px-4 py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-150"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </nav>
        </>
      )}
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
