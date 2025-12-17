import React from 'react';

type CollapsibleProps = React.PropsWithChildren<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}> & React.HTMLAttributes<HTMLDivElement>;

type CollapsibleTriggerProps = React.PropsWithChildren<{
  asChild?: boolean;
}> & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Collapsible: React.FC<CollapsibleProps> = ({ children, className = '', ...rest }) => (
  <div className={`collapsible ${className}`} {...rest}>{children}</div>
);

export const CollapsibleContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => (
  <div className={`collapsible-content ${className}`} {...rest}>{children}</div>
);

export const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({ children, className = '', ...rest }) => (
  <button {...rest} className={`collapsible-trigger ${className}`}>{children}</button>
);

export default Collapsible;
