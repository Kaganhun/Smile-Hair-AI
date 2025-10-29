
import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
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
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
    <path d="M5 22l-1-1" />
    <path d="M19 2l1 1" />
    <path d="M22 19l-1 1" />
    <path d="M2 5l1-1" />
    <path d="M19 22l1-1" />
    <path d="M5 2l-1 1" />
    <path d="M22 5l-1-1" />
  </svg>
);

export default SparklesIcon;
