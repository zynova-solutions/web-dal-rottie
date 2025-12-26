import './globals.css';
import '@/styles/theme.css'; // Import theme variables
import { Hepta_Slab } from 'next/font/google'; // Changed font import


// Configure Hepta Slab with required weights and optimizations
const hepta_slab = Hepta_Slab({ 
  subsets: ['latin'],
  weight: ['400', '600'], // Regular and Semibold
  display: 'swap', // Ensure text remains visible during font load (improves FCP)
  variable: '--font-hepta-slab', // CSS variable for better performance
  preload: true, // Preload the font for better performance
  fallback: ['Georgia', 'serif'] // Fallback fonts
});


// This function must be in client-side code
// Server side will use the default "en"
export function generateHtmlLangAttribute(pathname: string): string {
  if (pathname.startsWith('/de')) return 'de';
  return 'en';
}



import LayoutClientWrapper from "../components/layout/LayoutClientWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#d4af37" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script src="/scripts/resize-observer-fix.js" async />
        {/* Preload critical resources */}
        <link rel="preload" href="/hero-image.jpg" as="image" />
        <link rel="preload" href="/indian-food-spread.jpg" as="image" />
        <link rel="preload" href="/images/primary-version.png" as="image" />
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//static.elfsight.com" />
        <link rel="dns-prefetch" href="//www.opentable.de" />
        <link rel="dns-prefetch" href="//dalrotti.online-karte.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        {/* Preconnect for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Resource hints for critical third-party scripts */}
        <link rel="preload" href="https://static.elfsight.com/platform/platform.js" as="script" />
      </head>
      <body className={hepta_slab.className}>
        <LayoutClientWrapper>{children}</LayoutClientWrapper>
      </body>
    </html>
  );
}
