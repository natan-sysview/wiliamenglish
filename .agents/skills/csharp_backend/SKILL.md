---
name: csharp_backend
description: Reglas estrictas de Clean Architecture para el backend C#. Úsalo para crear entidades, controladores, repositorios y validaciones.
---

# Skill: Backend C# - Clean Architecture

## Propósito

Este documento define cómo Antigravity debe escribir, estructurar y validar
todo el código del backend C#. Seguirlo garantiza un proyecto limpio,
mantenible y preparado para crecer.

---

## 1. Estructura de Directorios

> Esta estructura es una guía de referencia, no una estructura fija.
> Las carpetas crecen según las funcionalidades del proyecto.
> Lo importante es respetar las 4 capas y sus reglas de dependencia.

### La estructura base siempre es esta

```
src/
├── Domain/          ← corazón del negocio, sin dependencias externas
├── Application/     ← casos de uso, orquesta el Domain
├── Infrastructure/  ← implementaciones técnicas (DB, APIs externas, IA)
└── API/             ← entrada HTTP al sistema

tests/
├── UnitTests/
├── IntegrationTests/
├── E2ETests/
└── ArchitectureTests/
```

### Ejemplo con una funcionalidad real (Minería de Datos)

```
src/
├── Domain/
│   ├── Entities/            → Programa.cs, Diagrama.cs
│   ├── Interfaces/          → IProgramaRepository.cs
│   └── Exceptions/          → ProgramaNoEncontradoException.cs
│
├── Application/
│   ├── Queries/             → GetProgramasQuery.cs
│   ├── Commands/            → AnalizarProgramaCommand.cs
│   └── DTOs/                → ProgramaDto.cs
│
├── Infrastructure/
│   ├── Persistence/         → ProgramaRepository.cs, AppDbContext.cs
│   └── Analyzers/           → CobolAnalyzer.cs, JclAnalyzer.cs
│
└── API/
    ├── Controllers/         → ProgramasController.cs
    └── Middleware/          → ExceptionMiddleware.cs

tests/
├── UnitTests/               → ProgramaTests.cs
├── IntegrationTests/        → ProgramaRepositoryTests.cs
├── E2ETests/                → ProgramasApiTests.cs
└── ArchitectureTests/       → CleanArchitectureTests.cs
```

### Cómo crece cuando se agregan más funcionalidades

```
Agregar análisis de Java:
→ Domain/Entities/           → sin cambios
→ Infrastructure/Analyzers/  → JavaAnalyzer.cs  ← solo aquí

Agregar IA:
→ Infrastructure/AI/         → OpenAIClient.cs  ← solo aquí

Agregar nueva funcionalidad completa:
→ cada capa agrega sus archivos correspondientes
→ las demás funcionalidades no se tocan
```

---

## 2. Reglas de Dependencias (LAS MÁS IMPORTANTES)

```
Domain        → no depende de NADIE
Application   → solo depende de Domain
Infrastructure → depende de Domain y Application
API           → depende de Application solamente
```

```
NUNCA hacer esto:
❌ Domain referencia Entity Framework
❌ Domain referencia Infrastructure
❌ Controller llama directamente a Repository
❌ Controller llama directamente a DbContext
❌ Application referencia Entity Framework directamente
```

---

## 3. Convenciones de Nombres

### Archivos y Clases

```
Entidades:          Programa.cs, Migracion.cs, Diagrama.cs
Interfaces:         IProgramaRepository.cs, IDiagramaService.cs
Repositorios:       ProgramaRepository.cs, MigracionRepository.cs
Commands:           CrearProgramaCommand.cs, IniciarMigracionCommand.cs
Queries:            GetProgramasQuery.cs, GetDiagramaQuery.cs
DTOs:               ProgramaDto.cs, CrearProgramaRequest.cs
Controllers:        ProgramasController.cs, MigracionesController.cs
Excepciones:        ProgramaNoEncontradoException.cs
```

### Métodos

