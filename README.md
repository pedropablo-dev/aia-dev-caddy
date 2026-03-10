# AIA Dev Caddy ⛳

**Tu compañero esencial de desarrollo.**

AIA Dev Caddy es un panel de control de alto rendimiento y **ejecución local** diseñado para organizar, ejecutar y gestionar tus comandos CLI más usados, prompts para LLMs y flujos de trabajo. Creado para desarrolladores que se niegan a perder el tiempo rebuscando en el historial de la terminal.

## 👤 Autoría y Créditos
Esta herramienta ha sido desarrollada por **Pedro Pablo Miras**, integrante del equipo de **Aplica la IA**. 
👉 **Conoce más sobre nuestro canal de YouTube**: [Aplica la IA](https://www.youtube.com/@Aplica_la_IA)

---

## 🚀 Características Principales

-   **⚡ Acceso Instantáneo**: Búsqueda global (Ctrl+K) y filtrado por categorías.
-   **🧠 Prompts Inteligentes para IA**:
    -   **Variables Dinámicas**: Escribe prompts como *"Refactoriza este código a `{Lenguaje}`"* y la interfaz generará automáticamente un campo de entrada para `Lenguaje`.
    -   **Copia en un Clic**: Rellena las variables y copia el prompt compilado al instante.
-   **📂 Organización Avanzada**:
    -   **Ordenamiento LIFO**: Los elementos más nuevos aparecen arriba para un acceso inmediato.
    -   **Arrastrar y Soltar (Drag & Drop)**: Categorías y comandos totalmente reordenables a través del Modo Edición.
-   **🔒 100% Privacidad Local**: Tus datos nunca salen de tu equipo.
    -   **Autoguardado**: Copia de seguridad pasiva en `localStorage` con cada cambio.
    -   **Exportación Manual**: Descarga copias de seguridad en formato JSON para almacenamiento externo.
-   **⭐ Panel de Favoritos**:
    -   Vista dedicada para tus elementos más utilizados.
    -   **Ordenamiento Inteligente**: Ordena por Uso, Nombre o Categoría al instante.
    -   **Analítica de Uso**: Rastrea la frecuencia con la que usas cada comando.
-   **✨ Duplicación Inteligente**:
    -   Los elementos duplicados aparecen inmediatamente después del original.
    -   La reindexación automática mantiene todo organizado.
-   **↺ Motor Deshacer/Rehacer (Undo/Redo)**:
    -   Los errores ocurren. Usa `Ctrl+Z` para Deshacer, `Ctrl+Y` para Rehacer.
    -   **Viaje en el Estado**: Navega por tu historial de edición con total confianza.
    -   **Persistencia "Debounced"**: El guardado inteligente garantiza el rendimiento de la aplicación sin cortes mientras escribes.
-   **⌨️ Atajos para Power Users**:
    -   `Ctrl+K`: Enfocar búsqueda.
    -   `Ctrl+Z` / `Ctrl+Y`: Deshacer / Rehacer.
    -   `Ctrl+Enter` / `Cmd+Enter`: Guardar/enviar cualquier formulario al instante.
    -   `Esc`: Cerrar cualquier modal sin guardar.
-   **🎨 Experiencia de Usuario (UX) Premium**:
    -   Elegante interfaz en Modo Oscuro con estética personalizada.
    -   Confirmaciones mediante AlertDialog para acciones destructivas (sin alertas nativas feas del navegador).
    -   Notificaciones tipo "toast" en la parte inferior central que no obstruyen la interfaz visual.

## 🛠️ Stack Tecnológico

-   **Framework**: [Next.js 14](https://nextjs.org/)
-   **Estilos**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
-   **Iconos**: [Lucide React](https://lucide.dev/)
-   **Estado**: [Zustand](https://github.com/pmndrs/zustand)
-   **Drag & Drop**: [@dnd-kit](https://dndkit.com/)

## 📦 Instalación

1.  **Clonar el repositorio**:
    ```bash
    git clone [https://github.com/pedropablo-dev/aia-dev-caddy.git](https://github.com/pedropablo-dev/aia-dev-caddy.git)
    cd aia-dev-caddy
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Ejecutar el Servidor de Desarrollo**:
    ```bash
    npm run dev
    ```
    Abre [http://localhost:3000](http://localhost:3000).

4.  **Construir para Producción**:
    ```bash
    npm run build
    npm start
    ```

## 📂 Estructura del Proyecto

-   `app/`: Páginas del App Router y layouts globales.
-   `components/dev-caddy/`: Componentes principales de la lógica de negocio (Tarjetas, Barra lateral, Formularios).
-   `context/`: Contextos de React (Sistema de notificaciones Toast).
-   `hooks/`: Hooks personalizados para el manejo de datos (`use-commands`).
-   `store/`: Almacenes (stores) de estado global de la interfaz.
-   `public/`: Archivos estáticos.

## 🤝 Contribuciones

Consulta el archivo [CONTRIBUTING.md](docs/CONTRIBUTING.md) para ver las directrices técnicas del proyecto.

---

**Desarrollado con ❤️ para máxima velocidad.**
