---
name: stack_nextjs_fullstack
description: Define el stack tecnológico completo del proyecto William English. Next.js como framework full-stack (frontend React + backend API Routes), Prisma ORM con PostgreSQL, NextAuth.js para autenticación y todas las herramientas de desarrollo.
---

# Stack Tecnológico: Next.js Full-Stack

## Framework: Next.js 15 (App Router)

| Paquete | Rol |
| ------- | --- |
| `Next.js 15` | Framework full-stack (React + API Routes + SSR/SSG) |
| `TypeScript` | Tipado estático en todo el proyecto |
| `React 19` | Librería UI (viene incluido con Next.js) |

> **¿Por qué Next.js?** Un solo proyecto hace frontend Y backend. La landing
> pública tiene SEO nativo (Server-Side Rendering) y la app privada vive
> en el mismo dominio. Un solo deploy, un solo lenguaje (TypeScript).

---

## ORM: Prisma + PostgreSQL

| Paquete | Rol |
| ------- | --- |
| `prisma` | ORM y migraciones (CLI) |
| `@prisma/client` | Cliente para consultas a la base de datos |
| `PostgreSQL` | Base de datos relacional |

### Definición del esquema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Usuario {
  id        String   @id @default(cuid())
  nombre    String
  email     String   @unique
  rol       Rol
  createdAt DateTime @default(now())
}

enum Rol {
  ADMIN
  MAESTRO
  ALUMNO
}
```

### Comandos de Prisma

```bash
# Crear una migración
npx prisma migrate dev --name agregar_tabla_horarios

# Ver el estado de migraciones
npx prisma migrate status

# Abrir el explorador visual de la BD
npx prisma studio

# Regenerar el cliente después de cambiar el schema
npx prisma generate
```

---

## Autenticación: NextAuth.js v5

| Paquete | Rol |
| ------- | --- |
| `next-auth@beta` | Autenticación con sesiones y JWT |
| `@auth/prisma-adapter` | Conectar NextAuth con Prisma/PostgreSQL |

### Flujo de autenticación

```
Alumno abre la app
        ↓
Ve la pantalla de login
        ↓
Ingresa email + contraseña
        ↓
NextAuth valida contra PostgreSQL (vía Prisma)
        ↓
Crea una sesión segura (cookie HttpOnly)
        ↓
