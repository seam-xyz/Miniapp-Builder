import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, fallbackSrc, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    const testImage = new Image();
    testImage.src = src as string;

    testImage.onload = () => {
      if (isMounted) {
        setImgSrc(src);
      }
    };

    testImage.onerror = () => {
      if (isMounted) {
        setImgSrc(fallbackSrc);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [src, fallbackSrc]);

  if (imgSrc === undefined) {
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />
    );
  }

  return <img className="object-cover h-full w-full" src={imgSrc} {...props} />;
};

export default ImageWithFallback;