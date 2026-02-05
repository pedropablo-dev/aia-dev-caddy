# ⚡️ Guía de Uso para broWorks Dev-Caddy (v0.3.0)

¡Bienvenido a tu arsenal de desarrollo! Esta guía te ayudará a dominar todas las funcionalidades de Dev-Caddy.

---

### Navegación y Conceptos Básicos

-   **Navegación por Teclado:** Usa las flechas `↑` y `↓` para moverte por la lista de comandos. Pulsa `Enter` para copiar el comando seleccionado.
-   **Panel de Categorías (Izquierda):** Navega entre tus categorías personalizadas. La primera, **⭐ Favoritos**, es especial: contiene todos los items que marques con una estrella para un acceso prioritario.
-   **Búsqueda Inteligente (`Ctrl+K`):** Usa la barra de búsqueda superior. Gracias a **Fuzzy Search**, puedes encontrar lo que buscas incluso si cometes errores tipográficos (ej: "dockr" encontrará "docker"). ¡Busca globalmente en todas las categorías!
-   **Sintaxis Resaltada:** Los bloques de código ahora se muestran con colores (tema vsDark) para facilitar la lectura de scripts complejos.

---

### #️⃣ Tipos de Items y Cómo Usarlos

Dev-Caddy soporta diferentes tipos de contenido para cada necesidad.

#### ▶️ Comando Simple
El más básico. Un comando o texto que no cambia.
-   **Uso:** Simplemente haz clic en el botón **`Copy`** (o `Enter` si está seleccionado).

#### 🚀 Workflow (Secuencia de Pasos)
Perfecto para procesos que requieren múltiples comandos en un orden específico (ej: un despliegue).
-   **Uso:** El botón **`Copy Step & Next`** es la clave. Al pulsarlo, copia el comando del paso actual y avanza automáticamente al siguiente.

#### 📝 Comando con Variables
Son plantillas de comandos con "huecos" que puedes rellenar.
-   **Uso:** Rellena los campos de texto que aparecen debajo del comando. Una vez rellenados, pulsa el botón **`Copy`**.

#### ✨ Prompt de IA
Diseñado para guardar, gestionar y reutilizar prompts complejos para modelos de lenguaje.
-   **Uso:** Puedes ver el prompt completo en un área de texto con resaltado de sintaxis Markdown. Usa el botón **`Copy Prompt`**.

---

### ⚙️ Panel de Administración (`/admin`)

El centro de control total de tu Dev-Caddy. Aquí puedes añadir, editar, reordenar y eliminar todo el contenido.

#### Gestionar Categorías (Columna Izquierda)
-   **Añadir:** Crea nuevas categorías con nombre e icono.
-   **Arrastrar y Soltar:** Usa el icono de agarre (seis puntos `⋮⋮`) a la izquierda de cada categoría para arrastrarla y cambiar su posición.
-   **Editar y Duplicar:** Al pasar el ratón, aparecen los iconos de **lápiz (editar)** y **copia (duplicar)**.
-   **Eliminar:** Selecciona una categoría y pulsa el botón de eliminar.

#### Gestionar Items (Columna Derecha)
-   **Añadir Item:** Usa los botones superiores para añadir un nuevo item (Simple, Workflow o Prompt).
-   **Arrastrar y Soltar:** Usa el icono de agarre (seis puntos `⋮⋮`) a la izquierda de cada item para reordenarlos libremente dentro de la lista.
-   **Editar y Duplicar:** Los iconos de lápiz y copia aparecen al pasar el ratón sobre un item.

---

### 🚀 El Editor de Prompts Avanzado

Al crear o editar un "Prompt de IA", accederás a un editor especializado con herramientas potentes:

-   **Barra de Herramientas Markdown:** Botones para aplicar formato rápidamente (negrita, cursiva, títulos, listas, bloques de código, etc.).
-   **Panel Derecho (Variables y Buscador):**
    -   **Buscador:** Encuentra texto dentro de tu prompt.
    -   **Variables Dinámicas:** Define variables (ej: `{nombre_componente}`) y añádelas con un clic.
-   **Contadores y Límite:** Visualiza el número de palabras y caracteres.
-   **Modo Zen:** Maximiza el editor para escribir sin distracciones.