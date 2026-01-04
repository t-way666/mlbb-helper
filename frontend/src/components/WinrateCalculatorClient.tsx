'use client';

import React, { useState, useMemo } from 'react';
import { Reveal } from '@/components/Reveal';

export default function WinrateCalculatorClient() {
  const [data, setData] = useState({
    matches: 100 as number | '',
    winrate: 50 as number | '',
    target: 60
  });

  const calculation = useMemo(() => {
    const matches = Number(data.matches) || 0;
    const winrate = Number(data.winrate) || 0;
    const currentWins = Math.round((matches * winrate) / 100);
    const targetWR = data.target / 100;

    if (data.target <= winrate) {
      // Сколько можно проиграть, пока не упадет до цели
      // (Wins) / (Matches + Losses) = TargetWR
      // Losses = (Wins / TargetWR) - Matches
      const maxLosses = targetWR > 0 
        ? Math.floor(currentWins / targetWR) - matches 
        : 0;
      
      return {
        type: 'lose',
        count: maxLosses > 0 ? maxLosses : 0,
        text: 'Вы можете проиграть столько раз, пока винрейт не упадет до цели'
      };
    } else {
      // Сколько нужно выиграть подряд
      // (Wins + X) / (Matches + X) = TargetWR
      // X = (TargetWR * Matches - Wins) / (1 - TargetWR)
      if (data.target >= 100) return { type: 'impossible', count: 0, text: '100% винрейт недостижим математически (если были поражения)' };
      
      const winsNeeded = Math.ceil((targetWR * matches - currentWins) / (1 - targetWR));
      
      return {
        type: 'win',
        count: winsNeeded > 0 ? winsNeeded : 0,
        text: 'Побед подряд нужно для достижения цели'
      };
    }
  }, [data]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      
      {/* INPUTS */}
      <Reveal direction="down">
        <div className="bg-card p-6 md:p-10 rounded-[2.5rem] border-2 border-foreground/10 shadow-xl flex flex-col md:flex-row gap-8">
          
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted ml-2">Всего матчей</label>
              <input 
                type="number" 
                className="w-full bg-background border-2 border-foreground/10 rounded-2xl p-4 outline-none focus:border-primary transition-all font-mono text-xl"
                value={data.matches}
                onChange={e => setData({...data, matches: e.target.value === '' ? '' : parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted ml-2">Текущий винрейт (%)</label>
              <input 
                type="number" step="0.1"
                className="w-full bg-background border-2 border-foreground/10 rounded-2xl p-4 outline-none focus:border-primary transition-all font-mono text-xl"
                value={data.winrate}
                onChange={e => setData({...data, winrate: e.target.value === '' ? '' : parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4 bg-primary/5 p-6 rounded-[2rem] border-2 border-primary/10">
            <div className="flex justify-between px-2 text-primary font-black uppercase tracking-widest text-xs">
              <span>Желаемый винрейт</span>
              <span>{data.target}%</span>
            </div>
            <input 
              type="range" min="1" max="99" step="0.1"
              className="w-full accent-primary h-12"
              value={data.target}
              onChange={e => setData({...data, target: parseFloat(e.target.value)})}
            />
            <p className="text-[10px] text-center text-muted uppercase font-bold">Передвигайте ползунок, чтобы увидеть расчет</p>
          </div>

        </div>
      </Reveal>

      {/* RESULT */}
      <Reveal direction="up" delay={0.3}>
        <div className={`
          p-10 rounded-[3rem] border-2 text-center transition-all duration-500
          ${calculation.type === 'win' ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_40px_rgba(59,130,246,0.15)]' : 
            calculation.type === 'lose' ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_40px_rgba(16,185,129,0.15)]' : 
            'border-red-500 bg-red-500/5'}
        `}>
          <h3 className="text-muted text-sm font-bold uppercase tracking-widest mb-4">{calculation.text}</h3>
          
          {calculation.type !== 'impossible' ? (
            <div className="flex flex-col items-center">
              <span className={`text-7xl md:text-8xl font-black mb-2 drop-shadow-lg
                ${calculation.type === 'win' ? 'text-blue-500' : 'text-emerald-500'}
              `}>
                {calculation.count}
              </span>
              <span className="text-xl font-bold uppercase tracking-tighter text-foreground/60">
                {calculation.type === 'win' ? 'Побед подряд' : 'Поражений подряд'}
              </span>
            </div>
          ) : (
            <p className="text-2xl font-bold text-red-500 uppercase tracking-tighter">Это невозможно 💀</p>
          )}
        </div>
      </Reveal>

      {/* INFO BLOCK */}
      <Reveal direction="up" delay={0.5}>
        <div className="bg-card p-8 rounded-[2.5rem] border-2 border-foreground/5 text-center max-w-2xl mx-auto space-y-4">
          <p className="text-muted text-sm leading-relaxed italic">
            "Статистика — это просто цифры, которые не всегда отражают ваш реальный вклад. 
            В игре 5 на 5 победа зависит не только от вас, но ваш винрейт — это то, что вы можете контролировать на длинной дистанции."
          </p>
          <p className="text-[10px] text-muted/40 uppercase tracking-widest leading-relaxed">
            И да, мы всё еще помним про подбор союзников, случайные мисклики, досадные тупняки и внезапные ссоры в чате... 🌚
          </p>
        </div>
      </Reveal>

    </div>
  );
}
