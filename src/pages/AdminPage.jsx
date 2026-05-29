import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPage({
  user,
  polls,
  selectedPollId,
  usuarios,
  onSelectPoll,
  onCreatePoll,
  onRevealPoll,
  onDeleteSesion,
  onAgregarParticipante,
  onEliminarParticipante,
  onDeleteUsuario,
  onUpdateRol, // Prop para actualizar el rol
  onLogout,
}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("sesiones");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [opciones, setOpciones] = useState([
    { label: "1", description: "Muy pequeño" },
    { label: "2", description: "Pequeño" },
    { label: "3", description: "Mediano" },
    { label: "5", description: "Grande" },
    { label: "8", description: "Muy grande" },
  ]);
  const [nuevaOpcion, setNuevaOpcion] = useState({
    label: "",
    description: "",
  });
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null); // {type: 'sesion'|'usuario', id}

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  const activePolls = useMemo(
    () => polls.filter((p) => p.status === "active"),
    [polls],
  );
  const closedPolls = useMemo(
    () => polls.filter((p) => p.status === "closed"),
    [polls],
  );
  const selectedPoll =
    polls.find((p) => p.id === selectedPollId) ?? activePolls[0] ?? null;

  const voteCounts = selectedPoll
    ? selectedPoll.options.map((option) => ({
        label: option.label,
        description: option.description,
        count: Object.values(selectedPoll.votes || {}).filter(
          (v) => v === option.value,
        ).length,
      }))
    : [];
  const totalVotes = voteCounts.reduce((sum, item) => sum + item.count, 0);
  const majority = voteCounts.reduce(
    (prev, cur) => (cur.count > prev.count ? cur : prev),
    { label: "-", count: 0 },
  );

  const agregarOpcion = () => {
    if (!nuevaOpcion.label.trim()) return;
    setOpciones((prev) => [...prev, { ...nuevaOpcion }]);
    setNuevaOpcion({ label: "", description: "" });
  };

  const eliminarOpcion = (index) =>
    setOpciones((prev) => prev.filter((_, i) => i !== index));

  const handleCrear = () => {
    if (!title.trim()) return;
    const opcionesStr = opciones
      .map((o) => `${o.label}:${o.description}`)
      .join(",");
    onCreatePoll(title, description, opcionesStr);
    setTitle("");
    setDescription("");
    setOpciones([
      { label: "1", description: "Muy pequeño" },
      { label: "2", description: "Pequeño" },
      { label: "3", description: "Mediano" },
      { label: "5", description: "Grande" },
      { label: "8", description: "Muy grande" },
    ]);
    setTab("sesiones");
  };

  const handleAgregarParticipante = () => {
    if (!usuarioSeleccionado || !selectedPoll) return;
    onAgregarParticipante(selectedPoll.id, usuarioSeleccionado);
    setUsuarioSeleccionado("");
  };

  // Usuarios que no están ya en la sesión
  const usuariosDisponibles = (usuarios || []).filter(
    (u) =>
      !selectedPoll?.participants?.includes(u.nombre) &&
      u.id !== selectedPoll?.adminId,
  );

  return (
    <div className="min-h-screen pb-32 bg-background text-on-background">
      {/* Confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-6">
          <div className="bg-surface-container-low rounded-3xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold text-on-surface mb-2">
              ¿Confirmar eliminación?
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              {confirmDelete.type === "sesion"
                ? "Se eliminará la sesión y todos sus datos permanentemente."
                : "Se eliminará el usuario permanentemente."}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-full border border-outline px-4 py-3 font-bold text-on-surface hover:bg-surface-container transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmDelete.type === "sesion")
                    onDeleteSesion(confirmDelete.id);
                  else onDeleteUsuario(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="flex-1 rounded-full bg-error px-4 py-3 font-bold text-on-error hover:opacity-90 transition-opacity"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="fixed top-0 w-full z-50 bg-[#ddffe2]/95 backdrop-blur-xl border-b border-[#8bb795]/20">
        <div className="flex justify-between items-center px-6 py-4 max-w-screen-xl mx-auto">
          <div>
            <h1 className="text-2xl font-headline font-black text-[#0b361d]">
              Panel Admin
            </h1>
            <p className="text-sm text-on-surface-variant">
              Hola, {user?.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onLogout();
                navigate("/login");
              }}
              className="bg-white text-on-surface border border-outline px-4 py-3 rounded-full text-sm font-bold hover:bg-surface-container transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="pt-24 px-6 max-w-screen-xl mx-auto">
        <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-full max-w-2xl mb-8 shadow-sm overflow-x-auto">
          {[
            ["sesiones", "ballot", "Sesiones"],
            ["crear", "add_circle", "Crear"],
            ["historial", "history", "Historial"],
            ["usuarios", "group", "Usuarios"],
          ].map(([key, icon, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex-1 min-w-fit py-3 px-4 flex items-center justify-center gap-1 rounded-full transition-all whitespace-nowrap ${
                tab === key
                  ? "bg-gradient-to-br from-primary to-primary-container text-on-primary"
                  : "text-[#3b6447] hover:bg-[#bef5c9]"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{icon}</span>
              <span className="font-bold text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="px-6 max-w-screen-xl mx-auto space-y-8">
        {/* TAB: SESIONES ACTIVAS */}
        {tab === "sesiones" && (
          <section className="grid gap-6 lg:grid-cols-[0.8fr_1.4fr]">
            {/* Lista */}
            <div className="bg-surface-container-low p-6 rounded-3xl shadow-soft">
              <h2 className="font-headline text-xl font-extrabold text-on-surface mb-4">
                Sesiones activas
              </h2>
              <div className="space-y-3">
                {activePolls.length > 0 ? (
                  activePolls.map((poll) => (
                    <div key={poll.id} className="relative">
                      <button
                        type="button"
                        onClick={() => onSelectPoll(poll.id)}
                        className={`w-full rounded-3xl border px-5 py-4 text-left transition-all pr-12 ${
                          poll.id === selectedPoll?.id
                            ? "border-primary bg-primary/10"
                            : "border-outline bg-surface-container-lowest hover:bg-surface-container"
                        }`}
                      >
                        <strong className="block text-on-surface">
                          {poll.title}
                        </strong>
                        <span className="text-xs text-on-surface-variant">
                          {poll.description}
                        </span>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-bold">
                            {Object.keys(poll.votes || {}).length} votos
                          </span>
                          <span className="text-xs bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full">
                            {poll.participants?.length ?? 0} participantes
                          </span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmDelete({ type: "sesion", id: poll.id })
                        }
                        className="absolute top-3 right-3 material-symbols-outlined text-error hover:bg-error/10 rounded-full p-1 transition-colors text-sm"
                      >
                        delete
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-outline bg-surface-container-lowest p-6 text-center text-on-surface-variant text-sm">
                    No hay sesiones activas.
                  </div>
                )}
              </div>
            </div>

            {/* Detalle */}
            {selectedPoll ? (
              <div className="space-y-6">
                {/* Header sesión */}
                <div className="bg-surface-container-low p-6 rounded-3xl shadow-soft">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                        Sesión seleccionada
                      </p>
                      <h3 className="mt-2 text-2xl font-extrabold text-on-surface">
                        {selectedPoll.title}
                      </h3>
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

                  {/* Gráfico de votos */}
                  {totalVotes > 0 ? (
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        Resultados ({totalVotes} votos)
                      </p>
                      {voteCounts
                        .filter((o) => o.count > 0)
                        .sort((a, b) => b.count - a.count)
                        .map((option) => {
                          const percent = Math.round(
                            (option.count / totalVotes) * 100,
                          );
                          const isMaj = option.label === majority.label;
                          return (
                            <div
                              key={option.label}
                              className={`rounded-2xl p-4 border flex items-center gap-4 ${
                                isMaj
                                  ? "bg-primary/10 border-primary"
                                  : "bg-surface-container-lowest border-outline"
                              }`}
                            >
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0 ${
                                  isMaj
                                    ? "bg-primary text-on-primary"
                                    : "bg-surface-container text-on-surface"
                                }`}
                              >
                                {option.label}
                              </div>
                              <div className="flex-1">
                                {option.description && (
                                  <p className="text-xs text-on-surface-variant mb-1">
                                    {option.description}
                                  </p>
                                )}
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-bold">
                                    {option.count} voto
                                    {option.count !== 1 ? "s" : ""}
                                  </span>
                                  <span
                                    className={`text-sm font-bold ${isMaj ? "text-primary" : "text-on-surface-variant"}`}
                                  >
                                    {percent}%
                                  </span>
                                </div>
                                <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${isMaj ? "bg-primary" : "bg-outline"}`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                              {isMaj && (
                                <span className="material-symbols-outlined text-primary">
                                  emoji_events
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-surface-container-lowest border border-dashed border-outline p-6 text-center text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-3xl mb-2 block">
                        how_to_vote
                      </span>
                      Aún no hay votos registrados.
                    </div>
                  )}

                  {/* Distribución completa de opciones */}
                  {totalVotes === 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {voteCounts.map((option) => (
                        <div
                          key={option.label}
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
                  )}

                  {/* Botón revelar */}
                  {!selectedPoll.revealed && (
                    <button
                      type="button"
                      onClick={() => onRevealPoll(selectedPoll.id)}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-on-primary font-bold shadow-lg hover:scale-[0.98] transition-transform"
                    >
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                      Revelar resultados
                    </button>
                  )}
                </div>

                {/* Participantes */}
                <div className="bg-surface-container-low p-6 rounded-3xl shadow-soft">
                  <h3 className="text-xl font-bold text-on-surface mb-4">
                    Participantes
                  </h3>

                  {/* Lista de participantes actuales */}
                  <div className="space-y-2 mb-4">
                    {selectedPoll.participants.length > 0 ? (
                      selectedPoll.participants.map((p) => {
                        const usuarioReal = (usuarios || []).find(
                          (u) => u.nombre.toLowerCase() === p.toLowerCase(),
                        );
                        const emailUsuario = usuarioReal
                          ? usuarioReal.email
                          : null;
                        const voto = emailUsuario
                          ? selectedPoll.votes?.[emailUsuario]
                          : null;

                        return (
                          <div
                            key={p}
                            className="rounded-2xl bg-surface-container-lowest px-4 py-3 border border-outline flex items-center justify-between"
                          >
                            <div>
                              <span className="text-sm font-bold">{p}</span>
                              <span className="ml-2 text-xs text-on-surface-variant">
                                {voto ? `→ Votó: ${voto}` : "Sin voto aún"}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                onEliminarParticipante(selectedPoll.id, p)
                              }
                              className="material-symbols-outlined text-error hover:bg-error/10 rounded-full p-1 text-sm transition-colors"
                            >
                              person_remove
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-on-surface-variant">
                        No hay participantes aún.
                      </p>
                    )}
                  </div>

                  {/* Agregar participante desde lista de usuarios */}
                  {!selectedPoll.revealed && usuariosDisponibles.length > 0 && (
                    <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-outline p-4 space-y-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        Agregar participante
                      </p>
                      <div className="flex gap-3">
                        <select
                          value={usuarioSeleccionado}
                          onChange={(e) =>
                            setUsuarioSeleccionado(e.target.value)
                          }
                          className="flex-1 rounded-2xl border border-outline px-3 py-2 bg-background text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="">Selecciona un usuario</option>
                          {usuariosDisponibles.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.nombre} ({u.email})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handleAgregarParticipante}
                          disabled={!usuarioSeleccionado}
                          className="rounded-2xl bg-primary px-4 py-2 text-on-primary font-bold hover:scale-105 transition-transform disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined">
                            person_add
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-low p-8 rounded-3xl text-center text-on-surface-variant">
                Selecciona una sesión para ver el detalle.
              </div>
            )}
          </section>
        )}

        {/* TAB: CREAR SESIÓN */}
        {tab === "crear" && (
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="bg-surface-container-low p-6 rounded-3xl shadow-soft space-y-5">
              <h2 className="font-headline text-2xl font-extrabold text-on-surface">
                Nueva sesión
              </h2>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Título *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-3xl border border-outline px-4 py-4 bg-surface-container-lowest text-on-surface outline-none focus:ring-4 focus:ring-primary-fixed-dim/30"
                  placeholder="Ej: Estimación Sprint 4"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[100px] rounded-3xl border border-outline px-4 py-4 bg-surface-container-lowest text-on-surface outline-none focus:ring-4 focus:ring-primary-fixed-dim/30"
                  placeholder="Describe el objetivo de esta sesión"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Opciones de votación ({opciones.length})
                </label>
                <div className="space-y-2 mb-4">
                  {opciones.map((op, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest border border-outline px-4 py-3"
                    >
                      <span className="font-bold text-primary text-lg w-10 text-center">
                        {op.label}
                      </span>
                      <span className="flex-1 text-sm text-on-surface-variant">
                        {op.description || "Sin descripción"}
                      </span>
                      <button
                        type="button"
                        onClick={() => eliminarOpcion(i)}
                        className="material-symbols-outlined text-error hover:bg-error/10 rounded-full p-1 text-sm transition-colors"
                      >
                        delete
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-outline p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Agregar opción
                  </p>
                  <div className="flex gap-3">
                    <input
                      value={nuevaOpcion.label}
                      onChange={(e) =>
                        setNuevaOpcion((p) => ({ ...p, label: e.target.value }))
                      }
                      className="w-24 rounded-2xl border border-outline px-3 py-2 bg-background text-on-surface outline-none focus:ring-2 focus:ring-primary/30 text-center font-bold"
                      placeholder="Valor"
                    />
                    <input
                      value={nuevaOpcion.description}
                      onChange={(e) =>
                        setNuevaOpcion((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      className="flex-1 rounded-2xl border border-outline px-3 py-2 bg-background text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Descripción"
                      onKeyDown={(e) => e.key === "Enter" && agregarOpcion()}
                    />
                    <button
                      type="button"
                      onClick={agregarOpcion}
                      className="rounded-2xl bg-primary px-4 py-2 text-on-primary font-bold hover:scale-105 transition-transform"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCrear}
                disabled={!title.trim() || opciones.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-on-primary font-bold shadow-lg hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Crear Sesión
              </button>
            </div>
            <div className="bg-surface-container-low p-6 rounded-3xl shadow-soft">
              <h3 className="font-headline text-xl font-extrabold text-on-surface mb-4">
                Vista previa
              </h3>
              <div className="rounded-2xl bg-surface-container-lowest border border-outline p-4 mb-4">
                <p className="font-bold text-on-surface">
                  {title || "Sin título"}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {description || "Sin descripción"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {opciones.map((op, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-surface-container border border-outline p-3 text-center"
                  >
                    <p className="font-bold text-primary text-xl">{op.label}</p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {op.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB: HISTORIAL */}
        {tab === "historial" && (
          <section>
            <h2 className="text-2xl font-extrabold text-on-surface mb-6">
              Historial de sesiones
            </h2>
            {closedPolls.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {closedPolls.map((poll) => (
                  <div key={poll.id} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPoll(poll.id);
                        setTab("sesiones");
                      }}
                      className="w-full rounded-3xl border border-outline bg-surface-container-lowest px-5 py-4 text-left hover:bg-surface-container transition-all opacity-80 hover:opacity-100 pr-12"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <strong className="text-on-surface">
                          {poll.title}
                        </strong>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-tertiary-container text-on-tertiary-container">
                          Cerrada
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        {poll.description}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1 font-bold">
                        {Object.keys(poll.votes || {}).length} votos registrados
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmDelete({ type: "sesion", id: poll.id })
                      }
                      className="absolute top-3 right-3 material-symbols-outlined text-error hover:bg-error/10 rounded-full p-1 text-sm transition-colors"
                    >
                      delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-outline bg-surface-container-lowest p-8 text-center text-on-surface-variant">
                No hay sesiones cerradas todavía.
              </div>
            )}
          </section>
        )}

        {/* TAB: USUARIOS */}
        {tab === "usuarios" && (
          <section>
            <h2 className="text-2xl font-extrabold text-on-surface mb-6">
              Gestión de usuarios
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(usuarios || []).map((u) => {
                // Usamos los valores exactos de tu ENUM de PostgreSQL
                const rolActual = u.rol || "PARTICIPANTE";
                const isAdmin = rolActual === "ADMIN";
                const isMe = u.id === user?.id;

                return (
                  <div
                    key={u.id}
                    className="rounded-3xl border border-outline bg-surface-container-lowest p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3 gap-2">
                        <div className="truncate">
                          <p className="font-bold text-on-surface truncate">
                            {u.nombre}
                          </p>
                          <p className="text-xs text-on-surface-variant truncate">
                            {u.email}
                          </p>
                        </div>

                        {/* Selector de rol enviando valores exactos de la BD */}
                        {!isMe ? (
                          <select
                            value={rolActual}
                            onChange={(e) => {
                              if (onUpdateRol) {
                                onUpdateRol(u.id, e.target.value);
                              }
                            }}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full outline-none border border-transparent focus:border-outline cursor-pointer transition-colors ${
                              isAdmin
                                ? "bg-primary-container text-on-primary-container"
                                : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            <option value="PARTICIPANTE">USER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        ) : (
                          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-on-primary">
                            ADMIN (Tú)
                          </span>
                        )}
                      </div>

                      {/* Agregar a sesión activa (Solo si no es admin) */}
                      {activePolls.length > 0 && !isAdmin && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                            Agregar a sesión
                          </p>
                          <div className="flex gap-2">
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  onAgregarParticipante(
                                    Number(e.target.value),
                                    u.id,
                                  );
                                  e.target.value = "";
                                }
                              }}
                              className="w-full rounded-xl border border-outline px-2 py-1.5 bg-background text-on-surface text-xs outline-none focus:ring-2 focus:ring-primary/30"
                            >
                              <option value="">Seleccionar sesión...</option>
                              {activePolls.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {!isMe && (
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmDelete({ type: "usuario", id: u.id })
                        }
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-error/30 text-error px-4 py-2 text-xs font-bold hover:bg-error/10 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>
                        Eliminar usuario
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-[#ddffe2]/80 backdrop-blur-xl rounded-t-[3rem] border-t border-[#8bb795]/15 shadow-[0_-10px_40px_-10px_rgba(11,54,29,0.06)]">
        {[
          ["sesiones", "ballot", "Sesiones"],
          ["crear", "add_circle", "Crear"],
          ["historial", "history", "Historial"],
          ["usuarios", "group", "Usuarios"],
        ].map(([key, icon, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
              tab === key
                ? "bg-[#7bfeb8] text-[#0b361d] px-4"
                : "text-[#3b6447] hover:bg-[#bef5c9]"
            }`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default AdminPage;
