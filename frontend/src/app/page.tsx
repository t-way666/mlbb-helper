import { Reveal } from '@/components/Reveal';
import { ShareCard } from '@/components/ShareCard';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';

// Типы данных
interface NewsItem {
  title: string;
  content: string;
  date: string;
}

interface RoadmapItem {
  date: string;
  title: string;
  description: string;
}

async function getHomeData() {
  try {
    // Пути к файлам теперь внутри src/data
    const newsPath = path.join(process.cwd(), 'src/data/news.json');
    const roadmapPath = path.join(process.cwd(), 'src/data/roadmap.json');
    
    const news = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
    const roadmap = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
    
    return { news, roadmap };
  } catch (error) {
    console.error('Error loading home data:', error);
    return { news: [], roadmap: [] };
  }
}

export default async function Home() {
  const { news, roadmap } = await getHomeData();

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 text-center bg-gradient-to-b from-primary/5 to-transparent overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center relative z-10">
          <Reveal direction="down" delay={0.1}>
            <div className="relative w-full max-w-6xl mx-auto aspect-[16/10] md:aspect-[17/9] mb-8 group perspective-1000">
              {/* Poisonous Neon Glow Effect */}
              <div className="neon-hero-glow rounded-[2rem]" />
              
              {/* Image Container with Rounding */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                <Image 
                  src="/hero-banner.png" 
                  alt="MLBB Helper Banner" 
                  fill
                  priority
                  className="object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1400px"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="sr-only">Mobile Legends Helper 2.0</h1>
            <p className="text-xl md:text-2xl text-muted font-medium mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Ваш надежный спутник в мире MLBB. Точные расчеты урона, база знаний и аналитика для победных матчей.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        
        {/* News Column */}
        <div className="lg:col-span-2 space-y-8">
          <Reveal direction="left" delay={0.4}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold border-l-4 border-blue-500 pl-4 text-foreground uppercase tracking-wide">Последние обновления</h2>
            </div>
          </Reveal>
          
          <div className="grid gap-6">
            {news.map((item: NewsItem, idx: number) => (
              <Reveal key={idx} direction="left" delay={0.5 + (idx * 0.1)}>
                <article className="bg-card rounded-2xl p-6 border-2 border-foreground/5 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                  <p className="text-muted leading-relaxed text-sm font-medium">{item.content}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Roadmap Column */}
        <div className="space-y-8">
          <Reveal direction="right" delay={0.4}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold border-l-4 border-cyan-500 pl-4 text-foreground uppercase tracking-wide">Планы (Roadmap)</h2>
            </div>
          </Reveal>
          
          <div className="relative border-l-2 border-foreground/10 ml-4 space-y-10 py-4">
            {roadmap.map((item: RoadmapItem, idx: number) => (
              <Reveal key={idx} direction="right" delay={0.6 + (idx * 0.1)}>
                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] border-2 border-background"></div>
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase mb-1 block tracking-wider">{item.date}</span>
                  <h4 className="text-lg font-bold mb-2 text-foreground">{item.title}</h4>
                  <p className="text-muted text-sm leading-relaxed font-medium">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.8}>
            <ShareCard />
          </Reveal>
        </div>

      </div>
    </main>
  );
}
