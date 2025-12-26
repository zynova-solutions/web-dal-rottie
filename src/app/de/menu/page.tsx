import { Metadata } from 'next';
import Image from 'next/image';
import MenuComponent from '@/components/menu/MenuComponent';
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Nordindische Speisekarte bei Dal Rotti | Authentische Aromen in Frankfurt',
  description: 'Entdecken Sie die nordindische Speisekarte von Dal Rotti in Frankfurt. Von vegetarischen Gerichten bis zu traditionellen Punjabi-Thalis – unsere Speisekarte feiert authentische indische Aromen.',
  keywords: 'Dal Rotti Speisekarte, Indische Speisekarte Frankfurt, Indisches Restaurant Speisekarte, Tandoori Menü, Curry Menü, Biryani Menü, veganes indisches Essen, vegetarisches indisches Essen, indische Cocktails, Mango Lassi, Masala Chai',
};

export default function MenuDE() {
  // Enable static rendering
  setRequestLocale('de');

  return (
    <div>
      {/* Hero Section */}
      <section className="hero relative h-[30vh] sm:h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/blog/indian-healthy-food.jpg"
            alt="Authentische indische Gerichte bei Dal Rotti"
            fill
            style={{ objectFit: 'cover' }}
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 backdrop-blur-[1px]"></div>
        </div>
        <div className="hero-content container mx-auto px-4 relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">Unsere Speisekarte</h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto">
            Entdecken Sie authentische nordindische Küche mit einer Fusion aus Aromen
          </p>
        </div>
      </section>

      {/* Menu Component */}
      <section className="section primary-section py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="bg-background-secondary rounded-xl shadow-lg p-3 sm:p-6 md:p-8 pt-4 sm:pt-6 md:pt-8">
            <MenuComponent />
          </div>
        </div>
      </section>
    </div>
  );
}
