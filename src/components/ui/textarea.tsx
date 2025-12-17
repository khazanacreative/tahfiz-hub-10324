import React from 'react';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea(props, ref) {
    const { className = '', ...rest } = props;
    return <textarea ref={ref} className={`textarea ${className}`} {...rest} />;
  }
);

export default Textarea;
