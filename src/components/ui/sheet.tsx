import React from 'react';

type SheetProps = React.PropsWithChildren<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}> & React.HTMLAttributes<HTMLDivElement>;

type SheetContentProps = React.PropsWithChildren<{
  side?: 'top' | 'right' | 'bottom' | 'left';
}> & React.HTMLAttributes<HTMLDivElement>;

type SheetTriggerProps = React.PropsWithChildren<{
  asChild?: boolean;
}> & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Sheet: React.FC<SheetProps> = ({ children, className = '', ...rest }) => (
  <div className={`sheet ${className}`} {...rest}>{children}</div>
);

export const SheetContent: React.FC<SheetContentProps> = ({ children, className = '', side, ...rest }) => (
  <div className={`sheet-content ${className}`} data-side={side} {...rest}>{children}</div>
);

export const SheetTrigger: React.FC<SheetTriggerProps> = ({ children, className = '', ...rest }) => (
  <button {...rest} className={`sheet-trigger ${className}`}>{children}</button>
);

export default Sheet;
