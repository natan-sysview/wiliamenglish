"use client";

import { useState, useEffect } from "react";
import { Trash2, AlertTriangle, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

interface Props {
  userId: string;
  activo: boolean;
  isMobileCard?: boolean;
  currentUserId: string;
  currentUserRol: string;
  targetRol: string;
}

export function ToggleStatusButton({ userId, activo, isMobileCard = false, currentUserId, currentUserRol, targetRol }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Para evitar errores de hidratación con React Portals
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleClick = () => {
    // Regla de Auto-Preservación: No puedes dar de baja tu propia cuenta
    if (userId === currentUserId && activo) {
      setErrorMessage("Por seguridad, no puedes dar de baja tu propia cuenta.");
      return; 
    }

    // Regla de Jerarquía: STAFF no puede desactivar a un ADMIN
    if (currentUserRol === "STAFF" && targetRol === "ADMIN") {
      setErrorMessage("Privilegios insuficientes. El personal de STAFF no tiene permisos para dar de baja a un Administrador General.");
      return;
    }

    // Ya sea para dar de baja o reactivar a otros, siempre mostramos el modal confirmatorio
    setShowModal(true);
  };

  const processToggle = async () => {
    setShowModal(false);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/usuarios/${userId}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Ocurrió un error al cambiar el estado");
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error desconocido al contactar al servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const renderModal = () => {
    if (!mounted || !showModal) return null;
    
    // Configuraciones de estilo dinámicas dependiendo de si estamos desactivando o reactivando
    const config = activo ? {
      icon: <AlertTriangle size={32} strokeWidth={2.5} />,
      iconColors: "from-[#CC0000]/10 to-red-600/10 text-[#CC0000] dark:text-red-500 border-red-500/20",
      title: "¿Dar de baja?",
      description: "Este usuario ya no podrá iniciar sesión en el portal. Podrás reactivarlo más adelante si es necesario.",
      btnText: "Sí, dar de baja",
      btnColors: "bg-[#CC0000] hover:bg-red-700 shadow-red-900/30 text-white",
      shadow: "shadow-[0_20px_60px_-15px_rgba(204,0,0,0.3)]"
    } : {
      icon: <UserCheck size={32} strokeWidth={2.5} />,
      iconColors: "from-emerald-500/10 to-emerald-600/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20",
      title: "¿Reactivar usuario?",
      description: "Este usuario recuperará el acceso inmediato al sistema y podrá volver a iniciar sesión.",
      btnText: "Sí, reactivar",
      btnColors: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/30 text-white",
      shadow: "shadow-[0_20px_60px_-15px_rgba(16,185,129,0.3)]"
    };

    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
        <div className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] max-w-sm w-full p-7 ${config.shadow} border border-white/50 dark:border-slate-700/50 animate-in zoom-in-95 duration-200`}>
          <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br mb-5 mx-auto border ${config.iconColors}`}>
            {config.icon}
          </div>
          <h3 className="text-xl font-black text-center text-slate-900 dark:text-white mb-2 tracking-tight">{config.title}</h3>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium leading-relaxed">
            {config.description}
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowModal(false)}
              className="flex-1 py-3.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button 
              onClick={processToggle}
              className={`flex-1 py-3.5 px-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${config.btnColors}`}
            >
              {config.btnText}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const renderErrorModal = () => {
    if (!mounted || !errorMessage) return null;
    
    return createPortal(
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] max-w-sm w-full p-7 shadow-[0_20px_60px_-15px_rgba(204,0,0,0.3)] border border-white/50 dark:border-slate-700/50 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br mb-5 mx-auto border from-[#CC0000]/10 to-red-600/10 text-[#CC0000] dark:text-red-500 border-red-500/20">
            <AlertTriangle size={32} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-black text-center text-slate-900 dark:text-white mb-2 tracking-tight">Acción Denegada</h3>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium leading-relaxed">
            {errorMessage}
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => setErrorMessage(null)}
              className="w-full py-3.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all active:scale-95"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const IconComponent = activo ? Trash2 : UserCheck;

  if (isMobileCard) {
    return (
      <>
        <button 
          onClick={handleToggleClick}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            activo 
              ? "text-[#CC0000] dark:text-red-400 bg-[#CC0000]/10 dark:bg-red-900/20 hover:bg-[#CC0000]/20" 
              : "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-900/20 hover:bg-emerald-500/20"
          }`}
        >
          <IconComponent size={18} strokeWidth={2.5} className={isLoading ? "animate-pulse" : ""} /> 
          {isLoading ? "Procesando..." : (activo ? "Dar de baja" : "Re-activar")}
        </button>
        {renderModal()}
        {renderErrorModal()}
      </>
    );
  }

  return (
    <>
      <div className="relative group/btn flex justify-center">
        <button 
          onClick={handleToggleClick}
          disabled={isLoading}
          className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            activo 
              ? "text-slate-400 hover:text-[#CC0000] hover:bg-[#CC0000]/10 dark:hover:bg-red-900/20" 
              : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-500/10 dark:hover:bg-emerald-900/20"
          }`}
        >
          <IconComponent size={18} strokeWidth={2.5} className={isLoading ? "animate-pulse" : ""} />
        </button>
        <div className="absolute bottom-full mb-1.5 px-2.5 py-1 bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold uppercase tracking-wide rounded-md opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
          {isLoading ? "Procesando..." : (activo ? "Dar de baja" : "Re-activar")}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
        </div>
      </div>
      {renderModal()}
      {renderErrorModal()}
    </>
  );
}
