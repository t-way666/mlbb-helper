'use client';

import React, { useState, useMemo } from 'react';
import { Hero } from '@/types/hero';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Reveal } from '@/components/Reveal';

interface HeroesClientProps {
  heroes: Hero[];
}

type SortKey = 'name' | 'hp' | 'phys_atk' | 'phys_def' | 'mag_def' | 'move_speed' | 'atk_speed';

const COLUMNS = [
  { id: 'roles', label: 'Роли' },
  { id: 'hp', label: 'HP' },
  { id: 'phys_atk', label: 'Атака' },
  { id: 'phys_def', label: 'Физ. Защ' },
  { id: 'mag_def', label: 'Маг. Защ' },
  { id: 'move_speed', label: 'Скорость' },
  { id: 'atk_speed', label: 'Ск. Атаки' },
];

export default function HeroesClient({ heroes }: HeroesClientProps) {
  const [level, setLevel] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Состояние видимости колонок
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['roles', 'hp', 'phys_atk', 'phys_def', 'mag_def', 'move_speed', 'atk_speed']);

  // Инициализация из localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('heroes_visible_columns');
    if (saved) {
      try {
        setVisibleColumns(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing saved columns', e);
      }
    }
  }, []);

  const toggleColumn = (id: string) => {
    const next = visibleColumns.includes(id)
      ? visibleColumns.filter(c => c !== id)
      : [...visibleColumns, id];
    setVisibleColumns(next);
    localStorage.setItem('heroes_visible_columns', JSON.stringify(next));
  };

  const isVisible = (id: string) => visibleColumns.includes(id);

  const roles = useMemo(() => {
    const allRoles = new Set<string>();
    heroes.forEach(h => h.roles.ru.forEach(r => allRoles.add(r)));
    return ['All', ...Array.from(allRoles).sort()];
  }, [heroes]);

  const getVal = (hero: Hero, key: SortKey, lvl: number) => {
    switch (key) {
      case 'name': return hero.name.ru;
      case 'hp': return hero.stats.hp.base + hero.stats.hp.growth * (lvl - 1);
      case 'phys_atk': return hero.stats.phys_atk.base + hero.stats.phys_atk.growth * (lvl - 1);
      case 'phys_def': return hero.stats.phys_def.base + hero.stats.phys_def.growth * (lvl - 1);
      case 'mag_def': return hero.stats.mag_def.base + hero.stats.mag_def.growth * (lvl - 1);
      case 'move_speed': return hero.stats.move_speed;
      case 'atk_speed': return hero.stats.atk_speed.base + hero.stats.atk_speed.growth * (lvl - 1);
      default: return 0;
    }
  };

  const filteredAndSortedHeroes = useMemo(() => {
    return heroes
      .filter(h => {
        const matchesSearch = h.name.ru.toLowerCase().includes(search.toLowerCase()) || 
                             h.name.en.toLowerCase().includes(search.toLowerCase());
        const matchesRole = selectedRole === 'All' || h.roles.ru.includes(selectedRole);
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        const valA = getVal(a, sortKey, level);
        const valB = getVal(b, sortKey, level);
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [heroes, search, selectedRole, sortKey, sortOrder, level]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* FILTERS PANEL */}
      <Reveal direction="down" delay={0.2}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 ml-4">
            <div className="w-2 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground">Фильтры</h2>
          </div>
          <div className="bg-card p-6 rounded-3xl border-2 border-foreground/10 shadow-xl flex flex-wrap gap-6 items-end">
            <div className="flex-1 min-w-[200px] space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted ml-2">Поиск героя</label>
            <input 
              type="text" 
              placeholder="Имя героя..."
              className="w-full bg-background border-2 border-foreground/10 rounded-2xl p-3 focus:border-primary outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="min-w-[150px] space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted ml-2">Роль</label>
            <select 
              className="w-full bg-background border-2 border-foreground/10 rounded-2xl p-3 focus:border-primary outline-none transition-all"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map(r => <option key={r} value={r}>{r === 'All' ? 'Все роли' : r}</option>)}
            </select>
          </div>

          <div className="min-w-[200px] space-y-2 flex-grow sm:flex-grow-0">
            <div className="flex justify-between px-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted">Уровень</label>
              <span className="text-xs font-black text-primary">{level}</span>
            </div>
            <input 
              type="range" min="1" max="15" 
              className="w-full accent-primary h-10"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
      </Reveal>

      {/* COLUMN TOGGLES */}
      <Reveal direction="down" delay={0.3}>
        <div className="flex flex-wrap gap-2 justify-center">
          {COLUMNS.map(col => (
            <button
              key={col.id}
              onClick={() => toggleColumn(col.id)}
              className={`
                px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2
                ${visibleColumns.includes(col.id)
                  ? 'bg-primary border-primary text-white shadow-[0_5px_15px_rgba(37,99,235,0.4)] scale-105'
                  : 'bg-card border-foreground/10 text-muted hover:border-foreground/30'}
              `}
            >
              {col.label}
            </button>
          ))}
        </div>
      </Reveal>

      {/* TABLE */}
      <Reveal direction="up" delay={0.4}>
        <div className="bg-card rounded-3xl border-2 border-foreground/10 shadow-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/5 text-muted text-[10px] uppercase tracking-widest font-black border-b-2 border-foreground/10">
                <th className="p-4 cursor-pointer hover:text-primary transition-colors min-w-[200px]" onClick={() => toggleSort('name')}>Герой</th>
                {isVisible('roles') && <th className="p-4 min-w-[120px]">Роли</th>}
                {isVisible('hp') && <th className="p-4 cursor-pointer hover:text-primary transition-colors" onClick={() => toggleSort('hp')}>HP</th>}
                {isVisible('phys_atk') && <th className="p-4 cursor-pointer hover:text-primary transition-colors" onClick={() => toggleSort('phys_atk')}>Атака</th>}
                {isVisible('phys_def') && <th className="p-4 cursor-pointer hover:text-primary transition-colors" onClick={() => toggleSort('phys_def')}>Физ. Защ</th>}
                {isVisible('mag_def') && <th className="p-4 cursor-pointer hover:text-primary transition-colors" onClick={() => toggleSort('mag_def')}>Маг. Защ</th>}
                {isVisible('move_speed') && <th className="p-4 cursor-pointer hover:text-primary transition-colors" onClick={() => toggleSort('move_speed')}>Скорость</th>}
                {isVisible('atk_speed') && <th className="p-4 cursor-pointer hover:text-primary transition-colors" onClick={() => toggleSort('atk_speed')}>Ск. Атаки</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedHeroes.map((hero) => (
                <tr key={hero.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback 
                        srcBase={`/assets/images/hero_base_avatar_icons/${hero.image_id}`} 
                        alt={hero.name.ru}
                        className="w-10 h-10 rounded-full border-2 border-foreground/10 group-hover:border-primary transition-colors"
                      />
                      <span className="font-bold">{hero.name.ru}</span>
                    </div>
                  </td>
                  {isVisible('roles') && (
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {hero.roles.ru.map(r => (
                          <span key={r} className="text-[10px] bg-background px-2 py-1 rounded-md border border-foreground/10 font-bold text-muted uppercase">{r}</span>
                        ))}
                      </div>
                    </td>
                  )}
                  {isVisible('hp') && (
                    <td className="p-4 font-mono font-bold text-sm">
                      {Math.round(hero.stats.hp.base + hero.stats.hp.growth * (level - 1))}
                      <span className="text-[10px] text-muted ml-1 opacity-0 group-hover:opacity-100 transition-opacity">+{hero.stats.hp.growth}</span>
                    </td>
                  )}
                  {isVisible('phys_atk') && (
                    <td className="p-4 font-mono font-bold text-sm text-orange-500">
                      {Math.round(hero.stats.phys_atk.base + hero.stats.phys_atk.growth * (level - 1))}
                      <span className="text-[10px] text-muted ml-1 opacity-0 group-hover:opacity-100 transition-opacity">+{hero.stats.phys_atk.growth}</span>
                    </td>
                  )}
                  {isVisible('phys_def') && (
                    <td className="p-4 font-mono font-bold text-sm">
                      {Math.round(hero.stats.phys_def.base + hero.stats.phys_def.growth * (level - 1))}
                    </td>
                  )}
                  {isVisible('mag_def') && (
                    <td className="p-4 font-mono font-bold text-sm">
                      {Math.round(hero.stats.mag_def.base + hero.stats.mag_def.growth * (level - 1))}
                    </td>
                  )}
                  {isVisible('move_speed') && (
                    <td className="p-4 font-mono font-bold text-sm text-primary">
                      {hero.stats.move_speed}
                    </td>
                  )}
                  {isVisible('atk_speed') && (
                    <td className="p-4 font-mono font-bold text-sm text-amber-500">
                      {(hero.stats.atk_speed.base + hero.stats.atk_speed.growth * (level - 1)).toFixed(3)}
                      <span className="text-[10px] text-muted ml-1 opacity-0 group-hover:opacity-100 transition-opacity">({(hero.stats.atk_speed_ratio * 100).toFixed(0)}%)</span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAndSortedHeroes.length === 0 && (
            <div className="p-20 text-center text-muted font-bold uppercase tracking-widest">Герои не найдены</div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
