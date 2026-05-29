import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not configured.");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// ============================================
//  NORMALIZAR USUARIO
// ============================================
const normalizeUsuario = (usuario) => {
  if (!usuario) return null;
  return {
    id: usuario.id,
    name: usuario.nombre ?? "Usuario",
    email: usuario.email ?? "",
    role: usuario.rol === "ADMIN" ? "admin" : "user",
    rol: usuario.rol ?? "PARTICIPANTE",
  };
};

// ============================================
//  AUTH
// ============================================
export const signUp = async (email, password, nombre) => {
  try {
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    });
    if (authError) throw authError;
    await new Promise((r) => setTimeout(r, 1000));
    const { data: usuario, error: profileError } = await supabase
      .from("usuarios")
      .select("id, nombre, email, rol")
      .eq("id", data.user.id)
      .single();
    if (profileError) throw profileError;
    return { user: normalizeUsuario(usuario), error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) throw authError;
    const { data: usuario, error: profileError } = await supabase
      .from("usuarios")
      .select("id, nombre, email, rol")
      .eq("id", data.user.id)
      .single();
    if (profileError) throw profileError;
    return { user: normalizeUsuario(usuario), error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) return null;
    const { data: usuario, error: profileError } = await supabase
      .from("usuarios")
      .select("id, nombre, email, rol")
      .eq("id", user.id)
      .single();
    if (profileError) throw profileError;
    return normalizeUsuario(usuario);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// ============================================
//  SESIONES
// ============================================
export const getSesiones = async (estado = "ACTIVA") => {
  try {
    const { data, error } = await supabase
      .from("sesiones")
      .select(
        `
        id, nombre, estado, admin_id, creado_en,
        rondas(id, numero_ronda, carta_revelada),
        usuarios!admin_id(nombre, email),
        sesion_opciones(id, label, descripcion, orden)
      `,
      )
      .eq("estado", estado)
      .order("creado_en", { ascending: false });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const createSesion = async (nombre, adminId) => {
  try {
    const { data, error } = await supabase
      .from("sesiones")
      .insert([{ nombre, admin_id: adminId, estado: "ACTIVA" }])
      .select();
    if (error) throw error;
    return { data: data?.[0], error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateSesionEstado = async (sesionId, estado) => {
  try {
    const { data, error } = await supabase
      .from("sesiones")
      .update({ estado })
      .eq("id", sesionId)
      .select();
    if (error) throw error;
    return { data: data?.[0], error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const eliminarSesion = async (sesionId) => {
  try {
    const { data: rondas } = await supabase
      .from("rondas")
      .select("id")
      .eq("sesion_id", sesionId);
    if (rondas?.length) {
      const rondaIds = rondas.map((r) => r.id);
      await supabase.from("votos").delete().in("ronda_id", rondaIds);
      await supabase.from("rondas").delete().eq("sesion_id", sesionId);
    }
    await supabase
      .from("sesion_participantes")
      .delete()
      .eq("sesion_id", sesionId);
    await supabase.from("sesion_opciones").delete().eq("sesion_id", sesionId);
    const { error } = await supabase
      .from("sesiones")
      .delete()
      .eq("id", sesionId);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// ============================================
//  SESION_OPCIONES
// ============================================
export const guardarOpcionesSesion = async (sesionId, opciones) => {
  try {
    const rows = opciones.map((op, i) => ({
      sesion_id: sesionId,
      label: op.label,
      descripcion: op.description || "",
      orden: i,
    }));
    const { error } = await supabase.from("sesion_opciones").insert(rows);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// ============================================
//  RONDAS
// ============================================
export const getRondas = async (sesionId) => {
  try {
    const { data, error } = await supabase
      .from("rondas")
      .select("*")
      .eq("sesion_id", sesionId)
      .order("numero_ronda", { ascending: false });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const createRonda = async (sesionId, numeroRonda) => {
  try {
    const { data, error } = await supabase
      .from("rondas")
      .insert([
        {
          sesion_id: sesionId,
          numero_ronda: numeroRonda,
          carta_revelada: false,
        },
      ])
      .select();
    if (error) throw error;
    return { data: data?.[0], error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const revelarRonda = async (rondaId) => {
  try {
    const { data, error } = await supabase
      .from("rondas")
      .update({ carta_revelada: true })
      .eq("id", rondaId)
      .select();
    if (error) throw error;
    return { data: data?.[0], error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// ============================================
//  VOTOS (ahora usa carta_valor, no carta_id)
// ============================================
export const emitirVoto = async (rondaId, usuarioId, cartaValor) => {
  try {
    const { data, error } = await supabase
      .from("votos")
      .insert([
        { ronda_id: rondaId, usuario_id: usuarioId, carta_valor: cartaValor },
      ])
      .select();
    if (error) throw error;
    return { data: data?.[0], error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getVotosPorRonda = async (rondaId) => {
  try {
    const { data, error } = await supabase
      .from("votos")
      .select("id, usuario_id, carta_valor, votado_en, usuarios(nombre, email)")
      .eq("ronda_id", rondaId)
      .order("votado_en");
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

// ============================================
//  PARTICIPANTES
// ============================================
export const agregarParticipante = async (sesionId, usuarioId) => {
  try {
    const { data, error } = await supabase
      .from("sesion_participantes")
      .insert([{ sesion_id: sesionId, usuario_id: usuarioId }])
      .select();
    if (error) throw error;
    return { data: data?.[0], error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const obtenerParticipantes = async (sesionId) => {
  try {
    const { data, error } = await supabase
      .from("sesion_participantes")
      .select("usuario_id, unido_en, usuarios(id, nombre, email, rol)")
      .eq("sesion_id", sesionId)
      .order("unido_en");
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const eliminarParticipante = async (sesionId, usuarioId) => {
  try {
    const { error } = await supabase
      .from("sesion_participantes")
      .delete()
      .eq("sesion_id", sesionId)
      .eq("usuario_id", usuarioId);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// ============================================
//  USUARIOS
// ============================================
export const obtenerTodosUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre, email, rol")
      .order("creado_en", { ascending: true });
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};

export const actualizarUsuario = async (usuarioId, updates) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .update(updates)
      .eq("id", usuarioId)
      .select();
    if (error) throw error;
    return { data: data?.[0], error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const eliminarUsuario = async (usuarioId) => {
  try {
    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", usuarioId);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const actualizarRolUsuario = async (usuarioId, nuevoRol) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .update({ rol: nuevoRol }) // IMPORTANTE: Sin toLowerCase(), debe ir exacto
      .eq("id", usuarioId)
      .select();
    if (error) throw error;
    return { data: data?.[0], error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};
