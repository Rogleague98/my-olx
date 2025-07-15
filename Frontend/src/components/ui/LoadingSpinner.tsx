import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`} role="status" aria-live="polite">
      <div className={`relative ${sizes[size]} mb-4`}>
        <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-primary-400 via-secondary-400 to-accent-400 opacity-30 blur-sm animate-pulse-glow`} />
        <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-primary-200 via-primary-100 to-secondary-100 animate-shimmer`} />
        <div className={`${sizes[size]} border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin`} />
      </div>
      {text && <p className="text-primary-600 text-center">{text}</p>}
    </div>
  );
} 