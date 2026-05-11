import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditarMiembroForm from "./EditarMiembroForm";

export const metadata = {
  title: "Editar Miembro | William english institute",
};

export default async function EditarPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  // Protección de Ruta
  if (!session || (session.user.rol !== "ADMIN" && session.user.rol !== "STAFF")) {
    redirect("/portal");
  }

  // Next.js 15: params se deben resolver asíncronamente
  const resolvedParams = await params;
  
  // Buscar al usuario en la BD para pre-rellenar el formulario
  const usuario = await prisma.usuario.findUnique({
    where: { id: resolvedParams.id },
    select: {
      id: true,
      nombre: true,
      email: true,
      telefono: true,
      rol: true,
      sucursal: true,
      modalidad: true,
    }
  });

  // Si meten un ID inventado en la barra de direcciones, regresarlos a la comunidad
  if (!usuario) {
    redirect("/portal/comunidad");
  }

  return <EditarMiembroForm usuario={usuario} />;
}
