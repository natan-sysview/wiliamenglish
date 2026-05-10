---
name: skill_database
description: Convenciones y buenas prácticas para diseño de base de datos con Prisma ORM y PostgreSQL para el proyecto William English.
---

# Skill: Base de Datos — Prisma + PostgreSQL

## Propósito

Define cómo diseñar, nombrar y manejar la base de datos del proyecto.

---

## 1. Convenciones de Nombres

### Modelos (en schema.prisma)

```
✅ PascalCase, singular: Usuario, Horario, Clase, Paquete
❌ usuarios, horarios (Prisma usa PascalCase)
```

### Campos

```
✅ camelCase: fechaCreacion, tipoClase, maestroId
❌ fecha_creacion, tipo_clase (snake_case es para SQL directo)
```

> Prisma genera las tablas en snake_case automáticamente con `@@map`.

### Tablas en PostgreSQL (generadas)

```
✅ snake_case, plural: usuarios, horarios, clases, paquetes
```

---

## 2. Schema de Prisma (ejemplo base)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id             String    @id @default(cuid())
  nombre         String
  email          String    @unique
  passwordHash   String
  rol            Rol
  sucursal       Sucursal
  nivel          Nivel?
  paqueteId      String?
  paquete        Paquete?  @relation(fields: [paqueteId], references: [id])
  clasesAlumno   Reservacion[] @relation("alumno")
  clasesMaestro  Horario[]     @relation("maestro")
  activo         Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@map("usuarios")
}

model Paquete {
  id                    String    @id @default(cuid())
  nombre                String
  clasesPersonales      Int
  clasesGrupalListening Int
  clasesGrupalPracticing Int
  alumnos               Usuario[]
  activo                Boolean   @default(true)
  createdAt             DateTime  @default(now())

  @@map("paquetes")
}

model Horario {
  id           String       @id @default(cuid())
  fechaHora    DateTime
  tipoClase    TipoClase
  modalidad    Modalidad
  nivel        Nivel
  sucursal     Sucursal
  maestroId    String
  maestro      Usuario      @relation("maestro", fields: [maestroId], references: [id])
  capacidad    Int
  reservaciones Reservacion[]
  activo       Boolean      @default(true)
  createdAt    DateTime     @default(now())

  @@map("horarios")
}

model Reservacion {
  id          String   @id @default(cuid())
  alumnoId    String
  alumno      Usuario  @relation("alumno", fields: [alumnoId], references: [id])
  horarioId   String
  horario     Horario  @relation(fields: [horarioId], references: [id])
  estado      EstadoReservacion @default(ACTIVA)
  createdAt   DateTime @default(now())

  @@map("reservaciones")
}

enum Rol {
  ADMIN
  MAESTRO
  ALUMNO
}

enum Sucursal {
  QUERETARO
  METEPEC
}

enum Nivel {
  A
  B
  C
}

enum TipoClase {
  PERSONAL
  GRUPAL_LISTENING
  GRUPAL_PRACTICING
}

enum Modalidad {
  PRESENCIAL
  ZOOM
}

enum EstadoReservacion {
  ACTIVA
  REAGENDADA
  CANCELADA
}
```

---

## 3. Migraciones

```bash
# Crear migración
npx prisma migrate dev --name agregar_tabla_paquetes

# Aplicar en producción
npx prisma migrate deploy

# Ver estado
npx prisma migrate status
```

### Reglas

```
✅ SIEMPRE crear migración cuando cambia el schema
✅ Nombres descriptivos: agregar_campo_nivel_a_horarios
❌ NUNCA modificar una migración ya aplicada
❌ NUNCA modificar la DB directamente sin migración
```

---

## 4. Consultas con Prisma

```typescript
// ✅ CORRECTO — filtrado y paginación
const horarios = await prisma.horario.findMany({
  where: { sucursal: "QUERETARO", nivel: "A", activo: true },
  include: { reservaciones: true },
  orderBy: { fechaHora: "asc" },
  skip: (pagina - 1) * tamano,
  take: tamano,
});

// ❌ INCORRECTO — traer todo sin filtrar
const horarios = await prisma.horario.findMany();
```

---

## 5. Datos Sensibles

```
❌ Passwords en texto plano → usar bcrypt hash
❌ Nunca loguear passwords ni tokens
✅ passwordHash se guarda, NUNCA el password original
```

---

## 6. Checklist

```
□ Los modelos tienen nombres PascalCase singular
□ Los campos tienen nombres camelCase
□ Toda tabla tiene id, createdAt, updatedAt, activo
□ Las relaciones tienen FK con índice
□ La migración tiene nombre descriptivo
□ No hay datos sensibles sin protección
□ Las consultas grandes tienen paginación
```
