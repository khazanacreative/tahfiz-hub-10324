import React from 'react';

// Use permissive any props to match expected props like `open`, `onOpenChange`, `size`, `variant`, etc.
export const Dialog: React.FC<any> = ({ children, ...props }) => <div className="dialog" {...props}>{children}</div>;
export const DialogContent: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={`dialog-content ${className}`} {...rest}>{children}</div>
);
export const DialogHeader: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={`dialog-header ${className}`} {...rest}>{children}</div>
);
export const DialogTitle: React.FC<any> = ({ children, className = '', ...rest }) => (
  <h3 className={`dialog-title ${className}`} {...rest}>{children}</h3>
);
export const DialogTrigger: React.FC<any> = ({ children, className = '', ...rest }) => (
  <button className={`dialog-trigger ${className}`} {...rest}>{children}</button>
);

export const DialogDescription: React.FC<any> = ({ children, className = '', ...rest }) => (
  <p className={`dialog-description ${className}`} {...rest}>{children}</p>
);

export const DialogFooter: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={`dialog-footer ${className}`} {...rest}>{children}</div>
);

export default Dialog;
