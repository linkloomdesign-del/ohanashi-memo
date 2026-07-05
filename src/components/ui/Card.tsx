import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-md p-5
        ${onClick ? 'cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
