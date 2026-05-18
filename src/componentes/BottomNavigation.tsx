import React from "react";

// 1. Definimos un tipo estricto para evitar repetir los strings y asegurar consistencia
type NavTab = "mesas" | "votar" | "cartas" | "chat";

interface BottomNavProps {
  activeTab: NavTab;
  // 2. Cambiamos el 'any' por el tipo exacto que espera recibir la función
  setActiveTab: (tab: NavTab) => void;
}

export const BottomNavigation: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 bg-gradient-to-t from-[#ddffe2] via-[#ddffe2]/95 to-transparent dark:from-[#0b361d] dark:via-[#0b361d]/95">
      <nav className="max-w-md mx-auto flex items-center justify-around bg-[#bef5c9]/90 dark:bg-[#0b361d]/80 backdrop-blur-xl rounded-t-[3rem] border-t border-[#8bb795]/15 p-2 shadow-lg">
        {/* Botón Mesas */}
        <button
          onClick={() => setActiveTab("mesas")}
          className={`flex flex-col items-center justify-center p-2 rounded-full px-4 transition-all duration-200 ${
            activeTab === "mesas"
              ? "bg-[#7bfeb8] text-[#0b361d]"
              : "text-[#3b6447]"
          }`}
        >
          <span className="material-symbols-outlined">style</span>
          <span className="font-body text-[11px] font-semibold uppercase mt-0.5">
            Mesas
          </span>
        </button>

        {/* Botón Votar */}
        <button
          onClick={() => setActiveTab("votar")}
          className={`flex flex-col items-center justify-center p-2 rounded-full px-4 transition-all duration-200 ${
            activeTab === "votar"
              ? "bg-[#7bfeb8] text-[#0b361d]"
              : "text-[#3b6447]"
          }`}
        >
          <span className="material-symbols-outlined">how_to_vote</span>
          <span className="font-body text-[11px] font-semibold uppercase mt-0.5">
            Votar
          </span>
        </button>
      </nav>
    </div>
  );
};
