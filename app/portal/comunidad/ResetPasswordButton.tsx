"use client";

import { useState, useEffect } from "react";
import { KeyRound, AlertTriangle, CheckCircle2 } from "lucide-react";
import { createPortal } from "react-dom";

interface Props {
  userId: string;
  isMobileCard?: boolean;
  currentUserRol: string;
  targetRol: string;
}

export function ResetPasswordButton({ userId, isMobileCard = false, currentUserRol, targetRol }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleResetClick = () => {
    if (currentUserRol === "STAFF" && targetRol === "ADMIN") {
      setErrorMessage("Privilegios insuficientes. El personal de STAFF no tiene permisos para resetear la contraseña de un Administrador General.");
      return;
    }
    setShowModal(true);
  };

  const processReset = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/usuarios/${userId}/reset-password`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Ocurrió un error al resetear la contraseña");
      }

      setShowModal(false);
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error desconocido al contactar al servidor");
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const renderModal = () => {
    if (!mounted || !showModal) return null;
    
    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] max-w-sm w-full p-7 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.3)] border border-white/50 dark:border-slate-700/50 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br mb-5 mx-auto border from-amber-500/10 to-amber-600/10 text-amber-500 dark:text-amber-400 border-amber-500/20">
            <KeyRound size={32} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-black text-center text-slate-900 dark:text-white mb-2 tracking-tight">¿Resetear Contraseña?</h3>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4 font-medium leading-relaxed">
            La contraseña se restablecerá a la clave por defecto:
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 flex items-center justify-between gap-3 mb-6 border border-slate-200 dark:border-slate-700">
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400 select-all pl-2">WilliamEnglish!</span>
            <button 
              onClick={() => navigator.clipboard.writeText("WilliamEnglish!")}
              className="p-2 bg-white dark:bg-slate-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-slate-400 hover:text-amber-500 rounded-md transition-colors"
              title="Copiar contraseña"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 mb-8">
            El usuario será obligado a cambiarla en su próximo inicio de sesión.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowModal(false)}
              className="flex-1 py-3.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button 
              onClick={processReset}
              className="flex-1 py-3.5 px-4 bg-amber-500 hover:bg-amber-600 shadow-amber-900/30 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center"
            >
              {isLoading ? "Procesando..." : "Sí, Resetear"}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const renderSuccessModal = () => {
    if (!mounted || !showSuccess) return null;
    
    return createPortal(
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] max-w-sm w-full p-7 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.3)] border border-white/50 dark:border-slate-700/50 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br mb-5 mx-auto border from-emerald-500/10 to-emerald-600/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20">
            <CheckCircle2 size={32} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-black text-center text-slate-900 dark:text-white mb-2 tracking-tight">¡Contraseña Reseteada!</h3>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4 font-medium leading-relaxed">
            Informa al usuario que su contraseña temporal es:
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-lg p-3 flex items-center justify-between gap-3 mb-8 border border-emerald-200 dark:border-emerald-800/30 w-full max-w-[250px] mx-auto">
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 select-all pl-2">WilliamEnglish!</span>
            <button 
              onClick={() => navigator.clipboard.writeText("WilliamEnglish!")}
              className="p-2 bg-white dark:bg-emerald-800/40 hover:bg-emerald-100 dark:hover:bg-emerald-700/50 text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 rounded-md transition-colors shadow-sm"
              title="Copiar contraseña"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
          </div>
          <div className="flex justify-center">
            <button 
              onClick={() => setShowSuccess(false)}
              className="w-full py-3.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all active:scale-95"
            >
              Listo
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

  if (isMobileCard) {
    return (
      <>
        <button 
          onClick={handleResetClick}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-900/20 hover:bg-amber-500/20 mt-3 col-span-2"
        >
          <KeyRound size={18} strokeWidth={2.5} className={isLoading ? "animate-pulse" : ""} /> 
          Reset Password
        </button>
        {renderModal()}
        {renderSuccessModal()}
        {renderErrorModal()}
      </>
    );
  }

  return (
    <>
      <div className="relative group/btn flex justify-center">
        <button 
          onClick={handleResetClick}
          disabled={isLoading}
          className="p-2 rounded-xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 dark:hover:bg-amber-900/20"
        >
          <KeyRound size={18} strokeWidth={2.5} className={isLoading ? "animate-pulse" : ""} />
        </button>
        <div className="absolute bottom-full mb-1.5 px-2.5 py-1 bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold uppercase tracking-wide rounded-md opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
          Reset Password
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
        </div>
      </div>
      {renderModal()}
      {renderSuccessModal()}
      {renderErrorModal()}
    </>
  );
}
