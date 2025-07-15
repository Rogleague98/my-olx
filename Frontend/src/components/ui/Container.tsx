import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
  animate?: boolean;
}

export default function Container({
  children,
  className = '',
  size = 'lg',
  padding = 'md',
  center = true,
  animate = true,
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddings = {
    none: '',
    sm: 'px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
  };

  const centerClasses = center ? 'mx-auto' : '';
  const animateClasses = animate ? 'animate-fade-in' : '';

  const baseClass = 'w-full max-w-7xl mx-auto px-4 sm:px-8 bg-[#F6F7FB] text-[#181818]';

  const classes = `${sizes[size]} ${paddings[padding]} ${centerClasses} ${animateClasses} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
} 