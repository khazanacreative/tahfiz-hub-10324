import React from 'react';

export const Separator: React.FC<React.HTMLAttributes<HTMLHRElement>> = ({ className = '', ...rest }) => (
  <hr className={`separator ${className}`} {...rest} />
);

export default Separator;
