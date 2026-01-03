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
}

export function HeroSelector({ label, heroes, onSelect, selectedHero }: HeroSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Фильтрация героев по поиску
  const filteredHeroes = heroes.filter(hero => 
    hero.hero_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div 
        className="h-32 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-colors bg-slate-800/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedHero ? (
          <div className="flex flex-col items-center">
            <ImageWithFallback 
              srcBase={`/assets/images/hero_base_avatar_icons/${(selectedHero.hero_name_en || '').toLowerCase().replace(/[ .'-]/g, '_').replace(/__/g, '_')}`} 
              alt={selectedHero.hero_name}
              className="w-16 h-16 rounded-full border-2 border-blue-500 mb-2 object-cover"
            />
            <div className="text-xl font-bold">{selectedHero.hero_name}</div>
            <div className="text-sm text-slate-400">{selectedHero.main_role}</div>
            <div className="text-xs text-green-400 mt-2">Нажмите, чтобы изменить</div>
          </div>
        ) : (
          <span className="text-slate-500">+ Выбрать {label}</span>
        )}
      </div>

      {/* Модальное окно выбора (выпадающий список) */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 max-h-96 flex flex-col">
          
          {/* Поле поиска */}
          <div className="p-2 border-b border-slate-700 sticky top-0 bg-slate-800 rounded-t-lg">
            <input 
              type="text" 
              placeholder="Поиск героя..." 
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {/* Список героев */}
          <div className="overflow-y-auto flex-1">
            {filteredHeroes.map(hero => (
              <div 
                key={hero.hero_name}
                className="p-3 hover:bg-slate-700 cursor-pointer flex items-center gap-3 border-b border-slate-700/50 last:border-0"
                onClick={() => {
                  onSelect(hero);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                <ImageWithFallback 
                  srcBase={`/assets/images/hero_base_avatar_icons/${(hero.hero_name_en || '').toLowerCase().replace(/[ .'-]/g, '_').replace(/__/g, '_')}`} 
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1">
                    <div className="font-medium">{hero.hero_name}</div>
                    <div className="text-xs text-slate-400">{hero.main_role}</div>
                </div>
              </div>
            ))}
            
            {filteredHeroes.length === 0 && (
              <div className="p-4 text-center text-slate-500">Герои не найдены</div>
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
