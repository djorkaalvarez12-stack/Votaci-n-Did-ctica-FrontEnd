import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage({
  user,
  activePolls,
  closedPolls,
  selectedPoll,
  onSelectPoll,
  onLogout,
}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Encuestas");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  const totalParticipants = selectedPoll?.participants?.length ?? 0;
  const totalVotos = Object.keys(selectedPoll?.votes || {}).length;
  const faltanVotar = Math.max(0, totalParticipants - totalVotos);

  // VALIDACIÓN: Verifica si el usuario autenticado está en la lista de participantes de la sesión
  const esParticipanteActivo =
    selectedPoll?.participants?.some(
      (p) =>
        p.toLowerCase().trim() === user?.email?.toLowerCase().trim() ||
        p.toLowerCase().trim() === user?.name?.toLowerCase().trim(),
    ) ?? false;

  const SesionCard = ({ poll, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border px-5 py-4 text-left transition-all ${
        poll.id === selectedPoll?.id
          ? "border-primary bg-primary/10"
          : "border-outline bg-surface-container-lowest hover:bg-surface-container"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <strong className="text-on-surface">{poll.title}</strong>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            poll.status === "active"
              ? "bg-primary-container text-on-primary-container"
              : "bg-surface-container text-on-surface-variant"
          }`}
        >
          {poll.status === "active" ? "Activa" : "Cerrada"}
        </span>
      </div>
      {poll.description && (
        <p className="text-xs text-on-surface-variant mb-2">
          {poll.description}
        </p>
      )}
      <div className="flex gap-2">
        <span className="text-xs bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-bold">
          {Object.keys(poll.votes || {}).length} votos
        </span>
        <span className="text-xs bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full">
          {poll.participants?.length ?? 0} participantes
        </span>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen pb-32 bg-background text-on-background">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#ddffe2] backdrop-blur-xl border-b border-[#8bb795]/20">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-screen-xl mx-auto">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant font-bold">
              Bienvenido
            </p>
            <h1 className="font-headline font-black text-2xl text-[#0b361d]">
              {user?.name ?? "Jugador"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Botón Participar */}
            <button
              type="button"
              disabled={!esParticipanteActivo}
              onClick={() => navigate("/voting")}
              className={`rounded-full px-4 py-2 font-bold shadow-sm transition-colors ${
                esParticipanteActivo
                  ? "bg-primary text-on-primary hover:bg-primary-container"
                  : "bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed"
              }`}
            >
              Participar
            </button>
            <button
              type="button"
              onClick={() => {
                onLogout();
                navigate("/login");
              }}
              className="rounded-full border border-outline px-4 py-2 text-on-surface font-bold hover:bg-surface-container transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* NAV TABS */}
      <nav className="mt-20 px-6 py-4 sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-[#8bb795]/10">
        <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-full max-w-md mx-auto shadow-sm">
          {["Encuestas", "Historial"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-3 px-6 flex items-center justify-center gap-2 rounded-full transition-transform active:scale-95 ${
                tab === t
                  ? "bg-gradient-to-br from-primary to-primary-container text-on-primary"
                  : "text-[#3b6447] hover:bg-[#bef5c9]"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {t === "Encuestas" ? "ballot" : "history"}
              </span>
              <span className="font-bold text-sm">{t}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="px-6 py-6 max-w-screen-xl mx-auto">
        {tab === "Encuestas" && (
          <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            {/* Panel izquierdo: detalle sesión seleccionada */}
            <div className="space-y-4">
              {selectedPoll ? (
                <>
                  <div className="bg-surface-container-low rounded-3xl p-6 shadow-soft">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant font-bold">
                          Sesión seleccionada
                        </p>
                        <h2 className="mt-2 text-2xl font-extrabold text-on-surface">
                          {selectedPoll.title}
                        </h2>
                        {selectedPoll.description && (
                          <p className="text-sm text-on-surface-variant mt-1">
                            {selectedPoll.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`rounded-full px-4 py-2 text-xs font-bold flex-shrink-0 ${
                          selectedPoll.revealed
                            ? "bg-tertiary-container text-on-tertiary-container"
                            : "bg-primary-container text-on-primary-container"
                        }`}
                      >
                        {selectedPoll.revealed ? "Revelada" : "Pendiente"}
                      </span>
                    </div>

                    {!esParticipanteActivo && (
                      <div className="bg-orange-100 text-orange-800 text-xs font-bold p-3 rounded-2xl mb-4 flex items-center gap-2 border border-orange-200">
                        <span className="material-symbols-outlined text-base">
                          visibility
                        </span>
                        Solo lectura: No estás asignado como participante en
                        esta sesión de votación.
                      </div>
                    )}

                    {/* Stats de participación */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="rounded-2xl bg-surface-container-lowest border border-outline p-3 text-center">
                        <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                          Participantes
                        </p>
                        <p className="text-2xl font-extrabold text-on-surface mt-1">
                          {totalParticipants}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-surface-container-lowest border border-outline p-3 text-center">
                        <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                          Han votado
                        </p>
                        <p className="text-2xl font-extrabold text-primary mt-1">
                          {totalVotos}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-surface-container-lowest border border-outline p-3 text-center">
                        <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                          Faltan
                        </p>
                        <p
                          className={`text-2xl font-extrabold mt-1 ${faltanVotar > 0 ? "text-error" : "text-primary"}`}
                        >
                          {faltanVotar}
                        </p>
                      </div>
                    </div>

                    {/* Cartas disponibles */}
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      Cartas disponibles
                    </p>
                    <div className="grid gap-2 grid-cols-3 sm:grid-cols-4">
                      {selectedPoll.options?.map((option) => (
                        <div
                          key={option.value || option.label}
                          className="rounded-2xl bg-surface-container-lowest border border-outline p-3 text-center"
                        >
                          <p className="font-bold text-primary text-xl">
                            {option.label}
                          </p>
                          {option.description && (
                            <p className="text-xs text-on-surface-variant mt-1">
                              {option.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Resultados si ya están revelados */}
                    {selectedPoll.revealed &&
                      Object.keys(selectedPoll.votes || {}).length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                            Resultados
                          </p>
                          <div className="grid gap-2 md:grid-cols-2">
                            {Object.entries(selectedPoll.votes).map(
                              ([email, valor]) => (
                                <div
                                  key={email}
                                  className="rounded-2xl bg-surface-container-lowest p-3 border border-outline flex items-center justify-between"
                                >
                                  <span className="text-sm text-on-surface">
                                    {email}
                                  </span>
                                  <span className="font-bold text-primary text-lg">
                                    {valor}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {/* Botones de acción del panel */}
                    <div className="mt-4 flex gap-3">
                      {!selectedPoll.revealed && esParticipanteActivo && (
                        <button
                          type="button"
                          onClick={() => navigate("/voting")}
                          className="rounded-full bg-primary px-6 py-3 text-on-primary font-bold hover:scale-105 transition-transform"
                        >
                          Ir a votar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            selectedPoll.revealed
                              ? "/revealed"
                              : "/not-revealed",
                          )
                        }
                        className="rounded-full border border-outline px-6 py-3 text-on-surface font-bold hover:bg-surface-container transition-colors"
                      >
                        {selectedPoll.revealed
                          ? "Ver resultados"
                          : "Ver estado"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-surface-container-low rounded-3xl p-8 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-3 block">
                    ballot
                  </span>
                  Selecciona una sesión del panel derecho para ver sus detalles.
                </div>
              )}
            </div>

            {/* Panel derecho */}
            <div className="bg-surface-container-low rounded-3xl p-6 shadow-soft">
              <h3 className="text-xl font-extrabold text-on-surface mb-4">
                Sesiones activas
              </h3>
              <div className="space-y-3">
                {activePolls.length > 0 ? (
                  activePolls.map((poll) => (
                    <SesionCard
                      key={poll.id}
                      poll={poll}
                      onClick={() => onSelectPoll(poll.id)}
                    />
                  ))
                ) : (
                  <div className="rounded-3xl border border-outline bg-surface-container-lowest p-6 text-center text-on-surface-variant text-sm">
                    No hay sesiones activas por ahora.
                  </div>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-4 border border-outline text-center">
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    Activas
                  </p>
                  <p className="text-3xl font-extrabold text-on-surface mt-1">
                    {activePolls.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-outline text-center">
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    Cerradas
                  </p>
                  <p className="text-3xl font-extrabold text-on-surface mt-1">
                    {closedPolls?.length ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "Historial" && (
          <section>
            <h2 className="text-2xl font-extrabold text-on-surface mb-6">
              Historial de sesiones
            </h2>
            {closedPolls?.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {closedPolls.map((poll) => (
                  <SesionCard
                    key={poll.id}
                    poll={poll}
                    onClick={() => {
                      onSelectPoll(poll.id);
                      setTab("Encuestas");
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-outline bg-surface-container-lowest p-8 text-center text-on-surface-variant">
                No hay sesiones cerradas todavía.
              </div>
            )}
          </section>
        )}
      </main>

      {/* NAV INFERIOR MÓVIL */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-[#ddffe2]/80 backdrop-blur-2xl rounded-t-[3rem] pb-safe shadow-[0_-10px_40px_-10px_rgba(11,54,29,0.06)]">
        <button
          type="button"
          onClick={() => setTab("Encuestas")}
          className={`flex flex-col items-center justify-center rounded-full px-6 py-2 scale-90 duration-300 ${tab === "Encuestas" ? "bg-[#bef5c9] text-[#006941]" : "text-[#3b6447]"}`}
        >
          <span className="material-symbols-outlined">style</span>
          <span className="font-bold text-[10px] uppercase tracking-widest mt-1">
            Sesiones
          </span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/not-revealed")}
          className="flex flex-col items-center justify-center text-[#3b6447] hover:bg-[#acecbb] rounded-full px-6 py-2 scale-90 duration-300"
        >
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="font-bold text-[10px] uppercase tracking-widest mt-1">
            Estado
          </span>
        </button>

        <button
          type="button"
          disabled={!esParticipanteActivo}
          onClick={() => navigate("/voting")}
          className={`flex flex-col items-center justify-center rounded-full px-6 py-2 scale-90 duration-300 ${
            esParticipanteActivo
              ? "text-[#3b6447] hover:bg-[#acecbb]"
              : "text-on-surface-variant/30 cursor-not-allowed"
          }`}
        >
          <span className="material-symbols-outlined">groups</span>
          <span className="font-bold text-[10px] uppercase tracking-widest mt-1">
            Votar
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab("Historial")}
          className={`flex flex-col items-center justify-center rounded-full px-6 py-2 scale-90 duration-300 ${tab === "Historial" ? "bg-[#bef5c9] text-[#006941]" : "text-[#3b6447]"}`}
        >
          <span className="material-symbols-outlined">history</span>
          <span className="font-bold text-[10px] uppercase tracking-widest mt-1">
            Historial
          </span>
        </button>
      </nav>
    </div>
  );
}

export default DashboardPage;
