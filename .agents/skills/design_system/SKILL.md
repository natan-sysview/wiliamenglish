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
Azul William:    #2952F5  (azul fuerte del logo — color principal)
Rojo William:    #CC0000  (rojo de los letreros del logo — acento/CTA)
Blanco:          #FFFFFF  (fondo principal)
```

### Degradado de Marca (FinTech Style)
Para resaltar el nombre "William English" o títulos de máxima jerarquía, usar este gradiente de impacto:
```html
className="bg-clip-text text-transparent bg-gradient-to-r from-[#2952F5] to-[#CC0000]"
```

### Modo Claro (default — la mayoría de usuarios)

```
Fondo principal:     bg-white / bg-slate-50
Fondo tarjetas:      bg-white
Texto títulos:       text-gray-900
Texto normal:        text-gray-700
Texto secundario:    text-gray-500
Bordes:              border-gray-200
Botón primario:      bg-[#2952F5] text-white hover:bg-[#002880]
Botón acción/CTA:    bg-[#CC0000] text-white hover:bg-[#AA0000]
Focus rings:         ring-[#2952F5]/30
```

### Modo Oscuro (Totalmente Integrado y Activo)

```
Fondo principal:     bg-[#0b1120]
Fondo tarjetas:      bg-slate-900/80
Texto:               text-slate-300 / text-white
Bordes:              border-slate-800/50 o border-white/10
Botón primario:      bg-[#2952F5] text-white
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

## 3. Premium Glassmorphism (Super Flow)

Para headers, dropdowns y modales flotantes:

```
Modo Claro:   bg-white/80 backdrop-blur-2xl border border-white/50
Modo Oscuro:  bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50
Efecto Adicional: Redondeado expansivo (rounded-3xl o rounded-[2rem])
```

---

## 4. Sombras y Profundidad

```
Botón primario:         shadow-lg shadow-blue-900/30
Contenedor flotante:    shadow-[0_20px_60px_-15px_rgba(41,82,245,0.15)] (Modo Claro)
Contenedor flotante:    shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] (Modo Oscuro)
Tarjeta hover:          shadow-md → shadow-2xl (transición expansiva)
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

### Mobile-First (Responsive Extremo)

```
✅ Diseñar PRIMERO para las pantallas más pequeñas (320px - 375px) usando col, w-full, text-base.
✅ Adaptar para tablet y desktop usando prefijos (md:flex-row, lg:text-4xl).
✅ Mentalidad "Líquida": Usar fracciones (flex-1, w-full), NO usar tamaños rígidos (w-[400px]) que rompan el móvil.
✅ Seguro de Vida para Textos Flexibles: SIEMPRE usar `min-w-0` en el contenedor padre de textos largos junto con `truncate` para evitar desbordamientos y saltos de línea destructivos.
✅ Los botones y controles deben ser fáciles de presionar con el pulgar (ej. w-full o grid-cols-2 en móviles).
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
