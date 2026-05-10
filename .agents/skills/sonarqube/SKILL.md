---
name: skill_sonarqube
description: Define cómo usar SonarQube para analizar la calidad del código TypeScript/React del proyecto William English.
---

# Skill: SonarQube — Análisis de Calidad

## Propósito

SonarQube analiza el código y reporta bugs, vulnerabilidades, code smells
y deuda técnica. Valida si el código está bien escrito.

---

## 1. Flujo de análisis

```
Antigravity genera código
        ↓
npm run build (compila Next.js)
        ↓
npx vitest run --coverage (tests con cobertura)
        ↓
sonar-scanner analiza todo
        ↓
Resultados en http://localhost:9000
```

---

## 2. Configuración

```properties
# sonar-project.properties
sonar.projectKey=william-english
sonar.projectName=William English
sonar.sources=app,lib,components,features
sonar.tests=tests
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.exclusions=node_modules/**,.next/**
```

---

## 3. Quality Gate

```
El proyecto PASA si:
✅ Cobertura >= 80%
✅ Bugs = 0
✅ Vulnerabilidades = 0
✅ Código duplicado < 3%
✅ Issues BLOCKER = 0
✅ Issues CRITICAL = 0
```

---

## 4. Severidades

```
BLOCKER/CRITICAL → corregir inmediatamente
MAJOR            → corregir en la misma sesión
MINOR            → corregir si hay tiempo
INFO             → opcional
```

---

## 5. Docker

```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:community
```

---

## 6. MCP de SonarQube

Si el MCP está conectado, Antigravity puede usar directamente:
- `get_quality_gate(projectKey)` → ¿pasa o falla?
- `list_issues(projectKey)` → lista de problemas
- `sonarqube_get_project_metrics(projectKey)` → métricas
