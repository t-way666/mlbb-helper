import DefenseCalculatorClient from "@/components/DefenseCalculatorClient";

export default function DefensePage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-36 md:pt-40">
      <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent uppercase tracking-tighter drop-shadow-sm">
          Калькулятор защиты
        </h1>
        <p className="text-muted mt-4 font-medium max-w-2xl mx-auto leading-relaxed uppercase text-xs tracking-widest">
          Пойми, как работает твоя броня и почему тебя всё равно убивают
        </p>
      </header>

      <DefenseCalculatorClient />
    </main>
  );
}