```csharp
// Repositorios siempre async
Task<Programa> GetByIdAsync(int id);
Task<IEnumerable<Programa>> GetAllAsync();
Task<Programa> CreateAsync(Programa programa);
Task UpdateAsync(Programa programa);
Task DeleteAsync(int id);

// Servicios describen la acción
Task<DiagramaDto> GenerarDiagramaAsync(int programaId);
Task<ResultadoAnalisis> AnalizarComplejidadAsync(int programaId);
```

### Rutas del API

```
GET    /api/programas              → lista todos
GET    /api/programas/{id}         → obtiene uno
POST   /api/programas              → crea uno
PUT    /api/programas/{id}         → actualiza uno
DELETE /api/programas/{id}         → elimina uno
GET    /api/programas/{id}/diagrama → diagrama de ese programa
POST   /api/migraciones/iniciar    → inicia una migración
```

---

## 4. Cómo debe verse cada capa

### Domain/Entities (sin dependencias externas)

```csharp
// ✅ CORRECTO - clase pura, sin Entity Framework, sin nada externo
public class Programa
{
    public int Id { get; private set; }
    public string Nombre { get; private set; }
    public Lenguaje Lenguaje { get; private set; }
    public int LineasDeCodigo { get; private set; }

    public Programa(string nombre, Lenguaje lenguaje)
    {
        Nombre = nombre ?? throw new ArgumentNullException(nameof(nombre));
        Lenguaje = lenguaje;
    }
}
```

### Domain/Interfaces

```csharp
// ✅ CORRECTO - contrato puro, sin implementación
public interface IProgramaRepository
{
    Task<Programa> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Programa>> GetAllAsync(CancellationToken ct = default);
    Task<Programa> CreateAsync(Programa programa, CancellationToken ct = default);
}
```

### Application/Queries

```csharp
// ✅ CORRECTO - orquesta, no implementa detalles
public class GetProgramasQueryHandler
{
    private readonly IProgramaRepository _repository;

    public GetProgramasQueryHandler(IProgramaRepository repository)
        => _repository = repository;

    public async Task<IEnumerable<ProgramaDto>> HandleAsync(CancellationToken ct)
    {
        var programas = await _repository.GetAllAsync(ct);
        return programas.Select(p => new ProgramaDto(p.Id, p.Nombre, p.Lenguaje));
    }
}
```

### Infrastructure/Repositories

```csharp
// ✅ CORRECTO - implementa la interfaz del Domain
public class ProgramaRepository : IProgramaRepository
{
    private readonly AppDbContext _context;

    public ProgramaRepository(AppDbContext context)
        => _context = context;

    public async Task<Programa> GetByIdAsync(int id, CancellationToken ct = default)
        => await _context.Programas.FindAsync(new object[] { id }, ct)
           ?? throw new ProgramaNoEncontradoException(id);
}
```

### API/Controllers

```csharp
// ✅ CORRECTO - recibe HTTP, delega a Application, regresa respuesta
[ApiController]
[Route("api/[controller]")]
public class ProgramasController : ControllerBase
{
    private readonly GetProgramasQueryHandler _handler;

    public ProgramasController(GetProgramasQueryHandler handler)
        => _handler = handler;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var programas = await _handler.HandleAsync(ct);
        return Ok(programas);
    }
}
```

---

## 5. Pasos que Antigravity debe seguir al generar código nuevo

```
Paso 1: Compilar y corregir warnings
──────────────────────────────────────
dotnet build
→ corregir TODOS los warnings antes de continuar
→ no dejar warnings sin resolver

Paso 2: Formatear
──────────────────────────────────────
dotnet csharpier .
→ automático, sin revisión manual

Paso 3: Correr tests de arquitectura
──────────────────────────────────────
dotnet test --filter "Category=Architecture"
→ si algún test de NetArchTest falla
→ corregir la violación de arquitectura
→ NO modificar el test para que pase

Paso 4: Correr todos los tests
──────────────────────────────────────
dotnet test --collect:"XPlat Code Coverage"
→ si hay tests fallando → corregir el código
→ cobertura mínima aceptable: 80%

Paso 5: Análisis SonarQube
──────────────────────────────────────
dotnet sonarscanner begin /k:"mi-proyecto" /d:sonar.host.url="http://localhost:9000"
dotnet build
dotnet test --collect:"XPlat Code Coverage"
dotnet sonarscanner end
→ revisar issues críticos y de seguridad
→ corregirlos antes de terminar
```

