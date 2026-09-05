import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
}

/**
 * SITAM College Emblem Component
 * South Institute of Technology and Management (Since 1996)
 * Featuring the Sun, Pen Nib, Book with Eyes, Rice Stalks, 'S' Monogram & Telugu Motto
 */
export const SitamLogo: React.FC<LogoProps> = ({ className = 'w-9 h-9', size }) => {
  return (
    <img
      src="/logos/sitam-logo.svg"
      alt="SITAM Engineering College Emblem"
      className={`object-contain rounded-full bg-white shadow-xs ${className}`}
      style={size ? { width: size, height: size } : undefined}
      loading="eager"
    />
  );
};

/**
 * GVMC Seal Component
 * Greater Visakhapatnam Municipal Corporation ("City of Destiny")
 * Official Civic Sanitation & Solid Waste Authority
 */
export const GvmcLogo: React.FC<LogoProps> = ({ className = 'w-9 h-9', size }) => {
  return (
    <img
      src="/logos/gvmc-logo.svg"
      alt="Greater Visakhapatnam Municipal Corporation (GVMC) Official Seal"
      className={`object-contain rounded-full bg-white shadow-xs ${className}`}
      style={size ? { width: size, height: size } : undefined}
      loading="eager"
    />
  );
};

/**
 * GreenCity Logo Component
 * Clean Green City Environmental Action & Community Partner
 */
export const GreenCityLogo: React.FC<LogoProps> = ({ className = 'w-9 h-9', size }) => {
  return (
    <img
      src="/logos/greencity-logo.svg"
      alt="GreenCity Community & Environmental Foundation"
      className={`object-contain rounded-full bg-white shadow-xs ${className}`}
      style={size ? { width: size, height: size } : undefined}
      loading="eager"
    />
  );
};

/**
 * Civic Police Liaison Component
 */
export const PoliceLogo: React.FC<LogoProps> = ({ className = 'w-9 h-9', size }) => {
  return (
    <img
      src="/logos/police-logo.svg"
      alt="Civic Police Liaison & Encroachment Cell"
      className={`object-contain rounded-full bg-white shadow-xs ${className}`}
      style={size ? { width: size, height: size } : undefined}
      loading="eager"
    />
  );
};
