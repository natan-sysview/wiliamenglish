import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
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
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // Solo ADMIN y STAFF pueden crear usuarios
    if (!session || (session.user.rol !== "ADMIN" && session.user.rol !== "STAFF")) {
      return NextResponse.json({ error: "No tienes permisos para realizar esta acción." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { nombre, email, telefono, rol, sucursal, modalidad, password } = parsed.data;

    // Verificar que el correo no exista ya
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Este correo electrónico ya está registrado en el sistema." }, { status: 400 });
    }

    // Si es STAFF o ADMIN, la modalidad no aplica
    const finalModalidad = (rol === "ADMIN" || rol === "STAFF") ? "NINGUNO" : modalidad;

    // Hashear la contraseña temporal
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear el usuario con la bandera de Cambio Forzado activada
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        telefono: telefono || null,
        rol,
        sucursal,
        modalidad: finalModalidad,
        passwordHash,
        requiereCambioPassword: true,
      },
    });

    // Logging Estructurado (Observabilidad v1)
    console.log(`[ADMIN] Usuario ${session.user.id} (${session.user.email}) registró al nuevo ${rol} ${nuevoUsuario.id} (${nuevoUsuario.email})`);

    return NextResponse.json(
      { message: "Usuario creado con éxito", user: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre } },
      { status: 201 }
    );
  } catch (error) {
    // Logging Estructurado de Errores con Contexto Forense
    console.error(`[ERROR] Fallo al crear usuario: ${error instanceof Error ? error.message : String(error)}`, { error });
    return NextResponse.json({ error: "Error interno del servidor. Inténtalo más tarde." }, { status: 500 });
  }
}
