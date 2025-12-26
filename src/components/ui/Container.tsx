'use client';

import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = '' }: ContainerProps) => {
  return (
    <div className={`container mx-auto px-4 py-8 md:py-12 lg:py-16 ${className}`}>
      {children}
    </div>
  );
};

export default Container; 