import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { FaUtensils, FaMotorcycle, FaShoppingBag } from 'react-icons/fa';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Entdecken Sie das beste indisches Restaurant in Frankfurt | Dal Rotti',
  description: 'Genießen Sie authentische nordindische Küche in Frankfurt. Dal Rotti bietet leckere Gerichte, die Sie lieben werden. Reservieren Sie jetzt!',
};

export default function GermanHome() {
  // Enable static rendering
  setRequestLocale('de');

  // URLs for reservation and ordering (replace with actual links if different)
  const reservationUrl = "/de/reservation";
  const orderUrl = "/user/menu";

  return (
    <div>
      {/* Hero Section */}
      <section className="hero relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 animate-zoom-fade">
          <Image
            src="/indian-food-spread.jpg"
            alt="Leckeres indisches Essen von Dal Rotti"
            fill
            style={{ objectFit: 'cover' }}
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            sizes="100vw"
            quality={90}
          />
          {/* Improved overlay: darker gradient for better text readability on the colorful food background */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 backdrop-blur-[1px]"></div>
        </div>
        <div className="hero-content container mx-auto px-2 sm:px-4 relative z-10 flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl text-white">
            Erleben Sie authentische indische Aromen in Frankfurt
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 md:mb-8 drop-shadow-2xl text-white">
            Eine kulinarische Reise durch die nordindische Küche — Tandoor · Curry · Biryani
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4">
            <a href={reservationUrl} className="btn btn-primary px-4 py-3 md:px-8 text-base md:text-lg transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-1 focus:ring-4 focus:ring-primary-dark">
              Tisch reservieren
            </a>
            <span className="hidden sm:inline text-white/70">|</span>
            <Link href={orderUrl} className="btn btn-secondary px-4 py-3 md:px-8 text-base md:text-lg transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-1 focus:ring-4 focus:ring-primary-dark">
              Jetzt bestellen
            </Link>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="section primary-section bg-white py-8 md:py-16 border-t border-primary/10">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="section-title text-xl md:text-2xl">Unsere Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-center">
            {/* Vor Ort essen */}
            <div className="card p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg hover:shadow-lg transition-shadow hover:-translate-y-1 border border-gray-200">
              <div className="mb-4 flex justify-center">
                <FaUtensils className="text-primary text-4xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Vor Ort essen</h3>
              <p className="text-base md:text-lg">Entspannen Sie in unserer modernen indischen Küche mit vollem Tischservice.</p>
            </div>
            {/* Lieferung */}
            <div className="card p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg hover:shadow-lg transition-shadow hover:-translate-y-1 border border-gray-200">
              <div className="mb-4 flex justify-center">
                <FaMotorcycle className="text-primary text-4xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lieferung</h3>
              <p className="text-base md:text-lg">Frische, heiße indische Gerichte direkt nach Hause oder ins Büro geliefert.</p>
            </div>
            {/* Abholung */}
            <div className="card p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg hover:shadow-lg transition-shadow hover:-translate-y-1 border border-gray-200">
              <div className="mb-4 flex justify-center">
                <FaShoppingBag className="text-primary text-4xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Abholung</h3>
              <p className="text-base md:text-lg">Online bestellen und in unter 10 Minuten abholen – perfekt für ein schnelles Mittagessen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="my-12 border-t-2 border-primary/20 rounded-full w-1/2 mx-auto" />

      {/* Aktuelle Angebote Section */}
      <section className="section contrast-section bg-gradient-to-br from-primary/5 via-white to-primary/10 py-8 md:py-16 border-t border-primary/10">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="section-title text-xl md:text-2xl">Aktuelle Angebote</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Lunch Menu Offer */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-3">Mittagsmenü</h3>
              <p className="text-lg mb-4">Mo–Fr • 11:30–15:00 Uhr</p>
              {/* Simple PDF Preview Image */}
              <a href="/menus/Mittagsmenu Website.pdf" target="_blank" rel="noopener noreferrer" className="block">
                <div className="mb-4 h-80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <Image
                    src="/menus/Mittagsmenu Website.jpeg" 
                    alt="Mittagsmenü"
                    width={600}
                    height={500}
                    className="w-full h-full object-contain bg-amber-50"
                    unoptimized
                  />
                </div>
              </a>
            </div>
            {/* Cocktail Hour Offer */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-3">Cocktail-Stunde</h3>
              <p className="text-lg mb-4">Mo–Fr • 15:00–18:00</p>
              {/* Clickable Cocktail Hour Image */}
              <a href="/menus/Happy Hour Dal Rotti.jpg" target="_blank" rel="noopener noreferrer" className="block">
                <div className="mb-4 h-80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <Image
                    src="/menus/Happy Hour Dal Rotti.jpg"
                    alt="Cocktail-Stunden"
                    width={600}
                    height={500}
                    className="w-full h-full object-contain bg-amber-50"
                    unoptimized
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
          <h2 className="section-title text-xl md:text-2xl">Gruppen-Catering & Party-Bestellungen</h2>
          <p className="text-base md:text-lg mb-4">
            Planen Sie ein Treffen? Feiern Sie einen Geburtstag, ein Jubiläum oder ein Team-Mittagessen?
          </p>
          <p className="mb-6">
            Dal Rotti liefert authentische indische Küche für jeden Anlass – schon ab 5 Gästen. Reservieren Sie einen privaten Tisch für bis zu 20 Personen oder lassen Sie uns Ihr nächstes Treffen zu Hause, Büromeeting, Kinderfest oder besonderes Event beliefern.
          </p>
          <Link href="/de/catering" className="btn btn-secondary px-4 py-3 md:px-8 text-base md:text-lg">
            Catering-Angebot anfordern
          </Link>
        </div>
      </section>

      {/* What Our Guests Say Section */}
      <section className="section contrast-section bg-gradient-to-br from-primary/5 via-white to-primary/10 py-8 md:py-16 border-t border-primary/10">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="my-8">
            <Script src="https://static.elfsight.com/platform/platform.js" strategy="lazyOnload" />
            <div className="elfsight-app-1b86fd98-ff70-47c7-92cb-d1f61f26a24e" data-elfsight-app-lazy></div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Elfsight Instagram Feed Widget */}
          <div className="relative z-10">
            <Script src="https://static.elfsight.com/platform/platform.js" strategy="lazyOnload" />
            <div className="elfsight-app-2e1d0937-6274-4288-b3a5-1f15002b7c48" data-elfsight-app-lazy></div>
          </div>
        </div>
      </section>
    </div>
  );
}
