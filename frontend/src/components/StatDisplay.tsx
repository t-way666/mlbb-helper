'use client';

import { useState } from 'react';
import { Item, Emblem } from '@/types/hero';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { transliterate } from '@/utils/translit';

interface StatDisplayProps {
  label: string;
  valueColor?: string; // цвет значения (text-yellow-400)
  baseValue: number;
  items: (Item | null)[];
  emblem: Emblem | null;
  statKey: keyof Item; // Какой стат искать в предметах (например, 'phys_attack')
  emblemStatKey?: keyof Emblem; // Если в эмблеме ключ отличается (опционально)
  isPercent?: boolean;
}

export function StatDisplay({ 
  label, 
  valueColor = "text-white", 
  baseValue, 
  items, 
  emblem, 
  statKey,
  emblemStatKey,
  isPercent = false
}: StatDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Форматтер значения
  const fmt = (val: number) => isPercent ? `${Math.round(val * 100)}%` : Math.round(val);

  // 1. Собираем разбивку бонусов
  const breakdown: { source: string; value: number; srcBase?: string; isEmblem?: boolean }[] = [];

  // Предметы
  items.forEach(item => {
    if (item && item[statKey]) {
      // @ts-expect-error: dynamic key access
      const val = Number(item[statKey]); 
      if (val > 0) {
        breakdown.push({
          source: item.item_name_ru,
          value: val,
          srcBase: `/assets/images/equipments/${transliterate(item.item_name_ru)}`
        });
      }
    }
  });

  // Эмблема
  const eKey = emblemStatKey || (statKey as keyof Emblem);
  if (emblem && emblem[eKey]) {
     // @ts-expect-error: dynamic key access
    const val = Number(emblem[eKey]);
    if (val > 0) {
      breakdown.push({
        source: `Эмблема (${emblem.emblem_name_ru})`,
        value: val,
        srcBase: `/assets/images/emblems/${emblem.emblem_name_ru}`,
        isEmblem: true
      });
    }
  }

  // 2. Считаем сумму бонусов
  const totalBonus = breakdown.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="flex justify-between p-2 bg-card rounded relative border border-foreground/5">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        {/* Базовое значение */}
        <span className={valueColor}>{fmt(baseValue)}</span>
        
        {/* Бонусное значение (Кликабельное) */}
        {totalBonus > 0 && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs text-green-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/30 hover:bg-green-500/20 hover:border-green-500 transition-all cursor-pointer"
            title="Нажмите для детализации"
          >
            +{fmt(totalBonus)}
          </button>
        )}
      </div>

      {/* Детализация (Popover) */}
      {isOpen && (
        <>
          {/* Оверлей для закрытия кликом вне */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-foreground/20 rounded-lg shadow-2xl z-20 p-3 animate-in fade-in zoom-in-95 duration-200">
             <h4 className="text-xs font-bold text-foreground/40 mb-2 uppercase tracking-wider border-b border-foreground/10 pb-1">Источник бонусов</h4>
             <ul className="space-y-2">
               {breakdown.map((item, idx) => (
                 <li key={idx} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2">
                     {item.srcBase && (
                       <ImageWithFallback 
                         srcBase={item.srcBase} 
                         className="w-5 h-5 rounded-full bg-foreground/10 object-cover" 
                         alt="" 
                       />
                     )}
                     <span className="text-foreground/80 truncate max-w-[140px]">{item.source}</span>
                   </div>
                   <span className="text-green-400 font-mono">+{fmt(item.value)}</span>
                 </li>
               ))}
             </ul>
             <div className="mt-2 pt-2 border-t border-foreground/10 flex justify-between text-xs font-bold">
               <span>Всего бонусов:</span>
               <span className="text-green-400">+{fmt(totalBonus)}</span>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
