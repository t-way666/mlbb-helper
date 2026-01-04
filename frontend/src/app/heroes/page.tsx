import { Hero } from "@/types/hero";
import heroesData from "@/data/heroes.json";
import HeroesClient from "@/components/HeroesClient";

export default async function HeroesPage() {
  const heroes = heroesData as unknown as Hero[];

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-36 md:pt-40">
      <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-600 bg-clip-text text-transparent uppercase tracking-tighter drop-shadow-sm">
          База героев
        </h1>
        <p className="text-muted mt-4 font-medium max-w-2xl mx-auto leading-relaxed">
          Полная таблица характеристик всех героев Mobile Legends. Используйте ползунок уровня для просмотра динамики роста статов.
        </p>
      </header>

      <HeroesClient heroes={heroes} />
    </main>
  );
}
