import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import { BuscadorComunidad } from "./BuscadorComunidad";

export const metadata = {
  title: "Comunidad | William english institute",
};

export default async function ComunidadPage() {
  const session = await auth();

  // Protección de Ruta - Solo ADMIN y STAFF pueden ver esto
  if (!session || (session.user.rol !== "ADMIN" && session.user.rol !== "STAFF")) {
    redirect("/portal");
  }

  // Traer a todos los usuarios de la base de datos (ordenados por fecha de creación)
  const usuarios = await prisma.usuario.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nombre: true,
      email: true,
      telefono: true,
      rol: true,
      sucursal: true,
      modalidad: true,
      activo: true,
      createdAt: true,
    }
  });

  const currentUserId = session.user.id;
  const currentUserRol = session.user.rol;

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Encabezado Premium (Híbrido Apple + FinTech) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-12">
        <div className="flex items-start md:items-center gap-4 md:gap-5">
          {/* Glassmorphic Cube (Estilo Apple) */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#2952F5]/10 to-[#CC0000]/10 flex items-center justify-center flex-shrink-0 border border-white/60 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(41,82,245,0.1)] backdrop-blur-md">
            <Users className="w-7 h-7 md:w-8 md:h-8 text-[#2952F5] dark:text-blue-400" strokeWidth={2.5} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
              <span className="text-slate-900 dark:text-white">Comunidad</span>
              {/* Text Gradient (Estilo FinTech) */}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2952F5] to-[#CC0000] drop-shadow-sm">
                William English
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1 md:mt-2 font-medium">
              Gestiona alumnos, maestros y personal administrativo.
            </p>
          </div>
        </div>

        {/* Glowing Button (Azul Corporativo + Glow) */}
        <div className="relative group w-full md:w-auto mt-2 md:mt-0">
          {/* Resplandor luminoso azul bajo el botón */}
          <div className="absolute -inset-0.5 bg-[#2952F5] rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          
          <Link 
            href="/portal/comunidad/nuevo" 
            className="relative w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#2952F5] hover:bg-blue-700 text-white px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <UserPlus size={20} strokeWidth={2.5} className="text-white" />
            <span>Crear nuevo miembro</span>
          </Link>
        </div>
      </div>

      {/* Buscador Universal y Tabla (Client-Side) */}
      <BuscadorComunidad usuarios={usuarios} currentUserId={currentUserId} currentUserRol={currentUserRol} />
      
    </div>
  );
}
