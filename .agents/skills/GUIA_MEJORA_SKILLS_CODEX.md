# Guia para mejorar las skills del proyecto SysMiningView

## Contexto

Este proyecto ya cuenta con varias skills dentro de `.agents/skills/`, creadas originalmente para trabajar con Antigravity/Gemini. La estructura base usada es compatible con Codex:

```text
.agents/
  skills/
    nombre_skill/
      SKILL.md
```

Codex reconoce esta estructura. No es necesario cambiar el modelo general de directorios para que las skills funcionen.

El punto a mejorar no es la ubicacion, sino el contenido interno de cada skill. Actualmente varias skills concentran demasiada informacion dentro de un unico `SKILL.md`. Eso funciona, pero no es la forma mas eficiente ni mas mantenible de usar skills en Codex.

## Problema detectado

Las skills actuales tienden a comportarse como documentos largos de reglas completas. Por ejemplo, una skill puede mezclar en el mismo `SKILL.md`:

- Reglas obligatorias.
- Explicaciones conceptuales.
- Ejemplos largos.
- Contratos de API.
- Estructuras de carpetas.
- Patrones de implementacion.
- Comandos de validacion.
- Casos especiales.

Esto produce varios problemas:

1. **Consumo innecesario de contexto**

   Cuando Codex decide usar una skill, carga el cuerpo completo de `SKILL.md`. Si el archivo contiene detalles que no son necesarios para la tarea actual, esos detalles ocupan contexto sin aportar valor inmediato.

2. **Menor precision al ejecutar tareas**

   Un archivo demasiado grande mezcla instrucciones obligatorias con material de referencia. El agente puede tener mas dificil distinguir que debe cumplir siempre y que solo aplica en ciertos casos.

3. **Mantenimiento mas dificil**

   Cuando todo vive en `SKILL.md`, cualquier ajuste pequeno obliga a editar un documento largo. Con el tiempo, las reglas, ejemplos y patrones pueden duplicarse o contradecirse.

4. **Poca reutilizacion de recursos**

   Algunas tareas repetitivas, como validar arquitectura, crear esqueletos de feature o revisar convenciones, podrian automatizarse con scripts. Si solo estan descritas en texto, cada agente debe reconstruir el procedimiento cada vez.

5. **Falta de carga progresiva**

   Codex esta disenado para usar "progressive disclosure": primero ve nombre, descripcion y ruta de la skill; si la activa, lee `SKILL.md`; y solo despues deberia cargar referencias, scripts o assets cuando hagan falta. Si todo esta en `SKILL.md`, se pierde esta ventaja.

## Objetivo de la mejora

Convertir cada skill grande en una skill mas modular:

- `SKILL.md` debe ser una guia operativa corta.
- `references/` debe contener documentacion detallada que solo se lea cuando aplique.
- `scripts/` debe contener automatizaciones deterministicas.
- `assets/` debe contener plantillas o recursos reutilizables.
- `agents/openai.yaml` puede agregar metadata para Codex, como nombre visible, descripcion corta y politica de invocacion.

La meta no es crear carpetas por crear. La meta es separar responsabilidades.

## Estructura recomendada

Para cada skill relevante:

```text
.agents/
  skills/
    nombre_skill/
      SKILL.md
      references/
        archivo-de-referencia.md
      scripts/
        script-util.sh
      assets/
        plantilla-o-recurso/
      agents/
        openai.yaml
```

No todas las skills necesitan todas las carpetas. Usar solo las que aporten valor real.

## Regla practica de separacion

### Mantener en `SKILL.md`

Dejar en `SKILL.md` solamente lo que el agente necesita siempre que se active la skill:

- Proposito de la skill.
- Reglas obligatorias.
- Checklist operativo.
- Flujo de trabajo recomendado.
- Comandos minimos de validacion.
- Mapa de referencias: que archivo leer y cuando.
- Relacion con otras skills del proyecto.

Ejemplo:

