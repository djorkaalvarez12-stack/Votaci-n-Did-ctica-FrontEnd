import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import VotingSessionPage from "./pages/VotingSessionPage";
import ResultNotRevealedPage from "./pages/ResultNotRevealedPage";
import ResultRevealedPage from "./pages/ResultRevealedPage";
import AdminPage from "./pages/AdminPage";

import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  getSesiones,
  createSesion,
  createRonda,
  obtenerParticipantes,
  getVotosPorRonda,
  revelarRonda,
  updateSesionEstado,
  emitirVoto,
  agregarParticipante,
  guardarOpcionesSesion,
  obtenerTodosUsuarios,
  eliminarSesion,
  eliminarUsuario,
  eliminarParticipante,
  actualizarRolUsuario,
} from "./lib/supabase";

// ============================================
//  HELPERS
// ============================================
const buildOptionsFromString = (opcionesStr) =>
  opcionesStr.split(",").map((item) => {
    const [label, ...rest] = item.split(":");
    return {
      label: label.trim(),
      value: label.trim(),
      description: rest.join(":").trim(),
    };
  });

const mapSessionToPoll = (session) => {
  // Opciones vienen siempre de sesion_opciones en la BD
  const opciones = session.sesion_opciones ?? [];
  const options =
    opciones.length > 0
      ? [...opciones]
          .sort((a, b) => a.orden - b.orden)
          .map((op) => ({
            label: op.label,
            value: op.label,
            description: op.descripcion || "",
          }))
      : [];

  const round = session.rondas?.[0] ?? null;
  return {
    id: session.id,
    title: session.nombre,
    description: session.descripcion || "",
    status: session.estado === "ACTIVA" ? "active" : "closed",
    revealed: Boolean(round?.carta_revelada),
    options,
    votes: {},
    participants: [],
    roundId: round?.id ?? null,
    adminId: session.admin_id,
  };
};

