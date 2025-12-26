"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';

interface LogoProps {
  variant?: 'light' | 'dark'; // light = white text on dark bg, dark = dark text on light bg
}

const Logo = ({ variant = 'dark' }: LogoProps) => {
  const locale = useLocale();
  
  // Use different logo versions based on variant
  const logoSrc = variant === 'light' 
    ? "/images/primary-version-with-bg.png" 
    : "/images/primary-version.png";
  
  // Text colors based on variant
  const titleColor = variant === 'light' ? 'text-white' : 'text-primary';
  const subtitleColor = variant === 'light' ? 'text-white/90' : 'text-text-secondary';

  return (
    <Link 
      href={`/${locale}`}
      className="flex items-center space-x-3 group"
      aria-label="Dal Rotti - Home"
    >
      <div className="relative w-12 h-12 lg:w-16 lg:h-16 transform transition-transform duration-300 group-hover:scale-105">
        <Image
          src={logoSrc}
          alt="Dal Rotti Logo"
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 48px, 64px"
        />
      </div>
      <div className="flex flex-col">
        <span className={`text-xl lg:text-2xl font-bold ${titleColor} tracking-tight`}>
          Dal Rotti
        </span>
        <span className={`text-xs lg:text-sm ${subtitleColor} tracking-wider`}>
          Authentic Indian Cuisine
        </span>
      </div>
    </Link>
  );
};

export default Logo;
