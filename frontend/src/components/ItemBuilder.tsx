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
  if (!item || !item.item_name_en) return '';
  const normalized = item.item_name_en
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[ .'-]/g, '_')
    .replace(/__/g, '_');
  return `/static/images/equipments/${normalized}`;
};

export function ItemBuilder({ items, selectedItems, onUpdate, label }: ItemBuilderProps) {
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Отладка
  if (items.length > 0 && searchTerm === 'Когти') {
    console.log('Поиск "Когти":', items.filter(i => i.item_name_ru.includes('Когти')));
  }

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
      <h3 className="text-sm font-semibold text-slate-400 mb-2">{label}</h3>
      
      {/* Сетка из 6 слотов */}
      <div className="grid grid-cols-6 gap-2">
        {selectedItems.map((item, index) => (
          <div 
            key={index}
            className={`
              aspect-square rounded-full border-2 border-slate-700 bg-slate-800 
              flex items-center justify-center cursor-pointer relative group
              hover:border-blue-500 transition-colors
              ${!item ? 'border-dashed' : ''}
            `}
            onClick={() => setActiveSlotIndex(index)}
          >
            {item ? (
              <>
                <ImageWithFallback 
                  srcBase={`/static/images/equipments/${(item.item_name_en || '').toLowerCase().replace(/[ .'-]/g, '_').replace(/__/g, '_')}`} 
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
              <span className="text-slate-600 text-2xl">+</span>
            )}
          </div>
        ))}
      </div>

      {/* МОДАЛЬНОЕ ОКНО ВЫБОРА */}
      {activeSlotIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border border-slate-700">
            
            {/* Заголовок модалки */}
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900 rounded-t-2xl z-10">
              <h3 className="text-xl font-bold">Выбор предмета ({filteredItems.length})</h3>
              <button 
                onClick={() => setActiveSlotIndex(null)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Табы категорий */}
            <div className="flex overflow-x-auto p-2 border-b border-slate-700 gap-2 scrollbar-hide bg-slate-900 z-10 shrink-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors
                    ${activeCategory === cat.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
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
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
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
                  className="flex flex-col items-center gap-1 group"
                  onClick={() => handleSelect(item)}
                >
                  <div className="aspect-square w-full bg-slate-800 rounded-full border border-slate-700 cursor-pointer hover:border-blue-400 hover:scale-105 transition-all relative">
                    <ImageWithFallback 
                      srcBase={`/static/images/equipments/${(item.item_name_en || '').toLowerCase().replace(/[ .'-]/g, '_').replace(/__/g, '_')}`}
                      alt={item.item_name_ru}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 text-center leading-tight truncate w-full group-hover:text-blue-400">
                    {item.item_name_ru}
                  </span>
                </div>
              ))}
              
              {filteredItem