import React from 'react';

const Input = ({
  id,
  className,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      id={id}
      className={className}
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
