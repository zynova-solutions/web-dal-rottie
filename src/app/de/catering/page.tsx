import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SEO from '@/components/SEO';
import { setRequestLocale } from 'next-intl/server';
import { FaMotorcycle, FaAward } from 'react-icons/fa';
import { GiHotMeal, GiCupcake } from 'react-icons/gi';
import { TbToolsKitchen2 } from 'react-icons/tb';

export const metadata: Metadata = {
  title: 'Indisches Catering Frankfurt - Dal Rotti | Events & Feiern',
  description: 'Dal Rotti Frankfurt bietet authentisches indisches Catering für Geschäftsessen, private Feiern, Hochzeiten und Gemeinschaftsveranstaltungen. Anpassbare Menüs & zuverlässige Lieferung.',
  keywords: 'Indisches Catering Frankfurt, Dal Rotti Catering, Event Catering, Party Lieferservice, Firmen Catering Indien, Hochzeit Catering Indisch, Gemeinschaftsveranstaltung Essen, Indisches Essen Lieferung Frankfurt',
  alternates: {
    languages: {
      'en-US': '/en/catering',
      'de-DE': '/de/catering',
    },
  },
};

export default function CateringDE() {
  // Enable static rendering
  setRequestLocale('de');

  return (
    <>
      <SEO
        title="Catering Services - Dal Rotti | Authentisches Indisches Catering"
        description="Dal Rotti bietet authentischen indischen Catering-Service in Frankfurt für alle Arten von Veranstaltungen."
        keywords="Dal Rotti Catering, Indischer Catering-Service, Event Catering Frankfurt"
      />
      
      {/* Hero Section - Mobile Optimized */}
      <section className="hero relative min-h-[40vh] sm:min-h-[45vh] md:min-h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/catering-hero.jpg"
            alt="Dal Rotti Catering"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-black/50 md:bg-black/40"></div>
        </div>
        <div className="hero-content container mx-auto px-4 py-12 relative z-10">
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center">Dal Rotti Frankfurt Catering</h1>
          <p className="mx-auto mb-6 sm:mb-8 max-w-2xl text-base sm:text-lg text-white text-center font-light">
            Erleben Sie die vielfältigen Aromen Indiens auf Ihrem nächsten Event. Von klassischen Biryanis bis hin zu herzhaften Currys – Dal Rotti bringt authentische indische Küche direkt zu Ihrer Feier.
          </p>
          <div className="flex justify-center">
            <Link
              href="#kontakt-formular"
              className="btn btn-primary px-6 py-3 text-base sm:text-lg"
            >
              Angebot anfordern
            </Link>
          </div>
        </div>
      </section>

      {/* Food Supply Section - Mobile Optimized */}
      <section className="section primary-section py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl mb-3">Speisenangebot nach Maß</h2>
          <p className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto text-base sm:text-lg">
            Unser Catering-Service unterstützt Ihre Veranstaltung mit einer vielseitigen Auswahl an Menüoptionen, die die wahre Essenz der indischen Küche einfangen. Wählen Sie das Format, das am besten zu Ihrem Anlass passt:
          </p>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="bg-gradient-to-b from-primary/5 to-white p-5 sm:p-6 md:p-8 rounded-lg border-l-4 border-primary shadow-sm hover:shadow-md transition-all">
              <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-primary flex items-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center mr-3 shadow-sm text-sm sm:text-base">1</span>
                Geschäftsessen
              </h3>
              <p className="text-sm sm:text-base">
                Genießen Sie einen reibungslosen und zuverlässigen Service für Ihre Treffen am Arbeitsplatz. Wir liefern herzhafte, 
                authentische indische Gerichte direkt in Ihr Büro – ideal, um Kunden zu beeindrucken oder Ihr Team bei Besprechungen zu stärken.
              </p>
            </div>
            <div className="bg-gradient-to-b from-primary/5 to-white p-5 sm:p-6 md:p-8 rounded-lg border-l-4 border-primary shadow-sm hover:shadow-md transition-all">
              <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-primary flex items-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center mr-3 shadow-sm text-sm sm:text-base">2</span>
                Private Feiern
              </h3>
              <p className="text-sm sm:text-base">
                Ob Geburtstage, Babypartys, Gender-Reveal-Partys, Einweihungsfeiern, Hochzeiten oder andere besondere Anlässe – 
                unser Speisenangebot wertet Ihre Feier auf. Sie entscheiden, ob Sie Ihre Bestellung liefern lassen oder abholen möchten.
              </p>
            </div>
            <div className="bg-gradient-to-b from-primary/5 to-white p-5 sm:p-6 md:p-8 rounded-lg border-l-4 border-primary shadow-sm hover:shadow-md transition-all">
              <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-primary flex items-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center mr-3 shadow-sm text-sm sm:text-base">3</span>
                Gemeinschaftsevents
              </h3>
              <p className="text-sm sm:text-base">
                Veranstalten Sie ein lokales Event – wie eine Valentinstagsfeier, einen Musikabend, eine Comedy-Show oder eine andere Zusammenkunft? 
                Lassen Sie Dal Rotti Ihre Veranstaltung mit unseren typischen Gerichten unterstützen und stellen Sie sicher, 
                dass jeder Gast den echten Geschmack indischen Essens erlebt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customizable Menu Options Section - Mobile Optimized */}
      <section className="section contrast-section bg-gradient-to-br from-primary/5 via-white to-primary/10 py-10 sm:py-12 md:py-16 border-t border-primary/10">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl mb-3">Individuell anpassbare Menüoptionen</h2>
          <p className="text-center mb-6 sm:mb-10 max-w-3xl mx-auto text-base sm:text-lg">
            Wir bieten eine Reihe flexibler Catering-Lösungen, die auf Ihr Budget und die Größe Ihrer Veranstaltung zugeschnitten sind:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 text-center hover:shadow-lg transition-all">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <GiHotMeal className="text-primary text-3xl sm:text-4xl" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-primary">Komplette Menüteller</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                Genießen Sie ein vollständiges kulinarisches Erlebnis mit einer Auswahl an traditionellen Currys, frisch gebackenem Brot und herzhaften Beilagen.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 text-center hover:shadow-lg transition-all">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <GiCupcake className="text-primary text-3xl sm:text-4xl" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-primary">Fingerfood-Auswahl</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                Ideal für gesellige Anlässe, bei denen kleine Häppchen perfekt zum Austauschen und Probieren verschiedener Geschmacksrichtungen sind.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 text-center hover:shadow-lg transition-all sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none md:mx-0">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <TbToolsKitchen2 className="text-primary text-3xl sm:text-4xl" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-primary">Kombinationsmenüs</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                Stellen Sie Ihr Menü individuell zusammen – zum Beispiel ein Hauptgericht mit einer Auswahl an Vorspeisen und einem köstlichen Dessert für eine ausgewogene Mahlzeit.
              </p>
            </div>
          </div>
          
          <p className="text-center mt-6 sm:mt-10 max-w-3xl mx-auto italic text-sm sm:text-base">
            Unsere kulinarischen Experten passen das Menü gerne nach Ihren Wünschen an, damit jede Bestellung Ihren Geschmack und Ihre Qualitätsansprüche erfüllt.
          </p>
        </div>
      </section>

      {/* Reliable & Convenient Service Section - Mobile Optimized */}
      <section className="section primary-section py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl mb-3">Zuverlässiger & bequemer Service</h2>
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-8 bg-white rounded-xl shadow-sm p-5 sm:p-6 md:p-8 transition-all hover:shadow-md">
              <div className="mb-4 md:mb-0 md:w-1/4 flex justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaMotorcycle className="text-primary text-4xl sm:text-5xl md:text-6xl" />
                </div>
              </div>
              <div className="md:w-3/4 text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Flexible Lieferoptionen</h3>
                <p className="text-sm sm:text-base">Wählen Sie zwischen prompter Lieferung zu Ihrem Veranstaltungsort oder bequemer Abholung, je nach Größe Ihrer Veranstaltung und Ihrem Zeitplan. Wir stellen sicher, dass Ihr Essen pünktlich und in perfektem Zustand ankommt, egal ob Sie zu Hause, im Büro oder an einem externen Veranstaltungsort feiern.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse items-center gap-5 sm:gap-8 bg-white rounded-xl shadow-sm p-5 sm:p-6 md:p-8 transition-all hover:shadow-md">
              <div className="mb-4 md:mb-0 md:w-1/4 flex justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaAward className="text-primary text-4xl sm:text-5xl md:text-6xl" />
                </div>
              </div>
              <div className="md:w-3/4 text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Verpflichtung zur Qualität</h3>
                <p className="text-sm sm:text-base">Jedes Gericht wird mit den besten Zutaten und authentischen Rezepten zubereitet, um die vielfältigen Aromen Indiens einzufangen. Unsere Köche sind in traditionellen Kochmethoden ausgebildet, um ein authentisches Erlebnis zu gewährleisten, das Ihre Gäste beeindrucken und nach mehr verlangen lässt.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-8 bg-white rounded-xl shadow-sm p-5 sm:p-6 md:p-8 transition-all hover:shadow-md">
              <div className="mb-4 md:mb-0 md:w-1/4 flex justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <TbToolsKitchen2 className="text-primary text-4xl sm:text-5xl md:text-6xl" />
                </div>
              </div>
              <div className="md:w-3/4 text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Einfacher Bestellprozess</h3>
                <p className="text-sm sm:text-base">Mit unkomplizierten Kontaktmethoden ist die Bestellung einfach. Sie konzentrieren sich auf Ihre Veranstaltung, während wir uns um die Speisen kümmern. Füllen Sie einfach das untenstehende Formular aus, und unser Team wird sich umgehend mit Ihnen in Verbindung setzen, um Ihre Anforderungen zu besprechen und Ihnen ein personalisiertes Angebot zu unterbreiten.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section - Mobile Optimized */}
      <section id="kontakt-formular" className="section contrast-section py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl mb-6 sm:mb-8">Kontaktieren Sie uns</h2>
          <div className="mx-auto max-w-2xl">
            <div className="card bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow-md">
              <form className="space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="form-label block text-sm font-medium mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label block text-sm font-medium mb-1">E-Mail</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="form-label block text-sm font-medium mb-1">Telefon</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="event-date" className="form-label block text-sm font-medium mb-1">Veranstaltungsdatum</label>
                    <input 
                      type="date" 
                      id="event-date" 
                      className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="event-type" className="form-label block text-sm font-medium mb-1">Art der Veranstaltung</label>
                  <select 
                    id="event-type" 
                    className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base" 
                    required
                  >
                    <option value="">Veranstaltungstyp auswählen</option>
                    <option value="corporate">Geschäftsveranstaltung</option>
                    <option value="wedding">Hochzeit</option>
                    <option value="birthday">Geburtstag</option>
                    <option value="other">Sonstiges</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="guests" className="form-label block text-sm font-medium mb-1">Anzahl der Gäste</label>
                  <input 
                    type="number" 
                    id="guests" 
                    min="1" 
                    className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="form-label block text-sm font-medium mb-1">Zusätzliche Informationen</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full py-2 sm:py-3 text-sm sm:text-base">
                  Anfrage senden
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
