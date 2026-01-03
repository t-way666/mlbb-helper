'use client';

import { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcBase: string; // Путь без расширения, например '/static/images/equipments/item'
  fallbackSrc?: string;
}

// Убираем _min.webp, так как их нет, оставляем только основные
const EXTENSIONS = ['.webp', '.png'];

export function ImageWithFallback({ 
  srcBase, 
  fallbackSrc = '/static/images/roles/Assassin.webp',
  alt, 
  ...props 
}: ImageWithFallbackProps) {
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  // Формируем путь при изменении srcBase или попытки
  useEffect(() => {
    if (!srcBase) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    if (attemptIndex < EXTENSIONS.length) {
      setCurrentSrc(`${srcBase}${EXTENSIONS[attemptIndex]}`);
    } else {
      setCurrentSrc(fallbackSrc);
    }
  }, [srcBase, attemptIndex, fallbackSrc]);

  const handleError = () => {
    console.warn(`[ImageWithFallback] Failed to load: ${currentSrc}. Trying next...`);
    setAttemptIndex(prev => prev + 1);
  };

  if (!currentSrc) return <div className={props.className} />;

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      onError={handleError}
      {...props} 
    />
  );
}
