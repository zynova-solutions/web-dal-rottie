import Script from 'next/script';

const LocalBusinessSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Dal Rotti",
    "image": "https://www.dalrotti.com/logo.png",
    "url": "https://www.dalrotti.com",
    "telephone": "+49 69 30036126",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mainzer Landstraße 681",
      "addressLocality": "Frankfurt"
    }
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default LocalBusinessSchema; 