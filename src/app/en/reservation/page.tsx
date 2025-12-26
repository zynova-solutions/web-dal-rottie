import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';

export default function ReservationEN() {
  // This function can only be used in Server Components
  setRequestLocale('en');
  
  // OpenTable direct booking URL for English users
  const openTableUrl = "https://www.opentable.de/restref/client/?rid=405786&restref=405786&lang=en-GB&ot_source=Restaurant%20website&corrid=212a247c-edb7-4c2d-bf3d-3ef59f08c220";
  
  return (
    <div>
      {/* Hero Section */}
      <section className="hero relative flex items-center h-[30vh] w-full mb-6 md:mb-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/blog-hero.jpg" 
            alt="Dal Rotti Reservation"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50"></div>
        </div>
        <div className="hero-content container mx-auto px-4 text-center z-10 text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">Reserve a Table</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Secure your table in seconds with our online reservation system
          </p>
        </div>
      </section>
      
      <section className="py-4 md:py-8 lg:py-12">
        <div className="container mx-auto px-2 md:px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center px-2">Book Your Table Online</h2>
            
            <div className="bg-white rounded-lg md:rounded-xl shadow-lg border border-gray-200 mx-2 md:mx-0 overflow-hidden">
              <div className="p-3 md:p-6 lg:p-8 pb-0">
                <p className="text-center mb-4 md:mb-6 text-gray-700 text-sm md:text-base">
                  Secure your table in seconds with our OpenTable reservation system below.
                </p>
              </div>
              
              {/* Seamlessly integrated OpenTable widget */}
              <div className="w-full">
                <iframe
                  src={openTableUrl}
                  title="OpenTable reservation"
                  className="w-full h-[600px] md:h-[700px] border-0"
                  style={{ 
                    maxWidth: '100%',
                    overflow: 'hidden'
                  }}
                  allow="payment"
                  loading="eager"
                  scrolling="yes"
                ></iframe>
              </div>
              
              <div className="p-3 md:p-6 lg:p-8 pt-4">
                <p className="text-xs md:text-sm text-center text-gray-500">
                  For parties larger than 8 people or special requirements, please call us directly at{' '}
                  <a href="tel:06930036126" className="text-primary hover:underline font-medium">
                    069 30036126
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
