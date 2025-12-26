import { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Kontakt Dal Rotti Frankfurt | Kontaktieren Sie uns noch heute!',
  description: 'Kontaktieren Sie DAL ROTTI, Ihr indisches Restaurant in Frankfurt. Rufen Sie an, schreiben Sie eine E-Mail oder kommen Sie vorbei – wir freuen uns auf Sie!',
};

export default function ContactDE() {
  // Enable static rendering
  setRequestLocale('de');

  return (
    <div>
      {/* Hero Section */}
      <section className="hero relative h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/contact-hero.jpg"
            alt="Kontakt Dal Rotti"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 backdrop-blur-[1px]"></div>
        </div>
        <div className="hero-content container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontakt</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Wir freuen uns, von Ihnen zu hören
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section contrast-section bg-gradient-to-br from-primary/5 via-white to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-6">Kontaktieren Sie uns</h2>
            <p className="text-text-secondary">
              Wir freuen uns auf Ihre Fragen, Ihr Feedback und Reservierungsanfragen. Kontaktieren Sie uns gerne über die untenstehenden Informationen.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="space-y-8">
                {/* Adresse */}
                <div className="flex items-start">
                  <div className="bg-primary/10 p-4 rounded-full mr-4 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Adresse</h3>
                    <p>123 Hauptstraße, 60313 Frankfurt am Main, Deutschland</p>
                    <a 
                      href="https://maps.app.goo.gl/Yszfrf7c4VKnLN8M6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline mt-1 inline-block font-medium"
                    >
                      Auf Google Maps anzeigen →
                    </a>
                  </div>
                </div>
                {/* Telefon */}
                <div className="flex items-start">
                  <div className="bg-primary/10 p-4 rounded-full mr-4 flex items-center justify-center">
                    <FaPhoneAlt className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Telefon</h3>
                    <p>+49 (0) 69 123456789</p>
                  </div>
                </div>
                {/* E-Mail */}
                <div className="flex items-start">
                  <div className="bg-primary/10 p-4 rounded-full mr-4 flex items-center justify-center">
                    <FaEnvelope className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">E-Mail</h3>
                    <p>info@dalrotti.de</p>
                  </div>
                </div>
                {/* Öffnungszeiten */}
                <div className="flex items-start">
                  <div className="bg-primary/10 p-4 rounded-full mr-4 flex items-center justify-center">
                    <FaClock className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Öffnungszeiten</h3>
                    <p>Montag - Freitag: 11:30 - 22:30 Uhr</p>
                    <p>Samstag - Sonntag: 12:00 - 23:00 Uhr</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Senden Sie uns eine Nachricht</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Ihr Name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">E-Mail</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Ihre E-Mail"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2 font-medium">Betreff</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Betreff"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium">Nachricht</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Ihre Nachricht"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary transition-colors"
                >
                  Nachricht senden
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section primary-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Finden Sie uns</h2>
          <div className="h-[400px] rounded-lg overflow-hidden shadow-md"> 
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2558.771622007244!2d8.664693976575919!3d50.10928151186997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bd0fd1e136f757%3A0x8627f1f851e05a64!2sDal%20Rotti%20-%20Indisches%20Restaurant!5e0!3m2!1sen!2sde!4v1745091010339!5m2!1sen!2sde" 
              className="w-full h-full" 
              style={{border:0}} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Dal Rotti Standortkarte" 
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
