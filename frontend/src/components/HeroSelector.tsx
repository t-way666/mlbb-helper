'use client';

import { useState } from 'react';
import { Hero } from '@/types/hero';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { transliterate } from '@/utils/translit';

interface HeroSelectorProps {
  label: string;
  heroes: Hero[];
  onSelect: (hero: Hero) => void;
  selectedHero: Hero | null;
  variant?: 'red' | 'blue';
}

export function HeroSelector({ label, heroes, onSelect, selectedHero, variant = 'blue' }: HeroSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const colors = {
    blue: {
      border: 'border-blue-500',
      shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
      hover: 'hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
    },
    red: {
      border: 'border-red-500',
      shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
      hover: 'hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
    }
  }[variant];

  // Фильтрация героев по поиску
  const filteredHeroes = heroes.filter(hero => 
    hero.name.ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hero.name.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative flex flex-col items-center">
      <div 
        className={`
          w-40 h-40 border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-background/30 rounded-full
          ${selectedHero 
            ? `${colors.border} ${colors.shadow} scale-105` 
            : `border-dashed border-slate-500 dark:border-slate-700 animate-pulse-subtle ${colors.hover}`}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedHero ? (
          <div className="flex flex-col items-center p-2 text-center">
            <ImageWithFallback 
              srcBase={`/assets/images/hero_base_avatar_icons/${selectedHero.image_id}`} 
              alt={selectedHero.name.ru}
              className={`w-20 h-20 rounded-full border-2 ${colors.border} mb-1 object-cover`}
            />
            <div className="text-sm font-bold truncate max-w-[120px] text-foreground">{selectedHero.name.ru}</div>
            <div className="text-[10px] text-muted uppercase tracking-tighter font-bold">{selectedHero.roles.ru.join(' / ')}</div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-4">
            <span className="text-3xl text-muted/40 mb-1">+</span>
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{label}</span>
          </div>
        )}
      </div>

      {/* Модальное окно выбора (выпадающий список) */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-background border-2 border-foreground/20 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] max-h-96 flex flex-col overflow-hidden">
          
          {/* Поле поиска */}
          <div className="p-3 border-b border-foreground/10 sticky top-0 bg-background z-20">
            <input 
              type="text" 
              placeholder="Поиск героя..." 
              className="w-full bg-background border border-foreground/10 rounded p-2 text-foreground focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {/* Список героев */}
          <div className="overflow-y-auto flex-1">
            {filteredHeroes.map(hero => (
              <div 
                key={hero.id}
                className="p-3 hover:bg-foreground/5 cursor-pointer flex items-center gap-3 border-b border-foreground/5 last:border-0"
                onClick={() => {
                  onSelect(hero);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                <ImageWithFallback 
                  srcBase={`/assets/images/hero_base_avatar_icons/${hero.image_id}`} 
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1">
                    <div className="font-medium">{hero.name.ru}</div>
                    <div className="text-xs text-foreground/40">{hero.roles.ru.join(' / ')}</div>
                </div>
              </div>
            ))}
            
            {filteredHeroes.length === 0 && (
              <div className="p-4 text-center text-foreground/30">Герои не найдены</div>
            )}
          </div>
        </div>
      )}
      
      {/* Оверлей, чтобы закрыть меню при клике вне его */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