```md
## Reglas obligatorias

- Respetar Clean Architecture.
- Domain no debe depender de ninguna otra capa.
- Application solo puede depender de Domain.
- Infrastructure implementa contratos definidos en Domain/Application.
- API no debe llamar directamente a DbContext ni repositorios.

## Referencias

- Para patrones CQRS, leer `references/cqrs-patterns.md`.
- Para errores y excepciones, leer `references/error-handling.md`.
- Para EF Core, leer `references/ef-core-guidelines.md`.
```

### Mover a `references/`

Mover a `references/` la informacion extensa o condicional:

- Ejemplos largos.
- Contratos de API completos.
- Guias detalladas por patron.
- Tablas de convenciones.
- Variantes por tecnologia.
- Casos especiales.
- Documentacion de dominio.

Ejemplo:

```text
csharp_backend/
  references/
    clean-architecture-rules.md
    cqrs-patterns.md
    error-handling.md
    validation-patterns.md
    ef-core-guidelines.md
    api-controller-patterns.md
```

### Mover a `scripts/`

Mover a `scripts/` lo que deba ejecutarse siempre igual o con parametros claros:

- Validaciones de arquitectura.
- Checks de formato.
- Scaffolding de features.
- Busquedas mecanicas de violaciones.
- Reportes repetitivos.

Ejemplo:

```text
csharp_backend/
  scripts/
    run-backend-checks.sh
    validate-clean-architecture.sh
    create-feature-skeleton.sh
```

Un script `run-backend-checks.sh` podria ejecutar:

```bash
dotnet build
dotnet csharpier --check .
dotnet test
dotnet test --filter "Category=Architecture"
```

### Mover a `assets/`

Mover a `assets/` archivos que sean recursos para copiar, adaptar o usar como plantilla:

- Plantillas de feature.
- Plantillas de controller.
- Plantillas de DTO.
- Plantillas de test.
- Archivos base de configuracion.
- Assets visuales o documentos base.

Ejemplo:

```text
csharp_backend/
  assets/
    feature-template/
      Domain/
      Application/
      Infrastructure/
      API/
      Tests/
    controller-template.cs
    query-handler-template.cs
    repository-template.cs
```

### Usar `agents/openai.yaml`

Este archivo es opcional. Sirve para metadata de la skill en Codex/OpenAI.

Ejemplo:

```yaml
interface:
  display_name: "C# Backend"
  short_description: "Clean Architecture para backend ASP.NET Core"
  default_prompt: "Usa esta skill para implementar o revisar backend C# respetando Clean Architecture, testing, seguridad y convenciones del proyecto."

policy:
  allow_implicit_invocation: true
```

Si una skill debe activarse solo cuando el usuario la mencione explicitamente:

```yaml
policy:
  allow_implicit_invocation: false
```

## Propuesta concreta para las skills actuales

### `csharp_backend`

Propuesta:

```text
csharp_backend/
  SKILL.md
  references/
    clean-architecture.md
    dependency-rules.md
    cqrs-patterns.md
    api-controller-patterns.md
    error-handling.md
    validation-patterns.md
    repository-patterns.md
  scripts/
    run-backend-checks.sh
    validate-clean-architecture.sh
  assets/
    feature-template/
    controller-template.cs
    query-handler-template.cs
    command-handler-template.cs
    repository-template.cs
  agents/
    openai.yaml
```

`SKILL.md` deberia quedarse con:

- Reglas esenciales de capas.
- Checklist para crear o modificar backend.
- Comandos obligatorios.
- Mapa hacia referencias.

Mover a referencias:

- Ejemplos largos de entidades, repositorios, controllers y handlers.
- Explicacion detallada de cada capa.
- Patrones de errores, validaciones y DTOs.

### `skill_architecture` o `arquitecture`

Propuesta:

```text
arquitecture/
  SKILL.md
  references/
    frontend-backend-communication.md
    api-url-conventions.md
    api-versioning.md
    response-format.md
    pagination.md
    environments.md
    deployment.md
  scripts/
    validate-api-routes.sh
  agents/
    openai.yaml
```

