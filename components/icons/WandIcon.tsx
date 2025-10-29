
import React from 'react';

const WandIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 4V2" />
    <path d="M15 10V8" />
    <path d="M12.5 7.5L11 6" />
    <path d="M18.5 7.5L20 6" />
    <path d="M20 13h2" />
    <path d="M4 13H2" />
    <path d="M18.5 18.5L20 20" />
    <path d="M11.5 18.5L10 20" />
    <path d="m3 21 9-9" />
    <path d="M12.5 11.5L14 10" />
  </svg>
);

export default WandIcon;
