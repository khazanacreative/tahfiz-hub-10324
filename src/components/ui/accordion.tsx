import React from 'react';

export const Accordion: React.FC<any> = ({ children, ...props }) => <div className="accordion" {...props}>{children}</div>;
export const AccordionItem: React.FC<any> = ({ children, ...props }) => (
  <div className="accordion-item" {...props}>{children}</div>
);
export const AccordionTrigger: React.FC<any> = ({ children, ...rest }) => (
  <button {...rest} className="accordion-trigger">{children}</button>
);
export const AccordionContent: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={`accordion-content ${className}`} {...rest}>{children}</div>
);

export default Accordion;
