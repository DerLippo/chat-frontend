import React from 'react';

const Textarea = ({ id, className, name, placeholder, value, onChange }) => {
  return (
    <textarea
      id={id}
      className={className}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

export default Textarea;
