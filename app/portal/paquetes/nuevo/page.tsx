"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { crearPaquete } from "@/lib/actions/paquetes";
import { PaqueteSchema } from "@/lib/validators/paquete";

export default function NuevoPaquetePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get("nombre") as string,
      clasesPersonales: Number(formData.get("clasesPersonales")),
      clasesGrupalListening: Number(formData.get("clasesGrupalListening")),
      clasesGrupalPracticing: Number(formData.get("clasesGrupalPracticing")),
    };

    // Validación en el cliente antes de ir al servidor
    const validation = PaqueteSchema.safeParse(data);
    if (!validation.success) {
      setError("Por favor revisa que todos los campos sean válidos.");
      setLoading(false);
      return;
    }

    // Llamada al Server Action
    const res = await crearPaquete(validation.data);
    
    if (res.success) {
      router.push("/portal/paquetes"); // Redirige y la tabla se actualiza sola
    } else {
      setError(res.error || "Ocurrió un error al guardar.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <div className="mb-6 border-b pb-4">
        <Link href="/portal/paquetes" className="text-gray-500 hover:text-[#2952F5] text-sm mb-2 inline-block">
          &larr; Volver al catálogo
        </Link>
        <h2 className="text-2xl font-bold text-[#2952F5]">Crear Nuevo Paquete</h2>
        <p className="text-gray-500 text-sm mt-1">Configura la cantidad de clases a las que el alumno tendrá derecho al mes.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Nombre del Paquete</label>
          <input 
            required 
            name="nombre" 
            type="text" 
            placeholder="Ej. Paquete Intensivo"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2952F5] focus:ring-[#2952F5] sm:text-sm p-3 border outline-none" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border border-gray-100">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Clases Personales</label>
            <input 
              required 
              name="clasesPersonales" 
              type="number" 
              min="0"
              defaultValue="2"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2952F5] focus:ring-[#2952F5] sm:text-sm p-2 border outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Grupal: Listening</label>
            <input 
              required 
              name="clasesGrupalListening" 
              type="number" 
              min="0"
              defaultValue="2"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2952F5] focus:ring-[#2952F5] sm:text-sm p-2 border outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Grupal: Practicing</label>
            <input 
              required 
              name="clasesGrupalPracticing" 
              type="number" 
              min="0"
              defaultValue="2"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2952F5] focus:ring-[#2952F5] sm:text-sm p-2 border outline-none" 
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-3 bg-[#2952F5] text-white font-semibold rounded-md shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2952F5] disabled:opacity-50 transition-colors"
          >
            {loading ? "Guardando en Postgres..." : "Guardar Paquete"}
          </button>
        </div>
      </form>
    </div>
  );
}
