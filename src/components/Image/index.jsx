import React from 'react';

const Image = ({ id, className, src, alt, placeholder, value, callback }) => {
  return (
    <img
      id={id}
      className={className}
      src={src}
      alt={alt}
      callback={callback}
    />
  );
};

export default Image;
