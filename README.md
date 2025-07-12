\# 🧰 broWorks Dev-Caddy



\*\*Visión General:\*\* `broWorks Dev-Caddy` es un arsenal de comandos personal, diseñado para actuar como una paleta de comandos centralizada y ultrarrápida. Su propósito es eliminar la fricción de buscar y recordar comandos de terminal, rutas y URLs de uso frecuente, organizándolos en categorías lógicas para un acceso y ejecución inmediatos.



---



\## ✨ Características Principales



\* \*\*Gestión por Categorías:\*\* Organiza los comandos en categorías personalizables con iconos para una fácil identificación visual.

\* \*\*Búsqueda Instantánea:\*\* Filtra categorías y busca comandos por nombre o contenido en tiempo real, con soporte para atajos de teclado (`Ctrl+K`).

\* \*\*Múltiples Tipos de Comandos:\*\*

&nbsp;   \* \*\*Simples:\*\* Comandos directos para copiar y pegar.

&nbsp;   \* \*\*Workflows:\*\* Secuencias de comandos de varios pasos que guían al usuario.

&nbsp;   \* \*\*Con Variables:\*\* Plantillas de comandos que se rellenan dinámicamente.

\* \*\*Panel de Administración Integrado:\*\* Una interfaz completa dentro de un modal para realizar operaciones CRUD (Crear, Leer, Editar, Eliminar) tanto en categorías como en comandos.

\* \*\*Interfaz Eficiente:\*\* Un panel lateral plegable y una interfaz limpia diseñada para la máxima productividad y el mínimo movimiento del ratón.



---



\## 🛠️ Stack Tecnológico



El proyecto está construido con un stack moderno enfocado en la simplicidad y el rendimiento:



\* \*\*Framework:\*\* Next.js (con App Router)

\* \*\*Lenguaje:\*\* TypeScript

\* \*\*Estilos:\*\* Tailwind CSS

\* \*\*Componentes UI:\*\* Shadcn UI

\* \*\*Gestión de Estado Global:\*\* Zustand (para estados de UI como el panel lateral)

\* \*\*Renderizado de Markdown:\*\* `react-markdown` (para la ventana de ayuda)



---



\## 🏗️ Arquitectura y Flujo de Datos



La aplicación sigue una arquitectura simple y autocontenida, ideal para una herramienta de desarrollo local.



1\.  \*\*Componente Principal (`app/page.tsx`):\*\*

&nbsp;   La lógica de la aplicación, la gestión de estado de los datos (comandos, categorías) y la renderización de toda la interfaz residen en este único componente.



2\.  \*\*Fuente de Datos (`app/data/commands.json`):\*\*

&nbsp;   Esta es la \*\*fuente única y absoluta de verdad\*\*. Este archivo JSON actúa como la base de datos de la aplicación, almacenando toda la estructura de categorías y comandos. Toda la persistencia de los datos se realiza leyendo y escribiendo en este fichero.



3\.  \*\*Capa de API Local (`app/api/commands/route.ts`):\*\*

&nbsp;   Para interactuar con el fichero `commands.json`, se utiliza una API Route de Next.js. Esto proporciona una interfaz limpia y desacoplada:

&nbsp;   \* `GET /api/commands`: Lee el contenido de `commands.json`.

&nbsp;   \* `POST /api/commands`: Recibe datos en formato JSON y sobreescribe `commands.json`.



4\.  \*\*Gestión de Estado de UI (`store/uiStore.ts`):\*\*

&nbsp;   Se utiliza un store de Zustand para manejar estados globales simples de la UI, como el estado de colapso de la barra lateral, para no sobrecargar el componente principal.



---



\## 📂 Estructura de Ficheros Clave



```

/

├── app/

│   ├── page.tsx            # Componente principal de la aplicación (UI y Lógica)

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

&nbsp;   └── uiStore.ts          # Store de Zustand para el estado de la UI

```



---



\## 🚀 Cómo Ejecutar Localmente



1\.  Asegúrate de tener Node.js y npm/yarn/pnpm instalados.

2\.  Instala las dependencias del proyecto:

&nbsp;   ```bash

&nbsp;   npm install

&nbsp;   ```

3\.  Inicia el servidor de desarrollo:

&nbsp;   ```bash

&nbsp;   npm run dev

&nbsp;   ```

4\.  La aplicación estará disponible en `http://localhost:3002`.

