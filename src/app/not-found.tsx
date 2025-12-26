import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';

export default function NotFound() {
  // Enable static rendering for the not-found page
  // Using default locale 'en' as no specific locale is available here
  setRequestLocale('en');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-primary mb-4">404</h1> {/* Removed dark:text-primary-light */}
        <h2 className="text-2xl font-semibold text-text mb-4">Page Not Found</h2> {/* Removed dark:text-text */}
        <p className="text-text-secondary mb-8"> {/* Removed dark:text-text-secondary */}
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/en" 
            className="btn btn-primary"
          >
            Go to Homepage (English)
          </Link>
          <Link 
            href="/de" 
            className="btn btn-secondary"
          >
            Zur Startseite (Deutsch)
          </Link>
        </div>
      </div>
    </div>
  );
}
