---
name: skill_testing
description: Convenciones de testing para el proyecto William English con Next.js. Vitest para unit/integration, Playwright para E2E. Cómo testear API Routes, componentes y hooks.
---

# Skill: Testing — Next.js (Vitest + Playwright)

## Propósito

Define cómo escribir tests. Un buen test valida que el código funciona
y documenta cómo debe comportarse el sistema.

---

## 1. Reglas Generales

```
✅ Todo código nuevo debe tener tests
✅ Cobertura mínima aceptable: 80%
✅ Un test prueba UNA sola cosa
✅ Patrón: Arrange → Act → Assert
❌ NUNCA modificar un test para que pase
❌ NUNCA hacer tests que dependen de datos externos
```

---

## 2. Qué SIEMPRE debe tener test

```
✅ Todos los Services (lib/services/)
✅ Todas las API Routes (al menos happy path + error)
✅ Todos los hooks personalizados
✅ Componentes con lógica condicional
✅ Los validators de Zod
✅ El flujo de reagendamiento (E2E)
```

---

## 3. Naming

```
Patrón: [Componente]_[Escenario]_[Resultado]

Ejemplos:
reagendamientoService_horarioDisponible_reagendaExitoso
reagendamientoService_horarioOcupado_lanzaError
CalendarioSemanal_cuandoCargando_muestraSkeleton
useHorarios_cuandoAPIFalla_retornaError
```

---

## 4. Tests de Services

```typescript
import { describe, it, expect, vi } from "vitest";
import { horarioService } from "@/lib/services/horarioService";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    horario: {
      findMany: vi.fn().mockResolvedValue([
        { id: "1", tipoClase: "PERSONAL", nivel: "A" }
      ]),
    },
  },
}));

describe("horarioService", () => {
  it("listarDisponibles_conFiltros_retornaHorarios", async () => {
    const result = await horarioService.listarDisponibles({ sucursal: "QUERETARO" });
    expect(result).toHaveLength(1);
    expect(result[0].tipoClase).toBe("PERSONAL");
  });
});
```

---

## 5. Tests de Componentes

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CalendarioSemanal } from "./CalendarioSemanal";

describe("CalendarioSemanal", () => {
  it("muestra skeleton cuando está cargando", () => {
    render(<CalendarioSemanal clases={[]} isLoading={true} />);
    expect(screen.getByTestId("skeleton-calendario")).toBeInTheDocument();
  });

  it("muestra las clases cuando hay datos", () => {
    const clases = [{ id: "1", tipo: "PERSONAL", fechaHora: "2026-05-14T16:00:00" }];
    render(<CalendarioSemanal clases={clases} isLoading={false} />);
    expect(screen.getByText("Clase Personal")).toBeInTheDocument();
  });
});
```

---

## 6. Tests E2E con Playwright

```typescript
import { test, expect } from "@playwright/test";

test.describe("Reagendamiento", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('[data-testid="email"]', "alumno@test.com");
    await page.fill('[data-testid="password"]', "password123");
    await page.click('[data-testid="login-btn"]');
    await expect(page).toHaveURL("/portal/alumno/mis-clases");
  });

  test("alumno puede reagendar una clase", async ({ page }) => {
    await page.click('[data-testid="btn-reagendar"]');
    await expect(page.locator('[data-testid="horarios-disponibles"]')).toBeVisible();
    await page.click('[data-testid="horario-opcion-1"]');
    await expect(page.locator("text=Clase reagendada")).toBeVisible();
  });
});
```

### Reglas Playwright

```
✅ Usar data-testid para seleccionar elementos
✅ Un test por flujo de usuario
❌ NUNCA usar selectores CSS frágiles
❌ NUNCA hardcodear delays (waitForTimeout)
```

---

## 7. Comandos

```bash
npx vitest run                  # todos los tests
npx vitest run --coverage       # con cobertura
npx playwright test             # E2E
```

---

## 8. Checklist

```
□ Services tienen tests unitarios
□ API Routes tienen tests de integración
□ Componentes con lógica tienen tests
□ El flujo de reagendamiento tiene test E2E
□ Los tests usan data-testid
□ La cobertura es >= 80%
□ No hay waitForTimeout en Playwright
```
