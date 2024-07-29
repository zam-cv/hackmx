import React from 'react';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => {
    return <input 
      className="p-3 h-12 w-full rounded-md outline-none text-gray-200 bg-p-accent-background border text-base border-p-border" 
      ref={ref} 
      {...props} 
    />;
  }
);

export default Input;