---

## 6. Checklist antes de dar código por terminado

```
□ El código compila sin warnings
□ Las clases están en la carpeta correcta según su capa
□ Domain no tiene referencias externas
□ Controllers no llaman Repositories directamente
□ Todos los métodos de repositorio son async
□ Los DTOs son los que salen/entran al API, no las Entidades
□ Los tests de arquitectura pasan (NetArchTest)
□ La cobertura de tests es >= 80%
□ SonarQube no reporta issues críticos
□ No hay strings de conexión hardcodeados
□ No hay passwords en el código
□ Los endpoints tienen autenticación JWT
```

---

## 7. Cómo agregar un nuevo lenguaje legacy (COBOL, JCL, Java, etc.)

```
1. Agregar la entidad en Domain/Entities/
2. Agregar interfaz del analizador en Domain/Interfaces/
3. Implementar el analizador en Infrastructure/
   (un módulo separado por lenguaje)
4. Agregar el Command/Query en Application/
5. Agregar el endpoint en API/Controllers/
6. Agregar tests de arquitectura para el nuevo módulo
```

El Domain y el API no cambian. Solo se agrega Infrastructure nueva.

---

## 8. Cómo agregar IA al proyecto

```
Toda la integración de IA vive en:
Infrastructure/AI/

Estructura:
Infrastructure/
└── AI/
    ├── Interfaces/           → IAIAnalyzerService (en Domain)
    ├── OpenAIClient.cs       → implementación OpenAI
    ├── AnthropicClient.cs    → implementación Anthropic
    └── AIServiceFactory.cs   → selecciona cuál usar según config

El Domain solo conoce IAIAnalyzerService
No sabe si es OpenAI, Anthropic u otro
```

---

## 9. Inyección de Dependencias

Todo se registra en `Program.cs`. Cada capa registra sus propias dependencias.

```csharp
// Program.cs

// ✅ Application - registrar handlers
builder.Services.AddScoped<GetProgramasQueryHandler>();
builder.Services.AddScoped<AnalizarProgramaCommandHandler>();

// ✅ Infrastructure - registrar repositorios
builder.Services.AddScoped<IProgramaRepository, ProgramaRepository>();
builder.Services.AddScoped<IDiagramaRepository, DiagramaRepository>();

// ✅ Infrastructure - registrar DB según configuración
var dbProvider = builder.Configuration["DatabaseProvider"];

if (dbProvider == "Postgres")
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));
}
else if (dbProvider == "Oracle")
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseOracle(builder.Configuration.GetConnectionString("Oracle")));
}

// ✅ Autenticación JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]))
        };
    });
```

### Reglas de inyección de dependencias

```
❌ NUNCA usar new() para instanciar servicios o repositorios
❌ NUNCA instanciar DbContext directamente en un Controller
✅ SIEMPRE inyectar por constructor
✅ SIEMPRE registrar interfaces, no implementaciones concretas
   builder.Services.AddScoped<IRepo, RepoImpl>()  ← correcto
   builder.Services.AddScoped<RepoImpl>()          ← incorrecto
```

---

## 10. Respuestas HTTP Estándar

Antigravity siempre debe retornar el código HTTP correcto según la situación.

```csharp
// ✅ GET exitoso → 200 OK
return Ok(programas);

// ✅ POST exitoso (creó algo nuevo) → 201 Created
return CreatedAtAction(nameof(GetById), new { id = programa.Id }, programa);

// ✅ PUT exitoso (sin contenido que retornar) → 204 No Content
return NoContent();

// ✅ DELETE exitoso → 204 No Content
return NoContent();

// ✅ No encontrado → 404 Not Found
return NotFound(new { mensaje = "Programa no encontrado" });

// ✅ Datos inválidos → 400 Bad Request
return BadRequest(new { mensaje = "El nombre es requerido" });

// ✅ Sin autenticación → 401 Unauthorized
// (lo maneja automáticamente el middleware JWT)

// ✅ Sin permisos → 403 Forbidden
// (lo maneja automáticamente con [Authorize(Roles = "Admin")])
```

