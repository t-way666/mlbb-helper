import WinrateCalculatorClient from "@/components/WinrateCalculatorClient";

export default function WinratePage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 pt-36 md:pt-40">
      <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent uppercase tracking-tighter drop-shadow-sm">
          Калькулятор винрейта
        </h1>
        <p className="text-muted mt-4 font-medium max-w-2xl mx-auto leading-relaxed uppercase text-xs tracking-widest">
          Рассчитай путь к идеальной статистике
        </p>
      </header>

      <WinrateCalculatorClient />
    </main>
  );
}
