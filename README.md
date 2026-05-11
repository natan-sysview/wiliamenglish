# William english institute - Portal de Administración 🏫

Este es el repositorio oficial del sistema integral de administración para **William english institute**. Una plataforma Full-Stack construida con Next.js 15 (App Router), Prisma (PostgreSQL), NextAuth y TailwindCSS bajo un estándar de diseño **Premium Glassmorphism**.

---

## 🚀 1. Operación Diaria (Cómo Levantar el Proyecto)

Para trabajar en el proyecto localmente, abre una nueva terminal en esta carpeta y corre:

```bash
npm run dev
```

Una vez que diga `Ready in Xms`, entra a tu navegador: [http://localhost:3000](http://localhost:3000)

### Cómo detenerlo correctamente:
En la misma terminal donde lo levantaste, presiona:
`Ctrl + C`

---

## 🚨 2. Solución a "Puerto Colgado" (Fantasma)

**El Problema:** 
Si cierras VS Code de golpe sin darle `Ctrl + C`, el servidor se queda atrapado en la memoria de la Mac bloqueando el puerto 3000. Si intentas correr `npm run dev` te dirá `Port 3000 is already in use`.

**La Solución (Copia y pega esto en tu terminal):**
```bash
lsof -ti:3000 | xargs kill -9
```
*Este comando rastrea silenciosamente quién está usando el puerto 3000 y lo "asesina" para que quede libre.*

---

## 🗄️ 3. Base de Datos (Prisma)

Cada que le pidamos a la Inteligencia Artificial (Antigravity) que agregue un nuevo campo a la tabla (como cuando agregamos `Modalidad` o `Sucursal`), **TIENES** que apagar el servidor `npm run dev` y sincronizar el motor.

**Comando de sincronización:**
```bash
npx prisma db push && npx prisma generate
```
Una vez que termine, puedes volver a iniciar el proyecto con `npm run dev`.

---

## 🗺️ 4. Mapa de Rutas de la Aplicación

El sistema está protegido con un Middleware estricto. Si no tienes sesión, intentar entrar a cualquier ruta de `/portal` te enviará de regreso a hacer login.

| Ruta Web | Descripción | Permisos (Roles) |
| :--- | :--- | :--- |
| `/` | Landing page pública (Por construir). | `TODOS` |
| `/login` | Pantalla de inicio de sesión segura. | `TODOS` |
| `/portal` | **Dashboard Principal:** Tarjetas flotantes y bienvenida. | `ADMIN, STAFF, MAESTRO, ALUMNO` |
| `/portal/comunidad` | **Directorio de Usuarios:** Creación y visualización. | `ADMIN, STAFF` |
| `/portal/paquetes` | **Catálogo Financiero:** Gestión de paquetes. | `ADMIN` |
| `/portal/horarios` | **Agenda:** Visualización de clases (Próximamente). | `ADMIN, STAFF, MAESTRO` |

---

## 🎨 5. Estándares Estéticos Actuales

El proyecto no utiliza un diseño genérico. El sistema de diseño se rige estrictamente por:
- **Colores Oficiales:** Azul Eléctrico (`#2952F5`) y Rojo William (`#CC0000`).
- **Glassmorphism Premium:** `backdrop-blur-2xl` con sombras ultra-profundas (`shadow-[0_20px_60px_-15px_...]`).
- **Modo Oscuro Integrado:** Implementación nativa usando las utilidades `dark:` de Tailwind.
- **Tipografía y Redondeo:** Bordes muy curvos para componentes principales (`rounded-3xl` o `rounded-[2rem]`).

---
> Documentación mantenida activamente por tu AI (Antigravity) en conjunto con el equipo de Desarrollo de William english institute.
