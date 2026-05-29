import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResultNotRevealedPage({ user, poll, onReveal, onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);
  const safeUrlId = encryptId(poll?.id || selectedPoll?.id);
  const isAdmin = user?.role === "admin";
  const title = poll?.title ?? "Encuesta pendiente";
  const description =
    poll?.description ?? "Los resultados aún no han sido revelados.";
  const participants = poll?.participants ?? [];

  return (
    <div className="min-h-screen pb-32 bg-background text-on-surface">
      <header className="fixed top-0 w-full z-50 bg-[#ddffe2]/95 backdrop-blur-xl border-b border-[#8bb795]/20">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="material-symbols-outlined text-[#006941] hover:bg-[#bef5c9] p-2 rounded-full"
              onClick={() => navigate(-1)}
            >
              arrow_back
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant font-bold">
                Fase de espera
              </p>
              <h1 className="font-headline text-lg font-bold tracking-tight text-[#006941]">
                Resultados sin revelar
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onLogout();
              navigate("/login");
            }}
            className="material-symbols-outlined text-[#006941] hover:bg-[#bef5c9] p-3 rounded-full"
          >
            logout
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-md mx-auto">
        <section className="mb-10 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-bold tracking-widest uppercase mb-4">
            <span className="material-symbols-outlined text-sm mr-2">
              timer
            </span>
            Esperando autorización
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface leading-tight mb-4">
            {title}
          </h2>
          <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
            {description}
          </p>
        </section>

        <section className="space-y-4">
          <div className="bg-surface-container-low p-5 rounded-3xl shadow-sm border border-outline">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant font-bold">
                  Estado
                </p>
                <p className="mt-2 text-lg font-bold text-on-surface">
                  {poll?.revealed ? "Revelada" : "Pendiente de revelación"}
                </p>
              </div>
              <div className="rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container">
                {isAdmin ? "Moderador" : "Jugador"}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-background p-4 border border-outline">
                <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant font-bold">
                  Votantes esperados
                </p>
                <p className="mt-2 text-xl font-bold text-on-surface">
                  {participants.length}
                </p>
              </div>
              <div className="rounded-3xl bg-background p-4 border border-outline">
                <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant font-bold">
                  Votos registrados
                </p>
                <p className="mt-2 text-xl font-bold text-on-surface">
                  {Object.keys(poll?.votes || {}).length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10">
          {isAdmin ? (
            <button
              type="button"
              onClick={() => {
                onReveal();
                navigate(`/revealed/${safeUrlId}`);
              }}
              className="w-full h-16 rounded-3xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-95 transition-opacity"
            >
              <span className="material-symbols-outlined align-middle">
                visibility
              </span>
              <span className="ml-2">Revelar resultados</span>
            </button>
          ) : (
            <div className="rounded-3xl border border-dashed border-outline p-6 text-center text-on-surface-variant">
              <p className="font-semibold text-on-surface mb-2">
                Resultados ocultos
              </p>
              <p>
                El moderador aún no ha revelado los resultados. Revisa de nuevo
                más tarde.
              </p>
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-6 bg-[#ddffe2]/80 backdrop-blur-xl z-50 rounded-t-[3rem] shadow-[0_-10px_40px_-10px_rgba(11,54,29,0.06)]">
        <button
          type="button"
          className="flex flex-col items-center justify-center bg-[#7bfeb8] text-[#0b361d] rounded-[2rem] px-5 py-2 scale-98 transition-transform duration-200"
          onClick={() => navigate(`/dashboard/${safeUrlId}`)}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider mt-1">
            Inicio
          </span>
        </button>
        <button
          type="button"
          onClick={() => navigate(`/voting/${safeUrlId}`)}
          className="flex flex-col items-center justify-center text-[#3b6447] px-5 py-2 hover:bg-[#bef5c9] rounded-full transition-all scale-98 duration-200"
        >
          <span className="material-symbols-outlined">how_to_vote</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider mt-1">
            Votar
          </span>
        </button>
        <button
          type="button"
          onClick={() => navigate(`/revealed/${safeUrlId}`)}
          className="flex flex-col items-center justify-center text-[#3b6447] px-5 py-2 hover:bg-[#bef5c9] rounded-full transition-all scale-98 duration-200"
        >
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider mt-1">
            Resultados
          </span>
        </button>
      </nav>
    </div>
  );
}

export default ResultNotRevealedPage;
