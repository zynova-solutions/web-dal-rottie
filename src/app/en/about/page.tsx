import { Metadata } from 'next';
import Image from 'next/image';
// import Link from 'next/link'; // Removed unused import
import { setRequestLocale } from 'next-intl/server';
import { FaPlaneDeparture, FaFire } from 'react-icons/fa';
import { GiIndiaGate } from 'react-icons/gi';
// import { GiHotMeal } from 'react-icons/gi'; // Removed unused import
import { FaHeart, FaUsers, FaLightbulb } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'About Dal Rotti Frankfurt | Our Story & Team',
  description: 'Discover the story behind Dal Rotti Frankfurt, founded by Gujarati friends. Learn about our journey, philosophy, and the chefs bringing authentic Indian flavors to Frankfurt.',
  keywords: 'Dal Rotti story, about Dal Rotti Frankfurt, Indian restaurant founders, Gujarati engineers Germany, Chef Deepak, Chef Umesh, Indian food philosophy',
};

export default function About() {
  // Enable static rendering
  setRequestLocale('en');

  return (
    <div>
      {/* Hero Section */}
      <section className="hero relative h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-hero.jpg"
            alt="About Dal Rotti"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 backdrop-blur-[1px]"></div>
        </div>
        <div className="hero-content container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Welcome to Dal Rotti — Your Home of Indian Flavor in Frankfurt
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section contrast-section">
        <div className="container mx-auto px-4">
          {/* Apply prose styling specifically to this text block */}
          <div className="prose prose-lg max-w-3xl mx-auto text-center">
            {/* Removed duplicate 'Welcome to Dal Rotti' heading */}
            <p className="text-text-secondary">
              Dal Rotti was born from friendship, passion, and a love of food. Five Gujarati engineers moved to Germany for their studies—and quickly discovered that nothing brings people together like a shared meal. What began as weekend cook-togethers in tiny apartments grew into a bold dream: create a place where authentic Indian cooking, warm hospitality, and modern flair meet under one roof.
            </p>
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="section primary-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Journey</h2>
          {/* Use standard grid, allow full container width */}
          <div className="grid md:grid-cols-2 gap-12 items-start"> {/* Removed max-w-5xl mx-auto */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-3 flex items-center justify-center md:justify-start gap-2">
                <FaPlaneDeparture className="text-primary text-2xl" /> From India to Germany
              </h3>
              <p className="text-text-secondary">
                Leaving Gujarat for higher education, our founders carried their family recipes and spice-filled memories across continents.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-3 flex items-center justify-center md:justify-start gap-2">
                <FaFire className="text-primary text-2xl" /> Weekend Kitchens to Restaurant Tables
              </h3>
              <p className="text-text-secondary">
                What started as home-cooked gatherings evolved into pop-up dinners, then finally into Dal Rotti's grand opening in Frankfurt in September 2024.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="section contrast-section bg-gradient-to-br from-primary/5 via-white to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-10">Our Philosophy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {/* Authentic */}
            <div className="p-8 rounded-2xl bg-white shadow-lg border border-primary/10 hover:shadow-xl transition-shadow flex flex-col items-center group">
              <div className="mb-4 bg-primary/10 rounded-full p-4 flex items-center justify-center">
                <GiIndiaGate className="text-primary text-4xl group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-primary">Authentic</h4>
              <p className="text-base text-text-secondary">We honor India's rich culinary heritage with recipes passed down through generations.</p>
            </div>
            {/* Passionate */}
            <div className="p-8 rounded-2xl bg-white shadow-lg border border-primary/10 hover:shadow-xl transition-shadow flex flex-col items-center group">
              <div className="mb-4 bg-primary/10 rounded-full p-4 flex items-center justify-center">
                <FaHeart className="text-primary text-4xl group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-primary">Passionate</h4>
              <p className="text-base text-text-secondary">Every dish is made from scratch with the best ingredients—and a whole lot of heart.</p>
            </div>
            {/* Inclusive */}
            <div className="p-8 rounded-2xl bg-white shadow-lg border border-primary/10 hover:shadow-xl transition-shadow flex flex-col items-center group">
              <div className="mb-4 bg-primary/10 rounded-full p-4 flex items-center justify-center">
                <FaUsers className="text-primary text-4xl group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-primary">Inclusive</h4>
              <p className="text-base text-text-secondary">Vegetarian, vegan, and meat lovers alike find their favorite flavors here.</p>
            </div>
            {/* Modern */}
            <div className="p-8 rounded-2xl bg-white shadow-lg border border-primary/10 hover:shadow-xl transition-shadow flex flex-col items-center group">
              <div className="mb-4 bg-primary/10 rounded-full p-4 flex items-center justify-center">
                <FaLightbulb className="text-primary text-4xl group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-primary">Modern</h4>
              <p className="text-base text-text-secondary">We blend traditional techniques with creative twists, served in a light, contemporary setting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="section primary-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Meet the Team</h2>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Chef Deepak Card */}
            <div className="group bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl border border-primary/10">
              <div className="w-48 h-48 rounded-full overflow-hidden shadow mb-4 border-4 border-primary">
                <Image
                  src="/images/chef-deepak.png"
                  alt="Chef Deepak"
                  width={192}
                  height={192}
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                Chef Deepak
              </h3>
              <div className="text-sm text-text-secondary mb-2 italic">
                "Tradition on every plate"
              </div>
              <p className="text-text-secondary text-center">
                A native of Delhi, Deepak brings decades of family cooking traditions and culinary expertise to every plate.
              </p>
            </div>
            {/* Chef Umesh Card */}
            <div className="group bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl border border-primary/10">
              <div className="w-48 h-48 rounded-full overflow-hidden shadow mb-4 border-4 border-primary">
                <Image
                  src="/images/chef-umesh.png"
                  alt="Chef Umesh"
                  width={192}
                  height={192}
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                Chef Umesh
              </h3>
              <div className="text-sm text-text-secondary mb-2 italic">
                "Inventiveness in every dish"
              </div>
              <p className="text-text-secondary text-center">
                Hailing from Punjab, Umesh fuses classic North Indian flavors with inventive presentations that surprise and delight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Halal Certification Section */}
      <section className="section contrast-section py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Halal Certified</h2>
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-text-secondary">
              At Dal Rotti, we're proud to serve 100% halal food. Our restaurant has been certified by the NZIDT (New Zealand Islamic Development Trust), ensuring we follow the highest standards of halal food preparation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-border hover:shadow-xl transition-all">
              <Image 
                src="/images/certificates/halal_certificate_1.jpeg" 
                alt="Halal Certificate - Alliance Group Limited" 
                width={600} 
                height={800}
                className="w-full object-contain" 
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">NZIDT Halal Certification</h3>
                <p className="text-sm text-text-secondary">Alliance Group Limited - ISO 2055-1:2015 & UAE.S 2055-1:2015</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-border hover:shadow-xl transition-all">
              <Image 
                src="/images/certificates/halal_certificate_2.jpeg" 
                alt="Halal Certificate - New Zealand Export Halal Scheme" 
                width={600} 
                height={800}
                className="w-full object-contain" 
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">New Zealand Export Halal Scheme</h3>
                <p className="text-sm text-text-secondary">General Export Requirements for Halal Animal Materials and Products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Table Section */}
      <section className="section primary-section">
        <div className="container mx-auto px-4">
           {/* Apply prose styling specifically to this text block */}
          <div className="prose prose-lg max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Table</h2>
            <p className="text-text-secondary">
              Whether you're craving a comforting Chicken Biryani, planning a group celebration, or simply seeking a fresh lunch spot, Dal Rotti welcomes you like family. Come taste the traditions of India, reimagined for Frankfurt.
            </p>
             {/* Add not-prose to prevent prose styling on buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center not-prose">
              <a
                href="/en/reservation"
                className="btn-primary inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-center min-w-[200px] w-full sm:w-auto"
              >
                Reserve a Table
              </a>
              <a
                href="/user/menu"
                className="btn-secondary inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-center min-w-[200px] w-full sm:w-auto"
              >
                Order Online
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
