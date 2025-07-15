import React, { useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'primary' | 'secondary' | 'accent' | 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
  as?: React.ElementType;
  to?: string;
}

const colorStyles: Record<string, { solid: string; outline: string; ghost: string }> = {
  primary: {
    solid: 'bg-gradient-to-r from-[#101624] via-[#1a2236] to-[#0a0e17] border border-blue-700 text-white shadow-md hover:shadow-blue-400/60 hover:scale-105 hover:border-blue-400 transition-all duration-300',
    outline: 'bg-transparent border-2 border-blue-700 text-white shadow hover:shadow-blue-400/60 hover:scale-105 hover:border-blue-400 transition-all duration-300',
    ghost: 'text-white bg-transparent hover:text-amber-400 hover:scale-105 transition-all duration-300',
  },
  secondary: {
    solid: 'text-secondary-700 bg-transparent',
    outline: 'border border-secondary-500 text-secondary-700 bg-transparent',
    ghost: 'text-secondary-700 bg-transparent',
  },
  accent: {
    solid: 'bg-gradient-to-r from-[#FFD700]/80 to-[#3578e5]/80 text-white border-none shadow-md hover:shadow-amber-200/60 hover:scale-105 transition-all duration-300',
    outline: 'bg-transparent border-2 border-amber-400 text-amber-300 shadow hover:shadow-amber-200/60 hover:scale-105 transition-all duration-300',
    ghost: 'text-amber-300 bg-transparent hover:text-blue-400 hover:scale-105 transition-all duration-300',
  },
  blue: {
    solid: 'bg-blue-700 border border-blue-700 text-white shadow-md hover:shadow-blue-400/60 hover:scale-105 hover:border-blue-400 transition-all duration-300',
    outline: 'bg-transparent border-2 border-blue-700 text-white shadow hover:shadow-blue-400/60 hover:scale-105 hover:border-blue-400 transition-all duration-300',
    ghost: 'text-blue-300 bg-transparent hover:text-amber-400 hover:scale-105 transition-all duration-300',
  },
  green: {
    solid: 'text-green-700 bg-transparent',
    outline: 'border border-green-500 text-green-700 bg-transparent',
    ghost: 'text-green-700 bg-transparent',
  },
  orange: {
    solid: 'text-orange-700 bg-transparent',
    outline: 'border border-orange-500 text-orange-700 bg-transparent',
    ghost: 'text-orange-700 bg-transparent',
  },
  purple: {
    solid: 'text-purple-700 bg-transparent',
    outline: 'border border-purple-500 text-purple-700 bg-transparent',
    ghost: 'text-purple-700 bg-transparent',
  },
  red: {
    solid: 'text-red-700 bg-transparent',
    outline: 'border border-red-500 text-red-700 bg-transparent',
    ghost: 'text-red-700 bg-transparent',
  },
  gray: {
    solid: 'bg-[#23272f] border border-blue-700 text-white shadow hover:shadow-blue-400/60 hover:scale-105 transition-all duration-300',
    outline: 'bg-transparent border-2 border-blue-700 text-white shadow hover:shadow-blue-400/60 hover:scale-105 transition-all duration-300',
    ghost: 'text-white bg-transparent hover:text-amber-400 hover:scale-105 transition-all duration-300',
  },
};

const sizeStyles = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
};

export default function Button({
  variant = 'solid',
  color = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  children,
  className = '',
  disabled,
  as: Component = 'button',
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  // Ripple effect handler
  const handleRipple = (e: React.MouseEvent) => {
    const button = btnRef.current;
    if (!button) return;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.className = 'ripple';
    button.appendChild(circle);
    setTimeout(() => {
      circle.remove();
    }, 600);
  };

  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-full transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden gap-2';
  const colorClass = colorStyles[color]?.[variant] || colorStyles.primary[variant];
  const sizeClass = sizeStyles[size];

  const classes = `${baseClasses} ${colorClass} ${sizeClass} ${className}`;

  return (
    <Component
      ref={btnRef}
      className={classes}
      disabled={disabled || loading}
      onClick={e => {
        handleRipple(e);
        if (props.onClick) props.onClick(e);
      }}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
      ) : null}
      <span className="flex items-center justify-center w-full h-full">{children}</span>
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
      )}
    </Component>
  );
}

// Add ripple CSS globally (in index.css):
// .ripple {
//   position: absolute;
//   border-radius: 50%;
//   transform: scale(0);
//   animation: ripple 0.6s linear;
//   background: rgba(255,255,255,0.4);
//   pointer-events: none;
//   z-index: 10;
// }
// @keyframes ripple {
//   to {
//     transform: scale(2.5);
//     opacity: 0;
//   }
// } 