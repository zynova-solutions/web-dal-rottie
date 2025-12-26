import { Metadata } from 'next';
import Image from 'next/image';
// import Link from 'next/link'; // Removed unused import
import { setRequestLocale } from 'next-intl/server';
import { FaPlaneDeparture, FaFire } from 'react-icons/fa';
import { GiIndiaGate } from 'react-icons/gi';
// import { GiHotMeal } from 'react-icons/gi'; // Removed unused import
import { FaHeart, FaUsers, FaLightbulb } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Über Dal Rotti Frankfurt | Unsere Geschichte & Team',
  description: 'Entdecken Sie die Geschichte hinter Dal Rotti Frankfurt, gegründet von Freunden aus Gujarat. Erfahren Sie mehr über unsere Reise, Philosophie und die Köche, die authentische indische Aromen nach Frankfurt bringen.',
  keywords: 'Dal Rotti Geschichte, über Dal Rotti Frankfurt, Indisches Restaurant Gründer, Gujarati Ingenieure Deutschland, Chefkoch Deepak, Chefkoch Umesh, Indische Essensphilosophie',
};

export default function AboutDE() {
  // Enable static rendering
  setRequestLocale('de');

  return (
    <div>
      {/* Hero Section */}
      <section className="hero relative h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-hero.jpg"
            alt="Über Dal Rotti"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 backdrop-blur-[1px]"></div>
        </div>
        <div className="hero-content container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Über Uns</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Willkommen bei Dal Rotti – Ihr Zuhause für indische Aromen in Frankfurt
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section contrast-section">
        <div className="container mx-auto px-4">
          {/* Apply prose styling specifically to this text block */}
          <div className="prose prose-lg max-w-3xl mx-auto text-center">
            <p className="text-text-secondary">
              Dal Rotti entstand aus Freundschaft, Leidenschaft und der Liebe zum Essen. Fünf Gujarati-Ingenieure kamen zum Studium nach Deutschland – und entdeckten schnell, dass nichts Menschen so sehr verbindet wie ein gemeinsames Essen. Was als Kochabende am Wochenende in kleinen Wohnungen begann, wurde zu einem kühnen Traum: Einen Ort zu schaffen, an dem authentische indische Küche, herzliche Gastfreundschaft und moderner Stil unter einem Dach vereint sind.
            </p>
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="section primary-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Unsere Reise</h2>
          {/* Use standard grid, allow full container width */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-3 flex items-center justify-center md:justify-start gap-2">
                <FaPlaneDeparture className="text-primary text-2xl" /> Von Indien nach Deutschland
              </h3>
              <p className="text-text-secondary">
                Für ihr Studium verließen unsere Gründer Gujarat und brachten ihre Familienrezepte und gewürzreichen Erinnerungen mit nach Deutschland.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-3 flex items-center justify-center md:justify-start gap-2">
                <FaFire className="text-primary text-2xl" /> Von WG-Küchen zum Restaurant
              </h3>
              <p className="text-text-secondary">
                Was als gemeinsames Kochen begann, entwickelte sich zu Pop-up-Dinnern und mündete schließlich in die Eröffnung von Dal Rotti in Frankfurt im September 2024.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="section contrast-section bg-gradient-to-br from-primary/5 via-white to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-10">Unsere Philosophie</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {/* Authentisch */}
            <div className="p-8 rounded-2xl bg-white shadow-lg border border-primary/10 hover:shadow-xl transition-shadow flex flex-col items-center group">
              <div className="mb-4 bg-primary/10 rounded-full p-4 flex items-center justify-center">
                <GiIndiaGate className="text-primary text-4xl group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-primary">Authentisch</h4>
              <p className="text-base text-text-secondary">Wir ehren Indiens reiche kulinarische Tradition mit Rezepten, die über Generationen weitergegeben wurden.</p>
            </div>
            {/* Leidenschaftlich */}
            <div className="p-8 rounded-2xl bg-white shadow-lg border border-primary/10 hover:shadow-xl transition-shadow flex flex-col items-center group">
              <div className="mb-4 bg-primary/10 rounded-full p-4 flex items-center justify-center">
                <FaHeart className="text-primary text-4xl group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-primary">Leidenschaftlich</h4>
              <p className="text-base text-text-secondary">Jedes Gericht wird mit den besten Zutaten und viel Herzblut frisch zubereitet.</p>
            </div>
            {/* Inklusiv */}
            <div className="p-8 rounded-2xl bg-white shadow-lg border border-primary/10 hover:shadow-xl transition-shadow flex flex-col items-center group">
              <div className="mb-4 bg-primary/10 rounded-full p-4 flex items-center justify-center">
                <FaUsers className="text-primary text-4xl group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-primary">Inklusiv</h4>
              <p className="text-base text-text-secondary">Vegetarier, Veganer und Fleischliebhaber finden hier ihre Lieblingsgerichte.</p>
            </div>
            {/* Modern */}
            <div className="p-8 rounded-2xl bg-white shadow-lg border border-primary/10 hover:shadow-xl transition-shadow flex flex-col items-center group">
              <div className="mb-4 bg-primary/10 rounded-full p-4 flex items-center justify-center">
                <FaLightbulb className="text-primary text-4xl group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-primary">Modern</h4>
              <p className="text-base text-text-secondary">Wir verbinden traditionelle Techniken mit kreativen Ideen in einem modernen Ambiente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="section primary-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Unser Team</h2>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Chef Deepak Card */}
            <div className="group bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl border border-primary/10">
              <div className="w-48 h-48 rounded-full overflow-hidden shadow mb-4 border-4 border-primary">
                <Image
                  src="/images/chef-deepak.png"
                  alt="Chefkoch Deepak"
                  width={192}
                  height={192}
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                Chefkoch Deepak
              </h3>
              <div className="text-sm text-text-secondary mb-2 italic">
                „Tradition auf jedem Teller"
              </div>
              <p className="text-text-secondary text-center">
                Deepak stammt aus Delhi und bringt jahrzehntelange Familientraditionen und kulinarische Expertise auf jeden Teller.
              </p>
            </div>
            {/* Chef Umesh Card */}
            <div className="group bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl border border-primary/10">
              <div className="w-48 h-48 rounded-full overflow-hidden shadow mb-4 border-4 border-primary">
                <Image
                  src="/images/chef-umesh.png"
                  alt="Chefkoch Umesh"
                  width={192}
                  height={192}
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                Chefkoch Umesh
              </h3>
              <div className="text-sm text-text-secondary mb-2 italic">
                „Kreativität in jedem Gericht"
              </div>
              <p className="text-text-secondary text-center">
                Umesh stammt aus Punjab und verbindet klassische nordindische Aromen mit kreativen Präsentationen, die überraschen und begeistern.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Halal Certification Section */}
      <section className="section contrast-section py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Halal Zertifiziert</h2>
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-text-secondary">
              Bei Dal Rotti sind wir stolz darauf, 100% Halal-Speisen zu servieren. Unser Restaurant wurde vom NZIDT (New Zealand Islamic Development Trust) zertifiziert und garantiert die Einhaltung höchster Standards bei der Zubereitung von Halal-Speisen.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-border hover:shadow-xl transition-all">
              <Image 
                src="/images/certificates/halal_certificate_1.jpeg" 
                alt="Halal Zertifikat - Alliance Group Limited" 
                width={600} 
                height={800}
                className="w-full object-contain" 
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">NZIDT Halal Zertifizierung</h3>
                <p className="text-sm text-text-secondary">Alliance Group Limited - ISO 2055-1:2015 & UAE.S 2055-1:2015</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-border hover:shadow-xl transition-all">
              <Image 
                src="/images/certificates/halal_certificate_2.jpeg" 
                alt="Halal Zertifikat - New Zealand Export Halal Scheme" 
                width={600} 
                height={800}
                className="w-full object-contain" 
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">New Zealand Export Halal Scheme</h3>
                <p className="text-sm text-text-secondary">Allgemeine Exportanforderungen für Halal-Tiermaterialien und -Produkte</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Table Section */}
      <section className="section primary-section">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Kommen Sie an unseren Tisch</h2>
            <p className="text-text-secondary">
              Ob Sie Lust auf ein wohltuendes Chicken Biryani haben, eine Gruppenfeier planen oder einfach einen neuen Ort zum Mittagessen suchen – Dal Rotti heißt Sie wie Familie willkommen. Entdecken Sie die Traditionen Indiens, neu interpretiert für Frankfurt.
            </p>
            <div className="mt-8 space-x-4 not-prose">
              <a
                href="/de/reservation"
                className="btn btn-primary"
              >
                Tisch reservieren
              </a>
              <a
                href="/user/menu"
                className="btn btn-secondary"
              >
                Online bestellen
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
