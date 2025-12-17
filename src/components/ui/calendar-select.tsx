'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  items: Array<{ value: string; label: string; shortLabel?: string }>;
  placeholder?: string;
  columns?: number;
  className?: string;
}

export function CalendarSelect({
  value,
  onValueChange,
  items,
  placeholder = 'Pilih',
  columns = 5,
  className,
}: CalendarSelectProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  
  const selectedItem = items.find((item) => item.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between h-9 text-xs', className)}
        >
          {selectedItem ? selectedItem.label : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2" align="start">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {items.map((item) => (
            <Button
              key={item.value}
              variant={value === item.value ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'h-9 text-xs justify-center',
                value === item.value
                  ? 'bg-gradient-to-r from-emerald-600 to-lime-600 text-white hover:from-emerald-700 hover:to-lime-700'
                  : 'hover:bg-emerald-50'
              )}
              onClick={() => {
                onValueChange(item.value);
                setOpen(false);
              }}
            >
              {item.shortLabel || item.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
