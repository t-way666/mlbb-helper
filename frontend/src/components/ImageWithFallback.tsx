'use client';

import { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcBase: string; // Путь без расширения
  fallbackSrc?: string;
}

export function ImageWithFallback({ 
  srcBase, 
  fallbackSrc = '/assets/images/roles/Assassin.webp',
  alt, 
  ...props 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!srcBase) {
      setImgSrc(fallbackSrc);
      return;
    }
    const path = srcBase.startsWith('/') ? srcBase : '/' + srcBase;
    setImgSrc(path + '.webp');
    setHasError(false);
  }, [srcBase, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  if (!isMounted || !imgSrc) {
    return <div className={props.className} style={{ minWidth: '20px', minHeight: '20px', background: '#1e293b' }} />;
  }

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      onError={handleError}
      {...props} 
    />
  );
}
