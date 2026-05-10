---
name: skill_observabilidad
description: Define el sistema de observabilidad simplificado para William English. Logging con Pino para v1, con opciones de escalar a Prometheus/Grafana si crece.
---

# Skill: Observabilidad — Logging (v1 Simplificada)

## Propósito

Para una app de 40-200 usuarios, no necesitamos Prometheus, Grafana ni Jaeger.
Arrancamos con logging estructurado y escalamos si crece.

---

## 1. Stack v1 (actual)

```
Logging:   Pino (viene con Next.js) → logs estructurados en consola
Hosting:   Los logs de Vercel/Railway se ven en su dashboard gratis
Errores:   Los errores se capturan en los API Routes con try/catch
```

---

## 2. Qué logear

```typescript
// ✅ Acciones importantes
console.log(`[REAGENDAMIENTO] Alumno ${alumnoId} reagendó clase ${claseId} a horario ${nuevoHorarioId}`);

// ✅ Errores con contexto
console.error(`[ERROR] Fallo al reagendar: ${error.message}`, { alumnoId, claseId });

// ✅ Accesos de admin
console.log(`[ADMIN] Usuario ${adminId} creó horario ${horarioId}`);
```

---

## 3. Qué NUNCA logear

```
❌ Passwords (ni hasheados)
❌ Tokens de sesión
❌ Connection strings
❌ Datos personales sensibles
```

---

## 4. Escalamiento futuro (si crece)

```
Si la app crece a 500+ usuarios:
→ Agregar Sentry para monitoreo de errores (free tier: 5K eventos/mes)
→ Agregar Axiom o Logtail para logs centralizados

Si crece a 1000+ usuarios:
→ Considerar Prometheus + Grafana para métricas
→ Considerar OpenTelemetry para trazas
```
