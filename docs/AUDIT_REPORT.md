# Informe de Auditoría Técnica (Deep Audit)
**Fecha:** 2026-02-11
**Versión Auditada:** Actual (Post-Undo/Redo implementation)

## 1. Resumen Ejecutivo
El proyecto `broworks-dev-caddy` muestra una arquitectura sólida para una SPA local basada en Next.js. La separación de responsabildades es clara (Hooks para lógica, Componentes para UI, Zod para validación).

Sin embargo, existen **riesgos críticos de integridad de datos** debido a la estrategia de persistencia en archivo (Last Write Wins) sin control de concurrencia. Además, detectamos patrones de rendimiento ineficientes (`JSON.parse/stringify` y re-binding de eventos) y deuda técnica en el tipado (`any`).

**Puntuación de Salud:** 82/100

## 2. Tabla de Hallazgos Críticos
| Archivo | Problema | Severidad | Acción |
|---------|----------|-----------|--------|
| `app/api/commands/route.ts` | Race Condition en escritura de archivo (File Corruption risk) | **[CRÍTICO]** | Implementar cola de escritura o lockfile. |
| `components/.../EditorOverlay.tsx` | Re-binding de event listener `keydown` en cada render | **[ALTO]** | Usar `useCallback` o ref para el handler. |
| `app/page.tsx` | Uso excesivo de `JSON.parse(JSON.stringify(data))` | **[MEDIO]** | Usar `structuredClone` o librerías inmutables. |
| `components/.../EditorOverlay.tsx` | Uso de `prompt()` nativo (Bloqueante) | **[MEDIO]** | Reemplazar por Dialog/Modal UI. |
| `app/page.tsx` | Uso explícito de `any` en variables y form data | **[BAJO]** | Tipar estrictamente con interfaces. |

## 3. Análisis Detallado por Categoría

### A. Integridad y Lógica
#### [INT-01] Race Condition en Persistencia (Severidad: CRÍTICO)
- **Ubicación:** `app/api/commands/route.ts:42`
- **Descripción:** El endpoint POST sobrescribe el archivo `commands.json` completo. Si dos peticiones llegan casi simultáneamente (ej: debounce fallido o múltiples pestañas), la última sobrescribe a la primera, perdiendo datos.
- **Snippet Culpable:**
  ```typescript
  await fs.writeFile(dataFilePath, JSON.stringify(validationResult.data), 'utf8');
  ```
- **Solución Recomendada:** Implementar un sistema de "optimistic locking" simple (enviar versión del archivo) o un mecanismo de cola en el server-side para escrituras secuenciales.

#### [INT-02] Generación de IDs insegura (Severidad: BAJO)
- **Ubicación:** `app/page.tsx:210`
- **Descripción:** `Math.random()` no garantiza unicidad criptográfica ni colisiones cero.
- **Solución:** Usar `crypto.randomUUID()`.

### B. Seguridad
#### [SEC-01] Datos de entrada Zod (Severidad: PASSED)
- La validación con `AppDataSchema.safeParse` en el backend es correcta y protege contra inyección de datos corruptos.

### C. Rendimiento (React/Next.js)
#### [PERF-01] Ineficiencia en Deep Cloning (Severidad: MEDIO)
- **Ubicación:** `app/page.tsx` (Múltiples líneas: 259, 279, 320, 414, etc.)
- **Descripción:** Se usa `JSON.parse(JSON.stringify(data))` para clonar el estado antes de mutarlo. Esto es lento y costoso para objetos grandes.
- **Snippet Culpable:**
  ```typescript
  const newData: AppData = JSON.parse(JSON.stringify(data))
  ```
- **Solución Recomendada:** Usar `structuredClone(data)` (nativo y más rápido) o cambiar a `immer` para mutabilidad segura.

#### [PERF-02] Event Listener Memory Thrashing (Severidad: ALTO)
- **Ubicación:** `components/dev-caddy/editor/EditorOverlay.tsx:99-110`
- **Descripción:** El `useEffect` que añade el listener de `keydown` (Ctrl+S) depende de `[label, text, variables]`. Cada vez que escribes una letra, el effect se desmonta y monta de nuevo, removiendo y añadiendo el listener al `window`.
- **Snippet Culpable:**
  ```typescript
  useEffect(() => { ... }, [isOpen, label, text, variables])
  ```
- **Solución Recomendada:** Usar una **Ref** para acceder al estado actual dentro del listener sin reiniciarlo, o solo depender de `isOpen`.
  ```typescript
  const stateRef = useRef({ label, text, variables });
  // Sincronizar ref
  useEffect(() => { stateRef.current = { label, text, variables }; }, [label, text, variables]);
  
  useEffect(() => {
     const handler = (e) => {
         const current = stateRef.current; // Acceder sin dependency
         // ...
     }
     window.addEventListener('keydown', handler);
     return () => window.removeEventListener('keydown', handler);
  }, [isOpen]); // Solo depende de si está abierto
  ```

### D. TypeScript & Calidad
#### [TS-01] Uso de `any` explícito (Severidad: BAJO)
- **Ubicación:** `app/page.tsx:183` y `561`
- **Snippet:** `variables?: any[]` y `onFormSubmit = (formData: any)`
- **Solución:** Usar los tipos `Variable[]` y `CommandFormData` respectivamente.

### E. UX & Accesibilidad
#### [UX-01] Uso de `prompt()` nativo (Severidad: MEDIO)
- **Ubicación:** `components/dev-caddy/editor/EditorOverlay.tsx:220`
- **Descripción:** `prompt()` detiene la ejecución del hilo principal de JS y tiene una UI inconsistente con la app.
- **Solución:** Implementar un Popover o Dialog de Shadcn para insertar enlaces/imágenes.

#### [A11Y-01] Botones sin etiqueta accesible (Severidad: BAJO)
- **Ubicación:** `CommandCard.tsx` y `Sidebar.tsx`
- **Descripción:** Múltiples botones solo tienen icono. Aunque tienen `title`, los lectores de pantalla prefieren `aria-label` o texto visible `sr-only`.

## 4. Plan de Refactorización Sugerido

1.  **[RAPID FIX]** Reemplazar `JSON.parse(JSON.stringify)` por `structuredClone` en `page.tsx`.
2.  **[PERF]** Optimizar `EditorOverlay` para evitar re-binding de listeners.
3.  **[UX]** Eliminar `prompt()` del editor y usar componentes UI.
4.  **[INTEGRITY]** Investigar librería de bajo nivel (ej: `lowdb` o similar) para manejo de archivos JSON con locking, o implementar cola de escritura en `route.ts`.
5.  **[CLEANUP]** Eliminar tipos `any` y aplicar `aria-label` faltantes.
