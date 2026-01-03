'use client';

import { useState } from 'react';
import { Hero, Item, Emblem } from '@/types/hero';
import { HeroSelector } from '@/components/HeroSelector';
import { ItemBuilder } from '@/components/ItemBuilder';
import { EmblemSelector } from '@/components/EmblemSelector';
import { StatDisplay } from '@/components/StatDisplay';

interface CalculatorClientProps {
  heroes: Hero[];
  items: Item[];
  emblems: Emblem[];
}

export default function CalculatorClient({ heroes, items, emblems }: CalculatorClientProps) {
  // Герои
  const [attacker, setAttacker] = useState<Hero | null>(null);
  const [defender, setDefender] = useState<Hero | null>(null);
  
  // Уровни
  const [attackerLevel, setAttackerLevel] = useState(1);
  const [defenderLevel, setDefenderLevel] = useState(1);

  // Предметы
  const [attackerItems, setAttackerItems] = useState<(Item | null)[]>(Array(6).fill(null));
  const [defenderItems, setDefenderItems] = useState<(Item | null)[]>(Array(6).fill(null));

  // Эмблемы
  const [attackerEmblem, setAttackerEmblem] = useState<Emblem | null>(null);
  const [defenderEmblem, setDefenderEmblem] = useState<Emblem | null>(null);

  // --- ЛОГИКА РАСЧЕТОВ ---

  const getStatFromGrowth = (base: number | undefined, growth: number | undefined, level: number) => {
    // Приводим к числу, так как из JSON могут прийти строки или null
    const b = Number(base) || 0;
    const g = Number(growth) || 0;
    return Math.round(b + g * (level - 1));
  };

  // Функция для сбора всех бонусов (от предметов и эмблем)
  const calculateTotalStats = (
    hero: Hero | null, 
    level: number, 
    currentItems: (Item | null)[], 
    currentEmblem: Emblem | null
  ) => {
    // 1. Базовые статы героя на уровне
    const basePhysAtk = getStatFromGrowth(hero?.phys_attack, hero?.growth_phys_attack, level);
    const baseMagPower = hero?.mag_power || 0;
    const basePhysDef = getStatFromGrowth(hero?.phys_def, hero?.growth_phys_def, level);
    const baseMagDef = getStatFromGrowth(hero?.mag_def, hero?.growth_mag_def, level);

    // 2. Считаем бонусы (Extra Stats)
    let extraPhysAtk = 0;
    let extraMagPower = 0;
    let extraPhysDef = 0;
    let extraMagDef = 0;
    let adaptiveAtk = 0; // Адаптивная атака

    // От предметов
    currentItems.forEach(item => {
      if (!item) return;
      extraPhysAtk += item.phys_attack || 0;
      extraMagPower += item.mag_power || 0;
      extraPhysDef += item.phys_def || 0;
      extraMagDef += item.mag_def || 0;
      // В предметах тоже может быть адаптивка (пока редкость, но учтем на будущее)
    });

    // От эмблемы
    if (currentEmblem) {
      extraPhysAtk += currentEmblem.phys_attack || 0;
      extraMagPower += currentEmblem.mag_power || 0;
      // В базе поле называется adaptive_attack (если оно есть в emblem_stats), 
      // но пока возьмем то что есть в типах. 
      // Если у вас в Emblem типе нет adaptive_attack, добавьте его позже.
      // Пока предположим, что эмблемы дают конкретный стат или мы добавим логику позже.
    }

    // 3. Распределяем Адаптивную Атаку
    // Правило: Если доп. физ. атака >= доп. маг. силы, то адаптив -> физ.
    if (extraPhysAtk >= extraMagPower) {
        extraPhysAtk += adaptiveAtk;
    } else {
        extraMagPower += adaptiveAtk;
    }

    return {
      totalPhysAtk: basePhysAtk + extraPhysAtk,
      totalMagPower: baseMagPower + extraMagPower,
      totalPhysDef: basePhysDef + extraPhysDef,
      totalMagDef: baseMagDef + extraMagDef,
      // Для UI полезно знать разбивку
      basePhysAtk, extraPhysAtk,
      baseMagPower, extraMagPower
    };
  };

  const attackerStats = calculateTotalStats(attacker, attackerLevel, attackerItems, attackerEmblem);
  const defenderStats = calculateTotalStats(defender, defenderLevel, defenderItems, defenderEmblem);

  // Упрощенный расчет урона
  const reduction = defenderStats.totalPhysDef > 0 
    ? (defenderStats.totalPhysDef / (120 + defenderStats.totalPhysDef)) * 100 
    : 0;
  
  const finalDamage = attackerStats.totalPhysAtk * (1 - reduction / 100);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* === АТАКУЮЩИЙ === */}
        <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-red-400">⚔️ Атакующий</h2>
            <div className="flex items-center gap-3">
               <span className="text-sm text-slate-400">Ур. {attackerLevel}</span>
               <input 
                type="range" min="1" max="15" 
                value={attackerLevel} 
                onChange={(e) => setAttackerLevel(parseInt(e.target.value))}
                className="w-24 accent-red-500"
               />
            </div>
          </div>
          
          <HeroSelector 
            label="Атакующего" 
            heroes={heroes} 
            selectedHero={attacker}
            onSelect={setAttacker}
          />

          <EmblemSelector 
            label="Эмблема" 
            emblems={emblems} 
            selectedEmblem={attackerEmblem} 
            onSelect={setAttackerEmblem}
          />

          <ItemBuilder 
            label="Снаряжение" 
            items={items} 
            selectedItems={attackerItems} 
            onUpdate={setAttackerItems} 
          />

          {/* Таблица статов */}
          <div className="space-y-1 text-sm">
            <StatDisplay 
              label="Физ. Атака" 
              valueColor="text-yellow-400"
              baseValue={attackerStats.basePhysAtk}
              items={attackerItems}
              emblem={attackerEmblem}
              statKey="phys_atk"
              emblemStatKey="phys_attack"
            />
            <StatDisplay 
              label="Маг. Сила" 
              valueColor="text-blue-400"
              baseValue={attackerStats.baseMagPower}
              items={attackerItems}
              emblem={attackerEmblem}
              statKey="mag_power"
            />
          </div>
        </section>

        {/* === ЗАЩИЩАЮЩИЙСЯ === */}
        <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-blue-400">🛡️ Защищающийся</h2>
            <div className="flex items-center gap-3">
               <span className="text-sm text-slate-400">Ур. {defenderLevel}</span>
               <input 
                type="range" min="1" max="15" 
                value={defenderLevel} 
                onChange={(e) => setDefenderLevel(parseInt(e.target.value))}
                className="w-24 accent-blue-500"
               />
            </div>
          </div>

          <HeroSelector 
            label="Цель" 
            heroes={heroes} 
            selectedHero={defender}
            onSelect={setDefender}
          />

          <EmblemSelector 
            label="Эмблема" 
            emblems={emblems} 
            selectedEmblem={defenderEmblem} 
            onSelect={setDefenderEmblem}
          />

           <ItemBuilder 
            label="Снаряжение" 
            items={items} 
            selectedItems={defenderItems} 
            onUpdate={setDefenderItems} 
          />

          <div className="space-y-1 text-sm">
             <StatDisplay 
              label="Физ. Защита" 
              valueColor="text-slate-300"
              baseValue={defenderStats.basePhysDef}
              items={defenderItems}
              emblem={defenderEmblem}
              statKey="phys_def"
            />
             <StatDisplay 
              label="Маг. Защита" 
              valueColor="text-slate-300"
              baseValue={defenderStats.baseMagDef}
              items={defenderItems}
              emblem={defenderEmblem}
              statKey="mag_def"
            />
          </div>
        </section>

      </div>

      {/* Результаты */}
      <section className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-green-400 mb-4">Результаты расчета (v2.1 + Эмблемы)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-black/20 rounded-lg">
                <div className="text-slate-400 text-sm">Физ. Атака (Total)</div>
                <div className="text-2xl font-bold text-white">{attackerStats.totalPhysAtk}</div>
            </div>
            <div className="p-4 bg-black/20 rounded-lg">
                <div className="text-slate-400 text-sm">Физ. снижение</div>
                <div className="text-2xl font-bold text-white">{reduction.toFixed(1)}%</div>
            </div>
            <div className="p-4 bg-black/20 rounded-lg">
                <div className="text-slate-400 text-sm">Урон по цели</div>
                <div className="text-2xl font-bold text-green-400">{finalDamage.toFixed(0)}</div>
            </div>
        </div>
      </section>
    </div>
  );
}
