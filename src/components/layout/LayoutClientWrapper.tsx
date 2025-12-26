"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import IntlDynamicProvider from '@/components/providers/IntlDynamicProvider';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import ResizeObserverErrorSuppressor from '@/components/ResizeObserverErrorSuppressor';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CookieBanner from '@/components/CookieBanner';
import WebVitals from '@/components/WebVitals';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import NavigationLoaderAdvanced from '@/components/NavigationLoaderAdvanced';
import { CartProvider } from '@/components/cart/CartContext';

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isUser = pathname.startsWith("/user");
  const hideHeaderFooter = isAdmin || isUser;
  return (
    <>
      <ResizeObserverErrorSuppressor />
      <NavigationLoaderAdvanced />
      <ThemeProvider>
        <IntlDynamicProvider>
          <ErrorBoundary>
            <CartProvider>
              <LocalBusinessSchema />
              {!hideHeaderFooter && <Header />}
              <main className="min-h-screen">{children}</main>
              {!hideHeaderFooter && <Footer />}
              <CookieBanner />
            </CartProvider>
          </ErrorBoundary>
        </IntlDynamicProvider>
        <GoogleAnalytics />
        <WebVitals />
        <ServiceWorkerRegistration />
      </ThemeProvider>
    </>
  );
}
