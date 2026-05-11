import { obtenerPaquetes, cambiarEstadoPaquete } from "@/lib/actions/paquetes";
import Link from "next/link";

export default async function PaquetesPage() {
  // Esto corre en el servidor (Server Component), va a Postgres y pinta el HTML
  const paquetes = await obtenerPaquetes();

  // Server Action inline para el toggle de Activo/Inactivo
  async function toggleActivo(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const activoStr = formData.get("activo") as string;
    await cambiarEstadoPaquete(id, activoStr !== "true");
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2952F5]">Catálogo de Paquetes</h2>
          <p className="text-gray-500 text-sm">Administra los paquetes de clases mensuales.</p>
        </div>
        <Link 
          href="/portal/paquetes/nuevo" 
          className="px-4 py-2 bg-[#CC0000] text-white rounded-md hover:bg-red-700 shadow-sm transition-colors"
        >
          + Nuevo Paquete
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">C. Personales</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">C. Listening</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">C. Practicing</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paquetes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">
                  No hay paquetes registrados en la base de datos.
                </td>
              </tr>
            ) : (
              paquetes.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#2952F5]">{p.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{p.clasesPersonales}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{p.clasesGrupalListening}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{p.clasesGrupalPracticing}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${p.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={toggleActivo}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="activo" value={String(p.activo)} />
                      <button type="submit" className="text-gray-500 hover:text-[#2952F5] underline">
                        {p.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
