import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

// Removed PageProps type alias

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: any): Promise<Metadata> { // Using any to bypass type constraint issue
  // Fetch translations using the locale from params if needed, or default
  // Assuming 'de' is the intended language here based on the file path
  const t = await getTranslations({ locale: params?.lang || 'de', namespace: 'terms' }); // Added optional chaining

  return {
    title: t('title') + ' - Dal Rotti',
    description: t('description'),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function TermsPageDE({ params }: any) { // Using any to bypass type constraint issue
  // Enable static rendering
  setRequestLocale('de');

  // Fetch translations - assuming 'de' based on file path or potentially use params.lang
  const t = await getTranslations({ locale: params?.lang || 'de', namespace: 'terms' }); // Added optional chaining for safety with 'any'

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

      {/* Terms Content */}
      <section className="section primary-section">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-primary">{t('title')}</h1> {/* Removed dark:text-primary */}
          
          <div className="prose prose-lg max-w-none">
            <p>{t('lastUpdated')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. {t('sections.introduction.title')}</h2>
            <p>
              {t('sections.introduction.content')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. {t('sections.reservations.title')}</h2>
            <p>
              {t('sections.reservations.content')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. {t('sections.orders.title')}</h2>
            <p>
              {t('sections.orders.content')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. {t('sections.payment.title')}</h2>
            <p>
              {t('sections.payment.content')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. {t('sections.privacy.title')}</h2>
            <p>
              {t('sections.privacy.content')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. {t('sections.intellectual.title')}</h2>
            <p>
              {t('sections.intellectual.content')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. {t('sections.liability.title')}</h2>
            <p>
              {t('sections.liability.content')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. {t('sections.changes.title')}</h2>
            <p>
              {t('sections.changes.content')}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. {t('sections.contact.title')}</h2>
            <p>
              {t('sections.contact.content')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
