# Contributing to Dev-Caddy

Thank you for your interest in contributing! We want to keep Dev-Caddy fast, local, and beautiful.

## Core Principles

1.  **Local First**: No external databases or required backend services. The app must run 100% locally.
2.  **Performance**: Avoid heavy libraries where possible.
3.  **Aesthetics**: Follow the existing Dark Mode aesthetic. Use existing Tailwind tokens.

## Development Workflow

1.  **Fork & Clone**:
    ```bash
    git clone https://github.com/pedropablo-dev/broworks-dev-caddy.git
    npm install
    npm run dev
    ```
2.  **Branching**: Use `feature/` or `fix/` prefixes.
3.  **Commits**: Use conventional commits (e.g., `feat: add new icon`, `fix: resolve sort bug`).

## Coding Standards

### Notifications
Use **Sonner** for all user feedback. NEVER use `alert()`:
```tsx
import { toast } from "sonner"

toast.success("Operación completada")
toast.error("Error al guardar")
```

### Icons
Use `lucide-react` exclusively:
```tsx
import { Pencil, Trash2, Copy } from "lucide-react"
```

### State Management
- **Zustand Stores**: For persistent UI state (`appStore`, `uiStore`)
- **useCommands Hook**: For all data operations (fetch, save, toggle)
- **Local State**: For form inputs and ephemeral UI state

### Data Validation
All API data is validated with Zod schemas in `lib/schemas.ts`.

### Edit Mode
All CRUD operations require Edit Mode to be enabled. Use `isEditMode` from `useAppStore`:
```tsx
const { isEditMode } = useAppStore()
```

## Pull Requests

-   Ensure `npm run build` passes
-   Update `CHANGELOG.md` if you added a feature
-   Test both expanded and collapsed sidebar states
-   Verify drag & drop still works after changes
