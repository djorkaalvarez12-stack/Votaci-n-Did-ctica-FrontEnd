import React, { useState } from "react";
import { Header } from "../componentes/Header";
import { BottomNavigation } from "../componentes/BottomNavigation";
import type { NavTab } from "../App";

interface VotingSessionViewProps {
  onVoteSubmitted: (voto: string) => void;
  onBack: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onLogout?: () => void;
}

export const VotingSessionView: React.FC<VotingSessionViewProps> = ({
  onVoteSubmitted,
  onBack,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const cartas = ["1", "2", "3", "5", "8", "13", "21", "?", "☕"];
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col justify-between pb-32">
      <Header
        title="Sesión: Estimación Sprint 1"
        showBack={true}
        onBackClick={onBack}
        onLogout={onLogout}
      />

      <main className="flex-grow pt-24 px-6 flex flex-col max-w-md mx-auto w-full justify-center">
        <section className="mb-6 text-center">
          <p className="text-on-surface-variant font-medium uppercase tracking-widest text-xs mb-1">
            Paso 1 de 2
          </p>
          <h2 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">
            Selecciona tu carta
          </h2>
        </section>

        {/* Malla Interactiva de Cartas */}
        <div className="grid grid-cols-3 gap-4 card-pattern p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
          {cartas.map((carta) => (
            <button
              key={carta}
              type="button"
              onClick={() => setSelectedCard(carta)}
              className={`aspect-[2/3] rounded-xl flex items-center justify-center border-2 transition-all duration-150 font-headline text-3xl font-black ${
                selectedCard === carta
                  ? "bg-[#006941] text-[#caffdc] border-[#006941] scale-105 shadow-xl ring-4 ring-[#7bfeb8]/30"
                  : "bg-surface border-outline-variant/30 text-on-surface hover:border-[#006941] active:scale-95"
              }`}
            >
              {carta}
            </button>
          ))}
        </div>

        {/* Botón de envío que reacciona si hay selección */}
        <div className="h-20 mt-4 flex items-center">
          {selectedCard ? (
            <button
              onClick={() => onVoteSubmitted(selectedCard)}
              className="w-full h-14 bg-[#006941] text-[#caffdc] font-bold rounded-full shadow-md hover:bg-[#004b2d] transition-all transform animate-fade-in active:scale-95"
            >
              Confirmar Votación con la carta "{selectedCard}"
            </button>
          ) : (
            <div className="w-full text-center text-sm text-on-surface-variant/60 italic font-medium">
              Toca una carta arriba para habilitar el envío...
            </div>
          )}
        </div>
      </main>

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
