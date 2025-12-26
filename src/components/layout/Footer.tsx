"use client"; // Make it a client component

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { trackGetDirections, trackPhoneCall, trackSocialMedia } from '@/utils/analytics';

const Footer = () => {
  const t = useTranslations();
  const locale = useLocale();
  const imprintHref = locale === 'de' ? '/de/imprint' : '/imprint';
  const imprintLabel = locale === 'de' ? 'Impressum' : 'Imprint';

  // Function to handle cookie settings reset
  const handleCookieSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cookie-consent');
      window.location.reload();
    }
  };

  // Function to handle tracking for "Get Directions" click
  const handleGetDirections = () => {
    trackGetDirections('footer');
  };

  // Function to handle tracking for phone call
  const handlePhoneCall = (e: React.MouseEvent) => {
    e.preventDefault();
    trackPhoneCall('footer');
    window.location.href = 'tel:06930036126';
  };

  return (
    <footer className="bg-[#7a1313] text-white border-t-2 border-border mt-12">
      <div className="container mx-auto px-2 md:px-4 py-8 md:py-16">
        {/* Removed Logo + Tagline from footer as requested */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-8 text-white text-center md:text-left items-center md:items-start">
          {/* Contact Info */}
          <div className="flex flex-col gap-4 items-center md:items-start mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-2 font-display text-white">Contact Us</h3>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <div className="flex items-center gap-3 break-words">
                <FaMapMarkerAlt className="text-xl" />
                <span className="text-white">
                  <a 
                    href="https://maps.app.goo.gl/Yszfrf7c4VKnLN8M6" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline text-white"
                    onClick={handleGetDirections}
                    data-event-category="directions"
                    data-event-action="click"
                    data-event-label="footer"
                  >
                    Taunusstraße 25,<br />60329 Frankfurt am Main
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-xl" />
                <a
                  href="tel:06930036126"
                  className="hover:underline text-white"
                  onClick={handlePhoneCall}
                  data-event-category="contact"
                  data-event-action="call"
                  data-event-label="footer"
                >
                  069 30036126
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-xl" />
                <a
                  href="mailto:info@dalrotti.com"
                  className="hover:underline break-all text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    trackPhoneCall('email_footer');
                    window.location.href = 'mailto:info@dalrotti.com';
                  }}
                  data-event-category="contact"
                  data-event-action="email"
                  data-event-label="footer"
                >
                  info@dalrotti.com
                </a>
              </div>
            </div>
          </div>
          {/* Opening Hours */}
          <div className="flex flex-col gap-4 items-center md:items-start mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-2 font-display text-white">{locale === 'de' ? 'Öffnungszeiten' : 'Opening Hours'}</h3>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <div><span className="text-white">{locale === 'de' ? 'Mo–So:' : 'Mon–Sun:'}</span> <span className="ml-2 text-white">11:00 – 23:00</span></div>
            </div>
          </div>
          {/* Quick Links */}
          <div className="flex flex-col gap-4 items-center md:items-start mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-2 font-display text-white">{locale === 'de' ? 'Schnellzugriff' : 'Quick Links'}</h3>
            <ul className="flex flex-col gap-2 items-center md:items-start">
              <li><Link href="/catering" className="hover:underline text-white">{t('common.catering')}</Link></li>
              <li><Link href={`/${locale}/blog`} className="hover:underline text-white">Blog</Link></li>
              <li><Link href={locale === 'de' ? '/de/contact' : '/en/contact'} className="hover:underline text-white">{locale === 'de' ? 'Kontakt' : 'Contact'}</Link></li>
              <li><Link href="/privacy-policy" className="hover:underline text-white">{t('privacy.title')}</Link></li>
              <li><Link href={imprintHref} className="hover:underline text-white">{imprintLabel}</Link></li>
              <li><Link href="/terms" className="hover:underline text-white">{t('terms.title')}</Link></li>
              <li><button onClick={handleCookieSettings} className="hover:underline bg-transparent p-0 m-0 text-left text-white">{locale === 'de' ? 'Cookie Einstellungen' : 'Cookie Settings'}</button></li>
            </ul>
          </div>
          {/* Social Media + Badge */}
          <div className="flex flex-col gap-4 items-center md:items-start justify-between h-full w-full">
            <div className="w-full flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-2 font-display text-white">{t('footer.followUs')}</h3>
              <div className="flex justify-center md:justify-start space-x-4 mb-4 w-full">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:bg-white/20 p-2 rounded-full transition" onClick={() => trackSocialMedia('facebook', 'footer')}>
                  <FaFacebook size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:bg-white/20 p-2 rounded-full transition" onClick={() => trackSocialMedia('instagram', 'footer')}>
                  <FaInstagram size={24} />
                </a>
              </div>
              <span className="block text-sm text-center md:text-left w-full text-white">Follow us for offers & updates!</span>
            </div>
            <div className="mt-2 w-full flex justify-center md:justify-start">
              <span className="inline-block bg-white/20 text-white font-bold px-4 py-1 rounded-full text-xs shadow w-full md:w-auto text-center">Top Rated on Google</span>
            </div>
          </div>
        </div>
        <div className="w-full border-t border-white/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-white mb-2 sm:mb-0">&copy; {new Date().getFullYear()} Dal Rotti. {t('footer.allRightsReserved')}</p>
          <button 
            onClick={handleCookieSettings}
            className="underline hover:bg-white/20 text-white transition"
          >
            {locale === 'de' ? 'Cookie Einstellungen' : 'Cookie Settings'}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
