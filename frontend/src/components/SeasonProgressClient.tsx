'use client';

import React, { useState, useMemo } from 'react';
import { Reveal } from '@/components/Reveal';
import { RankSelect } from '@/components/RankSelect';

const RANKS = [
  'Warrior III', 'Warrior II', 'Warrior I',
  'Elite III', 'Elite II', 'Elite I',
  'Master IV', 'Master III', 'Master II', 'Master I',
  'Grandmaster V', 'Grandmaster IV', 'Grandmaster III', 'Grandmaster II', 'Grandmaster I',
  'Epic V', 'Epic IV', 'Epic III', 'Epic II', 'Epic I',
  'Legend V', 'Legend IV', 'Legend III', 'Legend II', 'Legend I',
  'Mythic', 'Mythical Honor', 'Mythical Glory', 'Mythical Immortal'
];

const RANK_CONFIG: { [key: string]: number } = {
  'Warrior': 3,
  'Elite': 4,
  'Master': 4,
  'Grandmaster': 5,
  'Epic': 5,
  'Legend': 5,
  'Mythic': 25,
  'Mythical': 25
};

export default function SeasonProgressClient() {
  const [data, setData] = useState({
    startRank: 'Epic V',
    startStars: 0 as number | '',
    currentRank: 'Epic II',
    currentStars: 2 as number | '',
    targetRank: 'Mythic',
    targetStars: 0,
    winrate: 55,
    gamesPlayed: 100
  });

  const getBaseRank = (full: string) => full.split(' ')[0];
  
  const calculateStars = (rank: string, stars: number | string) => {
    let total = 0;
    const idx = RANKS.indexOf(rank);
    for (let i = 0; i < idx; i++) {
      total += RANK_CONFIG[getBaseRank(RANKS[i])];
    }
    return total + (Number(stars) || 0);
  };

  const results = useMemo(() => {
    const startTotal = calculateStars(data.startRank, data.startStars);
    const currentTotal = calculateStars(data.currentRank, data.currentStars);
    const targetTotal = calculateStars(data.targetRank, data.targetStars);

    const starsGained = currentTotal - startTotal;
    const starsNeeded = targetTotal - currentTotal;

    // Расчет игр: на одну звезду нужно (1 / (2*wr - 1)) игр
    const wr = data.winrate / 100;
    const gamesNeeded = wr > 0.5 
      ? Math.ceil(starsNeeded / (2 * wr - 1)) 
      : '∞ (нужен винрейт > 50%)';

    return {
      starsGained,
      starsNeeded: starsNeeded > 0 ? starsNeeded : 0,
      gamesNeeded
    };
  }, [data]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <Reveal direction="down">
        <div className="bg-card p-6 md:p-8 rounded-[2.5rem] border-2 border-foreground/10 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* START RANK */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Откуда начали</h3>
            <RankSelect 
              value={data.startRank}
              onChange={(val) => setData({...data, startRank: val})}
              options={RANKS}
              colorClass="text-primary"
            />
            <input 
              type="number" placeholder="Звезды" 
              value={data.startStars}
              onChange={e => setData({...data, startStars: e.target.value === '' ? '' : parseInt(e.target.value)})}
              className="w-full bg-background border-2 border-foreground/10 rounded-2xl p-3 outline-none focus:border-primary transition-all"
            />
          </div>

          {/* CURRENT RANK */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-green-500">Где сейчас</h3>
            <RankSelect 
              value={data.currentRank}
              onChange={(val) => setData({...data, currentRank: val})}
              options={RANKS}
              colorClass="text-green-500"
            />
            <input 
              type="number" placeholder="Звезды"
              value={data.currentStars}
              onChange={e => setData({...data, currentStars: e.target.value === '' ? '' : parseInt(e.target.value)})}
              className="w-full bg-background border-2 border-foreground/10 rounded-2xl p-3 outline-none focus:border-green-500 transition-all"
            />
          </div>

          {/* TARGET RANK */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-orange-500">Цель</h3>
            <RankSelect 
              value={data.targetRank}
              onChange={(val) => setData({...data, targetRank: val})}
              options={RANKS}
              colorClass="text-orange-500"
            />
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                  <span>Винрейт</span>
                  <span className="text-primary">{data.winrate}%</span>
                </div>
                <input 
                  type="range" min="45" max="95" 
                  value={data.winrate}
                  onChange={e => setData({...data, winrate: parseInt(e.target.value)})}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>

        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Reveal direction="right" delay={0.2}>
          <div className="bg-card p-8 rounded-[2.5rem] border-2 border-foreground/5 shadow-lg h-full">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-green-500 rounded-full"></span>
              Текущий прогресс
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-foreground/5 pb-2">
                <span className="text-muted text-sm">Получено звезд:</span>
                <span className="text-3xl font-black text-green-500">+{results.starsGained}</span>
              </div>
              <div className="flex justify-between items-end border-b border-foreground/5 pb-2">
                <span className="text-muted text-sm">Винрейт:</span>
                <span className="text-xl font-bold">{data.winrate}%</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.3}>
          <div className="bg-card p-8 rounded-[2.5rem] border-2 border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)] h-full">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
              До цели осталось
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-foreground/5 pb-2">
                <span className="text-muted text-sm">Нужно звезд:</span>
                <span className="text-3xl font-black text-orange-500">{results.starsNeeded}</span>
              </div>
              <div className="flex justify-between items-end border-b border-foreground/5 pb-2">
                <span className="text-muted text-sm">Примерно игр:</span>
                <span className="text-2xl font-black text-primary">{results.gamesNeeded}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal direction="up" delay={0.5}>
        <div className="bg-primary/5 border-2 border-primary/20 p-8 rounded-[2.5rem] text-center space-y-4">
          <p className="text-muted text-sm mb-2 font-medium uppercase tracking-widest">Кодекс Восхождения</p>
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-xl font-bold text-foreground">
              {results.starsNeeded > 20 
                ? "Путь будет долгим, но каждое великое достижение начинается с первого шага. Помните о перерывах!" 
                : "Цель совсем близко! Сфокусируйтесь на своих лучших героях и сохраняйте хладнокровие."}
            </p>
            <p className="text-base text-muted italic leading-relaxed">
              Получайте кайф от самой игры. Да, мы знаем: подбор бывает беспощадным, союзники — рандомными, а соперники — как из киберспорта. Это не в вашей власти. В вашей власти — только ваше мастерство и удовольствие от процесса! 🎮✨
            </p>
            <p className="text-[10px] text-muted/60 uppercase tracking-widest pt-2">
              * И не забывайте про очки защиты: иногда сама игра страхует вас от потери звезды в трудную минуту. А иногда нет 🌚
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
