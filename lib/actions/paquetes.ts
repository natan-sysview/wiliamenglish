"use server";

import { prisma } from "@/lib/prisma";
import { PaqueteSchema, PaqueteFormValues } from "../validators/paquete";
import { revalidatePath } from "next/cache";

export async function crearPaquete(data: PaqueteFormValues) {
  // 1. Validar datos estrictamente
  const result = PaqueteSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    // 2. Insertar en PostgreSQL vía Prisma
    const paquete = await prisma.paquete.create({
      data: result.data,
    });
    
    // 3. Invalidar la caché para que la tabla se refresque automáticamente
    revalidatePath("/portal/paquetes");
    return { success: true, paquete };
  } catch (error) {
    console.error("Error creando paquete:", error);
    return { success: false, error: "Ocurrió un error al guardar en la base de datos." };
  }
}

export async function obtenerPaquetes() {
  return await prisma.paquete.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function cambiarEstadoPaquete(id: string, activo: boolean) {
  try {
    await prisma.paquete.update({
      where: { id },
      data: { activo },
    });
    revalidatePath("/portal/paquetes");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al actualizar." };
  }
}
