"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, User, Mail, Phone, Shield, MapPin, Monitor, KeyRound, Loader2 } from "lucide-react";

export default function NuevoMiembroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Contraseña temporal por defecto
  const passwordTemporal = "WilliamEnglish!";

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "ALUMNO",
    sucursal: "QUERETARO",
    modalidad: "PRESENCIAL",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          password: passwordTemporal
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear el usuario");
      }

      // Redirigir de vuelta a la comunidad
      router.push("/portal/comunidad");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Botón de regreso */}
      <Link href="/portal/comunidad" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#2952F5] transition-colors mb-8 font-medium">
        <ArrowLeft size={20} />
        Volver a la comunidad
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2952F5] to-[#CC0000]">
            Crear nuevo miembro
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Registra un nuevo usuario en la plataforma. Se le pedirá al nuevo miembro que cambie su contraseña al iniciar sesión por primera vez.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Formulario Glassmorphism Premium */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(41,82,245,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden p-8 md:p-12">
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <User size={16} className="text-[#2952F5]" /> Nombre completo
              </label>
              <input 
                type="text" 
                required
                placeholder="Ej. Juan Pérez"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2952F5]/50 transition-all text-slate-900 dark:text-white"
              />
            </div>

            {/* Correo */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Mail size={16} className="text-[#CC0000]" /> Correo electrónico
              </label>
              <input 
                type="email" 
                required
                placeholder="juan@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC0000]/50 transition-all text-slate-900 dark:text-white"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Phone size={16} className="text-blue-500" /> Teléfono / WhatsApp <span className="text-xs font-normal text-slate-400">(Opcional)</span>
              </label>
              <input 
                type="tel" 
                placeholder="Ej. 5512345678"
                maxLength={10}
                pattern="[0-9]{10}"
                title="El teléfono debe tener exactamente 10 números"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value.replace(/\D/g, '')})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900 dark:text-white"
              />
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Shield size={16} className="text-emerald-500" /> Rol en el sistema
              </label>
              <select 
                value={formData.rol}
                onChange={(e) => setFormData({...formData, rol: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-900 dark:text-white font-medium appearance-none"
              >
                <option value="ALUMNO">Alumno</option>
                <option value="MAESTRO">Maestro</option>
                <option value="STAFF">Staff (Coordinación)</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            {/* Sucursal */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <MapPin size={16} className="text-purple-500" /> Sucursal (campus)
              </label>
              <select 
                value={formData.sucursal}
                onChange={(e) => setFormData({...formData, sucursal: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-slate-900 dark:text-white font-medium appearance-none"
              >
                <option value="QUERETARO">Querétaro</option>
                <option value="METEPEC">Metepec</option>
              </select>
            </div>

            {/* Modalidad (Ocultar si es STAFF o ADMIN) */}
            {formData.rol !== 'ADMIN' && formData.rol !== 'STAFF' ? (
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Monitor size={16} className="text-amber-500" /> Modalidad de estudio
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <label className={`flex items-center justify-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.modalidad === 'PRESENCIAL' ? 'bg-[#2952F5]/5 border-[#2952F5] ring-2 ring-[#2952F5]/20 shadow-md shadow-[#2952F5]/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                    <input type="radio" name="modalidad" value="PRESENCIAL" checked={formData.modalidad === 'PRESENCIAL'} onChange={(e) => setFormData({...formData, modalidad: e.target.value})} className="hidden" />
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.modalidad === 'PRESENCIAL' ? 'border-[#2952F5]' : 'border-slate-300 dark:border-slate-600'}`}>
                      {formData.modalidad === 'PRESENCIAL' && <span className="w-2.5 h-2.5 rounded-full bg-[#2952F5]"></span>}
                    </span>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Presencial</span>
                  </label>
                  
                  <label className={`flex items-center justify-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.modalidad === 'ZOOM' ? 'bg-[#2952F5]/5 border-[#2952F5] ring-2 ring-[#2952F5]/20 shadow-md shadow-[#2952F5]/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                    <input type="radio" name="modalidad" value="ZOOM" checked={formData.modalidad === 'ZOOM'} onChange={(e) => setFormData({...formData, modalidad: e.target.value})} className="hidden" />
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.modalidad === 'ZOOM' ? 'border-[#2952F5]' : 'border-slate-300 dark:border-slate-600'}`}>
                      {formData.modalidad === 'ZOOM' && <span className="w-2.5 h-2.5 rounded-full bg-[#2952F5]"></span>}
                    </span>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">En línea (Zoom)</span>
                  </label>

                  <label className={`flex items-center justify-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.modalidad === 'HIBRIDO' ? 'bg-[#2952F5]/5 border-[#2952F5] ring-2 ring-[#2952F5]/20 shadow-md shadow-[#2952F5]/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                    <input type="radio" name="modalidad" value="HIBRIDO" checked={formData.modalidad === 'HIBRIDO'} onChange={(e) => setFormData({...formData, modalidad: e.target.value})} className="hidden" />
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.modalidad === 'HIBRIDO' ? 'border-[#2952F5]' : 'border-slate-300 dark:border-slate-600'}`}>
                      {formData.modalidad === 'HIBRIDO' && <span className="w-2.5 h-2.5 rounded-full bg-[#2952F5]"></span>}
                    </span>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Híbrido</span>
                  </label>

                  <label className={`flex items-center justify-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.modalidad === 'NINGUNO' ? 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                    <input type="radio" name="modalidad" value="NINGUNO" checked={formData.modalidad === 'NINGUNO'} onChange={(e) => setFormData({...formData, modalidad: e.target.value})} className="hidden" />
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.modalidad === 'NINGUNO' ? 'border-slate-500' : 'border-slate-300 dark:border-slate-600'}`}>
                      {formData.modalidad === 'NINGUNO' && <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>}
                    </span>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Ninguno</span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Monitor size={16} className="text-slate-400" /> Modalidad de estudio
                </label>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">La modalidad de estudio no aplica para roles administrativos (Staff / Administrador).</p>
                </div>
              </div>
            )}
          </div>

          {/* Sección Informativa: Contraseña Temporal */}
          <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl">
            <h3 className="flex items-center gap-2 text-amber-800 dark:text-amber-500 font-bold mb-3">
              <KeyRound size={18} />
              Contraseña temporal automática
            </h3>
            <p className="text-sm text-amber-700/90 dark:text-amber-400/90 mb-4 leading-relaxed">
              Por seguridad, la contraseña inicial para este usuario será <strong className="font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded text-amber-900 dark:text-amber-300 select-all border border-amber-200 dark:border-amber-500/30 ml-1">{passwordTemporal}</strong>. 
              El sistema invitara al usuario a crear una nueva contraseña en su primer ingreso.
            </p>
          </div>

          {/* Botones de Acción Finales */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row justify-end gap-4">
            <Link 
              href="/portal/comunidad"
              className="px-6 py-4 text-center rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </Link>
            <button 
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-3 bg-[#2952F5] hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-900/30 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Procesando alta...
                </>
              ) : (
                <>
                  <Save size={20} /> Guardar miembro
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
