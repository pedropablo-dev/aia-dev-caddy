# 🧰 Dev-Caddy: Tu Arsenal de Comandos Personal

**Dev-Caddy** es una paleta de comandos personal, ultrarrápida y centralizada. Ha sido diseñada para eliminar la fricción de buscar y recordar comandos de terminal, rutas, URLs y prompts complejos de uso frecuente.

_¿Cansado de buscar en tu historial, notas o wikis internas el mismo comando una y otra vez? Dev-Caddy es la solución._

---

## ✨ Características Principales

- **Organización Intuitiva:** Agrupa tus comandos en **categorías** personalizables con iconos emoji
- **Búsqueda Instantánea:** Filtro rápido con `Ctrl+K` para encontrar cualquier item en milisegundos
- **⭐ Sistema de Favoritos:** Marca items con estrella para acceso rápido
- **Panel de Administración:** Interfaz CRUD completa en `/admin` con reordenamiento
- **Editor de Prompts:** Editor rico con toolbar Markdown, variables dinámicas y modo Zen

### ✅ Nuevas Características v0.2.0

| Característica | Descripción |
|----------------|-------------|
| **🔒 Validación Zod** | API protegida con validación de esquemas |
| **🛡️ Error Boundaries** | Prevención de "pantalla blanca" con recuperación |
| **⚡ Skeleton Loading** | Estados de carga con placeholders visuales |
| **💾 Backup/Restore** | Exportar e importar datos en JSON |
| **🧩 Arquitectura Atómica** | Componentes modulares y hooks reutilizables |

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
| [Shadcn UI](https://ui.shadcn.com/) | - | Componentes UI |
| [Zustand](https://github.com/pmndrs/zustand) | 5.0.6 | Estado global |
| [Sonner](https://sonner.emilkowal.ski/) | 1.7.1 | Notificaciones toast |
| [Zod](https://zod.dev/) | 3.24.1 | Validación de API |

---

## 🏗️ Arquitectura v0.2.0

```
app/
├── page.tsx              # Launchpad (160 líneas - orquestador)
├── error.tsx             # Error boundary global
├── not-found.tsx         # Página 404
├── loading.tsx           # Skeleton SSR
├── admin/
│   ├── page.tsx          # Panel de administración
│   └── editor/page.tsx   # Editor de prompts
├── api/commands/route.ts # API REST (Zod validado)
└── data/commands.json    # Fuente de datos

components/dev-caddy/
├── Sidebar.tsx           # Navegación lateral
├── Header.tsx            # Barra de búsqueda
├── CommandList.tsx       # Lista de comandos
├── CommandCard.tsx       # Tarjeta individual
├── skeletons.tsx         # Estados de carga
└── backup-controls.tsx   # Export/Import

hooks/
└── use-commands.ts       # Data fetching + state

types/
└── index.ts              # Tipos centralizados (SSoT)

lib/
└── schemas.ts            # Esquemas Zod
```

**Flujo de datos:**
1. `types/index.ts` es la fuente única de tipos
2. `useCommands` hook gestiona fetch/save/toggle
3. API route valida con Zod antes de escribir
4. Error boundaries capturan fallos

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Diagramas, hooks y flujo de datos |
| [PROJECT_BIBLE.md](docs/PROJECT_BIBLE.md) | Guía completa para desarrolladores |
| [ROADMAP.md](docs/ROADMAP.md) | Plan de modernización (Fases 1-4 ✅) |
| [UX_IMPROVEMENT_PLAN.md](docs/UX_IMPROVEMENT_PLAN.md) | Plan de mejoras UX |

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

**Versión actual:** 0.2.0 (Refactor Completo)

| Área | Estado |
|------|--------|
| Funcionalidad core | ✅ Completa |
| Validación API (Zod) | ✅ Implementada |
| Error Boundaries | ✅ Implementadas |
| Skeleton Loading | ✅ Implementado |
| Backup/Restore | ✅ Implementado |
| Componentes Atómicos | ✅ Completado |
| Hooks Reutilizables | ✅ Completado |
| Tests | ❌ Pendiente |
| Despliegue serverless | ❌ Requiere DB |

Ver [ROADMAP.md](docs/ROADMAP.md) para el plan hacia v1.0.0.

---

## 📄 Licencia

MIT