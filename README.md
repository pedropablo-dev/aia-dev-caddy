# 🧰 Dev-Caddy: Tu Arsenal de Comandos Personal

**Dev-Caddy** es una paleta de comandos personal, ultrarrápida y centralizada. Ha sido diseñada para eliminar la fricción de buscar y recordar comandos de terminal, rutas, URLs y prompts complejos de uso frecuente.

_¿Cansado de buscar en tu historial, notas o wikis internas el mismo comando una y otra vez? Dev-Caddy es la solución._

---

## ✨ Características Principales

- **Organización Intuitiva:** Agrupa tus comandos en **categorías** personalizables con iconos emoji
- **Búsqueda Instantánea:** Filtro rápido con `Ctrl+K` para encontrar cualquier item en milisegundos
- **⭐ Sistema de Favoritos:** Marca items con estrella para acceso rápido
- **Panel de Administración:** Interfaz CRUD completa en `/admin` con drag-and-drop para reordenar
- **Editor de Prompts:** Editor rico con toolbar Markdown, variables dinámicas y modo Zen

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
| [Zod](https://zod.dev/) | 3.24.1 | Validación (pendiente) |

---

## 🏗️ Arquitectura

```
app/
├── page.tsx              # Launchpad principal
├── admin/
│   ├── page.tsx          # Panel de administración
│   └── editor/page.tsx   # Editor de prompts
├── api/commands/route.ts # API REST
└── data/commands.json    # Fuente de datos
```

**Flujo de datos:**
1. `commands.json` es la fuente única de verdad
2. API route (`/api/commands`) lee/escribe el archivo JSON
3. Zustand persiste estado de UI en `localStorage`

> ⚠️ **Nota:** El almacenamiento basado en archivos no es compatible con despliegues serverless (Vercel). Ver [docs/ROADMAP.md](docs/ROADMAP.md) para plan de migración.

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Diagramas del sistema y flujo de datos |
| [PROJECT_BIBLE.md](docs/PROJECT_BIBLE.md) | Guía completa para desarrolladores |
| [AUDIT_REPORT.md](docs/AUDIT_REPORT.md) | Análisis crítico y deuda técnica |
| [ROADMAP.md](docs/ROADMAP.md) | Plan de modernización a producción |

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

**Versión actual:** 0.1.0 (MVP)

| Área | Estado |
|------|--------|
| Funcionalidad core | ✅ Completa |
| Validación API | ⚠️ Pendiente |
| Despliegue serverless | ❌ No soportado |
| Tests | ❌ No implementados |

Ver [ROADMAP.md](docs/ROADMAP.md) para el plan hacia v1.0.0.

---

## 📄 Licencia

MIT