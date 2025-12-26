"use client";
import React from 'react';
import Footer from '@/components/layout/Footer';
// Removed CartProvider import as it's now in the root layout

export default function UserLayout({ children }: { children: React.ReactNode }) {
  console.log('UserLayout rendering');

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f2]">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
