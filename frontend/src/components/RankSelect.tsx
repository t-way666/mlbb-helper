'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RankSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  colorClass?: string; // e.g. "text-primary", "text-green-500"
  label?: string;
}

const getBaseRank = (full: string) => full.split(' ')[0];

const getRankIcon = (full: string) => {
  if (full.includes('Honor')) return 'mythical-honor';
  if (full.includes('Glory')) return 'mythical-glory';
  if (full.includes('Immortal')) return 'mythical-immortal';
  return getBaseRank(full).toLowerCase();
};

export function RankSelect({ value, onChange, options, colorClass = "text-foreground", label }: RankSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentIcon = getRankIcon(value);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-background border-2 border-foreground/10 rounded-2xl p-3 outline-none flex items-center justify-between gap-3 transition-all hover:border-foreground/30 ${isOpen ? 'border-foreground/30 ring-2 ring-primary/20' : ''}`}
      >
        <div className="flex items-center gap-3">
            {/* Small icon in input */}
            <div className="w-8 h-8 relative flex-shrink-0">
                 <img 
                    src={`/assets/images/ranks/${currentIcon}.webp`} 
                    alt={value}
                    className="w-full h-full object-contain drop-shadow-sm"
                 />
            </div>
            <span className="font-bold text-sm truncate">{value}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-card border-2 border-foreground/10 rounded-2xl shadow-2xl overflow-hidden max-h-[300px] flex flex-col"
          >
            <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {options.map((option) => {
                const icon = getRankIcon(option);
                const isSelected = option === value;
                
                return (
                  <button
                    key={option}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all text-left group hover:bg-foreground/5 ${isSelected ? 'bg-primary/10' : ''}`}
                  >
                    <div className="w-8 h-8 flex-shrink-0">
                        <img 
                            src={`/assets/images/ranks/${icon}.webp`} 
                            alt={option}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <span className={`text-sm font-medium flex-1 ${isSelected ? colorClass + ' font-bold' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {option}
                    </span>
                    {isSelected && <Check className={`w-4 h-4 ${colorClass}`} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
