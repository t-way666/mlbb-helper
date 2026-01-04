import { Hero, Item, Emblem } from "@/types/hero";
import CalculatorClient from "@/components/CalculatorClient";

// Прямой импорт JSON данных
import heroesData from "@/data/heroes.json";
import itemsData from "@/data/items.json";
import emblemsData from "@/data/emblems.json";

export default async function CalculatorPage() {
  // Приводим данные к типам (casting)
  const heroes = heroesData as unknown as Hero[];
  const items = itemsData as unknown as Item[];
  const emblems = emblemsData as unknown as Emblem[];

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-36 md:pt-40">
      <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-600 bg-clip-text text-transparent uppercase tracking-tighter drop-shadow-sm">
          Калькулятор урона
        </h1>
      </header>

      {/* Передаем ВСЕ данные в клиентский компонент */}
      <CalculatorClient heroes={heroes} items={items} emblems={emblems} />
    </main>
  );
}