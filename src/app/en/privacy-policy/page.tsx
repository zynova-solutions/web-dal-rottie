import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dal Rotti',
  description: 'Privacy Policy for Dal Rotti Restaurant services and website.',
  keywords: 'Dal Rotti, privacy policy, data protection, Indian restaurant Frankfurt',
};

export default function PrivacyPolicy() {
  // Enable static rendering
  setRequestLocale('en');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero relative h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0 bg-background-tertiary"></div> {/* Removed dark:bg-background */}
        <div className="hero-overlay"></div>
        <div className="hero-content container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="section primary-section">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-primary">Privacy Policy</h1> {/* Removed dark:text-primary */}
          
          <div className="prose prose-lg max-w-none">
            <p>Last updated: January 1, 2023</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              At Dal Rotti, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you 
              visit our website and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which 
              we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li>Identity Data includes first name, last name, username or similar identifier.</li>
              <li>Contact Data includes billing address, delivery address, email address and telephone numbers.</li>
              <li>Financial Data includes payment card details.</li>
              <li>Transaction Data includes details about payments to and from you and other details of products and services you have purchased from us.</li>
              <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being 
              accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, 
              we limit access to your personal data to those employees, agents, contractors and other third 
              parties who have a business need to know.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as reasonably necessary to fulfill the 
              purposes we collected it for, including for the purposes of satisfying any legal, regulatory, 
              tax, accounting or reporting requirements.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
              <li>Request restriction of processing your personal data.</li>
              <li>Request transfer of your personal data.</li>
              <li>Right to withdraw consent.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
            <p>
              We may update our privacy policy from time to time. We will notify you of any changes by 
              posting the new privacy policy on this page and updating the "last updated" date at the top 
              of this privacy policy.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p className="mt-4">
              Email: privacy@dalrotti.com<br />
              Phone: +49 123 456 789<br />
              Address: Musterstraße 123, 60313 Frankfurt am Main, Germany
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
