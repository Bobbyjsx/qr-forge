import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buttonVariants = cva(
  'tactile-button inline-flex items-center justify-center rounded-md font-medium disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap transition-all active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-brand-orange text-white border border-brand-orange hover:bg-orange-600 shadow-md shadow-orange-200',
        secondary: 'bg-zinc-50 text-zinc-900 border border-zinc-200 hover:bg-zinc-100',
        outline: 'bg-transparent border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white',
        ghost: 'text-zinc-400 hover:text-brand-orange hover:bg-orange-50',
        danger: 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white',
        cobalt: 'bg-cobalt text-white border border-cobalt hover:bg-opacity-90',
      },
      size: {
        sm: 'px-3 py-1.5 text-[11px] rounded-lg',
        md: 'px-4 py-2 text-[13px] rounded-xl',
        lg: 'px-8 py-3.5 text-base rounded-2xl',
        icon: 'p-2.5 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
