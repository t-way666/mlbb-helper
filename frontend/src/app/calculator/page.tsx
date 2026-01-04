import { Hero, Item, Emblem } from "@/types/hero";
import CalculatorClient from "@/components/CalculatorClient";

// Универсальная функция загрузки
async function fetchData<T>(endpoint: string): Promise<T> {
  // Обращаемся к API
  const res = await fetch(`http://127.0.0.1:8080/api/${endpoint}`, { 
    cache: 'no-store' // Всегда свежие данные (можно изменить на 'force-cache' для продакшена)
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  
  return res.json();
}

export default async function CalculatorPage() {
  // Загружаем все данные ПАРАЛЛЕЛЬНО для скорости
  const [heroes, items, emblems] = await Promise.all([
    fetchData<Hero[]>('heroes'),
    fetchData<Item[]>('items'),
    fetchData<Emblem[]>('emblems')
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-24">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Калькулятор Урона
        </h1>
        <p className="text-foreground/60 mt-2 font-medium">v2.0: Next.js + Tailwind CSS</p>
      </header>

      {/* Передаем ВСЕ данные в клиентский компонент */}
      <CalculatorClient heroes={heroes} items={items} emblems={emblems} />
    </main>
  );
}
