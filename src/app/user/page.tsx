"use client";
import React from 'react';
import { CartProvider } from '../../components/cart/CartContext';
import CartButton from '../../components/cart/CartButton';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { FaUtensils, FaShoppingBag, FaClock, FaLeaf, FaClipboardList, FaEdit, FaLock, FaCheckCircle } from 'react-icons/fa';

function UserHomePageContent() {
  const [lang, setLang] = React.useState(() => Cookies.get('NEXT_LOCALE') || 'en');
  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
  ];
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const content = {
    en: {
      title: "Order Authentic Indian Cuisine",
      subtitle: "Fresh, flavorful, delivered to your door",
      exploreMenu: "Explore Menu",
      features: {
        quality: {
          title: "Premium Quality",
          desc: "Authentic recipes with fresh ingredients"
        },
        fast: {
          title: "Quick Delivery",
          desc: "Hot food delivered in 30-45 minutes"
        },
        easy: {
          title: "Easy Ordering",
          desc: "Simple checkout, multiple payment options"
        },
        healthy: {
          title: "Healthy Options",
          desc: "Vegetarian, vegan, and gluten-free choices"
        }
      },
      howItWorks: "How It Works",
      steps: {
        browse: { title: "Browse Menu", desc: "Explore our extensive selection of authentic Indian dishes" },
        customize: { title: "Customize Order", desc: "Add special requests and choose your spice level" },
        checkout: { title: "Secure Checkout", desc: "Pay with card, PayPal, or cash on delivery" },
        enjoy: { title: "Enjoy!", desc: "Track your order and enjoy delicious Indian cuisine" }
      }
    },
    de: {
      title: "Bestellen Sie Authentische Indische Küche",
      subtitle: "Frisch, geschmackvoll, direkt zu Ihnen nach Hause",
      exploreMenu: "Menü Erkunden",
      features: {
        quality: {
          title: "Premium Qualität",
          desc: "Authentische Rezepte mit frischen Zutaten"
        },
        fast: {
          title: "Schnelle Lieferung",
          desc: "Heißes Essen in 30-45 Minuten geliefert"
        },
        easy: {
          title: "Einfache Bestellung",
          desc: "Einfacher Checkout, mehrere Zahlungsoptionen"
        },
        healthy: {
          title: "Gesunde Optionen",
          desc: "Vegetarische, vegane und glutenfreie Optionen"
        }
      },
      howItWorks: "So Funktioniert Es",
      steps: {
        browse: { title: "Menü Durchsuchen", desc: "Entdecken Sie unsere umfangreiche Auswahl an authentischen indischen Gerichten" },
        customize: { title: "Bestellung Anpassen", desc: "Fügen Sie spezielle Wünsche hinzu und wählen Sie Ihre Schärfe" },
        checkout: { title: "Sichere Bezahlung", desc: "Bezahlen Sie mit Karte, PayPal oder bar bei Lieferung" },
        enjoy: { title: "Genießen!", desc: "Verfolgen Sie Ihre Bestellung und genießen Sie köstliche indische Küche" }
      }
    }
  };

  const handleLangSelect = (newLang: string) => {
    console.log('User page: Language changed from', lang, 'to', newLang);
    setLang(newLang);
    Cookies.set('NEXT_LOCALE', newLang, { expires: 365 });
    setDropdownOpen(false);
    
    // Dispatch event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: newLang } }));
      
      // Reload page to fetch data with new language
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const t = content[lang as 'en' | 'de'];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header - Matching main site style */}
      <header className="bg-white shadow-md flex items-center justify-between px-4 md:px-8 py-4 sticky top-0 z-20 border-b border-gray-200">
        <Link href="/user" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Dal Rotti" width={50} height={50} className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-primary" />
          <div className="flex flex-col leading-tight">
            <span className="text-xl md:text-2xl font-bold text-primary">Dal Rotti</span>
            <span className="text-xs text-gray-600">Online Ordering</span>
          </div>
        </Link>
        <div className="flex items-center gap-3 md:gap-5">
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/user/menu" className="text-gray-700 hover:text-primary transition font-medium">Menu</Link>
            <Link href="/en/about" className="text-gray-700 hover:text-primary transition font-medium">About</Link>
            <Link href="/en/contact" className="text-gray-700 hover:text-primary transition font-medium">Contact</Link>
          </nav>
          <CartButton />
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              {lang.toUpperCase()}
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-30">
                <ul className="py-1">
                  {LANGS.map((l) => (
                    <li
                      key={l.code}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm ${lang === l.code ? 'font-bold text-primary' : 'text-gray-700'}`}
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
      </header>

      {/* Hero Section - Matching main site hero */}
      <section className="relative min-h-[70vh] md:min-h-[75vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/indian-food-spread.jpg"
            alt="Authentic Indian Cuisine"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-2xl text-white max-w-4xl">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 drop-shadow-2xl text-white">
            {t.subtitle}
          </p>
          <Link href="/user/menu">
            <button className="btn btn-primary px-8 py-3 md:px-12 md:py-4 text-base md:text-lg transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-1">
              {t.exploreMenu}
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section - Matching main site services */}
      <section className="section primary-section bg-white py-12 md:py-16 border-t border-primary/10">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-2xl md:text-3xl mb-8 md:mb-12">{lang === 'en' ? 'Why Order From Dal Rotti?' : 'Warum bei Dal Rotti bestellen?'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="card p-6 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200">
              <div className="mb-4 flex justify-center">
                <FaUtensils className="text-primary text-4xl md:text-5xl" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">{t.features.quality.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{t.features.quality.desc}</p>
            </div>
            
            <div className="card p-6 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200">
              <div className="mb-4 flex justify-center">
                <FaClock className="text-primary text-4xl md:text-5xl" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">{t.features.fast.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{t.features.fast.desc}</p>
            </div>
            
            <div className="card p-6 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200">
              <div className="mb-4 flex justify-center">
                <FaShoppingBag className="text-primary text-4xl md:text-5xl" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">{t.features.easy.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{t.features.easy.desc}</p>
            </div>
            
            <div className="card p-6 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200">
              <div className="mb-4 flex justify-center">
                <FaLeaf className="text-primary text-4xl md:text-5xl" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">{t.features.healthy.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{t.features.healthy.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="my-8 md:my-12 border-t-2 border-primary/20 rounded-full w-1/2 mx-auto" />

      {/* Divider */}
      <hr className="my-8 md:my-12 border-t-2 border-primary/20 rounded-full w-1/2 mx-auto" />

      {/* How It Works Section - Matching main site style */}
      <section className="section contrast-section bg-gradient-to-br from-primary/5 via-white to-primary/10 py-12 md:py-16 border-t border-primary/10">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-2xl md:text-3xl mb-8 md:mb-12">{t.howItWorks}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: '1', icon: <FaClipboardList className="text-3xl md:text-4xl" />, data: t.steps.browse },
              { step: '2', icon: <FaEdit className="text-3xl md:text-4xl" />, data: t.steps.customize },
              { step: '3', icon: <FaLock className="text-3xl md:text-4xl" />, data: t.steps.checkout },
              { step: '4', icon: <FaCheckCircle className="text-3xl md:text-4xl" />, data: t.steps.enjoy }
            ].map((item, idx) => (
              <div key={idx} className="relative text-center bg-white p-6 md:p-8 rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-200">
                <div className="mb-4 flex justify-center text-primary">
                  {item.icon}
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {item.step}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{item.data.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{item.data.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Matching main site contrast section */}
      <section className="section contrast-section bg-white py-12 md:py-16 border-t border-primary/10 shadow-lg">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="section-title text-2xl md:text-3xl mb-4">{lang === 'en' ? 'Ready to Order?' : 'Bereit zu bestellen?'}</h2>
          <p className="text-base md:text-lg mb-6 text-gray-700">
            {lang === 'en' 
              ? 'Browse our full menu and enjoy authentic Indian cuisine delivered to your door' 
              : 'Durchsuchen Sie unser vollständiges Menü und genießen Sie authentische indische Küche, die Ihnen nach Hause geliefert wird'}
          </p>
          <Link href="/user/menu">
            <button className="btn btn-primary px-8 py-3 md:px-12 md:py-4 text-base md:text-lg">
              {lang === 'en' ? 'View Full Menu' : 'Vollständiges Menü anzeigen'}
            </button>
          </Link>
        </div>
      </section>

      {/* Footer - Matching main site footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-4 text-center border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <p className="text-sm mb-3">© 2025 Dal Rotti. {lang === 'en' ? 'All rights reserved.' : 'Alle Rechte vorbehalten.'}</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/en/imprint" className="hover:text-primary transition">
              {lang === 'en' ? 'Imprint' : 'Impressum'}
            </Link>
            <Link href="/en/contact" className="hover:text-primary transition">
              {lang === 'en' ? 'Contact' : 'Kontakt'}
            </Link>
            <Link href="/en/about" className="hover:text-primary transition">
              {lang === 'en' ? 'About Us' : 'Über Uns'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function UserHomePage() {
  return (
    <CartProvider>
      <UserHomePageContent />
    </CartProvider>
  );
}