`SKILL.md` deberia quedarse con:

- Regla base de comunicacion frontend/backend.
- Uso obligatorio de `/api/v1`.
- Convencion de recursos en plural y minusculas.
- Respuesta estandar.
- Cuándo leer cada referencia.

Mover a referencias:

- Ejemplos completos de JSON.
- Configuracion detallada de versionado.
- Detalles por ambiente.
- Deployment.

### `react_frontend`

Propuesta:

```text
react_frontend/
  SKILL.md
  references/
    component-patterns.md
    tanstack-query.md
    zustand.md
    forms-and-validation.md
    api-client.md
    routing.md
    error-states.md
  scripts/
    run-frontend-checks.sh
  assets/
    component-template/
    page-template/
    hook-template.ts
  agents/
    openai.yaml
```

Mover a referencias:

- Ejemplos largos de hooks.
- Patrones de formularios.
- Manejo de errores.
- Patrones de API client.

### `database`

Propuesta:

```text
database/
  SKILL.md
  references/
    naming-conventions.md
    postgres-guidelines.md
    oracle-guidelines.md
    ef-core-mapping.md
    migrations.md
    indexing.md
  scripts/
    validate-migrations.sh
  agents/
    openai.yaml
```

### `design_system`

Propuesta:

```text
design_system/
  SKILL.md
  references/
    tokens.md
    colors.md
    typography.md
    spacing.md
    components.md
    loading-states.md
    responsive-rules.md
  assets/
    ui-examples/
    icon-set/
  agents/
    openai.yaml
```

### `documentar_legacy`

Propuesta:

```text
documentar_legacy/
  SKILL.md
  references/
    delphi-analysis-process.md
    documentation-template.md
    migration-readiness.md
    legacy-risk-checklist.md
  assets/
    legacy-analysis-template.md
  scripts/
    scan-delphi-units.sh
  agents/
    openai.yaml
```

Esta skill probablemente se beneficia mucho de `assets/`, porque puede tener plantillas para documentar funcionalidades legacy de Delphi antes de reescribirlas.

## Ejemplo de `SKILL.md` despues de modularizar

Ejemplo para `csharp_backend/SKILL.md`:

```md
---
name: csharp_backend
description: Reglas estrictas para implementar, modificar o revisar backend C# con ASP.NET Core y Clean Architecture. Usar cuando la tarea involucre entidades, casos de uso, controladores, repositorios, validaciones, errores, DTOs, EF Core o tests de backend.
---

# Backend C# Clean Architecture

## Reglas obligatorias

- Mantener separadas las capas Domain, Application, Infrastructure y API.
- Domain no debe depender de ninguna otra capa.
- Application solo puede depender de Domain.
- Infrastructure puede depender de Domain y Application.
- API debe delegar a Application; no debe llamar directamente a DbContext.
- Todo metodo IO-bound debe ser async y aceptar CancellationToken cuando aplique.

## Flujo obligatorio

1. Identificar la feature y las capas afectadas.
2. Crear o modificar contratos en Domain/Application antes de implementar Infrastructure.
3. Mantener controllers delgados.
4. Agregar validaciones y manejo de errores.
5. Agregar o actualizar tests.
6. Ejecutar validaciones.

## Referencias

- Para reglas de dependencias, leer `references/dependency-rules.md`.
- Para CQRS y handlers, leer `references/cqrs-patterns.md`.
- Para controllers, leer `references/api-controller-patterns.md`.
- Para repositorios y EF Core, leer `references/repository-patterns.md`.
- Para errores, leer `references/error-handling.md`.
- Para validaciones, leer `references/validation-patterns.md`.

## Scripts

- Usar `scripts/run-backend-checks.sh` para validacion completa de backend cuando exista.
- Usar `scripts/validate-clean-architecture.sh` para revisar violaciones mecanicas de arquitectura cuando exista.
```

