import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-text transition-all",
              "focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
              "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
              icon && "pl-11",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <span className="text-sm text-red-500 animate-fade-in">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';