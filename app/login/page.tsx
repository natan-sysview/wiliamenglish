"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciales incorrectas");
      setIsLoading(false);
    } else {
      router.push("/portal");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-red/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-brand-blue tracking-tight mb-2">
            William english institute
          </h2>
          <p className="text-slate-600 font-medium">
            Sistema de Administración Escolar
          </p>
        </div>

        <div className="glass-panel p-8 sm:p-10 rounded-3xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all placeholder-slate-400"
                placeholder="admin@williamenglish.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-brand-red text-sm text-center bg-red-50/80 p-3 rounded-lg border border-red-100 font-medium">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-brand-blue to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-900/30 hover:shadow-blue-900/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-70 disabled:hover:translate-y-0 transition-all"
              >
                {isLoading ? "Validando..." : "Entrar al Portal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
