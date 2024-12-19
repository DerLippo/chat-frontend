import React from 'react';

const Textarea = ({
  id,
  className,
  name,
  placeholder,
  value,
  onChange,
  onKeyDown,
  onKeyUp,
}) => {
  return (
    <textarea
      id={id}
      className={className}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      value={value}
    />
  );
};

export default Textarea;
