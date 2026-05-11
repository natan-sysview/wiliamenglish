"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Users, GraduationCap, TrendingDown, MapPin } from "lucide-react";

interface AnalyticsProps {
  totalAlumnosActivos: number;
  totalMaestros: number;
  tasaBajas: number;
  campusPrincipal: string;
  distribucionSucursal: { name: string; value: number }[];
  distribucionModalidad: { name: string; value: number }[];
  crecimientoMensual: { name: string; inscritos: number }[];
  // Mock Data
  horariosPico: { day: string; hours: number[] }[];
  topPaquetes: { name: string; value: number }[];
  rendimientoMaestros: { name: string; clases: number; asisten: number; puntaje: number }[];
  tasaNoShow: { name: string; asistieron: number; cancelaron: number }[];
}

const COLORS_SUCURSAL = ["#2952F5", "#8B5CF6"];
const COLORS_MODALIDAD = ["#10B981", "#F59E0B", "#3B82F6", "#64748B"];
const HORAS_LABELS = ["8 AM", "10 AM", "12 PM", "4 PM", "6 PM", "8 PM", "10 PM"];

export default function DashboardAnalytics({ data }: { data: AnalyticsProps }) {
  // Helper for Heatmap color
  const getHeatmapColor = (value: number) => {
    if (value === 0) return "bg-slate-100 dark:bg-slate-800";
    if (value < 20) return "bg-[#2952F5]/20";
    if (value < 40) return "bg-[#2952F5]/40";
    if (value < 60) return "bg-[#2952F5]/60";
    if (value < 80) return "bg-[#2952F5]/80";
    return "bg-[#2952F5]";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Nivel 1: Tarjetas de Impacto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Alumnos */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-[#2952F5] dark:text-blue-400 rounded-xl flex items-center justify-center">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alumnos Activos</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-slate-800 dark:text-white">{data.totalAlumnosActivos}</span>
          </div>
        </div>

        {/* Total Maestros */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-xl flex items-center justify-center">
              <GraduationCap size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Maestros</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-slate-800 dark:text-white">{data.totalMaestros}</span>
          </div>
        </div>

        {/* Tasa de Bajas */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 text-[#CC0000] rounded-xl flex items-center justify-center">
              <TrendingDown size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tasa de Bajas</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-slate-800 dark:text-white">{data.tasaBajas}%</span>
          </div>
        </div>

        {/* Campus Principal */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-500 rounded-xl flex items-center justify-center">
              <MapPin size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Campus Fuerte</h3>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-2xl font-black text-slate-800 dark:text-white truncate">{data.campusPrincipal}</span>
          </div>
        </div>

      </div>

      {/* Nivel 2: Gráficas de Donas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Distribución por Sucursal */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Alumnos por Sucursal</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.distribucionSucursal}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.distribucionSucursal.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_SUCURSAL[index % COLORS_SUCURSAL.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255,255,255,0.9)', color: '#000' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {data.distribucionSucursal.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS_SUCURSAL[index % COLORS_SUCURSAL.length] }}></div>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por Modalidad */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Modalidad de Estudio</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.distribucionModalidad}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.distribucionModalidad.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_MODALIDAD[index % COLORS_MODALIDAD.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255,255,255,0.9)', color: '#000' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center flex-wrap gap-4 mt-2">
            {data.distribucionModalidad.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS_MODALIDAD[index % COLORS_MODALIDAD.length] }}></div>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 capitalize">{entry.name.toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Nivel 3: Crecimiento Histórico */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Crecimiento Mensual (Nuevos Ingresos)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.crecimientoMensual} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(41, 82, 245, 0.05)' }}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255,255,255,0.95)' }}
              />
              <Bar dataKey="inscritos" fill="#2952F5" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Nivel 4: Análisis Avanzado (NUEVAS GRÁFICAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfica 1: Tasa de Asistencia vs Cancelación (AreaChart) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Asistencia a Clases (No Show)</h3>
            <p className="text-xs text-slate-500">Métrica del último mes (Datos Demo)</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.tasaNoShow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAsistieron" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCancelaron" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CC0000" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#CC0000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="asistieron" name="Asistieron" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorAsistieron)" />
                <Area type="monotone" dataKey="cancelaron" name="No Show (Cancelaron)" stroke="#CC0000" strokeWidth={3} fillOpacity={1} fill="url(#colorCancelaron)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica 2: Rendimiento de Maestros (RadarChart) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Productividad de Maestros</h3>
            <p className="text-xs text-slate-500">Volumen de clases impartidas (Datos Demo)</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.rendimientoMaestros}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Productividad" dataKey="puntaje" stroke="#8B5CF6" strokeWidth={2} fill="#8B5CF6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ borderRadius: '0.5rem', border: 'none' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica 3: Top Paquetes Vendidos (BarChart Horizontal) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Paquetes Más Populares</h3>
            <p className="text-xs text-slate-500">Alumnos inscritos por paquete (Datos Demo)</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.topPaquetes} margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                <Tooltip cursor={{ fill: 'rgba(245, 158, 11, 0.05)' }} contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                <Bar dataKey="value" name="Alumnos" fill="#F59E0B" radius={[0, 6, 6, 0]} maxBarSize={30}>
                  {data.topPaquetes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_MODALIDAD[index % COLORS_MODALIDAD.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica 4: Mapa de Calor de Horarios Pico (Custom CSS Grid) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Horarios Pico (Heatmap)</h3>
            <p className="text-xs text-slate-500">Densidad de reservaciones por hora (Datos Demo)</p>
          </div>
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[400px]">
              {/* Eje X: Horas */}
              <div className="flex ml-10 mb-2">
                {HORAS_LABELS.map((hora, i) => (
                  <div key={i} className="flex-1 text-center text-[10px] font-bold text-slate-400">{hora}</div>
                ))}
              </div>
              
              {/* Grid Principal */}
              <div className="space-y-1">
                {data.horariosPico.map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {/* Eje Y: Días */}
                    <div className="w-8 text-[11px] font-bold text-slate-500 text-right">{row.day}</div>
                    
                    {/* Cuadros de calor */}
                    <div className="flex flex-1 gap-1">
                      {row.hours.map((val, j) => (
                        <div 
                          key={j} 
                          className={`flex-1 h-8 rounded-md transition-all hover:scale-110 hover:shadow-md cursor-crosshair ${getHeatmapColor(val)}`}
                          title={`${val} alumnos a las ${HORAS_LABELS[j]}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Leyenda */}
              <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-slate-400 font-medium">
                <span>Tranquilo</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                  <div className="w-3 h-3 rounded-sm bg-[#2952F5]/20"></div>
                  <div className="w-3 h-3 rounded-sm bg-[#2952F5]/60"></div>
                  <div className="w-3 h-3 rounded-sm bg-[#2952F5]"></div>
                </div>
                <span>Saturado</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
