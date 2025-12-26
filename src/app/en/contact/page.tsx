import { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Contact Dal Rotti Frankfurt | Get in Touch with us Today!',
  description: 'Get in touch with DAL ROTTI, your go-to Indian restaurant in Frankfurt. Call, email, or drop by—we\'d love to hear from you and look forward to serving you!',
};

export default function Contact() {
  // Enable static rendering
  setRequestLocale('en');

  return (
    <div>
      {/* Hero Section */}
      <section className="hero relative h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/contact-hero.jpg"
            alt="Contact Dal Rotti"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 backdrop-blur-[1px]"></div>
        </div>
        <div className="hero-content container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            We'd love to hear from you
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section contrast-section bg-gradient-to-br from-primary/5 via-white to-primary/10 py-16">
        <div className="container mx-auto px-4">
          {/* Added prose wrapper for intro text */}
          <div className="prose prose-lg max-w-3xl mx-auto text-center mb-12"> 
            <h2 className="text-3xl font-bold text-primary mb-6">Get in Touch</h2>
            <p className="text-text-secondary"> {/* Ensured text color */}
              We welcome your questions, feedback, and reservation requests. Feel free to contact us using the information below.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              {/* Removed h2 and p from here, moved above */}
              <div className="space-y-8">
                {/* Address */}
                <div className="flex items-start">
                  <div className="bg-primary/10 p-4 rounded-full mr-4 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Address</h3>
                    <p>123 Hauptstraße, 60313 Frankfurt am Main, Germany</p>
                    <a 
                      href="https://maps.app.goo.gl/Yszfrf7c4VKnLN8M6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline mt-1 inline-block font-medium"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
                {/* Phone */}
                <div className="flex items-start">
                  <div className="bg-primary/10 p-4 rounded-full mr-4 flex items-center justify-center">
                    <FaPhoneAlt className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Phone</h3>
                    <p>+49 (0) 69 123456789</p>
                  </div>
                </div>
                {/* Email */}
                <div className="flex items-start">
                  <div className="bg-primary/10 p-4 rounded-full mr-4 flex items-center justify-center">
                    <FaEnvelope className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p>info@dalrotti.de</p>
                  </div>
                </div>
                {/* Hours */}
                <div className="flex items-start">
                  <div className="bg-primary/10 p-4 rounded-full mr-4 flex items-center justify-center">
                    <FaClock className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Opening Hours</h3>
                    <p>Monday - Friday: 11:30 AM - 10:30 PM</p>
                    <p>Saturday - Sunday: 12:00 PM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Your email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2 font-medium">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Subject"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section primary-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Find Us</h2>
          <div className="h-[400px] rounded-lg overflow-hidden shadow-md"> {/* Removed bg-card */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2558.771622007244!2d8.664693976575919!3d50.10928151186997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bd0fd1e136f757%3A0x8627f1f851e05a64!2sDal%20Rotti%20-%20Indisches%20Restaurant!5e0!3m2!1sen!2sde!4v1745091010339!5m2!1sen!2sde" 
              className="w-full h-full" /* Added classes */
              style={{border:0}} 
              allowFullScreen={true} /* Use boolean prop */
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Dal Rotti Location Map" /* Added title */
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
