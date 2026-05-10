---
name: skill_design_system
description: Define el Sistema de Diseño y reglas UI/UX para William English Institute. Paleta azul/rojo/blanco de la marca, efectos glassmorphism, tipografía y comportamientos de carga.
---

# Skill: Design System & UI/UX — William English

## Propósito

Establece las normativas estéticas para todas las interfaces de la app.
Mobile-first, moderno, y alineado con los colores de la marca William English.

---

## 1. Paleta de Colores (Brand William English)

### Colores Primarios (de la marca)

```
Azul William:    #0033A0  (azul fuerte del logo — color principal)
Rojo William:    #CC0000  (rojo de los letreros del logo — acento/CTA)
Blanco:          #FFFFFF  (fondo principal)
```

### Modo Claro (default — la mayoría de usuarios)

```
Fondo principal:     bg-white / bg-slate-50
Fondo tarjetas:      bg-white
Texto títulos:       text-gray-900
Texto normal:        text-gray-700
Texto secundario:    text-gray-500
Bordes:              border-gray-200
Botón primario:      bg-[#0033A0] text-white hover:bg-[#002880]
Botón acción/CTA:    bg-[#CC0000] text-white hover:bg-[#AA0000]
Focus rings:         ring-[#0033A0]/30
```

### Modo Oscuro (opcional, fase futura)

```
Fondo principal:     bg-[#0f1117]
Fondo tarjetas:      bg-[#1c1e2b]
Texto:               text-gray-300 / text-white
Bordes:              border-white/10
Botón primario:      bg-[#3366CC] text-white
```

### Colores Funcionales

```
Éxito/Disponible:    text-emerald-600   bg-emerald-50
Advertencia:         text-amber-600     bg-amber-50
Error/Ocupado:       text-red-600       bg-red-50
Info:                text-blue-600      bg-blue-50
```

---

## 2. Formas y Bordes

```
Tarjetas/Contenedores:  rounded-xl o rounded-2xl
Botones e Inputs:       rounded-lg
Badges/Etiquetas:       rounded-md
Avatares:               rounded-full
```

❌ Nunca `rounded-none` en elementos mayores.

---

## 3. Glassmorphism (Efecto Cristal)

Para headers y modales flotantes:

```
Modo Claro:   bg-white/70 backdrop-blur-md border border-gray-200/50
Modo Oscuro:  bg-[#161822]/70 backdrop-blur-md border border-white/5
```

---

## 4. Sombras

```
Botón primario:         shadow-lg shadow-[#0033A0]/20
Contenedor flotante:    shadow-xl shadow-gray-200/30
Tarjeta hover:          shadow-md → shadow-lg (transición)
```

---

## 5. Experiencia de Usuario

### Estados de Carga

```
❌ NO spinners gigantes bloqueando pantalla
✅ Skeleton Loaders (animate-pulse) que simulan el contenido
✅ Botones: reemplazar ícono por Loader2 animate-spin + disabled
```

### Transiciones

```
✅ Todos los elementos interactivos: transition-all duration-200
✅ Botones principales: hover:-translate-y-0.5
✅ Tarjetas: hover:shadow-lg con transición suave
```

### Mobile-First

```
✅ Diseñar PRIMERO para celular (375px)
✅ Después adaptar para tablet (768px) y desktop (1024px+)
✅ El calendario debe ser usable con el dedo (touch targets mínimo 44px)
✅ Reagendar en 3 taps máximo
```

---

## 6. Íconos

```
Librería exclusiva: lucide-react
Tamaño en botones: w-4 h-4
Alineación: flex items-center gap-2
```

---

## 7. Tipografía

```
Font principal: Inter (Google Fonts) o la default de sistema
Títulos:        font-semibold o font-bold
Cuerpo:         text-sm (14px) en móvil, text-base (16px) en desktop
```

---

**Nota para Antigravity:** Siempre aplicar estos tokens visuales. No hacer interfaces genéricas. ¡Hacerlo hermoso desde el primer intento!
