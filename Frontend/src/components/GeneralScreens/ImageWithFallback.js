// components/ImageWithFallback.js
import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, fallback, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgSrc(fallback);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`image-container ${className || ''}`}>
      {isLoading && <div className="image-placeholder">Loading...</div>}
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
