"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Package, Users, Calendar } from "lucide-react";

export default function PortalPage() {
  const { data: session } = useSession();

  return (
    <>
      {/* Tarjeta Hero de Bienvenida Expansiva */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800 shadow-2xl shadow-[#2952F5]/5 dark:shadow-none rounded-[2.5rem] p-10 md:p-14 mb-16 overflow-hidden relative transition-colors duration-300">
        <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
          <svg width="600" height="600" viewBox="0 0 24 24" fill="none" stroke="#2952F5" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 dark:text-white mb-8 leading-tight">
            Bienvenido de vuelta, <span className="text-[#2952F5] dark:text-blue-400">{session?.user?.name || "Director"}</span>.
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed font-light">
            Desde este panel central tienes el control absoluto de la academia. Administra paquetes educativos, supervisa a tus maestros y alumnos, y coordina los horarios dinámicamente.
          </p>
        </div>
      </div>

      {/* Grid de Módulos (Diseño Ultra-Wide) */}
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Módulos Operativos</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        
        <Link href="/portal/paquetes" className="group block h-full">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none h-full p-10 lg:p-12 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#2952F5]/20 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/80 dark:from-blue-900/30 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-125"></div>
            
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-md shadow-blue-100/50 dark:shadow-blue-900/20 text-[#2952F5] dark:text-blue-400 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Package size={40} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-5 group-hover:text-[#2952F5] dark:group-hover:text-blue-400 transition-colors">Catálogo de Paquetes</h3>
            <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 font-light">
              Define la oferta educativa. Configura créditos mensuales de clases personales y grupales.
            </p>
            
            <div className="flex items-center text-[#2952F5] dark:text-blue-400 font-bold text-lg lg:text-xl group-hover:translate-x-3 transition-transform">
              Administrar <span className="ml-2 text-3xl">&rarr;</span>
            </div>
          </div>
        </Link>

        <Link href="/portal/comunidad" className="group block h-full">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none h-full p-10 lg:p-12 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#CC0000]/20 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-100/80 dark:from-red-900/30 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-125"></div>
            
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-md shadow-red-100/50 dark:shadow-red-900/20 text-[#CC0000] dark:text-red-400 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
              <Users size={40} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-5 group-hover:text-[#CC0000] dark:group-hover:text-red-400 transition-colors">Comunidad</h3>
            <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 font-light">
              Incorpora maestros a tu equipo y registra a los alumnos vinculándolos a sus paquetes.
            </p>
            
            <div className="flex items-center text-[#CC0000] dark:text-red-400 font-bold text-lg lg:text-xl group-hover:translate-x-3 transition-transform">
              Gestionar <span className="ml-2 text-3xl">&rarr;</span>
            </div>
          </div>
        </Link>

        <Link href="/portal/horarios" className="group block h-full">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none h-full p-10 lg:p-12 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-700 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-slate-200/80 dark:from-slate-800/80 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-125"></div>
            
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-md text-slate-700 dark:text-slate-300 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Calendar size={40} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Horarios y Clases</h3>
            <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 font-light">
              Publica disponibilidades, supervisa reservaciones y coordina las aulas.
            </p>
            
            <div className="flex items-center text-slate-700 dark:text-slate-300 font-bold text-lg lg:text-xl group-hover:translate-x-3 transition-transform">
              Próximamente <span className="ml-2 text-3xl">&rarr;</span>
            </div>
          </div>
        </Link>

      </div>
    </>
  );
}
