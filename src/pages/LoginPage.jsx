import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ onLogin, onRegister }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const account = await onLogin(email.trim(), password.trim());
    setLoading(false);
    if (!account) {
      setError("Credenciales incorrectas o cuenta no encontrada.");
      return;
    }
    navigate(account.role === "admin" ? "/admin" : "/dashboard");
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const result = await onRegister(
      email.trim(),
      password.trim(),
      nombre.trim(),
    );
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setInfo("Cuenta creada. Ahora puedes iniciar sesión.");
    setTab("login");
  };

  return (
    <main className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <header className="flex flex-col items-center text-center space-y-6 mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary to-primary-container p-1 shadow-[0_10px_30px_-15px_rgba(11,54,29,0.2)] transform -rotate-3 overflow-hidden">
            <img
              alt="Logo"
              className="w-full h-full object-cover rounded-[2.5rem]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLMBIZmGFmgFEM4wpkmhHu01D0NwJnDlDgi6bbKlU2Qbx5DizZBjBg4jFiGgjYn4amXBmTjkfRAGwLZd3ToXgGP0u3rN_w4Ezw9GguKXJ998ytwyHfWe7BvwzIzbC46ugGMTZ3C1__IQ2s9aUZd6Ys8Q234dxp4_B0VhaSCqBKumelPnDKfsKyKSEECX_XNIcMKE3JcubF0czGx2k6a1Q_FrRuWLTQJ6KJJxXTjdX4Cqn2CV4ULK775hZftg1vQbSQ1hYdaPq4gPM"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-tertiary-container text-on-tertiary-container p-3 rounded-full shadow-lg transform rotate-12">
            <span
              className="material-symbols-outlined block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              style
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            Planning Poker
          </h1>
          <p className="text-on-surface-variant font-medium">
            Estimación ágil en equipo
          </p>
        </div>
      </header>

      {/* Tabs login/registro */}
      <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-full w-full mb-6 shadow-sm">
        {[
          ["login", "Iniciar sesión"],
          ["register", "Registrarse"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setTab(key);
              setError("");
              setInfo("");
            }}
            className={`flex-1 py-3 rounded-full font-bold text-sm transition-all ${
              tab === key
                ? "bg-gradient-to-br from-primary to-primary-container text-on-primary"
                : "text-[#3b6447] hover:bg-[#bef5c9]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="w-full bg-surface-container-low p-8 rounded-xl shadow-soft space-y-6 mb-8">
        {tab === "login" ? (
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label
                className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
                htmlFor="email"
              >
                Correo
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border-none rounded-lg text-on-surface placeholder:text-outline/50 focus:ring-4 focus:ring-primary-fixed-dim/40 outline-none"
                  placeholder="nombre@ejemplo.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
                htmlFor="password"
              >
                Contraseña
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border-none rounded-lg text-on-surface placeholder:text-outline/50 focus:ring-4 focus:ring-primary-fixed-dim/40 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm text-error font-bold">{error}</p>}
            {info && <p className="text-sm text-primary font-bold">{info}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-gradient-to-br from-primary to-primary-container text-on-primary text-lg font-extrabold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                "Entrando..."
              ) : (
                <>
                  <span>Entrar</span>
                  <span className="material-symbols-outlined">login</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="space-y-2">
              <label
                className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
                htmlFor="nombre"
              >
                Nombre
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  person
                </span>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border-none rounded-lg text-on-surface placeholder:text-outline/50 focus:ring-4 focus:ring-primary-fixed-dim/40 outline-none"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
                htmlFor="reg-email"
              >
                Correo
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border-none rounded-lg text-on-surface placeholder:text-outline/50 focus:ring-4 focus:ring-primary-fixed-dim/40 outline-none"
                  placeholder="nombre@ejemplo.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                className="block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
                htmlFor="reg-password"
              >
                Contraseña
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border-none rounded-lg text-on-surface placeholder:text-outline/50 focus:ring-4 focus:ring-primary-fixed-dim/40 outline-none"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>
            </div>
            {error && <p className="text-sm text-error font-bold">{error}</p>}
            {info && <p className="text-sm text-primary font-bold">{info}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-gradient-to-br from-primary to-primary-container text-on-primary text-lg font-extrabold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                "Creando cuenta..."
              ) : (
                <>
                  <span>Crear cuenta</span>
                  <span className="material-symbols-outlined">person_add</span>
                </>
              )}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default LoginPage;
