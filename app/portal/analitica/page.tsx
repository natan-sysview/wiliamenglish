import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardAnalytics from "../DashboardAnalytics";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";

export const metadata = {
  title: "Analítica empresarial | William English",
};

export default async function AnaliticaPage(props: { searchParams: Promise<{ sucursal?: string }> }) {
  const searchParams = await props.searchParams;
  const currentSucursal = searchParams.sucursal || "TODAS";

  const session = await auth();

  // Permisos para ver el Dashboard Analytics
  if (!session || (session.user.rol !== "ADMIN" && session.user.rol !== "STAFF")) {
    redirect("/portal");
  }

  // Base query para filtrar por sucursal
  const baseWhere = (currentSucursal === "QUERETARO" || currentSucursal === "METEPEC") 
    ? { sucursal: currentSucursal as any } 
    : {};

  // 1. Total Alumnos Activos
  const totalAlumnosActivos = await prisma.usuario.count({
    where: { rol: "ALUMNO", activo: true, ...baseWhere }
  });

  // 2. Total Maestros
  const totalMaestros = await prisma.usuario.count({
    where: { rol: "MAESTRO", ...baseWhere }
  });

  // 3. Tasa de Bajas
  const totalAlumnosHistorico = await prisma.usuario.count({ where: { rol: "ALUMNO", ...baseWhere } });
  const tasaBajas = totalAlumnosHistorico > 0 
    ? Math.round(((totalAlumnosHistorico - totalAlumnosActivos) / totalAlumnosHistorico) * 100)
    : 0;

  // 4. Agrupación por Sucursal (Excluir nulos)
  const agrupadoSucursal = await prisma.usuario.groupBy({
    by: ['sucursal'],
    _count: { id: true },
    where: { rol: "ALUMNO", activo: true, ...baseWhere }
  });
  const distribucionSucursal = agrupadoSucursal
    .filter(item => item.sucursal !== null)
    .map(item => ({ name: item.sucursal!, value: item._count.id }));

  const campusPrincipal = distribucionSucursal.length > 0 
    ? distribucionSucursal.reduce((max, current) => (current.value > max.value ? current : max)).name 
    : "No definido";

  // 5. Agrupación por Modalidad (Excluir nulos y NINGUNO)
  const agrupadoModalidad = await prisma.usuario.groupBy({
    by: ['modalidad'],
    _count: { id: true },
    where: { rol: "ALUMNO", activo: true, ...baseWhere }
  });
  const distribucionModalidad = agrupadoModalidad
    .filter(item => item.modalidad !== null && item.modalidad !== "NINGUNO")
    .map(item => ({ name: item.modalidad!, value: item._count.id }));

  // 6. Crecimiento Mensual
  const todosLosAlumnos = await prisma.usuario.findMany({
    where: { rol: "ALUMNO", ...baseWhere },
    select: { createdAt: true }
  });

  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const monthCounts = new Map<string, number>();

  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const label = `${meses[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
    monthCounts.set(label, 0);
  }

  todosLosAlumnos.forEach(alumno => {
    const d = new Date(alumno.createdAt);
    const label = `${meses[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
    if (monthCounts.has(label)) {
      monthCounts.set(label, monthCounts.get(label)! + 1);
    }
  });

  const crecimientoMensual = Array.from(monthCounts.entries()).map(([name, inscritos]) => ({ name, inscritos }));

  // ===== DATOS MOCK PARA DEMOSTRACIÓN DE GRÁFICAS AVANZADAS =====
  const horariosPico = [
    { day: "Lun", hours: [10, 15, 20, 50, 80, 40, 20] }, // Horas: 8am, 10am, 12pm, 4pm, 6pm, 8pm
    { day: "Mar", hours: [12, 18, 25, 60, 90, 55, 25] },
    { day: "Mie", hours: [15, 20, 22, 55, 85, 45, 15] },
    { day: "Jue", hours: [10, 25, 30, 70, 95, 60, 30] },
    { day: "Vie", hours: [5, 10, 15, 40, 60, 30, 10] },
    { day: "Sab", hours: [80, 90, 100, 60, 20, 5, 0] },
  ];

  const topPaquetes = [
    { name: "Intensivo Plus", value: 180 },
    { name: "Básico Mensual", value: 145 },
    { name: "Sabatino Pro", value: 95 },
    { name: "Conversación", value: 60 },
  ];

  const rendimientoMaestros = [
    { name: "Daniel C.", clases: 45, asisten: 40, puntaje: 95 },
    { name: "Ana M.", clases: 42, asisten: 38, puntaje: 90 },
    { name: "Luis G.", clases: 38, asisten: 35, puntaje: 85 },
    { name: "Sofia T.", clases: 35, asisten: 30, puntaje: 80 },
    { name: "Carlos P.", clases: 30, asisten: 28, puntaje: 75 },
  ];

  const tasaNoShow = [
    { name: "Semana 1", asistieron: 120, cancelaron: 15 },
    { name: "Semana 2", asistieron: 130, cancelaron: 10 },
    { name: "Semana 3", asistieron: 110, cancelaron: 25 },
    { name: "Semana 4", asistieron: 145, cancelaron: 8 },
  ];

  const analyticsData = {
    totalAlumnosActivos,
    totalMaestros,
    tasaBajas,
    campusPrincipal,
    distribucionSucursal,
    distribucionModalidad,
    crecimientoMensual,
    horariosPico,
    topPaquetes,
    rendimientoMaestros,
    tasaNoShow
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <Link href="/portal" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#2952F5] transition-colors mb-8 font-medium">
        <ArrowLeft size={20} />
        Regresar al Inicio
      </Link>

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-12">
        <div className="flex items-start md:items-center gap-4 md:gap-5">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#2952F5]/10 to-[#CC0000]/10 flex items-center justify-center flex-shrink-0 border border-white/60 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
            <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-[#2952F5]" strokeWidth={2.5} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
              <span className="text-slate-900 dark:text-white">Analítica</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2952F5] to-[#CC0000] drop-shadow-sm">
                empresarial
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1 md:mt-2 font-medium">
              Indicadores clave de rendimiento y distribución demográfica de la academia.
            </p>
          </div>
        </div>

        {/* Filtro Global de Sucursal */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
          <Link 
            href="/portal/analitica" 
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${currentSucursal === "TODAS" ? "bg-white dark:bg-slate-700 shadow-md text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            Global
          </Link>
          <Link 
            href="/portal/analitica?sucursal=QUERETARO" 
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${currentSucursal === "QUERETARO" ? "bg-white dark:bg-slate-700 shadow-md text-[#2952F5] dark:text-blue-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            Querétaro
          </Link>
          <Link 
            href="/portal/analitica?sucursal=METEPEC" 
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${currentSucursal === "METEPEC" ? "bg-white dark:bg-slate-700 shadow-md text-[#CC0000] dark:text-red-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            Metepec
          </Link>
        </div>
      </div>

      <DashboardAnalytics data={analyticsData} />
      
    </div>
  );
}
