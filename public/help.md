# 🏌️‍♂️ Guía de Usuario Dev-Caddy

Bienvenido a tu **caddy** personal para el desarrollo. Aquí tienes todo lo que necesitas saber para dominar la herramienta.

---

### 🚀 1. Gestión de Comandos

**Dev-Caddy** está diseñado para velocidad.

- **Copiar**: Haz clic en cualquier tarjeta para copiar su contenido al portapapeles.
- **Crear**: Pulsa el botón flotante **`+`** (abajo derecha) o usa el **Modo Edición**.
- **Organizar**:
  - Activa el **Modo Edición** (candado en la sidebar).
  - Arrastra y suelta comandos para reordenarlos.
  - Arrastra categorías en la sidebar para cambiar su orden.

---

### 🧠 2. AI Prompts (Killer Feature)

La funcionalidad estrella para trabajar con LLMs (ChatGPT, Claude, etc.).

**¿Cómo funciona?**
Al crear un comando o prompt, usa la sintaxis `{variable}` para crear campos dinámicos.

**Ejemplo:**
1. Creas un nuevo prompt con el texto:
   > *"Actúa como un experto en `{Lenguaje}` y explícame cómo funciona `{Concepto}`."*

2. En la tarjeta del dashboard, verás automáticamente dos inputs: **Lenguaje** y **Concepto**.
3. Escribes "Python" y "AsyncIO".
4. Al copiar, obtendrás:
   > *"Actúa como un experto en Python y explícame cómo funciona AsyncIO."*

¡Ideal para reutilizar tus mejores prompts!

---

### 💾 3. Seguridad de Datos

**Importante:** Dev-Caddy es **100% Local**. No hay base de datos en la nube.

- Tus datos viven en el **navegador** (LocalStorage).
- **¡Cuidado!** Si borras la caché del navegador, perderás tus comandos.

**Solución: Backups**
1. Activa el **Modo Edición**.
2. En la sidebar, verás los botones **Exportar** e **Importar**.
3. Haz clic en **Exportar** regularmente para descargar un archivo `.json` con todos tus datos.

---

### 💡 4. Pro Tips

- **Búsqueda Rápida**: Pulsa `Ctrl + K` (o `Cmd + K` en Mac) para abrir la búsqueda global instantánea.
- **LIFO**: Los comandos nuevos siempre aparecen arriba.
- **Favoritos**: La categoría "Favoritos" siempre está arriba y no se puede borrar. Úsala para lo más vital.

---

*Hecho con ❤️ para developers.*