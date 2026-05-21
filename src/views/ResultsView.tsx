import React, { useState } from "react";
import { Header } from "../componentes/Header";
import { BottomNavigation } from "../componentes/BottomNavigation";
import type { PlayerVote, NavTab } from "../App";

interface ResultsViewProps {
  jugadores: PlayerVote[];
  onBack: () => void;
  onReset: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onLogout?: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  jugadores,
  onBack,
  onReset,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  // Función matemática de cálculo de consenso en tiempo real
  const calcularConsenso = (): string => {
    const votosNumericos = jugadores
      .map((j) => parseInt(j.voto))
      .filter((voto) => !isNaN(voto)); // Sacamos el café y el signo de interrogación

    if (votosNumericos.length === 0) return "—";

    const suma = votosNumericos.reduce((acc, curr) => acc + curr, 0);
    return Math.round(suma / votosNumericos.length).toString();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pb-32">
      <Header
        title={
          isRevealed ? "Mesa: Resultados finales" : "Mesa: Esperando votos"
        }
        showBack={true}
        onBackClick={onBack}
        onLogout={onLogout}
      />

      <main className="pt-24 px-6 max-w-md mx-auto w-full flex-grow">
        <section className="mb-6 text-center">
          <div
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3 ${
              isRevealed
                ? "bg-[#bef5c9] text-[#004b2d]"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            <span className="material-symbols-outlined text-sm mr-1.5">
              {isRevealed ? "analytics" : "hourglass_top"}
            </span>
            {isRevealed ? "Conteo Completado" : "Votos Ocultos"}
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">
            {isRevealed ? "Consenso del Equipo" : "Cartas en la mesa"}
          </h2>
        </section>

        {/* Panel del Gráfico / Promedio que aparece dinámicamente al revelar */}
        {isRevealed && (
          <div className="bg-surface-container p-5 rounded-2xl flex items-center justify-between mb-6 shadow-sm border border-outline-variant/20 transform transition-all scale-100 duration-300">
            <div className="w-20 h-20 pie-chart shadow-inner animate-spin-slow"></div>
            <div className="text-right">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Promedio sugerido
              </p>
              <p className="text-4xl font-black text-[#006941]">
                {calcularConsenso()} Pts
              </p>
            </div>
          </div>
        )}

        {/* Mapeo dinámico de jugadores */}
        <div className="space-y-3">
          {jugadores.map((jugador) => (
            <div
              key={jugador.id}
              className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between shadow-sm border border-outline-variant/10"
            >
              <div className="flex items-center gap-3">
                <img
                  src={jugador.avatar}
                  className="w-10 h-10 rounded-full border bg-surface"
                  alt={jugador.nombre}
                />
                <div>
                  <span className="font-bold text-on-surface block text-sm">
                    {jugador.nombre}
                  </span>
                  <span className="text-[11px] text-primary font-semibold">
                    ✓ Listo
                  </span>
                </div>
              </div>

              {/* Celda de la carta con transición visual de volteo */}
              <div
                className={`w-10 h-14 rounded-lg flex items-center justify-center font-headline text-xl font-bold border transform transition-all duration-300 ${
                  isRevealed
                    ? "bg-surface border-[#006941] text-[#006941] rotate-0 shadow-sm"
                    : "poker-card-back border-transparent shadow-md -rotate-6"
                }`}
              >
                {isRevealed ? jugador.voto : ""}
              </div>
            </div>
          ))}
        </div>

        {/* Control del Moderador abajo */}
        <div className="mt-8">
          {!isRevealed ? (
            <button
              onClick={() => setIsRevealed(true)}
              className="w-full h-14 bg-[#006941] text-[#caffdc] font-bold rounded-full shadow-lg hover:bg-[#004b2d] transition-all active:scale-95"
            >
              Revelar Cartas 🃏
            </button>
          ) : (
            <button
              onClick={onReset}
              className="w-full h-14 bg-surface border-2 border-[#006941] text-[#006941] font-bold rounded-full shadow-sm hover:bg-surface-container transition-all active:scale-95"
            >
              Nueva Estimación
            </button>
          )}
        </div>
      </main>

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