El middleware de Next.js protege las rutas /portal/*
        ↓
Según el rol (ADMIN/MAESTRO/ALUMNO) ve su dashboard
```

---

## UI y Estilos

| Paquete | Rol |
| ------- | --- |
| `Tailwind CSS 4` | Sistema de estilos utility-first |
| `shadcn/ui` | Componentes UI base (botones, calendarios, modales, tabs) |
| `lucide-react` | Íconos (exclusivamente esta librería) |
| `react-day-picker` | Componente de calendario (viene con shadcn/ui) |

---

## Datos y Estado

| Paquete | Rol |
| ------- | --- |
| `TanStack Query` | Fetching y cache de datos desde las API Routes |
| `Zustand` | Estado global (sesión, UI, tabs) |
| `Zod` | Validación de datos en frontend Y backend |

---

## Testing

| Paquete | Rol | Nivel |
| ------- | --- | ----- |
| `Vitest` | Framework base de testing | Unit + Integration |
| `React Testing Library` | Renderiza componentes y simula interacciones | Unit + Integration |
| `Playwright` | Abre navegador real y prueba la app completa | E2E |

### Niveles de testing

```
Unit Tests (Vitest + React Testing Library)
→ "el calendario muestra los horarios correctamente"
→ "el botón de reagendar llama la función correcta"

Integration Tests (Vitest)
→ "la API Route de horarios regresa datos válidos"
→ "el flujo de reagendamiento completo funciona"

E2E Tests (Playwright)
→ "el alumno entra, ve su calendario, reagenda una clase"
→ "el admin crea un horario y un alumno lo ve disponible"
```

---

## Code Quality

| Paquete | Rol |
| ------- | --- |
| `ESLint` | Linting y detección de malas prácticas |
| `@typescript-eslint` | Reglas específicas para TypeScript |
| `eslint-plugin-react-hooks` | Detecta mal uso de hooks de React |
| `Prettier` | Formateo automático del código |
| `Vitest --coverage` | Cobertura de tests |
| `SonarQube (Docker)` | Dashboard visual de deuda técnica |

### Comandos de calidad

```bash
# Revisar todo el código
npx eslint . --ext .ts,.tsx

# Corregir automáticamente
npx eslint . --ext .ts,.tsx --fix

# Formatear todo
npx prettier --write .

# Tests con cobertura
npx vitest run --coverage

# Tests E2E
npx playwright test
```

---

## Logging: Pino (incluido en Next.js)

| Paquete | Rol |
| ------- | --- |
| `pino` | Logger estructurado (el estándar de Node.js) |
| `pino-pretty` | Formato legible en desarrollo |

> Next.js usa Pino internamente. No necesitamos Serilog ni Seq
> para una app de este tamaño. Los logs van a la consola en desarrollo
> y al proveedor de hosting en producción (Vercel los muestra gratis).

---

## Estructura del Proyecto

```
william-english/
├── app/                          ← Next.js App Router
│   ├── (public)/                 ← Landing SEO (sin auth)
│   │   ├── page.tsx              ← Home
│   │   └── layout.tsx
│   │
│   ├── (auth)/                   ← Login/registro
│   │   └── login/page.tsx
│   │
│   ├── portal/                   ← App protegida (con auth)
│   │   ├── admin/                ← Vistas del admin
│   │   │   ├── usuarios/
│   │   │   ├── horarios/
│   │   │   └── paquetes/
│   │   ├── maestro/              ← Vistas del maestro
│   │   │   └── mi-agenda/
│   │   └── alumno/               ← Vistas del alumno
│   │       ├── mis-clases/
│   │       └── reagendar/
│   │
│   └── api/                      ← API Routes (backend)
│       ├── auth/[...nextauth]/
│       ├── usuarios/
│       ├── horarios/
│       └── paquetes/
│
├── components/                   ← Componentes reutilizables
│   ├── ui/                       ← shadcn/ui
│   └── shared/                   ← Compartidos (calendario, etc.)
│
├── lib/                          ← Configuraciones y utilidades
│   ├── auth.ts                   ← Config de NextAuth
│   ├── prisma.ts                 ← Cliente Prisma singleton
│   ├── validators/               ← Schemas Zod
│   └── utils.ts
│
├── prisma/                       ← Base de datos
│   ├── schema.prisma
│   └── migrations/
│
├── store/                        ← Estado global Zustand
├── types/                        ← Tipos TypeScript compartidos
├── config/                       ← Reglas de negocio configurables
│   └── reglas_reagendamiento.yml
│
├── tests/                        ← Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── public/                       ← Assets estáticos (logo, imágenes)
├── .env.local                    ← Variables de entorno (no va a git)
├── docker-compose.yml            ← PostgreSQL local
└── package.json
```

---

## Docker Compose (solo para desarrollo local)

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: william_dev
      POSTGRES_DB: william_english
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

---

## Variables de Entorno

```bash
# .env.local (desarrollo — NUNCA va a git)
DATABASE_URL="postgresql://postgres:william_dev@localhost:5432/william_english"
NEXTAUTH_SECRET="clave-local-desarrollo-no-usar-en-produccion"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Stack Completo Resumido

```
Framework
└── Next.js 15 (App Router)       → frontend + backend en uno

Base de Datos
├── PostgreSQL 16                  → base de datos
└── Prisma                         → ORM + migraciones

Autenticación
└── NextAuth.js v5                 → login, sesiones, roles

UI
├── Tailwind CSS 4                 → estilos
├── shadcn/ui                      → componentes base
└── lucide-react                   → íconos

Datos y Estado
├── TanStack Query                 → fetching + cache
├── Zustand                        → estado global
└── Zod                            → validación

Testing
├── Vitest                         → unit + integration
├── React Testing Library          → componentes
└── Playwright                     → E2E

Code Quality
├── ESLint + TypeScript rules      → linting
├── Prettier                       → formateo
└── SonarQube (Docker)             → deuda técnica

Logging
└── Pino                           → logs estructurados
```
