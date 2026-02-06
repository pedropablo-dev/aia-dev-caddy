# Contributing to Dev-Caddy

Thank you for your interest in contributing! We want to keep Dev-Caddy fast, local, and beautiful.

## Core Principles

1.  **Local First**: No external databases or required backend services. The app must run 100% in the browser.
2.  **Performance**: Avoid heavy libraries where possible.
3.  **Aesthetics**: Follow the existing Dark Mode / Cyberpunk-lite aesthetic. Use existing Tailwind tokens.

## Development Workflow

1.  **Fork & Clone**:
    ```bash
    git clone ...
    npm install
    npm run dev
    ```
2.  **Branching**: Use `feature/` or `fix/` prefixes.
3.  **Commits**: Use conventional commits (e.g., `feat: add new icon`, `fix: resolve sort bug`).

## Coding Standards

-   **Notifications**: NEVER use `alert()` or `window.confirm()`. Use the custom hook `useToast` from `context/ToastContext`.
    ```tsx
    const { notify } = useToast();
    notify("Operation successful", "success");
    ```
-   **Icons**: Use `lucide-react`.
-   **State**: Use `Zustand` for global UI state, but keep data logic in `use-commands` hook where possible.

## Pull Requests

-   Ensure `npm run build` passes.
-   Update `CHANGELOG.md` if you added a feature.
