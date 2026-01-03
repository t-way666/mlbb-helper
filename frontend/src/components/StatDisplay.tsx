'use client';

import { useState } from 'react';
import { Item, Emblem } from '@/types/hero';

interface StatDisplayProps {
  label: string;
  valueColor?: string; // цвет значения (text-yellow-400)
  baseValue: number;
  items: (Item | null)[];
  emblem: Emblem | null;
  statKey: keyof Item; // Какой стат искать в предметах (например, 'phys_attack')
  emblemStatKey?: keyof Emblem; // Если в эмблеме ключ отличается (опционально)
}

export function StatDisplay({ 
  label, 
  valueColor = "text-white", 
  baseValue, 
  items, 
  emblem, 
  statKey,
  emblemStatKey 
}: StatDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Собираем разбивку бонусов
  const breakdown: { source: string; value: number; icon?: string }[] = [];

  // Предметы
  items.forEach(item => {
    if (item && item[statKey]) {
      // @ts-ignore - мы проверили наличие ключа выше, но TS может ругаться на типы значений
      const val = Number(item[statKey]); 
      if (val > 0) {
        breakdown.push({
          source: item.item_name_ru,
          value: val,
          icon: `/static/images/equipments/${item.item_name_ru.replace(/[\s-]+/g, '_')}.png`
        });
      }
    }
  });

  // Эмблема
  const eKey = emblemStatKey || (statKey as keyof Emblem);
  if (emblem && emblem[eKey]) {
     // @ts-ignore
    const val = Number(emblem[eKey]);
    if (val > 0) {
      breakdown.push({
        source: `Эмблема (${emblem.emblem_name_ru})`,
        value: val,
        icon: `/static/images/emblems/${emblem.emblem_name_ru}.png`
      });
    }
  }

  // 2. Считаем сумму бонусов
  const totalBonus = breakdown.reduce((sum, item) => sum + item.value, 0);
  
  // Безопасный вывод
  const displayBase = isNaN(baseValue) ? 0 : Math.round(baseValue);
  const displayBonus = isNaN(totalBonus) ? 0 : Math.round(totalBonus);

  return (
    <div className="flex justify-between p-2 bg-slate-800 rounded relative">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        {/* Базовое значение */}
        <span className={valueColor}>{displayBase}</span>
        
        {/* Бонусное значение (Кликабельное) */}
        {displayBonus > 0 && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs text-green-400 font-bold bg-green-900/30 px-1.5 py-0.5 rounded border border-green-800 hover:bg-green-900/50 hover:border-green-500 transition-all cursor-pointer"
            title="Нажмите для детализации"
          >
            +{displayBonus}
          </button>
        )}
      </div>

      {/* Детализация (Popover) */}
      {isOpen && (
        <>
          {/* Оверлей для закрытия кликом вне */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-600 rounded-lg shadow-2xl z-20 p-3 animate-in fade-in zoom-in-95 duration-200">
             <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider border-b border-slate-700 pb-1">Источник бонусов</h4>
             <ul className="space-y-2">
               {breakdown.map((item, idx) => (
                 <li key={idx} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2">
                     {item.icon && <img src={item.icon} className="w-5 h-5 rounded-full bg-slate-800" alt="" />}
                     <span className="text-slate-200 truncate max-w-[140px]">{item.source}</span>
                   </div>
                   <span className="text-green-400 font-mono">+{item.value}</span>
                 </li>
               ))}
             </ul>
             <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between text-xs font-bold">
               <span>Всего бонусов:</span>
               <span className="text-green-400">+{totalBonus}</span>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
