import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SEO from '@/components/SEO';
import { setRequestLocale } from 'next-intl/server';
import { FaMotorcycle, FaAward, FaClipboardList } from 'react-icons/fa';
import { GiHotMeal, GiCupcake } from 'react-icons/gi';
import { TbToolsKitchen2 } from 'react-icons/tb';

export const metadata: Metadata = {
  title: 'Indian Catering Frankfurt - Dal Rotti | Events & Parties',
  description: 'Dal Rotti Frankfurt provides authentic Indian food catering for corporate lunches, private parties, weddings, and community events. Customizable menus & reliable delivery.',
  keywords: 'Indian catering Frankfurt, Dal Rotti catering, event catering, party food supply, corporate catering India, wedding catering Indian, community event food, Indian food delivery Frankfurt',
  alternates: {
    languages: {
      'en-US': '/en/catering',
      'de-DE': '/de/catering',
    },
  },
};

export default function Catering() {
  // Enable static rendering
  setRequestLocale('en');

  return (
    <>
      <SEO
        title="Catering Services - Dal Rotti | Authentic Indian Catering"
        description="Dal Rotti offers authentic Indian catering services in Frankfurt for all types of events."
        keywords="Dal Rotti catering, Indian catering services, event catering Frankfurt"
      />
      
      {/* Hero Section - Mobile Optimized */}
      <section className="hero relative min-h-[40vh] sm:min-h-[45vh] md:min-h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/catering-hero.jpg"
            alt="Dal Rotti Catering"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-black/50 md:bg-black/40"></div>
        </div>
        <div className="hero-content container mx-auto px-4 py-12 relative z-10">
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center">Catering Services</h1>
          <p className="mx-auto mb-6 sm:mb-8 max-w-2xl text-base sm:text-lg text-white text-center font-light">
            Experience the vibrant flavors of India at your next event. From classic biryanis to savory curries, Dal Rotti brings authentic Indian cuisine straight to your celebration.
          </p>
          <div className="flex justify-center">
            <Link
              href="#contact-form"
              className="btn btn-primary px-6 py-3 text-base sm:text-lg"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>


      {/* Food Supply Section - Mobile Optimized */}
      <section className="section primary-section py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl mb-3">Food Supply Tailored to Your Needs</h2>
          <p className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto text-base sm:text-lg">
            Our catering service is designed to support your event with a versatile range of menu options that capture the true essence of Indian cuisine. Choose the format that best fits your occasion:
          </p>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="bg-gradient-to-b from-primary/5 to-white p-5 sm:p-6 md:p-8 rounded-lg border-l-4 border-primary shadow-sm hover:shadow-md transition-all">
              <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-primary flex items-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center mr-3 shadow-sm text-sm sm:text-base">1</span>
                Corporate Lunches
              </h3>
              <p className="text-sm sm:text-base">
                Enjoy a seamless and reliable service for your workplace gatherings. We deliver hearty, authentic Indian meals 
                straight to your office—ideal for impressing clients or energizing your team during meetings.
              </p>
            </div>
            <div className="bg-gradient-to-b from-primary/5 to-white p-5 sm:p-6 md:p-8 rounded-lg border-l-4 border-primary shadow-sm hover:shadow-md transition-all">
              <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-primary flex items-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center mr-3 shadow-sm text-sm sm:text-base">2</span>
                Private Parties
              </h3>
              <p className="text-sm sm:text-base">
                From birthdays, baby showers, gender reveal parties, housewarmings, weddings, to any other special event, 
                our food supply elevates your celebration. You decide whether to have your order delivered or to pick it up.
              </p>
            </div>
            <div className="bg-gradient-to-b from-primary/5 to-white p-5 sm:p-6 md:p-8 rounded-lg border-l-4 border-primary shadow-sm hover:shadow-md transition-all">
              <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-primary flex items-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center mr-3 shadow-sm text-sm sm:text-base">3</span>
                Community Events
              </h3>
              <p className="text-sm sm:text-base">
                Hosting a local event—like a Valentine's Day celebration, music night, comedy show, or any other gathering? 
                Let Dal Rotti support your event with our signature dishes, ensuring every guest experiences authentic Indian food.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customizable Menu Options Section - Mobile Optimized */}
      <section className="section contrast-section bg-gradient-to-br from-primary/5 via-white to-primary/10 py-10 sm:py-12 md:py-16 border-t border-primary/10">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl mb-3">Customizable Menu Options</h2>
          <p className="text-center mb-6 sm:mb-10 max-w-3xl mx-auto text-base sm:text-lg">
            We offer a range of flexible catering solutions designed to fit your budget and event size:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 text-center hover:shadow-lg transition-all">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <GiHotMeal className="text-primary text-3xl sm:text-4xl" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-primary">Full Meal Plates</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                Enjoy a complete dining experience featuring an assortment of traditional curries, freshly baked breads, and savory sides.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 text-center hover:shadow-lg transition-all">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <GiCupcake className="text-primary text-3xl sm:text-4xl" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-primary">Finger Food Selections</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                Ideal for social settings where bite-sized treats are perfect for mingling and tasting a variety of flavors.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 text-center hover:shadow-lg transition-all sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none md:mx-0">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <TbToolsKitchen2 className="text-primary text-3xl sm:text-4xl" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-primary">Combination Menus</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                Mix and match options—such as one main course paired with a selection of appetizers and a delicious dessert—for a balanced and satisfying meal.
              </p>
            </div>
          </div>
          
          <p className="text-center mt-6 sm:mt-10 max-w-3xl mx-auto italic text-sm sm:text-base">
            Our culinary experts work with you to customize the menu according to your specific requirements, ensuring every order meets your taste and quality expectations.
          </p>
        </div>
      </section>

      {/* Reliable & Convenient Service Section - Mobile Optimized */}
      <section className="section primary-section py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl mb-3">Reliable & Convenient Service</h2>
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-8 bg-white rounded-xl shadow-sm p-5 sm:p-6 md:p-8 transition-all hover:shadow-md">
              <div className="mb-4 md:mb-0 md:w-1/4 flex justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaMotorcycle className="text-primary text-4xl sm:text-5xl md:text-6xl" />
                </div>
              </div>
              <div className="md:w-3/4 text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Flexible Delivery Options</h3>
                <p className="text-sm sm:text-base">Choose between prompt delivery to your venue or convenient pick-up, based on your event's size and your schedule. We ensure that your food arrives on time and in perfect condition, whether you're hosting at home, at the office, or at an external venue.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse items-center gap-5 sm:gap-8 bg-white rounded-xl shadow-sm p-5 sm:p-6 md:p-8 transition-all hover:shadow-md">
              <div className="mb-4 md:mb-0 md:w-1/4 flex justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaAward className="text-primary text-4xl sm:text-5xl md:text-6xl" />
                </div>
              </div>
              <div className="md:w-3/4 text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Commitment to Quality</h3>
                <p className="text-sm sm:text-base">Every dish is prepared using the best ingredients and authentic recipes, capturing the diverse flavors of India. Our chefs are trained in traditional cooking methods to ensure an authentic experience that will impress your guests and leave them asking for more.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-8 bg-white rounded-xl shadow-sm p-5 sm:p-6 md:p-8 transition-all hover:shadow-md">
              <div className="mb-4 md:mb-0 md:w-1/4 flex justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaClipboardList className="text-primary text-4xl sm:text-5xl md:text-6xl" />
                </div>
              </div>
              <div className="md:w-3/4 text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Easy Ordering Process</h3>
                <p className="text-sm sm:text-base">With straightforward contact methods, placing your order is simple. You focus on your event while we take care of the food supply. Just fill out the form below, and our team will get back to you promptly to discuss your requirements and provide a personalized quote.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section - Mobile Optimized */}
      <section id="contact-form" className="section contrast-section py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl mb-6 sm:mb-8">Get in Touch</h2>
          <div className="mx-auto max-w-2xl">
            <div className="card bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow-md">
              <form className="space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="form-label block text-sm font-medium mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="form-label block text-sm font-medium mb-1">Phone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="event-date" className="form-label block text-sm font-medium mb-1">Event Date</label>
                    <input 
                      type="date" 
                      id="event-date" 
                      className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="event-type" className="form-label block text-sm font-medium mb-1">Event Type</label>
                  <select 
                    id="event-type" 
                    className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base" 
                    required
                  >
                    <option value="">Select Event Type</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="guests" className="form-label block text-sm font-medium mb-1">Number of Guests</label>
                  <input 
                    type="number" 
                    id="guests" 
                    min="1" 
                    className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="form-label block text-sm font-medium mb-1">Additional Information</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full px-3 sm:px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full py-2 sm:py-3 text-sm sm:text-base">
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
