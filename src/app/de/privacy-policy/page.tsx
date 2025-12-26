import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | Dal Rotti',
  description: 'Datenschutzerklärung für die Dienstleistungen und Website des Dal Rotti Restaurants.',
  keywords: 'Dal Rotti, Datenschutzerklärung, Datenschutz, indisches Restaurant Frankfurt',
};

export default async function PrivacyPolicyDE() {
  // Enable static rendering
  setRequestLocale('de');

  const t = await getTranslations('privacy');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero relative h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0 bg-background-tertiary"></div> {/* Removed dark:bg-background */}
        <div className="hero-overlay"></div>
        <div className="hero-content container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="section primary-section">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-primary">{t('title')}</h1> {/* Removed dark:text-primary */}
          
          <div className="prose prose-lg max-w-none">
            <p>{t('lastUpdated')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. {t('sections.introduction.title')}</h2>
            <p>
              {t('sections.introduction.content')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. {t('sections.dataCollection.title')}</h2>
            <p>
              {t('sections.dataCollection.content')}
            </p>
            <ul className="list-disc pl-6 mt-4">
              {t('sections.dataCollection.items').split('|').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. {t('sections.dataUse.title')}</h2>
            <p>
              {t('sections.dataUse.content')}
            </p>
            <ul className="list-disc pl-6 mt-4">
              {t('sections.dataUse.items').split('|').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. {t('sections.dataSecurity.title')}</h2>
            <p>
              {t('sections.dataSecurity.content')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. {t('sections.dataRetention.title')}</h2>
            <p>
              {t('sections.dataRetention.content')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. {t('sections.rights.title')}</h2>
            <p>
              {t('sections.rights.content')}
            </p>
            <ul className="list-disc pl-6 mt-4">
              {t('sections.rights.items').split('|').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. {t('sections.changes.title')}</h2>
            <p>
              {t('sections.changes.content')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. {t('sections.contact.title')}</h2>
            <p>
              {t('sections.contact.content')}
            </p>
            <p className="mt-4">
              Email: privacy@dalrotti.com<br />
              {t('sections.contact.phone')}: +49 123 456 789<br />
              {t('sections.contact.address')}: Musterstraße 123, 60313 Frankfurt am Main, Deutschland
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
