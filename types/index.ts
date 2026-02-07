/**
 * Centralized TypeScript type definitions for Dev-Caddy
 * Single source of truth for all data structures
 */

/**
 * Variable definition for commands with dynamic placeholders
 */
export interface Variable {
    name: string;
    placeholder: string;
}

/**
 * Command entity representing a saved item
 * Supports three types: command, workflow, and prompt
 */
export interface Command {
    id: string;
    label: string;
    command: string;
    type: "command" | "workflow" | "prompt";
    isFavorite?: boolean;
    order?: number;
    categoryName?: string; // Category origin (injected for Favorites/Search)
    copyCount?: number; // Usage analytics (incremented on copy)
    // Variables can be either structured objects or simple strings (for prompts)
    variables?: Variable[] | string[];
    steps?: string[];
}

/**
 * Category entity for organizing commands
 */
export interface Category {
    id: string;
    name: string;
    icon: string;
    order?: number;
}

/**
 * Root application data structure
 * Represents the entire commands.json file
 */
export interface AppData {
    categories: Category[];
    commands: Record<string, Command[]>;
}
