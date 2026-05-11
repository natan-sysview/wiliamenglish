"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LogOut, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f4f8] dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 font-sans pb-20 transition-colors duration-300">
      {/* Background blobs decorativos que cubren todo el portal */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-300/20 dark:bg-blue-900/20 blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-red-300/10 dark:bg-red-900/10 blur-[100px]"></div>
      </div>

      {/* Header Superior Fijo (Navbar Conservador pero Moderno) */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
          <Link href="/portal" title="Volver al inicio" className="flex items-center gap-3 sm:gap-4 hover:opacity-80 transition-opacity max-w-[65%] sm:max-w-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-md shadow-blue-900/10 dark:shadow-none border border-slate-100 dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img 
                src="/logo.jpg" 
                alt="Logo William english institute" 
                className="w-full h-full object-contain scale-[1.35]"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-extrabold text-[#2952F5] dark:text-blue-400 tracking-tight truncate">
                William english institute
              </h1>
            </div>
          </Link>

          <div className="flex items-center gap-4 lg:gap-6">
            {/* Indicador Global de Estado y Rol */}
            <div className="hidden md:inline-flex items-center gap-2.5 bg-[#2952F5]/10 dark:bg-[#2952F5]/20 border border-[#2952F5]/20 dark:border-[#2952F5]/40 text-[#2952F5] dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors duration-300">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              {session?.user?.rol || "Online"}
            </div>

            {/* Botón de Modo Oscuro / Claro */}
            <ThemeToggle />
            
            <div className="relative flex items-center" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative rounded-full focus:outline-none group transition-all"
                aria-label="Menú de usuario"
              >
              {/* Aro de luz decorativo (Glow Effect) */}
              <div className={`absolute -inset-0.5 rounded-full blur opacity-60 transition-opacity duration-300 ${isProfileOpen ? 'bg-gradient-to-r from-[#2952F5] to-[#CC0000] opacity-100' : 'bg-gradient-to-r from-[#2952F5] to-[#CC0000] group-hover:opacity-100'}`}></div>
              
              {/* Círculo central con la Inicial (Inversión de roles por tema) */}
              <div className="relative w-11 h-11 rounded-full bg-[#CC0000] dark:bg-[#2952F5] border-[2.5px] border-[#2952F5] dark:border-[#CC0000] flex items-center justify-center shadow-md overflow-hidden transition-colors duration-300">
                <div className="w-full h-full flex items-center justify-center text-white text-lg font-extrabold shadow-inner">
                  {session?.user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
              </div>
            </button>

            {/* Menú Desplegable (Dropdown) Flotante */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-4 w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(41,82,245,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in zoom-in-95 slide-in-from-top-4 origin-top-right transition-all">
                
                {/* Header del Menú */}
                <div className="p-7 border-b border-slate-100/50 dark:border-slate-800/50 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-800/50 dark:to-transparent">
                  <p className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight mb-1">{session?.user?.name || "Administrador"}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate font-medium">{session?.user?.email}</p>
                  
                  <div className="mt-4 inline-flex items-center gap-2 bg-[#2952F5]/10 dark:bg-[#2952F5]/20 border border-[#2952F5]/20 dark:border-[#2952F5]/40 text-[#2952F5] dark:text-blue-400 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                    {session?.user?.rol}
                  </div>
                </div>

                {/* Acciones */}
                <div className="p-3 bg-white/40 dark:bg-slate-900/40">
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-[#CC0000] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl transition-all group"
                  >
                    <span className="flex items-center gap-3">
                      <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                      Cerrar Sesión
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-12 py-10">
        {children}
      </main>
    </div>
  );
}
