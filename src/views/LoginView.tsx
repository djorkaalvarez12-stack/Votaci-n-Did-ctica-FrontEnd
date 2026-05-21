import React, { useState } from "react";

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí tiras tu validación/autenticación con TS
    if (email && password) {
      onLoginSuccess();
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-6 selection:bg-primary-fixed">
      <main className="w-full max-w-md flex flex-col items-center space-y-12">
        <header className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-xl">
              <span
                className="material-symbols-outlined text-6xl text-on-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                playing_cards
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold tracking-tighter text-on-surface">
              The Playful Strategist
            </h2>
            <p className="text-on-surface-variant font-medium text-sm">
              Estima tus Sprints con toda la sabrosura del juego
            </p>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-surface-container-low p-8 rounded-xl space-y-6 shadow-sm"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-widest block">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@empresa.com"
              className="w-full h-14 bg-surface rounded-full px-6 border-0 focus:ring-2 focus:ring-primary text-on-surface font-medium placeholder:text-on-surface-variant/40"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-widest block">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-14 bg-surface rounded-full px-6 border-0 focus:ring-2 focus:ring-primary text-on-surface font-medium"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-14 bg-primary text-on-primary font-bold rounded-full hover:bg-primary-dim transition-colors active:scale-95 shadow-md"
          >
            Iniciar Sesión
          </button>
        </form>
      </main>
    </div>
  );
};
