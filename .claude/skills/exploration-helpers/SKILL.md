---
name: Exploration Helpers
description: |
  Use this skill when the user needs to explore the codebase, understand database schema, navigate API endpoints, or validate TypeScript types. Triggers on: "Explore the database", "Understand codebase structure", "Validate TypeScript types", "Find API endpoints", "Database schema", "How is the code organized?", "What tables exist?".
version: 1.0.0
---

# Exploration Helpers

Guidance for exploring and understanding the Future Technologies LMS codebase.

## Codebase Exploration

### Key Entry Points

| File | Purpose |
|------|---------|
| `src/main.tsx` | App entry point |
| `src/App.tsx` | Router + top-level layout |
| `src/pages/` | One file per screen (12 screens) |
| `src/components/` | Shared UI + layout components |
| `src/api/` | All backend calls (Lambda-ready) |
| `src/types/` | TypeScript interfaces |
| `src/hooks/` | Custom React hooks |
| `src/store/` | State management |

### Finding Existing Patterns

**Find all pages:**
```bash
# Pattern: src/pages/**/*.tsx
```

**Find all components:**
```bash
# Pattern: src/components/**/*.tsx
```

**Find API calls:**
```bash
# Pattern: src/api/**/*.ts
```

**Find types:**
```bash
# Pattern: src/types/**/*.ts
```

### Understanding a Feature

When exploring before implementing a new screen:

1. Check `src/pages/` for similar existing pages
2. Check `src/components/` for reusable UI elements
3. Check `src/api/` for existing API patterns
4. Read `CLAUDE.md` brand colors and design system

## DynamoDB Exploration (Phase 3+)

When DynamoDB is set up, tables will be:

- `users` — user profiles
- `courses` — course catalog
- `progress` — student progress per course
- `assignments` — homework/exam records

## Type Validation

```bash
# Check TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint

# Build check
npm run build
```

## Exploration Workflow

1. Read `CLAUDE.md` for project context and brand rules
2. Check `src/pages/` for existing screen implementations
3. Look at `src/components/ui/` for existing UI patterns
4. Check `tailwind.config.js` for custom theme values
5. Read `src/index.css` for global styles
