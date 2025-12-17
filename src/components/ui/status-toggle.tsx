'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface StatusToggleProps {
  value: string;
  onValueChange: (value: string) => void;
  option1: { value: string; label: string; icon?: React.ReactNode };
  option2: { value: string; label: string; icon?: React.ReactNode };
  className?: string;
}

export function StatusToggle({
  value,
  onValueChange,
  option1,
  option2,
  className,
}: StatusToggleProps) {
  const isOption1Selected = value === option1.value;

  return (
    <div
      className={cn(
        'relative inline-flex items-center rounded-full p-1 bg-gray-200 dark:bg-gray-800 transition-all',
        className
      )}
    >
      <div
        className={cn(
          'absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-emerald-600 to-lime-600 transition-all duration-300 ease-in-out',
          isOption1Selected ? 'left-1 right-[50%]' : 'left-[50%] right-1'
        )}
      />
      <button
        type="button"
        onClick={() => onValueChange(option1.value)}
        className={cn(
          'relative z-10 flex items-center justify-center gap-2 flex-1 py-2 rounded-full text-sm font-medium transition-colors duration-200',
          isOption1Selected
            ? 'text-white'
            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
        )}
      >
        {option1.icon}
        <span className="whitespace-nowrap">{option1.label}</span>
      </button>
      <button
        type="button"
        onClick={() => onValueChange(option2.value)}
        className={cn(
          'relative z-10 flex items-center justify-center gap-2 flex-1 py-2 rounded-full text-sm font-medium transition-colors duration-200',
          !isOption1Selected
            ? 'text-white'
            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
        )}
      >
        {option2.icon}
        <span className="whitespace-nowrap">{option2.label}</span>
      </button>
    </div>
  );
}
