---
name: skill_documentacion
description: Define qué documentación debe generarse y mantenerse en el proyecto William English. Cubre Swagger/OpenAPI, TSDoc, README y documentación funcional.
---

# Skill: Documentación del Proyecto

## Propósito

Define qué documentación existe, cuál genera Antigravity automáticamente
y cuál requiere intervención humana.

---

## 1. Documentación Automática (Antigravity la mantiene)

### TSDoc en TypeScript (obligatorio)

```typescript
// ✅ Todo componente
/**
 * Calendario semanal del alumno con sus clases programadas.
 * Permite seleccionar una clase para reagendarla.
 *
 * @param clases - Lista de clases del alumno esta semana
 * @param onReagendar - Callback cuando selecciona reagendar
 */
export function CalendarioSemanal({ clases, onReagendar }: CalendarioProps) {}

// ✅ Todo Service
/**
 * Reagenda una clase del alumno a un nuevo horario disponible.
 * Valida reglas de negocio configurables antes de procesar.
 *
 * @param alumnoId - ID del alumno
 * @param claseActualId - ID de la clase a reagendar
 * @param nuevoHorarioId - ID del horario destino
 * @throws ReagendamientoError si no cumple las reglas
 */
async reagendar(alumnoId: string, claseActualId: string, nuevoHorarioId: string) {}
```

---

## 2. README.md (estructura obligatoria)

```markdown
# William English Institute — App Web

Sistema de gestión de clases y reagendamiento para alumnos, maestros y admin.

## Requisitos previos

- Node.js 20+
- Docker Desktop (para PostgreSQL local)

## Levantar el proyecto

### 1. Base de datos
docker compose up -d

### 2. App
npm install
npx prisma migrate dev
npm run dev

## URLs
| Herramienta | URL |
| ----------- | --- |
| App | http://localhost:3000 |
| Prisma Studio | npx prisma studio |

## Correr tests
npm test                    # unit + integration
npx playwright test         # E2E
```

---

## 3. Reglas

```
✅ Todo código nuevo debe tener TSDoc
✅ Si se agrega funcionalidad → actualizar README
❌ NUNCA dejar funciones públicas sin documentar
❌ NUNCA documentar el CÓMO, documentar el QUÉ y POR QUÉ
```
