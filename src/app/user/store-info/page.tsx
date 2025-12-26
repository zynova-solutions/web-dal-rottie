import React from 'react';
import Image from 'next/image';

export default function StoreInfoPage() {
  return (
    <div className="min-h-screen bg-[#fff8f6] px-4 md:px-12 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-[#7a1313] mb-6">Store Info</h1>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl flex flex-col md:flex-row gap-8 items-center">
        <Image src="/images/indian-restaurant-interior.jpg" alt="Dal Rotti Interior" width={320} height={220} className="rounded-lg object-cover w-80 h-56" />
        <div className="flex-1">
          <div className="mb-2">
            <span className="font-bold text-[#7a1313]">Address:</span> Berger Str. 185, 60385 Frankfurt am Main
          </div>
          <div className="mb-2">
            <span className="font-bold text-[#7a1313]">Phone:</span> 069 123456789
          </div>
          <div className="mb-2">
            <span className="font-bold text-[#7a1313]">Opening Hours:</span>
            <ul className="ml-4 text-sm">
              <li>Mon-Fri: 11:30 - 22:00</li>
              <li>Sat-Sun: 12:00 - 23:00</li>
            </ul>
          </div>
          <div className="mb-2">
            <span className="font-bold text-[#7a1313]">Email:</span> info@dalrotti.de
          </div>
          <div className="mb-2">
            <span className="font-bold text-[#7a1313]">Instagram:</span> @dalrotti_frankfurt
          </div>
        </div>
      </div>
    </div>
  );
}
