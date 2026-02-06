# Dev-Caddy Architecture

## Overview
Dev-Caddy is a **Single Page Application (SPA)** designed for developers to manage and execute frequent commands, prompts, and workflows. It is built with **Next.js 14** (App Router) and uses **Local Storage** for data persistence.

## Tech Stack
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit

## Core Concepts

### 1. Single Page Design
The entire application lives in `/app/page.tsx`.
- **Sidebar**: Manages Categories.
- **Main Area**: Displays Commands for the selected category.
- **Modals**: Handle creation/editing of Commands and Categories.

### 2. Data Persistence
Data is stored directly in the local file system (in dev mode) or LocalStorage (in production demo) via a unified hook `useCommands`.
- **Data Structure**:
    ```typescript
    interface AppData {
        categories: Category[];
        commands: Record<string, Command[]>; // Keyed by Category ID
    }
    ```
- **Backup**: Users can export/import their entire configuration as a JSON file.

### 3. State Management
- **AppStore (Zustand)**: UI state like `isEditMode`, `selectedCategory`, `sidebarCollapsed`.
- **Local State**: Form inputs, drag-and-drop temporary state.

### 4. Edit Mode
A global toggle switch in the Sidebar enables "Admin Features":
- **Drag & Drop**: Reorder categories and commands.
- **CRUD Operations**: Create, Edit, Delete categories and commands.
- **Visual Feedback**: Drag handles and extra menus appear only in Edit Mode.

## Directory Structure
- `app/`: Main application routes (only `page.tsx` and `api/`).
- `components/dev-caddy/`: All UI components (Cards, Sidebar, Forms).
- `hooks/`: Custom hooks (`use-commands.tsx`).
- `store/`: Zustand stores.
- `types/`: TypeScript definitions.
- `docs/`: project documentation.
