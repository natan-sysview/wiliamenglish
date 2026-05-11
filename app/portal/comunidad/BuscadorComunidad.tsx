"use client";

import { useState } from "react";
import { Search, Users, Pencil, Copy, Check } from "lucide-react";
import Link from "next/link";
import { ToggleStatusButton } from "./ToggleStatusButton";
import { ResetPasswordButton } from "./ResetPasswordButton";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  sucursal: string | null;
  modalidad: string | null;
  activo: boolean;
  telefono?: string | null;
  createdAt: Date;
}

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  // Tomamos la primera letra de la primera palabra y la primera de la segunda
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

const CopyAction = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button 
      onClick={handleCopy}
      className="p-1.5 text-slate-400 hover:text-[#2952F5] hover:bg-[#2952F5]/10 dark:hover:bg-blue-900/30 rounded-md transition-all active:scale-90"
      title="Copiar"
    >
      {copied ? <Check size={14} className="text-emerald-500" strokeWidth={3} /> : <Copy size={14} />}
    </button>
  );
};

export function BuscadorComunidad({ usuarios, currentUserId, currentUserRol }: { usuarios: Usuario[], currentUserId: string, currentUserRol: string }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Motor de Filtro "Omnibox": Busca en todos los campos al mismo tiempo
  const filteredUsuarios = usuarios.filter((user) => {
    const term = searchTerm.toLowerCase();
    
    // Formatear fechas para que el buscador pueda "leer" meses y años
    const dateShort = new Date(user.createdAt).toLocaleDateString("es-MX", { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase();
    const dateLong = new Date(user.createdAt).toLocaleDateString("es-MX", { day: '2-digit', month: 'long', year: 'numeric' }).toLowerCase();

    return (
      user.nombre.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.telefono || "").toLowerCase().includes(term) ||
      user.rol.toLowerCase().includes(term) ||
      (user.sucursal?.toLowerCase() || "").includes(term) ||
      (user.modalidad?.toLowerCase() || "").includes(term) ||
      (user.activo ? "activo" : "inactivo").includes(term) ||
      dateShort.includes(term) ||
      dateLong.includes(term)
    );
  });

  return (
    <>
      {/* Buscador Dinámico (Client-Side) */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, correo, rol, sede, estado..." 
            className="w-full pl-11 pr-4 py-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2952F5] shadow-sm transition-all placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Tabla Premium Glassmorphism (Visible solo en PC/Tablet) */}
      <div className="hidden md:block bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(41,82,245,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100/50 dark:border-slate-800/50">
                <th className="px-6 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nombre</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Correo</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Teléfono</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rol</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sucursal / Modo</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Registro</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
              {filteredUsuarios.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2952F5]/10 to-[#CC0000]/10 flex items-center justify-center text-[#2952F5] dark:text-white font-black border border-[#2952F5]/20 dark:border-white/10 shadow-sm">
                        {getInitials(user.nombre)}
                      </div>
                      <span className="font-extrabold text-slate-900 dark:text-white">{user.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-2 group/copy">
                      <span className="truncate max-w-[150px] lg:max-w-none">{user.email}</span>
                      <div className="opacity-0 group-hover/copy:opacity-100 transition-opacity">
                        <CopyAction text={user.email} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    {user.telefono ? (
                      <div className="flex items-center gap-2 group/copy">
                        <span className="text-slate-700 dark:text-slate-300 tracking-wide">{user.telefono}</span>
                        <div className="opacity-0 group-hover/copy:opacity-100 transition-opacity">
                          <CopyAction text={user.telefono} />
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      user.rol === 'ADMIN' ? 'bg-[#2952F5]/10 text-[#2952F5] dark:text-blue-400 border-[#2952F5]/20' : 
                      user.rol === 'STAFF' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' :
                      user.rol === 'MAESTRO' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {user.sucursal || "—"}
                      </span>
                      {user.modalidad && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          <span className={`w-1.5 h-1.5 rounded-full ${user.modalidad === 'ZOOM' ? 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.6)]' : 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.6)]'}`}></span>
                          {user.modalidad}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("es-MX", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.activo ? (
                      <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="relative group/btn flex justify-center">
                        <Link href={`/portal/comunidad/editar/${user.id}`} className="p-2 text-slate-400 hover:text-[#2952F5] hover:bg-[#2952F5]/10 dark:hover:bg-blue-900/20 rounded-xl transition-all hover:scale-110 active:scale-95 block">
                          <Pencil size={18} strokeWidth={2.5} />
                        </Link>
                        <div className="absolute bottom-full mb-1.5 px-2.5 py-1 bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold uppercase tracking-wide rounded-md opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
                          Editar Perfil
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
                        </div>
                      </div>
                      <ResetPasswordButton userId={user.id} isMobileCard={false} currentUserRol={currentUserRol} targetRol={user.rol} />
                      <ToggleStatusButton userId={user.id} activo={user.activo} isMobileCard={false} currentUserId={currentUserId} currentUserRol={currentUserRol} targetRol={user.rol} />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsuarios.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Search className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                      <p className="text-lg font-medium">No se encontraron resultados.</p>
                      <p className="text-sm">Prueba buscar con otro nombre, correo o modalidad.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista en Tarjetas para Móviles (Visible solo en Celulares) */}
      <div className="md:hidden flex flex-col gap-3 sm:gap-4">
        {filteredUsuarios.map((user) => (
          <div key={user.id} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700/80 rounded-[1.5rem] p-4 sm:p-5 shadow-sm transition-all hover:shadow-md">
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2952F5]/10 to-[#CC0000]/10 flex items-center justify-center text-[#2952F5] dark:text-white font-black border border-[#2952F5]/20 dark:border-white/10 shadow-sm flex-shrink-0">
                {getInitials(user.nombre)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight truncate">{user.nombre}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  <CopyAction text={user.email} />
                </div>
                {user.telefono && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <p className="text-[11px] text-blue-500 dark:text-blue-400 font-bold truncate">📱 {user.telefono}</p>
                    <CopyAction text={user.telefono} />
                  </div>
                )}
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold truncate">
                  Registrado: {new Date(user.createdAt).toLocaleDateString("es-MX", { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {user.activo ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Activo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Inactivo
                </span>
              )}
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                user.rol === 'ADMIN' ? 'bg-[#2952F5]/10 text-[#2952F5] dark:text-blue-400 border-[#2952F5]/20' : 
                user.rol === 'STAFF' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' :
                user.rol === 'MAESTRO' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              }`}>
                {user.rol}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {user.sucursal || "—"}
              </span>
              {user.modalidad && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <span className={`w-1.5 h-1.5 rounded-full ${user.modalidad === 'ZOOM' ? 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.6)]' : 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.6)]'}`}></span>
                  {user.modalidad}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <Link 
                href={`/portal/comunidad/editar/${user.id}`} 
                className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-[#2952F5] dark:text-blue-400 bg-[#2952F5]/10 dark:bg-blue-900/20 hover:bg-[#2952F5]/20 rounded-xl transition-all active:scale-95"
              >
                <Pencil size={18} strokeWidth={2.5} /> Editar
              </Link>
              <ToggleStatusButton userId={user.id} activo={user.activo} isMobileCard={true} currentUserId={currentUserId} currentUserRol={currentUserRol} targetRol={user.rol} />
              <ResetPasswordButton userId={user.id} isMobileCard={true} currentUserRol={currentUserRol} targetRol={user.rol} />
            </div>
          </div>
        ))}
        
        {filteredUsuarios.length === 0 && (
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-8 text-center border border-slate-200/60 dark:border-slate-700/50">
            <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="font-medium text-slate-600 dark:text-slate-300">No se encontraron resultados.</p>
          </div>
        )}
      </div>
    </>
  );
}
