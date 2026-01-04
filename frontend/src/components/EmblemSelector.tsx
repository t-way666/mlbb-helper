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
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-foreground/50 mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {emblems.map((emblem) => {
          const isSelected = selectedEmblem?.emblem_id === emblem.emblem_id;
          
          return (
            <div
              key={emblem.emblem_id}
              className={`
                w-12 h-12 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center p-1
                ${isSelected 
                  ? 'border-blue-400 bg-blue-500/20 scale-110 shadow-[0_0_15px_rgba(96,165,250,0.8)]' 
                  : 'border-foreground/10 bg-card hover:border-foreground/30'}
              `}
              onClick={() => onSelect(emblem)}
              title={emblem.emblem_name_ru}
            >
                  <ImageWithFallback 
                    srcBase={emblem.emblem_name_en ? `/assets/images/emblems/${emblem.emblem_name_en.toLowerCase().replace(/[ .'-]/g, '_').replace(/__/g, '_')}` : ''} 
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
