import React from "react";
import { Header } from "../componentes/Header";
import { BottomNavigation } from "../componentes/BottomNavigation";
import type { NavTab } from "../App";

interface DashboardViewProps {
  onSelectSession: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onLogout?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectSession,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  // Simulación de data estructurada en TS
  const sscionesActivas = [
    {
      id: 1,
      titulo: "Estimación Sprint 1",
      creador: "Felipe",
      estado: "Activa",
    },
    {
      id: 2,
      titulo: "Refinamiento Refactor",
      creador: "Andrés",
      estado: "Pendiente",
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-24">
      <Header
        title="The Playful Strategist"
        showMenu={true}
        onLogout={onLogout}
      />

      <main className="px-6 pt-24 max-w-screen-xl mx-auto">
        {/* Hero Section */}
        <section className="mb-10 relative overflow-hidden rounded-xl bg-primary text-on-primary p-8 min-h-[220px] flex flex-col justify-end shadow-md">
          <h2 className="text-3xl font-black font-headline mb-2 z-10">
            Mesa de Estrategia
          </h2>
          <p className="text-on-primary/80 text-sm max-w-md z-10">
            Crea salas de póker de planificación y alinea a tu equipo de
            desarrollo en un par de clics.
          </p>
        </section>

        {/* Lista de Sesiones */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-[#0b361d]">
            Sesiones Disponibles
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {sscionesActivas.map((sesion) => (
              <div
                key={sesion.id}
                onClick={onSelectSession}
                className="bg-surface-container p-6 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-all active:scale-[0.98]"
              >
                <div>
                  <h4 className="font-bold text-lg text-on-surface">
                    {sesion.titulo}
                  </h4>
                  <p className="text-sm text-on-surface-variant">
                    Creado por {sesion.creador}
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary">
                  arrow_forward_ios
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
