import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Dal Rotti',
  description: 'Terms and conditions for Dal Rotti restaurant services.',
  keywords: 'Dal Rotti, terms and conditions, restaurant terms, Indian restaurant Frankfurt',
};

export default function TermsPage() {
  // Enable static rendering
  setRequestLocale('en');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero relative h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0 bg-background-tertiary"></div> {/* Removed dark:bg-background */}
        <div className="hero-overlay"></div>
        <div className="hero-content container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section primary-section">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-primary">Terms and Conditions</h1> {/* Removed dark:text-primary */}
          
          <div className="prose prose-lg max-w-none">
            <p>Last updated: January 1, 2023</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to Dal Rotti. These Terms and Conditions govern your use of our website and services. 
              By accessing or using our services, you agree to be bound by these Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Reservations</h2>
            <p>
              Reservations are subject to availability. We recommend making reservations in advance, 
              especially for weekends and holidays. Cancellations should be made at least 24 hours in advance.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Online Orders</h2>
            <p>
              Online orders are processed during our operating hours. Delivery times may vary based on 
              demand and distance. Minimum order values may apply for delivery services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Payment</h2>
            <p>
              We accept various payment methods including credit cards, debit cards, and cash. 
              All online payments are processed securely through our payment partners.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Privacy</h2>
            <p>
              Your privacy is important to us. Please refer to our Privacy Policy for information 
              on how we collect, use, and protect your personal data.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and images, is the property 
              of Dal Rotti and is protected by copyright laws.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
            <p>
              Dal Rotti shall not be liable for any indirect, incidental, special, consequential, or 
              punitive damages resulting from your use of our services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective 
              immediately upon posting on our website.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at info@dalrotti.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
