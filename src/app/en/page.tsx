import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { FaUtensils, FaMotorcycle, FaShoppingBag } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Dynamic imports for better performance
const DynamicElfsightWidget = dynamic(() => import('@/components/ui/DynamicElfsightWidget'), {
  loading: () => (
    <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Loading reviews...</span>
    </div>
  )
});

export const metadata: Metadata = {
  title: 'Experience Authentic Indian Flavors in Frankfurt | Dal Rotti',
  description: 'Discover the best Indian restaurant in Frankfurt am Main. Savor rich, flavorful North Indian cuisine at Dal Rotti. Dine-in, delivery, and pick-up available daily.',
  keywords: 'Dal Rotti Frankfurt, Indian restaurant Frankfurt, Indian food delivery Frankfurt, Indian takeaway, authentic Indian cuisine, lunch menu Frankfurt, cocktail hour Frankfurt, Indian catering',
};

export default function EnglishHome() {
  // Enable static rendering
  setRequestLocale('en');

  // URLs for reservation and ordering (replace with actual links if different)
  const reservationUrl = "/en/reservation";
  const orderUrl = "/user/menu";

  return (
    <div>
      {/* Hero Section */}
      <section className="hero relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 animate-zoom-fade">
          <Image
            src="/indian-food-spread.jpg"
            alt="Authentic Indian cuisine with variety of dishes from Dal Rotti"
            fill
            style={{ objectFit: 'cover' }}
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1920px"
            quality={75}
          />
          {/* Improved overlay: darker gradient for better text readability on the colorful food background */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 backdrop-blur-[1px]"></div>
        </div>
        <div className="hero-content container mx-auto px-2 sm:px-4 relative z-10 flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl text-white">
            Experience Authentic Indian Flavors in Frankfurt
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 md:mb-8 drop-shadow-2xl text-white">
            A Culinary Journey Through North Indian Cuisine — Tandoor · Curry · Biryani
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 mb-0">
            <a href={reservationUrl} className="btn btn-primary px-4 py-3 md:px-8 text-base md:text-lg transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-1 focus:ring-4 focus:ring-primary-dark">
              Reserve Your Table
            </a>
            <span className="hidden sm:inline text-white/70">|</span>
            <Link href={orderUrl} className="btn btn-secondary px-4 py-3 md:px-8 text-base md:text-lg transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-1 focus:ring-4 focus:ring-primary-dark">
              Order Now
            </Link>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="section primary-section bg-white py-8 md:py-16 border-t border-primary/10">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="section-title text-xl md:text-2xl">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-center">
            {/* Dine-In */}
            <div className="card p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg hover:shadow-lg transition-shadow hover:-translate-y-1 border border-gray-200">
              <div className="mb-4 flex justify-center">
                <FaUtensils className="text-primary text-4xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Dine-In</h3>
              <p className="text-base md:text-lg">Relax in our modern Indian kitchen with full table service.</p>
            </div>
            {/* Delivery */}
            <div className="card p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg hover:shadow-lg transition-shadow hover:-translate-y-1 border border-gray-200">
              <div className="mb-4 flex justify-center">
                <FaMotorcycle className="text-primary text-4xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Delivery</h3>
              <p className="text-base md:text-lg">Fresh, piping‑hot Indian meals delivered straight to home or office.</p>
            </div>
            {/* Pick-Up */}
            <div className="card p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg hover:shadow-lg transition-shadow hover:-translate-y-1 border border-gray-200">
              <div className="mb-4 flex justify-center">
                <FaShoppingBag className="text-primary text-4xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pick-Up</h3>
              <p className="text-base md:text-lg">Order online and collect in under 10 minutes — perfect for a quick lunch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="my-12 border-t-2 border-primary/20 rounded-full w-1/2 mx-auto" />

      {/* Current Offers Section */}
      <section className="section contrast-section bg-gradient-to-br from-primary/5 via-white to-primary/10 py-8 md:py-16 border-t border-primary/10">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="section-title text-xl md:text-2xl">Current Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Lunch Menu Offer */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-3">Lunch Menu</h3>
              <p className="text-lg mb-4">Mon–Fri • 11:30–15:00</p>
              {/* Simple PDF Preview Image */}
              <a href="/menus/Mittagsmenu Website.pdf" target="_blank" rel="noopener noreferrer" className="block">
                <div className="mb-4 h-80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <Image
                    src="/menus/Mittagsmenu Website.jpeg" 
                    alt="Lunch Menu"
                    width={300}
                    height={240}
                    className="w-full h-full object-contain bg-amber-50"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, 400px"
                    quality={70}
                  />
                </div>
              </a>
            </div>
            {/* Cocktail Hour Offer */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-3">Cocktail Hour</h3>
              <p className="text-lg mb-4">Mon–Fri • 15:00–18:00</p>
              {/* Clickable Cocktail Hour Image */}
              <a href="/menus/Happy Hour Dal Rotti.jpg" target="_blank" rel="noopener noreferrer" className="block">
                <div className="mb-4 h-80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <Image
                    src="/menus/Happy Hour Dal Rotti.jpg"
                    alt="Cocktail Hours"
                    width={300}
                    height={240}
                    className="w-full h-full object-contain bg-amber-50"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, 400px"
                    quality={70}
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Group Catering & Party Orders Section */}
      <section className="section contrast-section bg-white py-8 md:py-16 border-t border-primary/10 shadow-lg">
        <div className="container mx-auto px-2 sm:px-4 text-center max-w-4xl">
          <h2 className="section-title text-xl md:text-2xl">Group Catering & Party Orders</h2>
          <p className="text-base md:text-lg mb-4">
            Hosting a get‑together? Celebrating a birthday, anniversary or team lunch?
          </p>
          <p className="mb-6">
            Dal Rotti delivers authentic Indian cuisine for any occasion — starting from just 5 guests. Reserve a private table for up to 20 people, or let us cater your next home gathering, office meeting, kids' party, or special event.
          </p>
          <Link href="/en/catering" className="btn btn-secondary px-4 py-3 md:px-8 text-base md:text-lg">
            Request Catering Quote
          </Link>
        </div>
      </section>

      {/* What Our Guests Say Section */}
      <section className="section contrast-section bg-gradient-to-br from-primary/5 via-white to-primary/10 py-8 md:py-16 border-t border-primary/10">
        <div className="container mx-auto px-2 sm:px-4">
          {/* Google Reviews Widget Only */}
          <div className="my-8">
            <DynamicElfsightWidget 
              widgetId="1b86fd98-ff70-47c7-92cb-d1f61f26a24e"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Elfsight Instagram Feed Widget */}
          <div className="relative z-10">
            <DynamicElfsightWidget 
              widgetId="2e1d0937-6274-4288-b3a5-1f15002b7c48"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