## Recomendaciones para el agente que refactorice

1. **No cambiar la intencion original de las skills**

   Las reglas actuales fueron escritas para guiar el proyecto. La refactorizacion debe reorganizar, no eliminar criterio importante.

2. **No crear todas las carpetas si no hacen falta**

   Una skill puede tener solo `SKILL.md` y `references/`. Otra puede necesitar scripts. Otra puede no necesitar assets.

3. **Evitar duplicacion**

   Si una regla vive en `SKILL.md`, no repetirla completa en `references/`. En referencias se puede ampliar, pero no duplicar sin necesidad.

4. **Escribir descripciones fuertes**

   La propiedad `description` del frontmatter es critica porque Codex la usa para decidir si activa la skill. Debe explicar que hace la skill y cuando debe usarse.

5. **Mantener `SKILL.md` como indice operativo**

   Debe ser posible leer `SKILL.md` y entender:

   - Que hace la skill.
   - Que reglas siempre aplican.
   - Que flujo seguir.
   - Que referencia abrir para cada tipo de tarea.

6. **Preferir scripts para lo repetitivo**

   Si el agente siempre debe correr la misma secuencia de comandos, conviene crear un script. Si la tarea requiere juicio, dejarla como instruccion.

7. **Validar despues de la refactorizacion**

   Despues de reorganizar, probar con prompts reales:

   - "Crea un endpoint nuevo en backend".
   - "Agrega una pantalla React que consuma el API".
   - "Documenta una funcionalidad legacy Delphi".
   - "Revisa si esta migracion viola reglas de base de datos".

## Plan sugerido de migracion

### Fase 1: Inventario

Listar todas las skills actuales y medir cuales son mas grandes o mas densas.

Prioridad inicial recomendada:

1. `csharp_backend`
2. `react_frontend`
3. `arquitecture`
4. `database`
5. `design_system`
6. `documentar_legacy`

### Fase 2: Crear estructura minima

Para cada skill prioritaria:

```text
SKILL.md
references/
agents/openai.yaml
```

Agregar `scripts/` y `assets/` solo si hay uso claro.

### Fase 3: Dividir contenido

Separar el contenido actual en:

- Reglas siempre obligatorias -> `SKILL.md`.
- Detalles largos -> `references/`.
- Plantillas -> `assets/`.
- Validaciones/scaffolding -> `scripts/`.

### Fase 4: Ajustar frontmatter

Actualizar `description` para que sea mas precisa y autoactivable.

Ejemplo malo:

```yaml
description: Reglas para backend.
```

Ejemplo mejor:

```yaml
description: Reglas estrictas para implementar, modificar o revisar backend C# con ASP.NET Core y Clean Architecture. Usar cuando la tarea involucre entidades, casos de uso, controladores, repositorios, validaciones, errores, DTOs, EF Core o tests de backend.
```

### Fase 5: Agregar metadata opcional

Crear `agents/openai.yaml` con:

```yaml
interface:
  display_name: "Nombre legible"
  short_description: "Resumen corto para UI"
  default_prompt: "Prompt base sugerido para usar esta skill."

policy:
  allow_implicit_invocation: true
```

### Fase 6: Probar con tareas reales

Probar que el agente:

- Active la skill correcta.
- Lea solo las referencias necesarias.
- No ignore reglas obligatorias.
- Use scripts cuando correspondan.
- No duplique patrones entre skills.

## Resultado esperado

Al finalizar, las skills deberian ser mas rapidas de usar, mas faciles de mantener y mas precisas para Codex.

El resultado ideal no es tener skills mas pequenas porque si, sino skills con mejor arquitectura interna:

- `SKILL.md` como guia breve.
- `references/` como conocimiento detallado.
- `scripts/` como automatizacion confiable.
- `assets/` como plantillas reutilizables.
- `agents/openai.yaml` como metadata opcional para mejorar la experiencia en Codex.

