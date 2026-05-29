import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResultRevealedPage({ user, poll, onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  const hasVotes = Object.keys(poll?.votes || {}).length > 0;

  const voteCounts =
    poll?.options?.map((option) => ({
      label: option.label,
      count: Object.values(poll.votes || {}).filter(
        (value) => value === option.value,
      ).length,
    })) ?? [];

  const totalVotes = voteCounts.reduce((sum, item) => sum + item.count, 0);
  const majority = voteCounts.reduce(
    (prev, current) => (current.count > prev.count ? current : prev),
    { label: "-", count: 0 },
  );
  const currentPercent = totalVotes
    ? Math.round((majority.count / totalVotes) * 100)
    : 0;

  // Votos individuales para mostrar quién votó qué
  const votosList = Object.entries(poll?.votes || {});

  return (
    <div className="min-h-screen pb-32 bg-background text-on-surface">
      <header className="w-full top-0 sticky bg-[#ddffe2] z-50 border-b border-[#8bb795]/20">
        <div className="flex justify-between items-center px-6 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="material-symbols-outlined text-[#2E7D32] hover:bg-[#bef5c9] p-2 rounded-full"
          >
            arrow_back
          </button>
          <div className="text-center">
            <h1 className="font-headline font-bold tracking-tight text-xl text-[#2E7D32]">
              Resultados revelados
            </h1>
            <p className="text-xs text-on-surface-variant">{poll?.title}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onLogout();
              navigate("/login");
            }}
            className="material-symbols-outlined text-[#2E7D32] hover:bg-[#bef5c9] p-2 rounded-full"
          >
            logout
          </button>
        </div>
      </header>

      <main className="flex-grow px-6 pt-6 pb-32 max-w-4xl mx-auto w-full">
        {/* Sin votos aún */}
        {!hasVotes ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant">
              hourglass_empty
            </span>
            <p className="text-on-surface-variant font-bold text-lg">
              Cargando resultados...
            </p>
            <p className="text-on-surface-variant text-sm">
              No hay votos registrados en esta sesión.
            </p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full border border-outline px-6 py-3 text-on-surface font-bold hover:bg-surface-container transition-colors"
            >
              Volver
            </button>
          </div>
        ) : (
          <>
            {/* Título */}
            <div className="mb-8 text-center">
              <span className="inline-block px-4 py-1.5 bg-surface-container-high rounded-full text-on-surface-variant text-xs uppercase tracking-wider mb-3">
                Estadísticas finales
              </span>
              <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface">
                {poll?.title ?? "Resultados"}
              </h2>
              {poll?.description && (
                <p className="text-on-surface-variant mt-2 max-w-md mx-auto text-sm">
                  {poll.description}
                </p>
              )}
            </div>

            {/* Círculo central con mayoría */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative w-52 h-52 md:w-64 md:h-64 bg-surface-container-low rounded-full flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(11,54,29,0.12)] border border-outline">
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="font-headline font-extrabold text-5xl text-primary">
                    {currentPercent}%
                  </span>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider mt-1">
                    {majority.label === "-"
                      ? "Sin votos"
                      : `Mayoría: ${majority.label}`}
                  </span>
                  <span className="text-xs text-on-surface-variant mt-1">
                    {totalVotes} voto{totalVotes !== 1 ? "s" : ""} total
                  </span>
                </div>
              </div>
            </div>

            {/* Barras de resultados por opción */}
            <div className="grid gap-3 mb-8">
              {voteCounts
                .filter((o) => o.count > 0) // Solo mostrar opciones con votos
                .sort((a, b) => b.count - a.count)
                .map((option) => {
                  const percent = totalVotes
                    ? Math.round((option.count / totalVotes) * 100)
                    : 0;
                  const isMajority = option.label === majority.label;
                  return (
                    <div
                      key={option.label}
                      className={`rounded-3xl p-4 border flex items-center gap-4 ${
                        isMajority
                          ? "bg-primary/10 border-primary"
                          : "bg-surface-container-lowest border-outline"
                      }`}
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-headline font-black text-2xl flex-shrink-0 ${
                          isMajority
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container text-on-surface"
                        }`}
                      >
                        {option.label}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-on-surface text-sm">
                            {option.count} voto{option.count !== 1 ? "s" : ""}
                          </span>
                          <span
                            className={`font-bold text-sm ${isMajority ? "text-primary" : "text-on-surface-variant"}`}
                          >
                            {percent}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isMajority ? "bg-primary" : "bg-outline"}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                      {isMajority && (
                        <span className="material-symbols-outlined text-primary">
                          emoji_events
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Todas las cartas disponibles con sus conteos */}
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                Distribución completa
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {voteCounts.map((option) => {
                  const percent = totalVotes
                    ? Math.round((option.count / totalVotes) * 100)
                    : 0;
                  return (
                    <div
                      key={option.label}
                      className={`rounded-2xl p-3 flex flex-col items-center border ${
                        option.label === majority.label && option.count > 0
                          ? "bg-primary/10 border-primary"
                          : "bg-surface-container-lowest border-outline opacity-60"
                      }`}
                    >
                      <span className="font-headline font-bold text-xl text-primary">
                        {option.label}
                      </span>
                      <span className="text-xs font-bold text-on-surface mt-1">
                        {percent}%
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {option.count} v.
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detalle de votos individuales */}
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                Votos individuales
              </h3>
              <div className="space-y-2">
                {votosList.map(([email, valor]) => (
                  <div
                    key={email}
                    className="rounded-2xl bg-surface-container-lowest border border-outline px-4 py-3 flex items-center justify-between"
                  >
                    <span className="text-sm text-on-surface">{email}</span>
                    <span
                      className={`font-bold text-lg px-3 py-1 rounded-full ${
                        valor === majority.label
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container text-on-surface"
                      }`}
                    >
                      {valor}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Análisis */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline mb-8">
              <h3 className="font-headline font-bold text-on-surface flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary">
                  analytics
                </span>
                Análisis de la Mesa
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-background p-4 border border-outline text-center">
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    Mayoría
                  </p>
                  <p className="text-3xl font-extrabold text-primary mt-1">
                    {majority.label}
                  </p>
                </div>
                <div className="rounded-2xl bg-background p-4 border border-outline text-center">
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    Participación
                  </p>
                  <p className="text-3xl font-extrabold text-on-surface mt-1">
                    {totalVotes}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-on-primary font-bold hover:shadow-lg transition-shadow"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Volver al Dashboard
              </button>
            </div>
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 bg-[#ddffe2]/80 backdrop-blur-xl rounded-t-[3rem] border-t border-[#8bb795]/15 shadow-[0_-10px_40px_-10px_rgba(11,54,29,0.06)]">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center justify-center text-[#3b6447] p-2 hover:bg-[#bef5c9] rounded-full transition-all"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-xs font-semibold">Inicio</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/voting")}
          className="flex flex-col items-center justify-center text-[#3b6447] p-2 hover:bg-[#bef5c9] rounded-full transition-all"
        >
          <span className="material-symbols-outlined">how_to_vote</span>
          <span className="text-xs font-semibold">Votar</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center bg-[#7bfeb8] text-[#0b361d] rounded-[3rem] px-5 py-2"
        >
          <span className="material-symbols-outlined">pie_chart</span>
          <span className="text-xs font-semibold">Resultados</span>
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex flex-col items-center justify-center text-[#3b6447] p-2 hover:bg-[#bef5c9] rounded-full transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-xs font-semibold">Atrás</span>
        </button>
      </nav>
    </div>
  );
}

export default ResultRevealedPage;
