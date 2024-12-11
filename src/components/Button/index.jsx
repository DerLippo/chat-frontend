import React from 'react';

const Button = ({ type, id, className, name, value, onClick }) => {
  return (
    <button
      type={type}
      id={id}
      className={className}
      name={name}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Button;
