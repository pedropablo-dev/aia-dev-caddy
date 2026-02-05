# 🧰 Dev-Caddy: Tu Arsenal de Comandos Personal

**Dev-Caddy** es una paleta de comandos personal, ultrarrápida y centralizada. Ha sido diseñada para eliminar la fricción de buscar y recordar comandos de terminal, rutas, URLs y prompts complejos de uso frecuente.

_¿Cansado de buscar en tu historial, notas o wikis internas el mismo comando una y otra vez? Dev-Caddy es la solución._

---

## ✨ Características Principales

- **Organización Intuitiva:** Agrupa tus comandos en **categorías** personalizables con iconos emoji
- **Búsqueda Instantánea:** Filtro inteligente con `Ctrl+K` (Fuzzy Search) para encontrar items incluso con errores tipográficos
- **Arrastrar y Soltar:** Reordena categorías y comandos libremente con una experiencia fluida (`@dnd-kit`)
- **Navegación por Teclado:** Muévete con flechas `↑` `↓` y copia con `Enter`
- **Sintaxis Resaltada:** Bloques de código con colores para mejor legibilidad
- **⭐ Sistema de Favoritos:** Marca items con estrella para acceso rápido
- **Panel de Administración:** Interfaz CRUD completa en `/admin`
- **Editor de Prompts:** Editor rico con toolbar Markdown, variables dinámicas y modo Zen

### ✅ Nuevas Características v0.3.0

| Característica | Descripción |
|----------------|-------------|
| **🖐️ Drag & Drop** | Reordenación táctil y fluida en Admin |
| **🔍 Fuzzy Search** | Búsqueda tolerante a fallos (typos) |
| **⌨️ Keyboard Nav** | Navegación completa sin ratón |
| **🎨 Syntax Highlighting** | Código coloreado (vsDark theme) |
| **✨ Visual Polish** | Skeletons oscuros y micro-interacciones |

### Tipos de Items

| Tipo | Icono | Descripción |
|:-----|:-----:|:------------|
| **Comando Simple** | ▶️ | Comando directo listo para copiar |
| **Workflow** | 🚀 | Secuencia de comandos guiada paso a paso |
| **Con Variables** | 📝 | Plantillas con placeholders dinámicos |
| **Prompt de IA** | ✨ | Prompts multilínea con soporte Markdown |

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| [Next.js](https://nextjs.org/) | 14.2.30 | Framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Lenguaje |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4.17 | Estilos |
| [dnd-kit](https://dndkit.com/) | Core | Drag & Drop |
| [Fuse.js](https://fusejs.io/) | 7.0 | Búsqueda Fuzzy |
| [Prism React](https://github.com/FormidableLabs/prism-react-renderer) | Latest | Syntax Highlighting |
| [Zustand](https://github.com/pmndrs/zustand) | 5.0.6 | Estado global |
| [Sonner](https://sonner.emilkowal.ski/) | 1.7.1 | Notificaciones toast |
| [Zod](https://zod.dev/) | 3.24.1 | Validación de API |

---

## 🏗️ Arquitectura v0.3.0

```
app/
├── page.tsx              # Launchpad (Orquestador)
├── admin/
│   ├── page.tsx          # Panel Admin (Drag & Drop context)
│   └── editor/page.tsx   # Editor de prompts
├── ...

components/dev-caddy/
├── SortableCommandItem.tsx # Item reordenable
├── SortableCategoryItem.tsx # Categoría reordenable
├── CommandCard.tsx       # Tarjeta con Syntax Highlighting
└── ...
```

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Diagramas, componentes y dependencias |
| [PROJECT_BIBLE.md](docs/PROJECT_BIBLE.md) | Guía completa para desarrolladores |
| [ROADMAP.md](docs/ROADMAP.md) | Plan de modernización (Fases 1-5 ✅) |
| [UX_IMPROVEMENT_PLAN.md](docs/UX_IMPROVEMENT_PLAN.md) | Plan de mejoras UX (Completado) |

---

## 🚀 Cómo Empezar

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/dev-caddy.git
cd dev-caddy

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**URLs:**
- App principal: http://localhost:3002
- Panel admin: http://localhost:3002/admin

---

## 📋 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (puerto 3002) |
| `npm run build` | Build de producción |
| `npm run start` | Iniciar build de producción |
| `npm run lint` | Ejecutar ESLint |

---

## 🔮 Estado del Proyecto

**Versión actual:** 0.3.0 (UX Excellence)

| Área | Estado |
|------|--------|
| Funcionalidad core | ✅ Completa |
| UX / UI Polish | ✅ Completa |
| Drag & Drop | ✅ Implementado |
| Búsqueda Fuzzy | ✅ Implementada |
| Validación API (Zod) | ✅ Implementada |
| Backup/Restore | ✅ Implementado |
| Tests | ❌ Pendiente |
| Despliegue serverless | ❌ Requiere DB |

Ver [ROADMAP.md](docs/ROADMAP.md) para el plan hacia v1.0.0.

---

## 📄 Licencia

MIT