'use client';

import { Emblem } from '@/types/hero';
import { ImageWithFallback } from '@/components/ImageWithFallback';

interface EmblemSelectorProps {
  emblems: Emblem[];
  selectedEmblem: Emblem | null;
  onSelect: (emblem: Emblem) => void;
  label: string;
}

export function EmblemSelector({ emblems, selectedEmblem, onSelect, label }: EmblemSelectorProps) {
  const getEmblemColor = (emblem: Emblem) => {
    const n = emblem.emblem_name_ru.toLowerCase();
    const e = emblem.emblem_name_en.toLowerCase();
    
    if (n.includes('боец') || e.includes('fighter')) return { border: 'border-red-500', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.8)]', bg: 'bg-red-500/20' };
    if (n.includes('маг') || e.includes('mage')) return { border: 'border-blue-500', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.8)]', bg: 'bg-blue-500/20' };
    if (n.includes('танк') || e.includes('tank')) return { border: 'border-orange-500', shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.8)]', bg: 'bg-orange-500/20' };
    if (n.includes('убийца') || e.includes('assassin')) return { border: 'border-purple-500', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.8)]', bg: 'bg-purple-500/20' };
    if (n.includes('поддерж') || e.includes('support')) return { border: 'border-emerald-500', shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.8)]', bg: 'bg-emerald-500/20' };
    if (n.includes('стрелок') || e.includes('marksman')) return { border: 'border-amber-400', shadow: 'shadow-[0_0_20px_rgba(251,191,36,0.8)]', bg: 'bg-amber-400/20' };
    
    return { border: 'border-slate-200', shadow: 'shadow-[0_0_20px_rgba(241,245,249,0.8)]', bg: 'bg-slate-200/20' };
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-foreground/50 mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {emblems.map((emblem) => {
          const isSelected = selectedEmblem?.emblem_id === emblem.emblem_id;
          const colors = isSelected ? getEmblemColor(emblem) : null;
          
          return (
            <div
              key={emblem.emblem_id}
              className={`
                w-12 h-12 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center p-1
                ${isSelected 
                  ? `${colors?.border} ${colors?.bg} ${colors?.shadow} scale-110` 
                  : 'border-foreground/10 bg-card hover:border-foreground/30'}
              `}
              onClick={() => onSelect(emblem)}
              title={emblem.emblem_name_ru}
            >
                  <ImageWithFallback 
                    srcBase={emblem.emblem_name_en ? `/assets/images/emblems/${emblem.emblem_name_en.toLowerCase().replace(/[^a-z0-9]/g, '')}` : ''} 
                    alt={emblem.emblem_name_ru}
                    className="w-full h-full object-contain"
                  />
            </div>
          );
        })}
      </div>
    </div>
  );
}
