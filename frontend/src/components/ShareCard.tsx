'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function ShareCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-primary/10 rounded-2xl p-6 border-2 border-primary/20 mt-8 shadow-inner">
      <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase text-sm tracking-wide">
        Поддержать проект
      </h3>
      <p className="text-muted text-xs leading-relaxed mb-4 font-medium">
        Мы постоянно работаем над новыми функциями. Если вам нравится сервис, расскажите о нем друзьям!
      </p>
      <button
        onClick={handleCopy}
        className="w-full py-3 bg-card hover:bg-background border-2 border-foreground/10 rounded-xl text-xs font-bold transition-all text-foreground uppercase tracking-widest flex items-center justify-center gap-2 group"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-green-600 dark:text-green-400">Скопировано!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
            <span>Копировать ссылку</span>
          </>
        )}
      </button>
    </div>
  );
}
