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
    const b = Number(base) || 0;
    const g = Number(growth) || 0;
    return Math.round(b + g * (level - 1));
  };

  // Функция "нормализации" эмблемы (превращает адаптивку в конкретный стат)
  const getEffectiveEmblem = (
    emblem: Emblem | null,
    items: (Item | null)[]
  ): Emblem | null => {
    if (!emblem) return null;

    let bonusPhys = 0;
    let bonusMag = 0;
    items.forEach(i => {
        if (i) {
            bonusPhys += i.phys_atk || 0;
            bonusMag += i.mag_power || 0;
        }
    });

    const effective = { ...emblem };

    // Адаптивная Атака
    if (effective.adaptive_attack) {
        if (bonusPhys >= bonusMag) {
            effective.phys_attack = (effective.phys_attack || 0) + effective.adaptive_attack;
        } else {
            effective.mag_power = (effective.mag_power || 0) + effective.adaptive_attack;
        }
        effective.adaptive_attack = 0;
    }

    return effective;
  };

  const attackerEffectiveEmblem = getEffectiveEmblem(attackerEmblem, attackerItems);
  const defenderEffectiveEmblem = getEffectiveEmblem(defenderEmblem, defenderItems);


  // Сбор статов
  const calculateTotalStats = (
    hero: Hero | null, 
    level: number, 
    currentItems: (Item | null)[], 
    effectiveEmblem: Emblem | null
  ) => {
    // Базовые
    const basePhysAtk = getStatFromGrowth(hero?.phys_attack, hero?.growth_phys_attack, level);
    const baseMagPower = hero?.mag_power || 0;
    const basePhysDef = getStatFromGrowth(hero?.phys_def, hero?.growth_phys_def, level);
    const baseMagDef = getStatFromGrowth(hero?.mag_def, hero?.growth_mag_def, level);

    // Дополнительные
    let extraPhysAtk = 0;
    let extraMagPower = 0;
    let extraPhysDef = 0;
    let extraMagDef = 0;

    // Проникновение
    let flatPhysPen = hero?.phys_penetration || 0;
    let percentPhysPen = hero?.phys_penetration_fraction || 0;
    let flatMagPen = hero?.mag_penetration || 0;
    let percentMagPen = hero?.mag_penetration_fraction || 0;

    // Сбор с предметов
    currentItems.forEach(item => {
      if (!item) return;
      extraPhysAtk += item.phys_atk || 0;
      extraMagPower += item.mag_power || 0;
      extraPhysDef += item.phys_def || 0;
      extraMagDef += item.mag_def || 0;
      
      flatPhysPen += item.phys_penetration_flat || 0;
      percentPhysPen += item.phys_penetration_fraction || 0;
      flatMagPen += item.mag_penetration_flat || 0;
      percentMagPen += item.mag_penetration_fraction || 0;
    });

    // Сбор с эмблем
    if (effectiveEmblem) {
      extraPhysAtk += effectiveEmblem.phys_attack || 0;
      extraMagPower += effectiveEmblem.mag_power || 0;
      
      flatPhysPen += effectiveEmblem.phys_penetration || 0;
      flatMagPen += effectiveEmblem.mag_penetration || 0;
      
      // Гибридное проникновение дает и физ, и маг
      if (effectiveEmblem.hybrid_penetration) {
          flatPhysPen += effectiveEmblem.hybrid_penetration;
          flatMagPen += effectiveEmblem.hybrid_penetration;
      }
    }

    return {
      totalPhysAtk: basePhysAtk + extraPhysAtk,
      totalMagPower: baseMagPower + extraMagPower,
      totalPhysDef: basePhysDef + extraPhysDef,
      totalMagDef: baseMagDef + extraMagDef,
      
      flatPhysPen, percentPhysPen,
      flatMagPen, percentMagPen,

      basePhysAtk, baseMagPower, basePhysDef, baseMagDef // Для UI
    };
  };

  const attackerStats = calculateTotalStats(attacker, attackerLevel, attackerItems, attackerEffectiveEmblem);
  const defenderStats = calculateTotalStats(defender, defenderLevel, defenderItems, defenderEffectiveEmblem);

  // === РАСЧЕТ УРОНА ===
  
  // 1. Эффективная защита (после проникновения)
  // Формула: (Def - FlatPen) * (1 - PercentPen)
  let effectivePhysDef = (defenderStats.totalPhysDef - attackerStats.flatPhysPen);
  if (effectivePhysDef < -60) effectivePhysDef = -60; // Кап негативной защиты
  
  // Применяем процентное проникновение (только если защита > 0, иначе оно не работает или усиливает минус? В MLBB работает на позитив)
  if (effectivePhysDef > 0) {
      effectivePhysDef = effectivePhysDef * (1 - attackerStats.percentPhysPen);
  }
  
  // 2. Снижение урона (Damage Reduction)
  let damageMultiplier = 0;
  if (effectivePhysDef >= 0) {
      // Стандартная формула: 120 / (120 + Def) -> множитель урона (меньше 1)
      damageMultiplier = 120 / (120 + effectivePhysDef);
  } else {
      // Негативная защита: Увеличивает урон
      // Формула: 1 - (0.01 * Def) -> множитель больше 1
      damageMultiplier = 1 - (0.01 * effectivePhysDef);
  }

  const finalPhysDamage = attackerStats.totalPhysAtk * damageMultiplier;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* === АТАКУЮЩИЙ === */}
        <section className="bg-card rounded-[3rem] p-8 border-2 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] flex flex-col gap-6 transition-all hover:shadow-[0_0_40px_rgba(239,68,68,0.2)]">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-bold text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">⚔️ Атакующий</h2>
            <div className="flex items-center gap-3">
               <span className="text-sm text-foreground/50 font-bold">Ур. {attackerLevel}</span>
               <input 
                type="range" min="1" max="15" 
                value={attackerLevel} 
                onChange={(e) => setAttackerLevel(parseInt(e.target.value))}
                className="w-24 accent-red-500"
               />
            </div>
          </div>
          
          <HeroSelector label="Атакующего" heroes={heroes} selectedHero={attacker} onSelect={setAttacker} />
          <EmblemSelector label="Эмблема" emblems={emblems} selectedEmblem={attackerEmblem} onSelect={setAttackerEmblem} />
          <ItemBuilder label="Снаряжение" items={items} selectedItems={attackerItems} onUpdate={setAttackerItems} />

          {/* Таблица статов */}
          <div className="space-y-1 text-sm bg-background/50 p-6 rounded-[2rem] border border-foreground/5 shadow-inner">
            <StatDisplay 
              label="Физ. Атака" valueColor="text-orange-500 dark:text-yellow-400"
              baseValue={attackerStats.basePhysAtk} items={attackerItems} emblem={attackerEffectiveEmblem}
              statKey="phys_atk" emblemStatKey="phys_attack"
            />
            <StatDisplay 
              label="Маг. Сила" valueColor="text-blue-500 dark:text-blue-400"
              baseValue={attackerStats.baseMagPower} items={attackerItems} emblem={attackerEffectiveEmblem}
              statKey="mag_power"
            />
            <div className="h-px bg-foreground/10 my-2"></div>
            <StatDisplay 
              label="Физ. Проникновение (Flat)" valueColor="text-red-500 dark:text-red-400"
              baseValue={0} items={attackerItems} emblem={attackerEffectiveEmblem}
              statKey="phys_penetration_flat"
            />
             <StatDisplay 
              label="Физ. Проникновение (%)" valueColor="text-red-500 dark:text-red-400"
              baseValue={0} items={attackerItems} emblem={attackerEffectiveEmblem}
              statKey="phys_penetration_fraction" isPercent={true}
            />
          </div>
        </section>

        {/* === ЗАЩИЩАЮЩИЙСЯ === */}
        <section className="bg-card rounded-[3rem] p-8 border-2 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col gap-6 transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-bold text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">🛡️ Защищающийся</h2>
            <div className="flex items-center gap-3">
               <span className="text-sm text-foreground/50 font-bold">Ур. {defenderLevel}</span>
               <input 
                type="range" min="1" max="15" 
                value={defenderLevel} 
                onChange={(e) => setDefenderLevel(parseInt(e.target.value))}
                className="w-24 accent-blue-500"
               />
            </div>
          </div>

          <HeroSelector label="Цель" heroes={heroes} selectedHero={defender} onSelect={setDefender} />
          <EmblemSelector label="Эмблема" emblems={emblems} selectedEmblem={defenderEmblem} onSelect={setDefenderEmblem} />
          <ItemBuilder label="Снаряжение" items={items} selectedItems={defenderItems} onUpdate={setDefenderItems} />

          <div className="space-y-1 text-sm bg-background/50 p-6 rounded-[2rem] border border-foreground/5 shadow-inner">
             <StatDisplay 
              label="Физ. Защита" valueColor="text-foreground/80"
              baseValue={defenderStats.basePhysDef} items={defenderItems} emblem={defenderEffectiveEmblem}
              statKey="phys_def"
            />
             <StatDisplay 
              label="Маг. Защита" valueColor="text-foreground/80"
              baseValue={defenderStats.baseMagDef} items={defenderItems} emblem={defenderEffectiveEmblem}
              statKey="mag_def"
            />
          </div>
        </section>

      </div>

      {/* Результаты */}
      <section className="mt-8 bg-card rounded-2xl p-6 border border-foreground/20 shadow-lg transition-colors">
        <h3 className="text-lg font-bold text-green-500 dark:text-green-400 mb-4">Результаты расчета</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-background/40 rounded-lg border border-foreground/5">
                <div className="text-foreground/50 text-sm">Физ. Атака</div>
                <div className="text-2xl font-bold">{attackerStats.totalPhysAtk}</div>
            </div>
            <div className="p-4 bg-background/40 rounded-lg border border-foreground/5">
                <div className="text-foreground/50 text-sm">Физ. Пробитие</div>
                <div className="text-xl font-bold text-red-500 dark:text-red-300">
                    {attackerStats.flatPhysPen} | {(attackerStats.percentPhysPen * 100).toFixed(0)}%
                </div>
            </div>
            <div className="p-4 bg-background/40 rounded-lg border border-foreground/5">
                <div className="text-foreground/50 text-sm">Эфф. Защита</div>
                <div className="text-2xl font-bold">{effectivePhysDef.toFixed(0)}</div>
                <div className="text-xs text-foreground/40">Снижение: {((1 - damageMultiplier) * 100).toFixed(1)}%</div>
            </div>
            <div className="p-4 bg-background/40 rounded-lg border border-green-500/30">
                <div className="text-foreground/50 text-sm">Итоговый Урон</div>
                <div className="text-3xl font-bold text-green-500 dark:text-green-400">{finalPhysDamage.toFixed(0)}</div>
            </div>
        </div>
      </section>
    </div>
  );
}
