'use client';

import React from 'react';
import Link from 'next/link';

interface NeonButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  href, 
  onClick, 
  className = "" 
}) => {
  const content = (
    <span className="relative z-10">{children}</span>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className={`neon-button rounded-lg ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick} 
      className={`neon-button rounded-lg ${className}`}
    >
      {content}
    </button>
  );
};
