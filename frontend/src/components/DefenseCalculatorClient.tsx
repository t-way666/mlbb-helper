'use client';

import React, { useState, useMemo } from 'react';
import { Reveal } from '@/components/Reveal';

export default function DefenseCalculatorClient() {
  const [stats, setStats] = useState({
    hp: 5000,
    def: 100,
    flatPen: 0,
    percentPen: 0
  });

  const calculation = useMemo(() => {
    // 1. Расчет эффективной брони после проникновения
    // Формула: (Def - FlatPen) * (1 - %Pen)
    let effectiveDef = (stats.def - stats.flatPen);
    
    // В MLBB процентное пробитие работает только на положительную броню
    if (effectiveDef > 0) {
      effectiveDef = effectiveDef * (1 - stats.percentPen / 100);
    }
    
    if (effectiveDef < -60) effectiveDef = -60; // Кап негативной защиты

    // 2. Расчет снижения урона
    let reduction = 0;
    let multiplier = 1;
    
    if (effectiveDef >= 0) {
      multiplier = 120 / (120 + effectiveDef);
      reduction = (1 - multiplier) * 100;
    } else {
      // Негативная броня увеличивает урон: 1% за каждую единицу
      multiplier = 1 - (effectiveDef * 0.01);
      reduction = (1 - multiplier) * 100; // Будет отрицательным
    }

    // 3. Эффективное ХП (EHP)
    // Это сколько "чистого" урона нужно, чтобы убить героя
    const ehp = stats.hp / multiplier;

    return {
      effectiveDef: effectiveDef.toFixed(1),
      reduction: reduction.toFixed(1),
      multiplier: multiplier.toFixed(2),
      ehp: Math.round(ehp)
    };
  }, [stats]);

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
      {/* INPUTS */}
      <Reveal direction="down">
        <div className="bg-card p-6 md:p-10 rounded-[2.5rem] border-2 border-foreground/10 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between px-2">
                <label className="text-xs font-black uppercase tracking-widest text-emerald-500">Ваше ХП</label>
                <span className="font-mono font-bold text-foreground">{stats.hp}</span>
              </div>
              <input 
                type="range" min="1000" max="15000" step="100"
                className="w-full accent-emerald-500"
                value={stats.hp}
                onChange={e => setStats({...stats, hp: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between px-2">
                <label className="text-xs font-black uppercase tracking-widest text-blue-500">Ваша Защита</label>
                <span className="font-mono font-bold text-foreground">{stats.def}</span>
              </div>
              <input 
                type="range" min="0" max="500" 
                className="w-full accent-blue-500"
                value={stats.def}
                onChange={e => setStats({...stats, def: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between px-2">
                <label className="text-xs font-black uppercase tracking-widest text-red-500">Пробитие врага (Flat)</label>
                <span className="font-mono font-bold text-foreground">{stats.flatPen}</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                className="w-full accent-red-500"
                value={stats.flatPen}
                onChange={e => setStats({...stats, flatPen: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between px-2">
                <label className="text-xs font-black uppercase tracking-widest text-orange-500">Пробитие врага (%)</label>
                <span className="font-mono font-bold text-foreground">{stats.percentPen}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                className="w-full accent-orange-500"
                value={stats.percentPen}
                onChange={e => setStats({...stats, percentPen: parseInt(e.target.value)})}
              />
            </div>
          </div>

        </div>
      </Reveal>

      {/* RESULTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <Reveal direction="right" delay={0.2}>
          <div className="bg-card p-8 rounded-[2.5rem] border-2 border-foreground/5 shadow-lg">
            <p className="text-xs font-bold text-muted uppercase mb-2">Снижение урона</p>
            <p className={`text-5xl font-black ${parseFloat(calculation.reduction) >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
              {calculation.reduction}%
            </p>
            <p className="text-[10px] text-muted mt-2 uppercase tracking-tighter">
              {parseFloat(calculation.reduction) >= 0 
                ? 'урона блокируется броней' 
                : 'урона ДОБАВЛЕНО из-за отрицательной защиты'}
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.3}>
          <div className="bg-card p-8 rounded-[2.5rem] border-2 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <p className="text-xs font-bold text-muted uppercase mb-2">Эффективное ХП</p>
            <p className="text-5xl font-black text-emerald-500">{calculation.ehp}</p>
            <p className="text-[10px] text-muted mt-2 uppercase tracking-tighter">
              Столько «чистого» урона нужно влить, чтобы вы погибли
            </p>
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.4}>
          <div className="bg-card p-8 rounded-[2.5rem] border-2 border-foreground/5 shadow-lg">
            <p className="text-xs font-bold text-muted uppercase mb-2">Множитель урона</p>
            <p className="text-5xl font-black text-foreground">x{calculation.multiplier}</p>
            <p className="text-[10px] text-muted mt-2 uppercase tracking-tighter">
              Входящий урон умножается на это число
            </p>
          </div>
        </Reveal>
      </div>

      {/* EXPLANATION "FOR DUMMIES" */}
      <Reveal direction="up" delay={0.6}>
        <div className="bg-card p-8 md:p-12 rounded-[3rem] border-2 border-primary/20 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-3 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Как это работает?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-primary">1. Магия числа 120</h4>
              <p className="text-muted leading-relaxed">
                В MLBB защита не вычитает урон (как 100 - 10), а работает через деление. 
                Когда у вас <b>120 защиты</b>, вы получаете ровно в <b>2 раза меньше</b> урона (50% снижение). 
                При 240 защиты — в 3 раза меньше (66%).
              </p>
              <div className="bg-background/50 p-4 rounded-2xl border border-foreground/5 italic text-sm">
                "Первые 50-100 единиц защиты самые важные. Дальше каждая единица дает всё меньше и меньше реальной пользы."
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-bold text-red-500">2. Почему пробитие — это больно?</h4>
              <p className="text-muted leading-relaxed">
                Если у вас 50 защиты, а враг собрал <b>Клинок семи морей</b> (+15 пробития), ваша защита станет 35. 
                Но если у вас 0 защиты, а враг бьет в "минус" — вы начинаете получать <b>БОЛЬШЕ</b> урона, чем написано в описании навыка.
              </p>
              <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/10 italic text-sm text-red-400">
                "Минус 60 защиты — это кап. В этом состоянии вы получаете на 60% больше урона. Это как постоянный критический удар!"
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-bold text-emerald-500">3. Эффективное здоровье (EHP)</h4>
              <p className="text-muted leading-relaxed">
                Это самый важный показатель. Не важно, сколько у вас защиты, важно — сколько урона вы выдержите до смерти. 
                Иногда выгоднее купить <b>Защитный шлем</b> (+1550 ХП), чем еще один предмет на броню, потому что ваше итоговое выживание (EHP) вырастет сильнее.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-bold text-orange-500">4. Процентное vs Плоское</h4>
              <p className="text-muted leading-relaxed">
                <b>Плоское (Flat)</b> пробитие лучше всего работает против тонких целей (маги, стрелки). 
                <b>Процентное (%)</b> пробитие — это гроза танков. Оно игнорирует огромные куски брони.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

    </div>
  );
}
