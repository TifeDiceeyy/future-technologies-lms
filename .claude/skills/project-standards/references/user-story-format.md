# User Story Format Reference

## Template

```markdown
# US-XXX: [Story Title]

## User Story

As a [user type],
I want [goal],
So that [benefit].

## Context

[Background information, related stories, dependencies]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Notes

[Any technical considerations, constraints, or recommendations]

## Edge Cases

- [ ] Edge case 1: [Expected behavior]
- [ ] Edge case 2: [Expected behavior]

## Out of Scope

- [Explicitly excluded item 1]

## UI/UX Notes

[Reference to GP2_3.pptx slide, wireframe, or design notes]

## AWS Phase

Phase X — [phase name]
```

## Example

```markdown
# US-001: Landing Page

## User Story

As a prospective student,
I want to see the Future Technologies landing page,
So that I understand what the platform offers and can sign up.

## Acceptance Criteria

- [ ] Hero section displays brand name and tagline "Your Gateway to the Innovations"
- [ ] CTA button is visible and styled with purple accent
- [ ] Page uses dark navy background (#0a0c10)
- [ ] Page is responsive on mobile and desktop
- [ ] npm run build produces clean static output

## Technical Notes

- Static page only — no backend calls
- Must work as S3 static export

## AWS Phase

Phase 1 — S3 + CloudFront
```
