# Dev-Caddy Roadmap: Path to Production

> From MVP to 10/10 Production-Grade Application

---

## Current State: v0.1.0 (MVP)

✅ Core functionality works  
❌ Not production-ready  
❌ Won't deploy to serverless  
❌ Security vulnerabilities  

---

## Phase 1: Foundation Hardening (Priority: Critical)

### Step 1.1: Implement Zod Validation
**Effort:** 2 hours | **Impact:** High

Create schema validation for API endpoints:

```typescript
// lib/schemas.ts
import { z } from 'zod';

export const VariableSchema = z.object({
  name: z.string().min(1),
  placeholder: z.string()
});

export const CommandSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  command: z.string(),
  type: z.enum(['command', 'workflow', 'prompt']),
  isFavorite: z.boolean().optional(),
  order: z.number().optional(),
  variables: z.union([
    z.array(VariableSchema),
    z.array(z.string())
  ]).optional(),
  steps: z.array(z.string()).optional()
});

export const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().min(1),
  order: z.number().optional()
});

export const AppDataSchema = z.object({
  categories: z.array(CategorySchema),
  commands: z.record(z.string(), z.array(CommandSchema))
});
```

Update API route:
```typescript
// app/api/commands/route.ts
import { AppDataSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  const body = await request.json();
  const result = AppDataSchema.safeParse(body);
  
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }
  // ... proceed with validated data
}
```

---

### Step 1.2: Centralize Type Definitions
**Effort:** 1 hour | **Impact:** Medium

```typescript
// types/index.ts
export interface Variable {
  name: string;
  placeholder: string;
}

export interface Command {
  id: string;
  label: string;
  command: string;
  type: 'command' | 'workflow' | 'prompt';
  isFavorite?: boolean;
  order?: number;
  variables?: Variable[] | string[];
  steps?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  order?: number;
}

export interface AppData {
  categories: Category[];
  commands: Record<string, Command[]>;
}
```

---

### Step 1.3: Replace alert() with toast()
**Effort:** 30 minutes | **Impact:** Medium

Find and replace in `page.tsx` and `admin/page.tsx`:

```typescript
// Before
alert("Error al guardar los datos.")

// After
import { toast } from "sonner"
toast.error("Error al guardar los datos.")
```

Add `<Toaster />` to layout or each page.

---

## Phase 2: Component Atomic Design (Priority: High)

### Step 2.1: Extract Shared Components
**Effort:** 4 hours | **Impact:** Very High

```
components/
├── commands/
│   ├── CommandCard.tsx        # Single command display
│   ├── CommandList.tsx        # List with scroll
│   ├── WorkflowCard.tsx       # Multi-step workflow
│   └── PromptCard.tsx         # AI prompt display
│
├── categories/
│   ├── CategoryButton.tsx     # Single category
│   ├── CategoryList.tsx       # Sidebar list
│   └── CategorySearch.tsx     # Filter input
│
├── layout/
│   ├── Sidebar.tsx            # Collapsible sidebar
│   ├── MainPanel.tsx          # Content area
│   └── SearchHeader.tsx       # Ctrl+K search bar
│
└── shared/
    ├── LoadingScreen.tsx
    ├── ErrorBoundary.tsx
    └── ConfirmDialog.tsx
```

---

### Step 2.2: Create Custom Hooks
**Effort:** 2 hours | **Impact:** High

```typescript
// hooks/useCommandsData.ts
export function useCommandsData() {
  const [data, setData] = useState<AppData>({ categories: [], commands: {} });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => { /* ... */ };
  const saveData = async (newData: AppData) => { /* ... */ };
  const addCommand = async (categoryId: string, command: Command) => { /* ... */ };
  const updateCommand = async (categoryId: string, command: Command) => { /* ... */ };
  const deleteCommand = async (categoryId: string, commandId: string) => { /* ... */ };

  return { data, isLoading, fetchData, saveData, addCommand, updateCommand, deleteCommand };
}
```

---

## Phase 3: Data Layer Migration (Priority: Critical for Deployment)

### Option A: SQLite with Turso (Recommended)
**Effort:** 8 hours | **Impact:** Critical

Turso provides edge-compatible SQLite:

```bash
npm install @libsql/client
```

```typescript
// lib/db.ts
import { createClient } from '@libsql/client';

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});
```

---

### Option B: Supabase
**Effort:** 6 hours | **Impact:** Critical

```bash
npm install @supabase/supabase-js
```

Tables:
- `categories(id, name, icon, order)`
- `commands(id, category_id, label, command, type, ...)`

---

### Option C: JSON in Cloud Storage
**Effort:** 4 hours | **Impact:** Critical

Store `commands.json` in:
- Vercel Blob Storage
- AWS S3
- Cloudflare R2

Simplest migration path but limited scalability.

---

## Phase 4: Error Handling & UX Polish

### Step 4.1: Global Error Boundary
**Effort:** 1 hour

```typescript
// app/error.tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div className="...">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

### Step 4.2: Loading States
**Effort:** 1 hour

Add loading skeletons for:
- Command list
- Category sidebar
- Admin panels

---

### Step 4.3: Data Backup
**Effort:** 2 hours

- Export to JSON button
- Import from JSON
- Auto-backup to localStorage

---

## Version Milestones

| Version | Features | ETA |
|---------|----------|-----|
| **v0.2.0** | Zod validation, types, toasts | 1 day |
| **v0.3.0** | Component refactor, hooks | 3 days |
| **v0.4.0** | Database migration | 1 week |
| **v1.0.0** | Production-ready | 2 weeks |

---

## Success Criteria for v1.0.0

- [ ] Deploys successfully to Vercel
- [ ] No `alert()` calls anywhere
- [ ] All API inputs validated with Zod
- [ ] No single file > 300 lines
- [ ] Shared types in one location
- [ ] Error boundaries catch failures
- [ ] Loading states for all async ops
- [ ] Export/import for backup
