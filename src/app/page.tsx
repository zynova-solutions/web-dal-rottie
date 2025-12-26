import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export default function Home() {
  // Enable static rendering for the root page
  // Using default locale 'en' as this page redirects immediately
  setRequestLocale('en');

  // For the homepage, we'll redirect to the English version
  // Users can switch to German using the language switcher
  // This avoids server/client hydration issues
  redirect('/en');
}
