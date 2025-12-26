"use client";

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
  canonical?: string;
  noIndex?: boolean;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  twitterImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  alternateLanguages?: { [key: string]: string };
}

const SEO = ({
  title = 'Dal Rotti - Authentic North Indian Cuisine in Frankfurt',
  description = 'Experience authentic North Indian cuisine with a fusion of flavors at Dal Rotti, the best Indian restaurant in Frankfurt. Enjoy our veg and non-veg menus along with a variety of drinks.',
  keywords = 'Indian restaurant Frankfurt, North Indian cuisine, Dal Rotti, Indian food, Frankfurt restaurant',
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  jsonLd,
  canonical,
  noIndex = false,
  twitterCard = 'summary_large_image',
  twitterSite = '@dalrotti',
  twitterCreator = '@dalrotti',
  twitterImage,
  twitterTitle,
  twitterDescription,
  alternateLanguages = {},
}: SEOProps) => {
  const pathname = usePathname();
  const baseUrl = 'https://www.dalrotti.com';
  const url = canonical ? `${baseUrl}${canonical}` : `${baseUrl}${pathname}`;
  const twitterImageUrl = twitterImage || ogImage;
  
  // Default restaurant JSON-LD
  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Dal Rotti',
    image: `${baseUrl}/images/restaurant-image.jpg`,
    '@id': baseUrl,
    url: baseUrl,
    telephone: '+49 69 30036126',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Taunusstrasse 25',
      addressLocality: 'Frankfurt',
      postalCode: '60329',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.1071,
      longitude: 8.6721,
    },
    priceRange: '€€',
    servesCuisine: ['Indian', 'North Indian'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '11:30',
        closes: '22:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '12:00',
        closes: '23:00',
      },
    ],
    menu: `${baseUrl}/menu`,
    acceptsReservations: 'True',
  };

  // Use provided JSON-LD or default
  const finalJsonLd = jsonLd || defaultJsonLd;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={url} />
        
        {/* Robots meta tag */}
        {noIndex && <meta name="robots" content="noindex, nofollow" />}
        
        {/* Open Graph tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content={ogType} />
        <meta property="og:image" content={`${baseUrl}${ogImage}`} />
        <meta property="og:site_name" content="Dal Rotti" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card data */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:site" content={twitterSite} />
        <meta name="twitter:creator" content={twitterCreator} />
        <meta name="twitter:title" content={twitterTitle || title} />
        <meta name="twitter:description" content={twitterDescription || description} />
        <meta name="twitter:image" content={`${baseUrl}${twitterImageUrl}`} />
        
        {/* Alternate language versions */}
        {Object.entries(alternateLanguages).map(([lang, path]) => (
          <link 
            key={lang} 
            rel="alternate" 
            hrefLang={lang} 
            href={`${baseUrl}${path}`} 
          />
        ))}
      </Head>
      
      {/* Structured Data */}
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(finalJsonLd) }}
      />
    </>
  );
};

export default SEO;
