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
  'Legend': 5
};

const MYTHIC_CONFIG: { [key: string]: number } = {
  'Mythic': 0,
  'Mythical Honor': 25,
  'Mythical Glory': 50,
  'Mythical Immortal': 100
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
  const isMythic = (rank: string) => rank.startsWith('Mythic');
  
  const calculateStars = (rank: string, stars: number | string) => {
    // 1. Calculate base stars to reach Mythic
    let starsToMythic = 0;
    const mythicIdx = RANKS.indexOf('Mythic');
    
    // Sum all ranks BEFORE Mythic
    for (let i = 0; i < mythicIdx; i++) {
      starsToMythic += RANK_CONFIG[getBaseRank(RANKS[i])];
    }

    // 2. If rank is Mythic or higher
    if (isMythic(rank)) {
      const mythicBase = MYTHIC_CONFIG[rank] || 0;
      return starsToMythic + mythicBase + (Number(stars) || 0);
    }

    // 3. If rank is below Mythic
    let rankBase = 0;
    const rankIdx = RANKS.indexOf(rank);
    for (let i = 0; i < rankIdx; i++) {
      rankBase += RANK_CONFIG[getBaseRank(RANKS[i])];
    }
    return rankBase + (Number(stars) || 0);
  };

  const handleStarChange = (field: 'startStars' | 'currentStars' | 'targetStars', value: string, rank: string) => {
    if (value === '') {
      setData(prev => ({ ...prev, [field]: '' }));
      return;
    }
    
    let num = parseInt(value);
    if (isNaN(num)) return;

    // Validate max stars for non-mythic ranks
    if (!isMythic(rank) && num > 5) {
      num = 5;
    }

    // Auto-switch logic for Mythic (UPGRADE only)
    let newRank = rank;
    let newStars = num;
    // Determine which rank field to update (startRank, currentRank, targetRank)
    const rankField = field.replace('Stars', 'Rank') as 'startRank' | 'currentRank' | 'targetRank';

    if (rank === 'Mythic' && num >= 25) {
      newRank = 'Mythical Honor';
      newStars = num - 25;
    } else if (rank === 'Mythical Honor' && num >= 25) {
      newRank = 'Mythical Glory';
      newStars = num - 25;
    } else if (rank === 'Mythical Glory' && num >= 50) {
      newRank = 'Mythical Immortal';
      newStars = num - 50;
    }
    
    setData(prev => ({ ...prev, [field]: newStars, [rankField]: newRank }));
  };

  const results = useMemo(() => {
    const startTotal = calculateStars(data.startRank, data.startStars);
    const currentTotal = calculateStars(data.currentRank, data.currentStars);
    const targetTotal = calculateStars(data.targetRank, data.targetStars);

    const starsGained = currentTotal - startTotal;
    const starsDiff = targetTotal - currentTotal; // Can be negative (derank)
    const isDeranking = starsDiff < 0;

    const wr = data.winrate / 100;
    let gamesNeeded: number | string = 0;

    if (!isDeranking) {
      // CLIMBING MODE
      // If WR <= 50%, you can't climb indefinitely (mathematically)
      if (wr <= 0.5) {
         gamesNeeded = '∞ (нужен винрейт > 50%)';
      } else {
         gamesNeeded = Math.ceil(starsDiff / (2 * wr - 1));
      }
    } else {
      // DERANKING MODE (starsDiff is negative, we need to lose abs(starsDiff))
      const starsToLose = Math.abs(starsDiff);
      // To lose stars, WR must be < 50%
      if (wr >= 0.5) {
         gamesNeeded = '∞ (нужен винрейт < 50%)';
      } else {
         // Loss rate per game = (1 - WR) - WR = 1 - 2*WR
         // Example: WR 0.4. Loss = 0.6 - 0.4 = 0.2 stars/game.
         gamesNeeded = Math.ceil(starsToLose / (1 - 2 * wr));
      }
    }

    return {
      starsGained,
      starsNeeded: Math.abs(starsDiff),
      gamesNeeded,
      isDeranking
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
              onChange={e => handleStarChange('startStars', e.target.value, data.startRank)}
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
              onChange={e => handleStarChange('currentStars', e.target.value, data.currentRank)}
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
            <input 
              type="number" placeholder="Звезды"
              value={data.targetStars}
              onChange={e => handleStarChange('targetStars', e.target.value, data.targetRank)}
              className="w-full bg-background border-2 border-foreground/10 rounded-2xl p-3 outline-none focus:border-orange-500 transition-all"
            />
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                  <span>Винрейт</span>
                  <span className="text-primary">{data.winrate}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
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
          <div className={`bg-card p-8 rounded-[2.5rem] border-2 shadow-lg h-full transition-colors duration-300
            ${results.isDeranking 
              ? 'border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]' 
              : 'border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]'
            }`}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className={`w-2 h-6 rounded-full shadow-md transition-colors duration-300
                ${results.isDeranking ? 'bg-red-500 shadow-red-500/50' : 'bg-orange-500 shadow-orange-500/50'}
              `}></span>
              {results.isDeranking ? 'Цель (Слив ранга)' : 'До цели осталось'}
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-foreground/5 pb-2">
                <span className="text-muted text-sm">{results.isDeranking ? 'Слить звезд:' : 'Нужно звезд:'}</span>
                <span className={`text-3xl font-black transition-colors duration-300
                  ${results.isDeranking ? 'text-red-500' : 'text-orange-500'}
                `}>{results.starsNeeded}</span>
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
