---
name: react_frontend
description: Buenas prácticas para el frontend React dentro de Next.js App Router. Estado global con Zustand, llamadas API con TanStack Query, componentes UI con shadcn/ui.
---

# Skill: Frontend React (Next.js App Router)

## Propósito

Este documento define cómo escribir y estructurar el código frontend
dentro de Next.js. Aplican las mismas reglas de React pero adaptadas
al App Router de Next.js.

---

## 1. Estructura de Directorios

```
app/
├── (public)/                ← páginas públicas (landing SEO)
├── portal/                  ← app protegida
│   ├── admin/               ← vistas admin
│   ├── maestro/             ← vistas maestro
│   └── alumno/              ← vistas alumno

components/
├── ui/                      ← shadcn/ui
└── shared/                  ← compartidos (CalendarioSemanal, etc.)

features/                    ← lógica por funcionalidad
├── horarios/
│   ├── components/          ← CalendarioHorarios.tsx
│   ├── hooks/               ← useHorarios.ts
│   └── api/                 ← horarios.api.ts

hooks/                       ← hooks globales (useAuth, etc.)
store/                       ← Zustand stores
types/                       ← tipos compartidos
```

---

## 2. Convenciones de Nombres

```
Componentes:         PascalCase         → CalendarioSemanal.tsx
Hooks:               camelCase con use   → useHorarios.ts
Stores Zustand:      camelCase con Store → calendarStore.ts
Archivos API:        camelCase con .api  → horarios.api.ts
Tipos:               camelCase con .types → horario.types.ts
```

---

## 3. Reglas de Componentes

### Siempre TypeScript, nunca any

```tsx
// ✅ CORRECTO
interface CalendarioProps {
  clases: Clase[];
  onReagendar: (claseId: string) => void;
  isLoading?: boolean;
}

// ❌ INCORRECTO
function Calendario({ clases, onReagendar }: any) {}
```

### Máximo 150 líneas por componente

### Un componente, una responsabilidad

### Error Boundaries en componentes críticos

```tsx
<ErrorBoundary fallback={<ErrorCalendario />}>
  <CalendarioSemanal alumnoId={id} />
</ErrorBoundary>
```

---

## 4. Fetching con TanStack Query

```tsx
// ✅ CORRECTO
function useHorariosDisponibles(sucursal: string) {
  return useQuery({
    queryKey: ["horarios", sucursal],
    queryFn: () => horariosApi.getDisponibles(sucursal),
    staleTime: 2 * 60 * 1000,
  });
}

// ❌ INCORRECTO — fetch manual con useEffect
```

### Las llamadas al API van en archivos separados

```tsx
// features/horarios/api/horarios.api.ts
export const horariosApi = {
  getDisponibles: (sucursal: string) =>
    fetch(`/api/horarios?sucursal=${sucursal}`).then(r => r.json()),
  reagendar: (data: ReagendarInput) =>
    fetch("/api/reagendamiento", { method: "POST", body: JSON.stringify(data) }).then(r => r.json()),
};
```

---

## 5. Estado Global con Zustand

Solo lo que múltiples componentes necesitan:

```tsx
// store/calendarStore.ts
interface CalendarStore {
  semanaActual: Date;
  setSemana: (fecha: Date) => void;
  claseSeleccionada: string | null;
  seleccionarClase: (id: string | null) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  semanaActual: new Date(),
  setSemana: (fecha) => set({ semanaActual: fecha }),
  claseSeleccionada: null,
  seleccionarClase: (id) => set({ claseSeleccionada: id }),
}));
```

---

## 6. Variables de Entorno

```
✅ Variables públicas (frontend): NEXT_PUBLIC_*
✅ Variables privadas (solo backend/API Routes): sin prefijo

# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000    ← visible en frontend
DATABASE_URL=postgresql://...                ← solo backend
```

---

## 7. Checklist

```
□ No hay errores de TypeScript
□ No hay uso de any
□ Los componentes tienen Props tipadas
□ Las llamadas API están en archivos .api.ts
□ Los hooks personalizados están en archivos use*.ts
□ Estado global solo tiene lo que múltiples componentes usan
□ Los estados de loading y error están manejados
□ Los componentes tienen menos de 150 líneas
□ Mobile-first: diseñado primero para celular
```
