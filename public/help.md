## ⚡️ Guía de Uso para broWorks dev-caddy

¡Bienvenido a tu centro de control de desarrollo! Esta herramienta está diseñada para ser el arsenal definitivo de tus comandos, permitiéndote acceder, copiar y gestionar de forma centralizada y ultrarrápida todas las instrucciones que usas en tu día a día. Se acabó el buscar en historiales o blocs de notas.

---

### 🎯 Interfaz Principal

**La aplicación se divide en dos áreas de trabajo principales:**

- **⬅️ Panel Izquierdo (Navegación):** Aquí es donde navegas por tus **Categorías**. Utiliza el buscador superior para filtrarlas al instante. Si necesitas más espacio de trabajo, puedes plegar y desplegar esta barra con el botón `Colapsar` en la parte inferior.
- #️⃣ **Comandos:** Aquí aparecen todos los comandos de la categoría que hayas seleccionado a la izquierda. Usa la barra de búsqueda principal (o el atajo `Ctrl+K`) para encontrar un comando específico por su nombre o por su contenido.

---

### #️⃣ Tipos de Comandos

**dev-caddy maneja tres tipos de comandos para adaptarse a todas tus necesidades:**

- **▶️ Comando Simple:** El más básico y directo. Es un comando que no cambia. Muestra su descripción y un botón para copiarlo al portapapeles con un solo clic. Perfecto para esas tareas repetitivas de "disparar y olvidar".
- **🚀 Workflow (Secuencia):** Para procesos complejos de varios pasos. En lugar de un simple botón de copiar, encontrarás el botón `Copy Step & Next`. Al pulsarlo, no solo copia el comando del paso actual, sino que avanza automáticamente al siguiente, guiándote a través del workflow y evitando que te saltes pasos.
- **📝 Comando con Variables (Plantilla):** Son plantillas de comandos con "huecos" dinámicos (ej: `ssh {user}@{host}`). Al seleccionarlo, aparecerán campos de texto para que rellenes cada una de las variables. Una vez completados, el botón "Copy" generará y copiará el comando final con tus datos ya integrados.

---

### ⚙️ Administración

Haz clic en el botón **"Administrar"** en la barra lateral para abrir el panel de gestión. Este es el centro neurálgico para personalizar la herramienta.

- **Gestionar Categorías:** En la columna de la izquierda del panel de administración, puedes:
    - **Añadir** nuevas categorías con su propio nombre e icono.
    - **Editar** una categoría existente haciendo clic en el icono del lápiz que aparece al pasar el ratón.
    - **Eliminar** la categoría seleccionada (¡cuidado, esto también borrará todos sus comandos asociados!).
- **Gestionar Comandos:** En la columna de la derecha, y siempre con una categoría previamente seleccionada, podrás:
    - **Añadir** nuevos comandos de cualquier tipo (Simple, Workflow o con Variables) a la categoría elegida.
    - **Editar** un comando existente para cambiar su nombre, el propio comando, los pasos de un workflow o sus variables.
    - **Eliminar** comandos de forma individual.

---

### 🛠️ Personalización Avanzada (Edición Directa)

Para los más valientes: la fuente única de verdad de toda la aplicación reside en el fichero `app/data/commands.json`. Si necesitas hacer cambios masivos, reordenar comandos o crear estructuras complejas, puedes editar este fichero directamente.

**Recomendación:** Haz siempre una copia de seguridad del fichero antes de modificarlo manualmente para evitar romper la estructura JSON.

---

### ✨ Consejos Profesionales

- **Organiza bien tus categorías:** Una buena estructura de categorías (Docker, Git, VPS-Producción, VPS-Desarrollo...) es la clave para encontrar lo que necesitas en segundos.
- **Usa el atajo `Ctrl+K`:** Acostúmbrate a usarlo para acceder a la búsqueda de comandos sin levantar las manos del teclado.
- **Crea Workflows para tareas críticas:** No te fíes de tu memoria para los procesos de despliegue o reinicios completos. Un workflow te asegurará ejecutar siempre los mismos pasos en el orden correcto.