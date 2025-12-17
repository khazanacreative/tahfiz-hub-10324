import React from 'react';

type PopoverProps = React.PropsWithChildren<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}> & React.HTMLAttributes<HTMLDivElement>;

type PopoverContentProps = React.PropsWithChildren<{
  align?: 'start' | 'center' | 'end';
}> & React.HTMLAttributes<HTMLDivElement>;

type PopoverTriggerProps = React.PropsWithChildren<{
  asChild?: boolean;
}> & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Popover: React.FC<PopoverProps> = ({ children, className = '', ...rest }) => (
  <div className={`popover ${className}`} {...rest}>{children}</div>
);

export const PopoverContent: React.FC<PopoverContentProps> = ({ children, className = '', align, ...rest }) => (
  <div className={`popover-content ${className}`} data-align={align} {...rest}>{children}</div>
);

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, className = '', ...rest }) => (
  <button {...rest} className={`popover-trigger ${className}`}>{children}</button>
);

export default Popover;
