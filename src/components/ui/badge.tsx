import React from 'react';

export const Badge: React.FC<any> = ({ children, className = '', ...rest }) => (
  <span className={`badge ${className}`} {...rest}>
    {children}
  </span>
);

export default Badge;
