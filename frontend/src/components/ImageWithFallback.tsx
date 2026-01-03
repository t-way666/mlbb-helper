'use client';

import { useState, useEffect } from 'react';
import { transliterate } from '@/utils/translit';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcBase: string; // Путь без расширения, например '/static/images/equipments/item'
  fallbackSrc?: string;
}

// Порядок попыток: .webp, .png, транслит, транслит_min
const EXTENSIONS = ['.webp', '.png'];

export function ImageWithFallback({ 
  srcBase, 
  fallbackSrc = '/static/images/roles/Assassin.webp',
  alt, 
  ...props 
}: ImageWithFallbackProps) {
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  // Сбрасываем попытки при изменении базового пути
  useEffect(() => {
    setAttemptIndex(0);
  }, [srcBase]);

  // Логика формирования текущего пути
  useEffect(() => {
    if (!srcBase) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    if (attemptIndex < EXTENSIONS.length) {
      // 1. Пробуем основные расширения (.webp, .png)
      setCurrentSrc(`${srcBase}${EXTENSIONS[attemptIndex]}`);
    } else if (attemptIndex === EXTENSIONS.length && alt) {
      // 2. Пробуем транслит русского названия
      const parts = srcBase.split('/');
      const dir = parts.slice(0, -1).join('/');
      const translitName = transliterate(alt).replace(/[^a-z0-9_]/g, '_').replace(/__/g, '_');
      setCurrentSrc(`${dir}/${translitName}.webp`);
    } else if (attemptIndex === EXTENSIONS.length + 1 && alt) {
      // 3. Пробуем транслит с суффиксом _min
      const parts = srcBase.split('/');
      const dir = parts.slice(0, -1).join('/');
      const translitName = transliterate(alt).replace(/[^a-z0-9_]/g, '_').replace(/__/g, '_');
      setCurrentSrc(`${dir}/${translitName}_min.webp`);
    } else {
      // 4. Фоллбек, если ничего не помогло
      setCurrentSrc(fallbackSrc);
    }
  }, [srcBase, attemptIndex, fallbackSrc, alt]);

  // Отладка путей в консоли
  useEffect(() => {
    if (currentSrc && srcBase && srcBase.includes('equipment')) {
      console.log(`[ImageDebug] srcBase: ${srcBase}, currentSrc: ${currentSrc}, attempt: ${attemptIndex}`);
    }
  }, [currentSrc, srcBase, attemptIndex]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setAttemptIndex(prev => prev + 1);
    }
  };

  // Пока путь не определен, рендерим пустой блок
  if (!currentSrc) {
    return <div className={props.className} style={{ minWidth: '20px', minHeight: '20px' }} />;
  }

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      onError={handleError}
      {...props} 
    />
  );
}