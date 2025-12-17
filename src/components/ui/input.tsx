import React from 'react';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input(props, ref) {
    const { className = '', ...rest } = props;
    return <input ref={ref} className={`input ${className}`} {...rest} />;
  }
);

export default Input;
