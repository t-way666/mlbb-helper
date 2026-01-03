import { Hero } from "@/types/hero";

// Это асинхронная функция, которая выполняется на СЕРВЕРЕ
async function getHeroes(): Promise<Hero[]> {
  // Мы делаем запрос к нашему Flask API
  // Так как это Server Component, мы можем обращаться напрямую к 8080
  const res = await fetch('http://127.0.0.1:8080/api/heroes', { cache: 'no-store' });
  
  if (!res.ok) {
    throw new Error('Failed to fetch heroes');
  }
  
  return res.json();
}

export default async function Home() {
  const heroes = await getHeroes();

  return (
    <main className="min-h-screen p-8 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-blue-400">MLBB Helper 2.0</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {heroes.map((hero) => (
            <div 
              key={hero.hero_name} 
              className="p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors"
            >
              <h2 className="text-xl font-semibold">{hero.hero_name}</h2>
              <p className="text-slate-400 text-sm">{hero.main_role}</p>
              
              <div className="mt-4 flex gap-2">
                <span className="text-xs bg-slate-700 px-2 py-1 rounded">HP: {hero.hp}</span>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded">ATK: {hero.phys_attack}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}