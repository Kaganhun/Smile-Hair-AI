import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background Circle/Shield */}
    <path
      d="M50 5C25.147 5 5 25.147 5 50C5 74.853 25.147 95 50 95C74.853 95 95 74.853 95 50C95 25.147 74.853 5 50 5Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z"
      stroke="currentColor"
      strokeWidth="3"
    />
    
    {/* Stylized Hair Follicle / S Shape */}
    <path
      d="M50 75C61.0457 75 70 66.0457 70 55C70 43.9543 61.0457 35 50 35"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M35 55C35 63.2843 41.7157 70 50 70"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
    
    {/* Follicle Top */}
    <circle cx="50" cy="28" r="6" fill="currentColor" />
  </svg>
);

export default Logo;