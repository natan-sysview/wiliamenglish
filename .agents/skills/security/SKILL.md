---
name: skill_security
description: Reglas de seguridad para la app William English con Next.js. Autenticación con NextAuth, roles (Admin/Maestro/Alumno), protección de rutas y validación.
---

# Skill: Seguridad — Next.js + NextAuth

## Propósito

Define las reglas de seguridad para la app. Tres roles: Admin, Maestro, Alumno.

---

## 1. Autenticación con NextAuth.js

```typescript
// lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!valid) return null;
        return { id: user.id, name: user.nombre, email: user.email, rol: user.rol };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) { token.rol = user.rol; token.id = user.id; }
      return token;
    },
    session({ session, token }) {
      session.user.rol = token.rol;
      session.user.id = token.id;
      return session;
    },
  },
});
```

---

## 2. Roles y Matriz de Permisos (RBAC)

El sistema opera bajo un esquema estricto de control de acceso basado en roles:

- **ADMIN** (Director): Control maestro. Único que puede borrar bases de datos, modificar precios de paquetes educativos y ver métricas financieras globales.
- **STAFF** (Secretaria/Coordinador): Operación diaria. Puede crear/editar usuarios, asignar paquetes, y reagendar clases. NO puede alterar precios ni eliminar registros críticos.
- **MAESTRO**: Acceso limitado a la operatividad. Puede ver su propia agenda de clases asignadas, pasar lista y ver los alumnos inscritos en su sesión. NO puede crear paquetes ni modificar datos de cobro.
- **ALUMNO**: Acceso de solo lectura y reservación. Puede ver sus clases pagadas, reservar clases nuevas según los créditos de su paquete, y reagendar con las reglas establecidas.

---

## 2.1 Flujo de Onboarding (Ruta de Conserjería)

Para evitar cuentas falsas (spam) y mantener el control administrativo, la creación de usuarios sigue este flujo cerrado:
1. **Creación:** Solo el `ADMIN` puede dar de alta nuevos alumnos y maestros desde el panel de Comunidad.
2. **Clave Temporal:** Al crear la cuenta, el Admin asigna una contraseña temporal.
3. **Bandera de Seguridad:** La base de datos marcará al usuario con una bandera interna (ej. `requiereCambioPassword: true`).
4. **Cambio Forzado:** Cuando el usuario inicie sesión con la clave temporal, el Middleware o el Dashboard detectará la bandera y **bloqueará el acceso**, forzándolo a cambiar su contraseña en una pantalla dedicada. Tras cambiarla, se libera el acceso al sistema.

---

## 3. Protección de Rutas (Middleware)

```typescript
// middleware.ts
export { default } from "next-auth/middleware";
export const config = { matcher: ["/portal/:path*", "/api/usuarios/:path*", "/api/horarios/:path*"] };
```

### Verificar rol en API Routes

```typescript
const session = await auth();
if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
if (session.user.rol !== "ADMIN") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
```

---

## 4. Reglas

```
✅ Passwords hasheados con bcrypt (mínimo 10 salt rounds)
✅ Sesiones con cookie HttpOnly (NextAuth lo hace automático)
✅ Toda API Route protegida verifica sesión
✅ Endpoints admin verifican rol === "ADMIN"
❌ NUNCA guardar passwords en texto plano
❌ NUNCA exponer el password hash en respuestas API
❌ NUNCA hardcodear secrets en el código
❌ NUNCA devolver stack traces al cliente
```

---

## 5. Validación de Entradas

```typescript
// Siempre validar con Zod
const schema = z.object({
  email: z.string().email("Email inválido"),
  nombre: z.string().min(2).max(100),
});
const parsed = schema.safeParse(body);
if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
```

---

## 6. CORS y Headers

Next.js maneja CORS automáticamente para API Routes del mismo dominio.
Para producción, configurar `next.config.js` si se necesitan orígenes externos.

---

## 7. Checklist

```
□ Todos los endpoints del portal verifican sesión
□ Los endpoints admin verifican rol ADMIN
□ Passwords hasheados con bcrypt
□ No hay secrets en el código ni en git
□ Las entradas se validan con Zod
□ El NEXTAUTH_SECRET tiene mínimo 32 caracteres
□ .env.local está en .gitignore
```
