import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  animate?: boolean;
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = true,
  animate = true,
  ...props
}: CardProps) {
  const baseClass = 'rounded-2xl shadow border bg-[#181c23] backdrop-blur-xl text-white transition-all duration-300';
  const elevatedClass = 'shadow-xl border-blue-700';
  const glassClass = 'bg-[#23272f]/80 backdrop-blur-2xl border-blue-700';
  
  const variants = {
    default: 'border border-blue-700',
    elevated: 'shadow-2xl border border-blue-700',
    outlined: 'border-2 border-blue-700',
    glass: glassClass,
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover ? 'hover:shadow-blue-200/60 hover:scale-[1.03] hover:border-[#3578e5]' : '';
  const animateClasses = animate ? 'animate-fade-in' : '';

  const classes = `${baseClass} ${variants[variant]} ${paddings[padding]} ${hoverClasses} ${animateClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

// Card sub-components for better composition
Card.Header = function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`pb-4 border-b border-blue-700 font-bold text-lg text-white ${className}`}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`py-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`pt-4 border-t border-blue-700 text-white ${className}`}>
      {children}
    </div>
  );
}; 