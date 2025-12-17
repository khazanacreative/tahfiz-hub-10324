import React from 'react';

export const ScrollArea: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={`scroll-area ${className}`} {...rest}>{children}</div>
);

export default ScrollArea;
