---
name: skill_architecture
description: Define la arquitectura del proyecto William English con Next.js. Un solo proyecto, estructura de URLs, ambientes y comunicación frontend-backend.
---

# Skill: Arquitectura — Next.js Full-Stack

## Propósito

Define cómo se estructura el proyecto. Con Next.js el frontend y backend
viven juntos en un solo proyecto. No hay dos servidores separados.

---

## 1. Visión General

```
┌─────────────────────────────────────┐
│              Usuario                │
│         (celular/tablet/laptop)     │
└────────────────┬────────────────────┘
                 │ HTTPS
┌────────────────▼────────────────────┐
│         Next.js (todo junto)        │
│                                     │
│  Landing SEO ←→ App Router          │
│  API Routes  ←→ Prisma ORM         │
│                                     │
│  localhost:3000 (dev)               │
│  williamsenglish.com.mx (prod)     │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│           PostgreSQL                │
└─────────────────────────────────────┘
```

---

## 2. Estructura de URLs

### Páginas públicas (Landing SEO)

```
/                         → página principal
/nosotros                 → sobre la escuela
/sucursales/queretaro     → info de Querétaro con mapa
/sucursales/metepec       → info de Metepec con mapa
/contacto                 → formulario + WhatsApp
/login                    → iniciar sesión
```

### App protegida (Portal)

```
/portal/admin/usuarios           → gestión de usuarios
/portal/admin/horarios           → gestión de horarios
/portal/admin/paquetes           → catálogo de paquetes
/portal/maestro/mi-agenda        → agenda del maestro
/portal/alumno/mis-clases        → clases del alumno
/portal/alumno/reagendar/{id}    → reagendar una clase
```

### API Routes

```
GET    /api/horarios                → listar disponibles
POST   /api/horarios                → crear (admin)
PUT    /api/horarios/{id}           → editar (admin)
DELETE /api/horarios/{id}           → eliminar (admin)
POST   /api/reagendamiento          → reagendar clase (alumno)
GET    /api/usuarios                → listar (admin)
POST   /api/usuarios                → crear (admin)
GET    /api/paquetes                → listar paquetes
POST   /api/auth/[...nextauth]      → autenticación
```

---

## 3. Formato de Respuestas API

```json
// Exitosa
{ "success": true, "data": { ... } }

// Exitosa con paginación
{ "success": true, "data": [...], "pagination": { "pagina": 1, "total": 50 } }

// Error
{ "success": false, "error": { "mensaje": "Horario no disponible" } }
```

---

## 4. Ambientes

```
Desarrollo:    http://localhost:3000    + PostgreSQL Docker local
Producción:    williamsenglish.com.mx   + PostgreSQL hosted (Supabase/Neon)
```

---

## 5. Middleware de Protección

```typescript
// middleware.ts (raíz del proyecto)
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;
      if (path.startsWith("/portal/admin")) return token?.rol === "ADMIN";
      if (path.startsWith("/portal/maestro")) return token?.rol === "MAESTRO";
      if (path.startsWith("/portal")) return !!token;
      return true; // páginas públicas
    },
  },
});

export const config = {
  matcher: ["/portal/:path*"],
};
```
