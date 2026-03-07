# Implementation Plan Template

Use this template when creating implementation plans for features.

## 1. Requirements Summary

**User Story:** [Reference to user story]

**Acceptance Criteria:**

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Scope:**

- In scope: [What's included]
- Out of scope: [What's explicitly excluded]

---

## 2. Technical Approach

**Solution Overview:**
[High-level description of the approach]

**Key Decisions:**
| Decision | Rationale |
|----------|-----------|
| [Decision 1] | [Why this choice] |
| [Decision 2] | [Why this choice] |

**Dependencies:**

- [Dependency 1]
- [Dependency 2]

---

## 3. Database Changes

**Schema Changes:**

```sql
-- New tables or modifications
```

**Migrations:**

- [ ] Migration 1: [Description]
- [ ] Migration 2: [Description]

---

## 4. API Layer

**Endpoints / Lambda handlers:**

| Method | Path          | Description     |
| ------ | ------------- | --------------- |
| GET    | /api/resource | Fetch resources |
| POST   | /api/resource | Create resource |

---

## 5. Component Architecture

**Component Hierarchy:**

```
ParentComponent
├── ChildComponent1
└── ChildComponent2
```

**Props & Interfaces:**

```typescript
interface ParentComponentProps {
  // Define component props
}
```

---

## 6. State Management

**Data Flow:**

```
User Action -> Component -> API (src/api/) -> Update UI
```

---

## 7. Edge Cases & Error Handling

- [ ] Empty state handling
- [ ] Loading state handling
- [ ] Error state handling

---

## 8. Testing Strategy

- [ ] Manual testing checklist
- [ ] Build passes

---

## 9. Implementation Checklist

**Phase 1: Components**

- [ ] Task 1
- [ ] Task 2

**Phase 2: API wiring**

- [ ] Task 1

**Phase 3: Polish**

- [ ] Task 1

---

## 10. Effort & Risks

**Complexity:** [Low/Medium/High]

**Notes:**

[Any additional context or decisions to remember]
