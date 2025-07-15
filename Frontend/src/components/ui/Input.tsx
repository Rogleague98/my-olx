import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled';
}

export default function Input({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClass = 'w-full px-4 py-3 rounded-xl bg-[#FFFFFF] border border-[#FFD700] text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#A8FFEB]/40 transition';
  
  const variants = {
    default: '',
    filled: 'bg-primary-50',
  };

  const inputClasses = `${baseClass} ${variants[variant]} ${error ? 'border-error focus:border-error focus:ring-error' : ''} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-white">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={inputId}
          className={`${inputClasses} ${Icon && iconPosition === 'left' ? 'pl-12' : ''} ${Icon && iconPosition === 'right' ? 'pr-12' : ''}`}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-error animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
} 