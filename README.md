# 🧰 broWorks Dev-Caddy

**Visión General:** `broWorks Dev-Caddy` es un arsenal de comandos personal, diseñado para actuar como una paleta de comandos centralizada y ultrarrápida. Su propósito es eliminar la fricción de buscar y recordar comandos de terminal, rutas y URLs de uso frecuente, organizándolos en categorías lógicas para un acceso y ejecución inmediatos.

---

## ✨ Características Principales

* **Gestión por Categorías:** Organiza los comandos en categorías personalizables con iconos para una fácil identificación visual.
* **Búsqueda Instantánea:** Filtra categorías y busca comandos por nombre o contenido en tiempo real, con soporte para atajos de teclado (`Ctrl+K`).
* **Sistema de Favoritos:** Marca cualquier item con una estrella para que aparezca en una categoría especial de "Favoritos" para un acceso aún más rápido.
* **Tipos de Contenido Versátiles:**
    * **Comandos Simples:** Para copiar y pegar directamente.
    * **Workflows:** Secuencias de comandos de varios pasos que guían al usuario.
    * **Comandos con Variables:** Plantillas que se rellenan dinámicamente.
    * **Prompts de IA:** Almacena y gestiona prompts multilínea para usarlos con modelos de lenguaje.
* **Panel de Administración Completo:** Una interfaz integrada para realizar operaciones CRUD (Crear, Leer, Editar, Eliminar), **Duplicar** y **Reordenar** tanto categorías como items.
* **Interfaz Eficiente y Persistente:** Un panel lateral plegable y una interfaz limpia. El estado de la UI (barra lateral y categoría seleccionada) se guarda en `localStorage` para persistir entre sesiones.

---

## 🛠️ Stack Tecnológico

El proyecto está construido con un stack moderno enfocado en la simplicidad y el rendimiento:

* **Framework:** Next.js (con App Router)
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS
* **Componentes UI:** Shadcn UI
* **Gestión de Estado Global:** Zustand (para estados de UI y de la aplicación)
* **Renderizado de Markdown:** `react-markdown` (para la ventana de ayuda)

---

## 🏗️ Arquitectura y Flujo de Datos

1.  **Componentes Principales:**
    * **`app/page.tsx`:** Lógica de la aplicación principal, renderizado de categorías e items.
    * **`app/admin/page.tsx`:** Lógica completa del panel de administración (CRUD, reordenación, etc.).
2.  **Fuente de Datos (`app/data/commands.json`):**
    * Actúa como la "base de datos" del proyecto. Es la fuente única y absoluta de verdad.
3.  **API Local (`app/api/commands/route.ts`):**
    * Endpoint para leer (`GET`) y escribir (`POST`) en `commands.json` de forma desacoplada.
4.  **Gestión de Estado (`store/*.ts`):**
    * Se utilizan *stores* de Zustand para manejar estados globales que necesitan persistir, como el estado de colapso de la barra lateral (`uiStore.ts`) y la última categoría seleccionada por el usuario (`appStore.ts`).

---

## 📂 Estructura de Ficheros Clave

/
├── app/
│   ├── page.tsx            # Componente principal de la aplicación
│   ├── admin/
│   │   └── page.tsx        # Panel de administración
│   ├── data/
│   │   └── commands.json   # La "base de datos" del proyecto
│   └── api/
│       └── commands/
│           └── route.ts    # Endpoint para leer/escribir commands.json
├── components/
│   └── ui/                 # Componentes base de Shadcn UI
├── public/
│   └── help.md             # Contenido Markdown para el modal de ayuda
└── store/
├── uiStore.ts          # Store de Zustand para el estado de la UI
└── appStore.ts         # Store de Zustand para el estado de la App


---

## 🚀 Cómo Ejecutar Localmente

1.  Asegúrate de tener Node.js y npm/yarn/pnpm instalados.
2.  Instala las dependencias: `npm install`
3.  Inicia el servidor de desarrollo: `npm run dev`
4.  La aplicación estará disponible en `http://localhost:3002`.
