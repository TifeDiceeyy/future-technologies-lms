---
name: Project Standards
description: |
  Use this skill when the user asks about user story format, documentation standards, acceptance criteria, or code review practices. Triggers on: "User story format?", "How to write documentation?", "Acceptance criteria?", "Documentation standards", "Code review checklist", "How to write user stories".
version: 1.0.0
---

# Project Standards

Guidance for user stories, documentation conventions, and quality standards.

## User Story Standards

### User Story Format

```
As a [user type/persona],
I want [goal/desire],
So that [benefit/value].
```

### Acceptance Criteria

Write acceptance criteria in checklist format:

```markdown
- [ ] Users can see the landing page hero section
- [ ] CTA button navigates to sign up
- [ ] Page is responsive on mobile
```

### User Story ID Conventions

- **Display:** UPPERCASE (`US-001`)
- **File paths:** lowercase (`us-001-landing-page.md`)

---

## Architecture Standards (CRITICAL for this project)

1. **No Express.js** — pure Lambda handler pattern for all backend
2. **API calls isolated** — always in `src/api/` directory, never inline in components
3. **Static-first** — Phase 1 pages must work with `npm run build` (no backend calls)
4. **Env vars** — use `import.meta.env.VITE_*` for all config
5. **One component per file** — keep components small and focused

## Component Standards

- Pages go in `src/pages/`
- Shared UI in `src/components/ui/`
- Layout components (Sidebar, Header) in `src/components/layout/`
- Custom hooks in `src/hooks/`
- TypeScript types in `src/types/`

## Code Review Checklist

- [ ] Tailwind classes use brand colors (`#0a0c10`, `#7c3aed`, `#0891b2`)
- [ ] Dark theme maintained throughout
- [ ] No hardcoded API endpoints
- [ ] Component is properly typed (no `any`)
- [ ] Loading and error states handled
- [ ] Build passes (`npm run build`)