### Tabla de referencia rápida

```
Situación                          Código    Método
────────────────────────────────────────────────────────
Consulta exitosa                   200       Ok()
Recurso creado                     201       CreatedAtAction()
Actualización sin respuesta        204       NoContent()
Eliminación exitosa                204       NoContent()
Recurso no encontrado              404       NotFound()
Datos inválidos del cliente        400       BadRequest()
Sin token JWT                      401       automático
Sin permisos suficientes           403       automático
Error interno del servidor         500       automático (middleware)
```

---

## 11. Configuración y Variables de Entorno

### appsettings.json (valores por defecto, sin secrets)

```json
{
  "DatabaseProvider": "Postgres",
  "ConnectionStrings": {
    "Postgres": "",
    "Oracle": ""
  },
  "Jwt": {
    "Secret": "",
    "Issuer": "mi-app",
    "Audience": "mi-app-users",
    "ExpirationHours": 8
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### appsettings.Development.json (solo desarrollo local)

```json
{
  "DatabaseProvider": "Postgres",
  "ConnectionStrings": {
    "Postgres": "Host=localhost;Database=midb;Username=user;Password=pass",
    "Oracle": "User Id=user;Password=pass;Data Source=localhost:1521/db"
  },
  "Jwt": {
    "Secret": "clave-local-desarrollo-no-usar-en-produccion"
  }
}
```

### Reglas de configuración

```
❌ NUNCA hardcodear connection strings en el código
❌ NUNCA hardcodear el JWT Secret en el código
❌ NUNCA subir appsettings.Development.json al repositorio
✅ SIEMPRE leer con builder.Configuration["clave"]
✅ SIEMPRE agregar appsettings.Development.json al .gitignore
✅ En producción usar variables de entorno del servidor
```

---

## 12. Manejo de Errores por Capa

### Domain → lanza excepciones de negocio

```csharp
// Domain/Exceptions/ProgramaNoEncontradoException.cs
public class ProgramaNoEncontradoException : Exception
{
    public ProgramaNoEncontradoException(int id)
        : base($"El programa con ID {id} no existe") { }
}

// Domain/Exceptions/LenguajeNoSoportadoException.cs
public class LenguajeNoSoportadoException : Exception
{
    public LenguajeNoSoportadoException(string lenguaje)
        : base($"El lenguaje {lenguaje} no está soportado") { }
}
```

### Infrastructure → captura errores técnicos

```csharp
// Si la DB falla, deja que el middleware global lo capture
// No atrapar excepciones que no puedes manejar
public async Task<Programa> GetByIdAsync(int id, CancellationToken ct = default)
{
    return await _context.Programas.FindAsync(new object[] { id }, ct)
        ?? throw new ProgramaNoEncontradoException(id);  // excepción de negocio
}
```

### API → Middleware global captura todo

```csharp
// API/Middleware/ExceptionMiddleware.cs
public class ExceptionMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ProgramaNoEncontradoException ex)
        {
            // excepción de negocio → 404
            context.Response.StatusCode = 404;
            await context.Response.WriteAsJsonAsync(new { mensaje = ex.Message });
            Log.Warning(ex, "Recurso no encontrado");
        }
        catch (LenguajeNoSoportadoException ex)
        {
            // excepción de negocio → 400
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new { mensaje = ex.Message });
            Log.Warning(ex, "Solicitud inválida");
        }
        catch (Exception ex)
        {
            // cualquier otro error → 500, sin exponer detalles al cliente
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new { mensaje = "Error interno del servidor" });
            Log.Error(ex, "Error no controlado");
        }
    }
}
```

### Reglas de manejo de errores

```
✅ Domain lanza excepciones con nombres descriptivos
✅ El Middleware global las captura y convierte a HTTP
✅ Serilog loguea todos los errores con contexto
✅ El cliente NUNCA ve stack traces ni mensajes técnicos
❌ NUNCA retornar el mensaje de excepción técnica al frontend
❌ NUNCA atrapar excepciones que no puedes manejar correctamente
❌ NUNCA usar catch(Exception ex) {} vacío (silencia errores)
```
