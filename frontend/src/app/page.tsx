import Link from 'next/link';
import Navbar from '@/components/Navbar';

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
    // В Next.js мы можем читать файлы напрямую, если мы на сервере
    const fs = require('fs');
    const path = require('path');
    
    // Пути к файлам в корне проекта (выходим из frontend/src/app)
    const newsPath = path.join(process.cwd(), '../backend/data/news.json');
    const roadmapPath = path.join(process.cwd(), '../backend/data/roadmap.json');
    
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
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-blue-900/20 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Mobile Legends Helper 2.0
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ваш надежный спутник в мире MLBB. Точные расчеты урона, база знаний и аналитика для победных матчей.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/calculator" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition-all shadow-lg shadow-blue-600/20 hover:scale-105">
              Начать расчеты
            </Link>
            <Link href="/heroes" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full font-bold transition-all hover:scale-105 border border-slate-700">
              База героев
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        
        {/* News Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold border-l-4 border-blue-500 pl-4">Последние обновления</h2>
          </div>
          
          <div className="grid gap-6">
            {news.map((item: NewsItem, idx: number) => (
              <article key={idx} className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{item.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{item.content}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Roadmap Column */}
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold border-l-4 border-cyan-500 pl-4">Планы (Roadmap)</h2>
          </div>
          
          <div className="relative border-l border-slate-800 ml-4 space-y-10 py-4">
            {roadmap.map((item: RoadmapItem, idx: number) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                <span className="text-xs font-bold text-cyan-400 uppercase mb-1 block">{item.date}</span>
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-900/10 rounded-2xl p-6 border border-blue-500/20 mt-8">
            <h3 className="font-bold text-blue-400 mb-2">Поддержать проект</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Мы постоянно работаем над новыми функциями. Если вам нравится сервис, расскажите о нем друзьям!
            </p>
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors">
              Копировать ссылку
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
