import React from 'react';

// Accept any props (including custom props like `variant`, `size`) used across the app
export const Button = React.forwardRef<HTMLButtonElement, any>(function Button(props, ref) {
  const { children, className = '', ...rest } = props;
  return (
    <button ref={ref} className={`btn ${className}`} {...rest}>
      {children}
    </button>
  );
});

export default Button;
