'use client';

import React from 'react';

interface LargeButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'orange' | 'danger';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const variantClasses = {
  primary: 'bg-main text-white hover:brightness-110 active:brightness-95',
  secondary: 'bg-sub-blue text-white hover:brightness-110 active:brightness-95',
  orange: 'bg-sub-orange text-white hover:brightness-110 active:brightness-95',
  danger: 'bg-danger text-white hover:brightness-110 active:brightness-95',
};

export default function LargeButton({
  children,
  onClick,
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  type = 'button',
}: LargeButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        min-h-[72px] rounded-2xl font-bold text-2xl
        transition-all duration-150 shadow-md
        flex items-center justify-center gap-3 px-6
        ${fullWidth ? 'w-full' : 'px-8'}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  );
}
