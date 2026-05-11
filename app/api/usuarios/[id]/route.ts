import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().superRefine((val, ctx) => {
    if (!val.includes("@")) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Te falta incluir el símbolo '@' en el correo." });
      return;
    }
    const parts = val.split("@");
    if (!parts[1] || !parts[1].includes(".")) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Te falta incluir la terminación del dominio (ejemplo: .com o .edu)." });
      return;
    }
    if (parts[1].endsWith(".")) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El correo no puede terminar con un punto." });
      return;
    }
    if (!z.string().email().safeParse(val).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El formato general del correo parece tener un error." });
    }
  }),
  telefono: z.string()
    .refine((val) => !val || val === "" || /^[0-9]{10}$/.test(val), {
      message: "El teléfono debe contener exactamente 10 números, sin espacios ni letras.",
    })
    .optional(),
  rol: z.enum(["ADMIN", "STAFF", "MAESTRO", "ALUMNO"]),
  sucursal: z.enum(["QUERETARO", "METEPEC"]),
  modalidad: z.enum(["PRESENCIAL", "ZOOM", "HIBRIDO", "NINGUNO"]),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    // Solo ADMIN y STAFF pueden editar
    if (!session || (session.user.rol !== "ADMIN" && session.user.rol !== "STAFF")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Obtener el usuario actual antes de modificar para verificar roles
    const userToUpdate = await prisma.usuario.findUnique({ where: { id } });
    if (!userToUpdate) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Regla de Jerarquía: STAFF no puede editar a un ADMIN
    if (session.user.rol === "STAFF" && userToUpdate.rol === "ADMIN") {
      return NextResponse.json({ error: "Privilegios insuficientes. Un perfil STAFF no puede modificar a un Administrador." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { nombre, email, telefono, rol, sucursal, modalidad } = parsed.data;

    // Regla de Jerarquía: STAFF no puede otorgar el rol de ADMIN
    if (session.user.rol === "STAFF" && rol === "ADMIN") {
      return NextResponse.json({ error: "Privilegios insuficientes. Solo un Administrador puede otorgar el rol de ADMIN a otro usuario." }, { status: 403 });
    }

    // Evitar que le pongan un correo que ya usa otro usuario
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== id) {
      return NextResponse.json({ error: "Este correo ya está siendo usado por otro miembro." }, { status: 400 });
    }

    if (userToUpdate.rol === "ADMIN" && rol !== "ADMIN") {
      return NextResponse.json({ error: "No puedes quitarle el rol de Administrador a este usuario." }, { status: 403 });
    }

    // Si es STAFF o ADMIN, la modalidad no aplica
    const finalModalidad = (rol === "ADMIN" || rol === "STAFF") ? "NINGUNO" : modalidad;

    // Actualizar usuario
    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: { nombre, email, telefono: telefono || null, rol, sucursal, modalidad: finalModalidad },
    });

    // Logging Estructurado (Observabilidad v1)
    console.log(`[ADMIN] Usuario ${session.user.id} (${session.user.email}) actualizó el perfil de ${updatedUser.id} (${updatedUser.email})`);

    return NextResponse.json({ message: "Usuario actualizado", user: updatedUser });
  } catch (error) {
    // Logging Estructurado de Errores con Contexto Forense
    console.error(`[ERROR] Fallo al actualizar usuario: ${error instanceof Error ? error.message : String(error)}`, { error });
    return NextResponse.json({ error: "Error interno del servidor. Inténtalo más tarde." }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    
    // Solo ADMIN y STAFF pueden activar/desactivar
    if (!session || (session.user.rol !== "ADMIN" && session.user.rol !== "STAFF")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Buscar al usuario que queremos modificar
    const userToUpdate = await prisma.usuario.findUnique({
      where: { id },
      select: { id: true, email: true, activo: true, rol: true }
    });

    if (!userToUpdate) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Regla de Oro: Un administrador no puede darse de baja a sí mismo
    if (userToUpdate.id === session.user.id) {
      return NextResponse.json({ error: "Por seguridad, no puedes dar de baja tu propia cuenta." }, { status: 400 });
    }

    // Regla de Jerarquía: STAFF no puede alterar a un ADMIN
    if (session.user.rol === "STAFF" && userToUpdate.rol === "ADMIN") {
      return NextResponse.json({ error: "Privilegios insuficientes. Un perfil STAFF no puede alterar el estado de un Administrador." }, { status: 403 });
    }

    // Cambiar el switch de activo a inactivo (y viceversa)
    const nuevoEstado = !userToUpdate.activo;
    
    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: { activo: nuevoEstado },
    });

    // Logging Estructurado de Seguridad
    console.log(`[ADMIN] Usuario ${session.user.id} cambió el estado del usuario ${updatedUser.id} (${updatedUser.email}) a -> ${nuevoEstado ? 'ACTIVO' : 'DADO DE BAJA'}`);

    return NextResponse.json({ message: "Estado actualizado con éxito", activo: updatedUser.activo });

  } catch (error) {
    console.error(`[ERROR] Fallo al intentar desactivar usuario: ${error instanceof Error ? error.message : String(error)}`, { error });
    return NextResponse.json({ error: "Error interno del servidor al cambiar el estado." }, { status: 500 });
  }
}
