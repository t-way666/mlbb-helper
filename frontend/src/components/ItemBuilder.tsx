'use client';

import { useState } from 'react';
import { Item } from '@/types/hero';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { transliterate } from '@/utils/translit';

interface ItemBuilderProps {
  items: Item[];
  selectedItems: (Item | null)[];
  onUpdate: (newItems: (Item | null)[]) => void;
  label: string; // "Снаряжение атакующего"
}

// Категории предметов (как в базе данных)
const CATEGORIES = [
  { id: 'All', label: 'Все', icon: '∞' },
  { id: 'Атака', label: 'Атака', icon: '⚔️' },
  { id: 'Магия', label: 'Магия', icon: '🔮' },
  { id: 'Защита', label: 'Защита', icon: '🛡️' },
  { id: 'Движение', label: 'Движение', icon: '👞' },
  { id: 'Прочее', label: 'Прочее', icon: '📦' },
];

const getItemIconPath = (item: Item | null) => {
  if (!item) return '';
  
  // Приоритет - английское название из БД
  const nameToNormalize = item.item_name_en || item.item_name_ru;
  const normalized = nameToNormalize
    .toLowerCase()
    .replace(/[ .'-_]/g, ''); // Удаляем пробелы, точки, апострофы, дефисы и подчеркивания
    
  return `/assets/images/equipments/${normalized}`;
};

export function ItemBuilder({ items, selectedItems, onUpdate, label }: ItemBuilderProps) {
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Отфильтрованные предметы для модалки
  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.item_name_ru.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (item: Item) => {
    if (activeSlotIndex === null) return;
    
    // Создаем копию массива (не мутируем напрямую!)
    const newItems = [...selectedItems];
    newItems[activeSlotIndex] = item;
    
    onUpdate(newItems);
    setActiveSlotIndex(null); // Закрываем модалку
    setSearchTerm('');
  };

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Чтобы не открывалась модалка
    const newItems = [...selectedItems];
    newItems[index] = null;
    onUpdate(newItems);
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-foreground/50 mb-2">{label}</h3>
      
      {/* Сетка из 6 слотов */}
      <div className="grid grid-cols-6 gap-2">
        {selectedItems.map((item, index) => (
          <div 
            key={index}
            className={`
              aspect-square rounded-full border-2 border-foreground/10 bg-card 
              flex items-center justify-center cursor-pointer relative group
              hover:border-blue-500 transition-colors
              ${!item ? 'border-dashed' : ''}
            `}
            onClick={() => setActiveSlotIndex(index)}
          >
            {item ? (
              <>
                <ImageWithFallback 
                  srcBase={getItemIconPath(item)} 
                  alt={item.item_name_ru}
                  className="w-full h-full object-cover rounded-full"
                  title={item.item_name_ru}
                />
                {/* Кнопка удаления (появляется при наведении) */}
                <button 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleRemove(e, index)}
                >
                  ×
                </button>
              </>
            ) : (
              <span className="text-foreground/20 text-2xl">+</span>
            )}
          </div>
        ))}
      </div>

      {/* МОДАЛЬНОЕ ОКНО ВЫБОРА */}
      {activeSlotIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border border-foreground/10 overflow-hidden">
            
            {/* Заголовок модалки */}
            <div className="p-4 border-b border-foreground/10 flex justify-between items-center bg-card">
              <h3 className="text-xl font-bold">Выбор предмета ({filteredItems.length})</h3>
              <button 
                onClick={() => setActiveSlotIndex(null)}
                className="text-foreground/50 hover:text-foreground text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Табы категорий */}
            <div className="flex overflow-x-auto p-2 border-b border-foreground/10 gap-2 scrollbar-hide bg-card shrink-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors
                    ${activeCategory === cat.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-background text-foreground/50 hover:bg-foreground/5'}
                  `}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Поиск */}
            <div className="p-4 pb-0">
              <input 
                type="text" 
                placeholder="Поиск предмета..." 
                className="w-full bg-background border border-foreground/10 rounded-lg p-3 text-foreground focus:border-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            {/* Сетка предметов */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 min-h-[300px]">
              {filteredItems.map(item => (
                <div 
                  key={item.item_id}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                  onClick={() => handleSelect(item)}
                >
                  <div className="aspect-square w-full bg-background rounded-full border border-foreground/5 hover:border-blue-400 hover:scale-105 transition-all relative">
                    <ImageWithFallback 
                      srcBase={getItemIconPath(item)}
                      alt={item.item_name_ru}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="text-[10px] text-foreground/50 text-center leading-tight truncate w-full group-hover:text-blue-500">
                    {item.item_name_ru}
                  </span>
                </div>
              ))}
              
              {filteredItems.length === 0 && (
                <div className="col-span-full text-center text-foreground/30 py-10">
                  Предметы не найдены
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
