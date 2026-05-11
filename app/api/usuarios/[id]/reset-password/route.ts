import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    // Solo ADMIN y STAFF pueden resetear
    if (!session || (session.user.rol !== "ADMIN" && session.user.rol !== "STAFF")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Buscar al usuario que queremos modificar
    const userToUpdate = await prisma.usuario.findUnique({
      where: { id },
      select: { id: true, email: true, rol: true }
    });

    if (!userToUpdate) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Regla de Jerarquía: STAFF no puede alterar a un ADMIN
    if (session.user.rol === "STAFF" && userToUpdate.rol === "ADMIN") {
      return NextResponse.json({ error: "Privilegios insuficientes. Un perfil STAFF no puede alterar a un Administrador." }, { status: 403 });
    }

    // Hashear la nueva contraseña temporal
    const passwordTemporal = "WilliamEnglish!";
    const passwordHash = await bcrypt.hash(passwordTemporal, 10);
    
    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: { 
        passwordHash,
        requiereCambioPassword: true 
      },
    });

    // Logging Estructurado de Seguridad
    console.log(`[ADMIN] Usuario ${session.user.id} reseteó la contraseña del usuario ${updatedUser.id} (${updatedUser.email})`);

    return NextResponse.json({ message: "Contraseña reseteada con éxito" });

  } catch (error) {
    console.error(`[ERROR] Fallo al intentar resetear la contraseña: ${error instanceof Error ? error.message : String(error)}`, { error });
    return NextResponse.json({ error: "Error interno del servidor al resetear la contraseña." }, { status: 500 });
  }
}
