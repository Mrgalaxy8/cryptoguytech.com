import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#00C853', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0A2342', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <text x="0" y="35" fontFamily="Inter, sans-serif" fontSize="32" fontWeight="900" fill="url(#logo-gradient)">
      CryptoGuy<tspan fill="#00C853">TECH</tspan>
    </text>
  </svg>
);