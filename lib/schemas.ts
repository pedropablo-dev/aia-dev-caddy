import { z } from "zod";
import type { Variable, Command, Category, AppData } from "@/types";

/**
 * Schema for command variables (two formats supported)
 * Format 1: Object with name and placeholder
 * Format 2: Simple string (for prompts)
 */
export const VariableObjectSchema = z.object({
  name: z.string().min(1, "Variable name is required"),
  placeholder: z.string(),
}) satisfies z.ZodType<Variable>;

/**
 * Schema for Command entities
 * Supports: simple commands, workflows, and prompts
 */
export const CommandSchema = z.object({
  id: z.string().min(1, "Command ID is required"),
  label: z.string().min(1, "Command label is required"),
  command: z.string(),
  type: z.enum(["command", "workflow", "prompt"], {
    errorMap: () => ({ message: "Type must be 'command', 'workflow', or 'prompt'" }),
  }),
  isFavorite: z.boolean().optional(),
  order: z.number().int().nonnegative().optional(),
  // Variables can be either array of objects or array of strings (for prompts)
  variables: z
    .union([z.array(VariableObjectSchema), z.array(z.string())])
    .optional(),
  steps: z.array(z.string()).optional(),
}) satisfies z.ZodType<Command>;

/**
 * Schema for Category entities
 */
export const CategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Category name is required"),
  icon: z.string().min(1, "Category icon is required"),
  order: z.number().int().nonnegative().optional(),
}) satisfies z.ZodType<Category>;

/**
 * Schema for the entire AppData structure
 * This is the root schema used to validate the commands.json file
 */
export const AppDataSchema = z.object({
  categories: z.array(CategorySchema),
  commands: z.record(z.string(), z.array(CommandSchema)),
}) satisfies z.ZodType<AppData>;

