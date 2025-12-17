import React from 'react';

export const Progress: React.FC<React.HTMLAttributes<HTMLDivElement> & { value?: number }> = ({ value = 0, className = '', ...rest }) => (
  <div className={`progress ${className}`} {...rest}>
    <div className="progress-bar" style={{ width: `${value}%` }} />
  </div>
);

export default Progress;
