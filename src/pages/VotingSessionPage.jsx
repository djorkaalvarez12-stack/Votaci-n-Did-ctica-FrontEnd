import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VotingSessionPage({
  user,
  polls,
  selectedPoll,
  onSelectPoll,
  onVote,
  onLogout,
}) {
  const navigate = useNavigate();
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  useEffect(() => {
    if (selectedPoll) {
      setChoice(
        selectedPoll.votes?.[user?.email] ??
          selectedPoll.options?.[0]?.value ??
          null,
      );
    }
  }, [selectedPoll, user]);

  const alreadyVoted = Boolean(selectedPoll?.votes?.[user?.email]);

  const handleSubmit = () => {
    if (!selectedPoll || alreadyVoted || !choice) return;
    onVote(selectedPoll.id, choice);
    navigate("/not-revealed");
  };

  const optionCards = selectedPoll?.options ?? [];
  const availablePolls = polls ?? [];
  const totalParticipants = selectedPoll?.participants?.length ?? 0;
  const totalVotos = Object.keys(selectedPoll?.votes || {}).length;
  const faltanVotar = Math.max(0, totalParticipants - totalVotos);

  return (
    <div className="min-h-screen pb-32 bg-background text-on-background">
      <header className="fixed top-0 w-full z-50 bg-[#ddffe2]/95 backdrop-blur-xl border-b border-[#8bb795]/20">
        <div className="flex justify-between items-center px-6 py-4">
          <button
            type="button"
            className="material-symbols-outlined text-[#2E7D32] hover:bg-[#bef5c9] p-2 rounded-full"
            onClick={() => navigate(-1)}
          >
            arrow_back
          </button>
          <div className="text-center">
            <h1 className="font-headline text-lg font-bold tracking-tight text-[#2E7D32]">
              Votación en Curso
            </h1>
            <p className="text-xs text-on-surface-variant">
              {selectedPoll?.title ?? "Sin sesión"}
            </p>
          </div>
          <button
            type="button"
            className="material-symbols-outlined text-[#2E7D32] hover:bg-[#bef5c9] p-2 rounded-full"
            onClick={() => {
              onLogout();
              navigate("/login");
            }}
          >
            logout
          </button>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-32 px-6 max-w-4xl mx-auto space-y-6">
        {/* Lista de sesiones activas */}
        <section>
          <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant font-bold mb-3">
            Sesiones activas
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availablePolls.length > 0 ? (
              availablePolls.map((poll) => (
                <button
                  key={poll.id}
                  type="button"
                  onClick={() => onSelectPoll(poll.id)}
                  className={`rounded-3xl border p-4 text-left transition-all ${
                    poll.id === selectedPoll?.id
                      ? "border-primary bg-primary/10"
                      : "border-outline bg-surface-container-lowest hover:bg-surface-container"
                  }`}
                >
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                    {poll.revealed ? "Revelada" : "Activa"}
                  </span>
                  <h3 className="mt-1 text-lg font-extrabold text-on-surface">
                    {poll.title}
                  </h3>
                  {poll.description && (
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {poll.description}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-bold">
                      {Object.keys(poll.votes || {}).length} votos
                    </span>
                    <span className="text-xs bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full">
                      {poll.participants?.length ?? 0} participantes
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-3xl border border-outline bg-surface-container-lowest p-8 text-center text-on-surface-variant col-span-3">
                No hay sesiones activas por ahora.
              </div>
            )}
          </div>
        </section>

        {/* Info de la sesión seleccionada */}
        {selectedPoll && (
          <section className="bg-surface-container-low rounded-3xl p-6 shadow-soft">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
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
                  alreadyVoted
                    ? "bg-tertiary-container text-on-tertiary-container"
                    : "bg-primary-container text-on-primary-container"
                }`}
              >
                {alreadyVoted ? "Ya votaste" : "Puedes votar"}
              </span>
            </div>

            {/* Stats de participación */}
            <div className="grid grid-cols-3 gap-3 mb-6">
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

            {/* Cartas con descripción */}
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
              Selecciona tu carta
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {optionCards.map((option) => {
                const isSelected = choice === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !alreadyVoted && setChoice(option.value)}
                    disabled={alreadyVoted}
                    className={`rounded-3xl border p-5 text-center transition-all ${
                      isSelected
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-surface-container-highest border-outline text-on-surface hover:border-primary"
                    } ${alreadyVoted ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="text-4xl font-headline font-black mb-2">
                      {option.label}
                    </div>
                    {option.description && (
                      <p
                        className={`text-xs font-medium ${isSelected ? "text-on-primary/80" : "text-on-surface-variant"}`}
                      >
                        {option.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-on-surface-variant">
                  Tu elección actual
                </p>
                <p className="text-3xl font-extrabold text-on-surface mt-1">
                  {choice ?? "-"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={alreadyVoted || !selectedPoll || !choice}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-br from-primary to-primary-container px-8 py-4 text-on-primary font-bold shadow-lg transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {alreadyVoted ? "Ya votaste" : "Enviar voto"}
              </button>
            </div>
          </section>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-6 bg-[#ddffe2]/80 backdrop-blur-xl z-50 rounded-t-[3rem] shadow-[0_-40px_40px_-10px_rgba(11,54,29,0.06)]">
        <button
          type="button"
          className="flex flex-col items-center justify-center text-[#3b6447] px-5 py-2 hover:bg-[#bef5c9] rounded-full transition-all"
          onClick={() => navigate("/dashboard")}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[11px] font-bold uppercase tracking-wider mt-1">
            Inicio
          </span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center bg-[#7bfeb8] text-[#0b361d] rounded-full px-6 py-2"
          onClick={() => navigate("/not-revealed")}
        >
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="text-[11px] font-bold uppercase tracking-wider mt-1">
            Estado
          </span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center text-[#3b6447] px-5 py-2 hover:bg-[#bef5c9] rounded-full transition-all"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-[11px] font-bold uppercase tracking-wider mt-1">
            Atrás
          </span>
        </button>
      </nav>
    </div>
  );
}

export default VotingSessionPage;
