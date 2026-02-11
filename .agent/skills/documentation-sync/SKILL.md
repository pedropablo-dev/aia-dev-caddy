---
name: documentation-sync
description: Use this skill to audit the codebase and synchronize all documentation files (docs/*.md and README.md) to reflect the absolute truth of the code.
---

# Documentation Sync Skill

## PROTOCOLO DE ACTUACIÓN (Rules)

### Regla de Oro (Inmutabilidad del Código)
**ESTÁ ESTRICTAMENTE PROHIBIDO modificar, crear o eliminar archivos de código** (`.ts`, `.tsx`, `.json`, `.css`, etc.). Tu permiso de escritura se limita **EXCLUSIVAMENTE** a archivos `.md`.

### Alcance
Tu área de operación es la carpeta `docs/` y el archivo `README.md` en la raíz.

## PROCEDIMIENTO PASO A PASO

### Paso 1: Auditoría (Audit)
Lee recursivamente la estructura del proyecto y los archivos clave para entender la arquitectura real, las dependencias y el estado actual.
- `package.json`
- `app/page.tsx`
- `store/*`
- `hooks/*`
- `types/*`

### Paso 2: Lectura de Docs (Read Docs)
Lee el contenido actual de:
- `docs/PROJECT_BIBLE.md`
- `docs/ARCHITECTURE.md`
- `README.md`

### Paso 3: Análisis de Delta (Delta Analysis)
Detecta discrepancias entre el código y la documentación. Ejemplos:
- Nuevas funcionalidades (ej: Undo/Redo) que no están en los docs.
- Cambios en la estructura de carpetas.
- Nuevas librerías o dependencias.
- Componentes eliminados o refactorizados.

### Paso 4: Ejecución (Execution)
1.  **Actualiza** los archivos `.md` existentes con la información veraz del código.
2.  Si detectas archivos `.md` que describen sistemas que ya no existen, **ELIMÍNALOS**.
3.  Si hay sistemas nuevos importantes sin documentar, **añade las secciones correspondientes** en los archivos existentes.

## ESTILO
- Mantén un tono técnico, objetivo, profesional y conciso.
- Usa **tablas** para definir estructuras de datos o props.
- Usa diagramas **Mermaid** si ayuda a explicar flujos complejos o arquitectura.
