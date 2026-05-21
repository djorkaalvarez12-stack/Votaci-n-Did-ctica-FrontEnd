import React, { useState } from "react";
import { LoginView } from "./views/LoginView";
import { DashboardView } from "./views/DashboardView";
import { VotingSessionView } from "./views/VotingSessionView";
import { ResultsView } from "./views/ResultsView";

export type AppScreen = "LOGIN" | "DASHBOARD" | "VOTING_SESSION" | "RESULTS";
export type NavTab = "mesas" | "votar" | "cartas" | "chat";

export interface PlayerVote {
  id: number;
  nombre: string;
  avatar: string;
  voto: string;
  haVotado: boolean;
}

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("LOGIN");
  const [activeTab, setActiveTab] = useState<NavTab>("mesas");
  // estado `userVote` eliminado porque no se utiliza directamente

  // El equipo que votará contigo en la mesa
  const [jugadores, setJugadores] = useState<PlayerVote[]>([
    {
      id: 1,
      nombre: "Andrés (Dev)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andres",
      voto: "5",
      haVotado: true,
    },
    {
      id: 2,
      nombre: "Carlos (Frontend)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      voto: "8",
      haVotado: true,
    },
    {
      id: 3,
      nombre: "María (QA)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      voto: "8",
      haVotado: true,
    },
  ]);

  // Manejador cuando tú confirmas tu voto en la pantalla de cartas
  const handleConfirmVote = (votoSeleccionado: string) => {
    // Agregamos tu voto a la lista de jugadores dinámicamente
    const tuVoto: PlayerVote = {
      id: 99,
      nombre: "Felipe (Tú)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe",
      voto: votoSeleccionado,
      haVotado: true,
    };

    // Actualizamos la lista incluyendo tu voto real
    setJugadores((prev) => [tuVoto, ...prev.filter((j) => j.id !== 99)]);
    setCurrentScreen("RESULTS"); // Pasamos de una a ver los resultados
  };

  const handleLogout = () => {
    // Resetea a la pantalla de login
    setCurrentScreen("LOGIN");
  };

  const handleResetGame = () => {
    setJugadores((prev) => prev.filter((j) => j.id !== 99));
    setCurrentScreen("VOTING_SESSION");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface select-none">
      {currentScreen === "LOGIN" && (
        <LoginView onLoginSuccess={() => setCurrentScreen("DASHBOARD")} />
      )}

      {currentScreen === "DASHBOARD" && (
        <DashboardView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSelectSession={() => setCurrentScreen("VOTING_SESSION")}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === "VOTING_SESSION" && (
        <VotingSessionView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onVoteSubmitted={handleConfirmVote}
          onBack={() => setCurrentScreen("DASHBOARD")}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === "RESULTS" && (
        <ResultsView
          jugadores={jugadores}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onReset={handleResetGame}
          onBack={() => setCurrentScreen("DASHBOARD")}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
