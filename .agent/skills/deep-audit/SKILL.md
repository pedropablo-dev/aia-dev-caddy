---
name: deep-audit
description: Performs a 360-degree technical audit of the codebase (Security, Performance, Integrity, Typing, A11y) and generates a detailed report.
---

# Deep Audit Skill

## REGLAS DE EJECUCIÓN

### Solo Lectura
**NO toques el código fuente.** Tu función es puramente analítica. Tu único output permitido es el informe de auditoría.

### Output
Genera o sobrescribe **SIEMPRE** el archivo `docs/AUDIT_REPORT.md` con los resultados.

### Estilo
Sé **crítico, directo y técnico**. No suavices los problemas.
Clasifica cada hallazgo por severidad:
- **[CRÍTICO]**: Rompe la aplicación o vulnerabilidad de seguridad grave. Arreglar YA.
- **[ALTO]**: Impacto significativo en rendimiento o manetnibilidad. Arreglar pronto.
- **[MEDIO]**: Deuda técnica o mejora UX. Planificar.
- **[BAJO]**: Nitpicks, estilo o sugerencias menores.

## DIMENSIONES DE LA AUDITORÍA (Checklist 10/10)

### A. Integridad y Lógica
- Busca bugs lógicos evidentes o sutiles.
- Detecta **Race Conditions** (condiciones de carrera) en estados asíncronos.
- Revisa el manejo de errores: `try/catch` vacíos o insuficientes.

### B. Seguridad
- Inyección de dependencias o SQL/Code Injection (si aplica).
- Exposición de datos sensibles (API Keys, secretos en cliente).
- Validación de Inputs: ¿Se usa Zod/Yup? ¿Se validan los datos de API?
- Seguridad en API Routes y Server Actions.

### C. Rendimiento (React/Next.js)
- Detecta **re-renderizados innecesarios**.
- Mal uso de `useEffect` (dependencias faltantes o excesivas).
- Operaciones costosas en render sin `useMemo` o `useCallback`.
- Identifica componentes marcados con `'use client'` que podrían ser Server Components.

### D. TypeScript & Calidad
- Busca el **uso de `any`** explícito o implícito. ¡Erradícalo!
- Complejidad Ciclomática: Detecta funciones con demasiados `if/else` anidados.
- Código muerto, comentado o duplicado (DRY violations).

### E. UX & Accesibilidad
- Falta de feedback visual ante acciones de usuario (loading states, toasts, disable buttons).
- **Semántica HTML y A11y**: `aria-labels` faltantes, etiquetas incorrectas, contraste.

## FORMATO DEL REPORTE (Markdown)

El archivo `docs/AUDIT_REPORT.md` debe seguir estrictamente esta estructura:

# Informe de Auditoría Técnica (Deep Audit)
**Fecha:** [Fecha Actual]
**Versión Auditada:** [Commit/Estado actual]

## 1. Resumen Ejecutivo
Estado general de salud del proyecto (0-100%). Párrafo conciso sobre la calidad global.

## 2. Tabla de Hallazgos Críticos
| Archivo | Problema | Severidad | Acción |
|---------|----------|-----------|--------|
| ...     | ...      | [CRÍTICO] | ...    |

## 3. Análisis Detallado por Categoría

### [Categoría A/B/C/D/E]
#### [ID-Problema] Título del Problema (Severidad)
- **Ubicación:** `path/to/file.tsx:L10-20`
- **Descripción:** Explicación técnica del error o ineficiencia.
- **Snippet Culpable:**
  ```typescript
  // Código actual
  ```
- **Solución Recomendada:**
  ```typescript
  // Código corregido (o explicación)
  ```

## 4. Plan de Refactorización Sugerido
Lista ordenada de pasos para sanear el proyecto, priorizando [CRÍTICO] y [ALTO].