function App() {
  const [user, setUser] = useState(null);
  const [polls, setPolls] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appError, setAppError] = useState("");

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await loadSessions();
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser?.role === "admin") await loadUsuarios();
      setLoading(false);
    };
    initialize();
  }, []);

  const loadUsuarios = async () => {
    const { data, error } = await obtenerTodosUsuarios();
    if (error) {
      setAppError(error);
      return;
    }
    setUsuarios(data || []);
  };

  const loadSessions = async () => {
    const [activasRes, cerradasRes] = await Promise.all([
      getSesiones("ACTIVA"),
      getSesiones("CERRADA"),
    ]);
    if (activasRes.error) {
      setAppError(activasRes.error);
      setPolls([]);
      return;
    }
    const todas = [...(activasRes.data || []), ...(cerradasRes.data || [])];
    const mapped = todas.map((s) => mapSessionToPoll(s));
    setPolls(mapped);
    setSelectedPollId((prev) => {
      if (!prev && mapped.length > 0) return mapped[0].id;
      return mapped.find((p) => p.id === prev) ? prev : (mapped[0]?.id ?? null);
    });
    return mapped;
  };

  const loadPollDetailsFromList = async (pollId, pollList) => {
    const session = pollList.find((item) => item.id === pollId);
    if (!session?.roundId) return;
    const [participantesRes, votosRes] = await Promise.all([
      obtenerParticipantes(pollId),
      getVotosPorRonda(session.roundId),
    ]);
    if (participantesRes.error) {
      setAppError(participantesRes.error);
      return;
    }
    if (votosRes.error) {
      setAppError(votosRes.error);
      return;
    }

    // Ahora los votos usan carta_valor directamente
    const votesMap = (votosRes.data || []).reduce((acc, vote) => {
      const email = vote.usuarios?.email ?? `usuario-${vote.usuario_id}`;
      acc[email] = vote.carta_valor ?? "";
      return acc;
    }, {});

    const participants = (participantesRes.data || []).map(
      (p) => p.usuarios?.nombre || p.usuario_id,
    );

    setPolls((current) =>
      current.map((poll) =>
        poll.id === pollId ? { ...poll, participants, votes: votesMap } : poll,
      ),
    );
  };

  useEffect(() => {
    if (selectedPollId && polls.length > 0) {
      loadPollDetailsFromList(selectedPollId, polls);
    }
  }, [selectedPollId]);

  const handleSelectPoll = (pollId) => setSelectedPollId(pollId);

  const handleLogin = async (email, password) => {
    const result = await signIn(email, password);
    if (result.error || !result.user) return null;
    setUser(result.user);
    await loadSessions();
    if (result.user.role === "admin") await loadUsuarios();
    return result.user;
  };

  const handleRegister = async (email, password, nombre) => {
    const result = await signUp(email, password, nombre);
    if (result.error) return { error: result.error };
    return { success: true };
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setPolls([]);
    setSelectedPollId(null);
    setUsuarios([]);
  };

  const handleVote = async (pollId, cartaValor) => {
    if (!user) return;
    const poll = polls.find((item) => item.id === pollId);
    if (!poll?.roundId || poll.votes[user.email]) return;

    // Emitir voto con el valor directamente (ya no busca carta en BD)
    const { error } = await emitirVoto(poll.roundId, user.id, cartaValor);
    if (error) {
      setAppError(error);
      return;
    }
    loadPollDetailsFromList(pollId, polls);
  };

  const handleCreatePoll = async (title, description, opcionesStr) => {
    if (!user) return;
    const { data, error } = await createSesion(
      title || `Sesión ${Date.now()}`,
      user.id,
    );
    if (error || !data) {
      setAppError(error || "Error creando la sesión.");
      return;
    }

    const rondaResult = await createRonda(data.id, 1);
    if (rondaResult.error) {
      setAppError(rondaResult.error);
      return;
    }

    // Guardar opciones en BD
    const opciones = opcionesStr ? buildOptionsFromString(opcionesStr) : [];
    if (opciones.length > 0) {
      const { error: opErr } = await guardarOpcionesSesion(data.id, opciones);
      if (opErr) {
        setAppError(opErr);
        return;
      }
    }

    await loadSessions();
    setSelectedPollId(data.id);
  };

  const handleRevealPoll = async (pollId) => {
    const poll = polls.find((item) => item.id === pollId);
    if (!poll?.roundId) return;
    const { error } = await revelarRonda(poll.roundId);
    if (error) {
      setAppError(error);
      return;
    }
    const { error: estadoError } = await updateSesionEstado(pollId, "CERRADA");
    if (estadoError) {
      setAppError(estadoError);
      return;
    }
    const mapped = await loadSessions();
    if (mapped) await loadPollDetailsFromList(pollId, mapped);
  };

  const handleDeleteSesion = async (pollId) => {
    const { error } = await eliminarSesion(pollId);
    if (error) {
      setAppError(error);
      return;
    }
    await loadSessions();
  };

  const handleAgregarParticipante = async (sesionId, usuarioId) => {
    const { error } = await agregarParticipante(sesionId, usuarioId);
    if (error) {
      setAppError(error);
      return;
    }
    loadPollDetailsFromList(sesionId, polls);
    await loadUsuarios();
  };

  const handleEliminarParticipante = async (sesionId, nombreParticipante) => {
    const usuario = usuarios.find((u) => u.nombre === nombreParticipante);
    if (!usuario) return;
    const { error } = await eliminarParticipante(sesionId, usuario.id);
    if (error) {
      setAppError(error);
      return;
    }
    loadPollDetailsFromList(sesionId, polls);
  };

  const handleDeleteUsuario = async (usuarioId) => {
    const { error } = await eliminarUsuario(usuarioId);
    if (error) {
      setAppError(error);
      return;
    }
    await loadUsuarios();
  };

  // ← NUEVA FUNCIÓN MANEJADORA
  const handleUpdateRol = async (usuarioId, nuevoRol) => {
    // 1. Actualización optimista en el estado de React
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((u) =>
        u.id === usuarioId ? { ...u, rol: nuevoRol } : u,
      ),
    );

    // 2. Enviar petición real a la base de datos
    const { error } = await actualizarRolUsuario(usuarioId, nuevoRol);
    if (error) {
      setAppError(error);
      return;
    }

    // 3. Sincronizar con el backend de forma segura
    await loadUsuarios();
  };

  const activePolls = useMemo(
    () => polls.filter((p) => p.status === "active"),
    [polls],
  );
  const closedPolls = useMemo(
    () => polls.filter((p) => p.status === "closed"),
    [polls],
  );
  const selectedPoll = useMemo(
    () => polls.find((p) => p.id === selectedPollId) ?? polls[0] ?? null,
    [polls, selectedPollId],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <p className="text-lg font-bold">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body">
      {appError && (
        <div className="fixed top-4 right-4 z-[9999] bg-error text-on-error px-4 py-3 rounded-2xl shadow-lg text-sm font-bold flex items-center gap-3">
          <span>{appError}</span>
          <button
            type="button"
            onClick={() => setAppError("")}
            className="material-symbols-outlined text-sm"
          >
            close
          </button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <DashboardPage
                  user={user}
                  activePolls={activePolls}
                  closedPolls={closedPolls}
                  selectedPoll={selectedPoll}
                  onSelectPoll={handleSelectPoll}
                  onLogout={handleLogout}
                />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin"
          element={
            user ? (
              user.role === "admin" ? (
                <AdminPage
                  user={user}
                  polls={polls}
                  selectedPollId={selectedPollId}
                  usuarios={usuarios}
                  onSelectPoll={handleSelectPoll}
                  onCreatePoll={handleCreatePoll}
                  onRevealPoll={handleRevealPoll}
                  onDeleteSesion={handleDeleteSesion}
                  onAgregarParticipante={handleAgregarParticipante}
                  onEliminarParticipante={handleEliminarParticipante}
                  onDeleteUsuario={handleDeleteUsuario}
                  onUpdateRol={handleUpdateRol}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/voting"
          element={
            user ? (
              user.role === "user" ? (
                <VotingSessionPage
                  user={user}
                  polls={activePolls}
                  selectedPoll={selectedPoll}
                  onSelectPoll={handleSelectPoll}
                  onVote={handleVote}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/admin" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/not-revealed"
          element={
            user ? (
              selectedPoll?.revealed ? (
                <Navigate to="/revealed" replace />
              ) : (
                <ResultNotRevealedPage
                  user={user}
                  poll={selectedPoll}
                  onReveal={() => handleRevealPoll(selectedPoll?.id)}
                  onLogout={handleLogout}
                />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/revealed"
          element={
            user ? (
              selectedPoll?.revealed || selectedPoll?.status === "closed" ? (
                <ResultRevealedPage
                  user={user}
                  poll={selectedPoll}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/not-revealed" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
