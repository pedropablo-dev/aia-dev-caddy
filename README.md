# AIA Dev Caddy ⛳

**Tu compañero esencial de desarrollo.**

AIA Dev Caddy es un panel de control de alto rendimiento y **ejecución local** diseñado para organizar, ejecutar y gestionar tus comandos CLI más usados, prompts para LLMs y flujos de trabajo. Creado para desarrolladores que se niegan a perder el tiempo rebuscando en el historial de la terminal.

## 👤 Autoría y Créditos
Esta herramienta ha sido desarrollada por **Pedro Pablo Miras** para la organización [@aplica-la-ia](https://github.com/aplica-la-ia).
👉 **Conoce más sobre nuestro canal de YouTube**: [Aplica la IA](https://www.youtube.com/@Aplica_la_IA)

---

## 🚀 Características Principales
- **⚡ Acceso Instantáneo**: Búsqueda global (Ctrl+K) y filtrado por categorías.
- **🧠 Prompts Inteligentes para IA**: Variables dinámicas y compilación instantánea de texto para LLMs.
- **📂 Organización Avanzada**: Ordenamiento LIFO y sistema Drag & Drop para categorías.
- **🔒 100% Privacidad Local**: Persistencia en `localStorage` y exportación manual en formato JSON.
- **⭐ Panel de Favoritos**: Analítica de uso y ordenamiento inteligente por frecuencia.
- **↺ Motor Deshacer/Rehacer**: Sistema de historial de estado completo con `Ctrl+Z` / `Ctrl+Y`.
- **🎨 UX Premium**: Interfaz en Modo Oscuro con Shadcn UI y notificaciones tipo "toast".

## 🛠️ Stack Tecnológico
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Estado**: [Zustand](https://github.com/pmndrs/zustand)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)

## 📦 Instalación

1. **Clonar el repositorio**:
   git clone https://github.com/aplica-la-ia/aia-dev-caddy.git
   cd aia-dev-caddy

2. **Instalar dependencias**:
   npm install

3. **Ejecutar el Servidor de Desarrollo**:
   npm run dev
   # Abre http://localhost:3000

## 📂 Estructura del Proyecto
- `app/`: Páginas y layouts globales.
- `components/dev-caddy/`: Lógica de negocio (Tarjetas, Formularios).
- `hooks/`: Manejo de datos y persistencia (`use-commands`).
- `store/`: Estado global de la interfaz con Zustand.

---

### 🤖 AI-Native Development & Methodology
**Meta-desarrollo:** Este proyecto es un ejemplo de circularidad técnica; una herramienta diseñada para gestionar prompts que ha sido construida íntegramente mediante prompts y **Vibecoding**.

* **Arquitectura:** Pedro Pablo Miras para [@aplica-la-ia](https://github.com/aplica-la-ia).
* **Metodología:** Desarrollo ágil mediante lenguaje natural para crear una infraestructura React/Next.js robusta y escalable.
* **Propósito:** Demostrar la viabilidad del desarrollo asistido por IA para crear herramientas de sistema que mejoren la propia productividad del desarrollador.

---
*Desarrollado con ❤️ para máxima velocidad por @aplica-la-ia*