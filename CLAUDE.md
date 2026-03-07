# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Future Technologies E-Learning Platform** — A full-stack e-learning web app built and deployed on AWS across 4 phases as a real portfolio project.

**Vision:** "A dark-themed, modern e-learning platform that students use to access courses, track progress, and complete assignments — deployed on production AWS infrastructure."

**Current State:** This repository is **scaffolded and ready for development**. Documentation, workflow commands, and skills are in place.

### Target Users

**Primary Market:** Students and self-learners seeking structured online courses in technology topics.

**Why This Matters:**

- Every feature must be deployable on AWS (Lambda-friendly architecture from day 1)
- App serves as a real portfolio project covering all 4 AWS phases (S3 → EC2 → DynamoDB → ECS)
- Must work as a static export for Phase 1 S3 hosting, then grow into full-stack in Phase 2+

---

## CRITICAL: Read Skills BEFORE Coding

**BEFORE implementing ANY feature, Claude will automatically activate relevant skills based on context.**

### Available Skills

Skills are interactive documentation that Claude activates on-demand:

1. **`.claude/skills/development-workflow/`** CORE
   - Feature development process (10-step SOP)
   - Git workflow and conventions
   - Implementation planning templates
   - **Triggers:** "How do I implement features?", "Git workflow?", "Create implementation plan"

2. **`.claude/skills/project-standards/`** (Full mode only)
   - User story format and acceptance criteria
   - Documentation conventions
   - Code review standards
   - **Triggers:** "User story format?", "Documentation standards?", "Acceptance criteria?"

3. **`.claude/skills/exploration-helpers/`** (Full mode only)
   - Database exploration patterns
   - Codebase navigation guidance
   - Type validation approaches
   - **Triggers:** "Explore the database", "Understand codebase", "Validate TypeScript types"

---

## Quick Start for Claude

### Key Files & Purposes

| File/Directory          | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `CLAUDE.md`             | This file - project hub and quick reference |
| `.claude/settings.json` | Hooks for auto-formatting                   |
| `.claude/commands/`     | Workflow commands for feature development   |
| `.claude/skills/`       | Interactive skills for guidance             |
| `.claude/project/`      | Project tracking (features, plans, roadmap) |

### Tech Stack

- **Frontend:** React + Vite (TypeScript)
- **Styling:** Tailwind CSS
- **Backend:** Node.js — Lambda handler pattern (NO Express, pure handlers)
- **Database:** DynamoDB (primary), RDS MySQL (Phase 3 alternative)
- **Auth:** AWS Cognito (Phase 2)
- **Deployment:** AWS (S3/CloudFront → EC2/ALB → ECS Fargate)
- **IaC:** Terraform (Phase 4)
- **CI/CD:** AWS CodePipeline + CodeBuild + CodeDeploy (Phase 4)

### Development Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm run test

# Build (static export for S3)
npm run build

# Preview build
npm run preview
```

---

## Brand & Design

- **Name:** Future Technologies
- **Tagline:** "Your Gateway to the Innovations"
- **Visual Style:** Dark navy/black background, purple + teal gradient glow, clean white text
- **Color Palette:**
  - Background: `#0a0c10`
  - Surface: `#111318`
  - Purple accent: `#7c3aed`
  - Teal accent: `#0891b2`
  - Text: `#e8eaf0`
  - Muted: `#5a6175`
- **Font:** Clean sans-serif (Syne or similar) for headings, monospace for code/data

---

## Screens to Build (from design mockup GP2_3.pptx)

| # | Screen | Route | Phase |
|---|--------|-------|-------|
| 1 | Landing page — hero + CTA | `/` | Phase 1 |
| 2 | Sign Up | `/signup` | Phase 2 (Cognito) |
| 3 | Register | `/register` | Phase 2 (Cognito) |
| 4 | Login — "Welcome back" | `/login` | Phase 2 (Cognito) |
| 5 | Home — "Your Learning Organized in One Place" | `/home` | Phase 1 |
| 6 | Dashboard — progress stats + current courses | `/dashboard` | Phase 3 |
| 7 | Notifications | `/notifications` | Phase 3 |
| 8 | My Courses — course list + progress bars | `/courses` | Phase 2 |
| 9 | Homework / Assignments | `/homework` | Phase 3 |
| 10 | Exams | `/exams` | Phase 3 |
| 11 | Attendance | `/attendance` | Phase 3 |
| 12 | Settings | `/settings` | Phase 2 |

---

## AWS Deployment Plan (4 Phases)

### Phase 1 — Foundation (S3 + CloudFront + Route 53)
- Build: Landing page + Home page (static, no backend needed)
- Deploy: `npm run build` → upload `/dist` to S3 bucket
- CDN: CloudFront distribution pointing to S3
- Domain: Route 53 custom domain + ACM SSL cert
- IAM: Least-privilege bucket policy
- **CV line:** "Deployed React app on AWS S3 + CloudFront with custom domain and SSL"

### Phase 2 — Compute (EC2 + Lambda + API Gateway + Cognito)
- Build: Auth pages (Login/Signup) + Courses page
- Backend: Lambda functions for courses API
- API: API Gateway REST endpoints
- Auth: AWS Cognito user pools
- Server option: EC2 + ALB for Node.js backend
- **CV line:** "Built serverless REST API with Lambda + API Gateway; auth via AWS Cognito"

### Phase 3 — Data & Storage (DynamoDB + RDS + CloudWatch)
- Build: Dashboard, Notifications, Homework, Exams, Attendance
- DB: DynamoDB tables for users, courses, progress, assignments
- Monitoring: CloudWatch dashboard + SNS alerts
- **CV line:** "Architected DynamoDB data layer with CloudWatch monitoring and SNS alerts"

### Phase 4 — Advanced (CodePipeline + ECS Fargate + Terraform)
- Containerize: Dockerfile for the app
- ECR: Push image to Elastic Container Registry
- ECS: Deploy on Fargate with ALB
- CI/CD: GitHub push → CodePipeline → CodeBuild → CodeDeploy
- IaC: Terraform for all infrastructure
- **CV line:** "Containerized app on ECS Fargate with full CI/CD pipeline via AWS CodePipeline and Terraform IaC"

---

## Architecture Rules (CRITICAL)

1. **No Express.js** — all backend logic in pure Lambda handlers from day 1
2. **Lambda-ready components** — keep API calls isolated in `/src/api/` directory
3. **Static-first** — Phase 1 must work as pure static export (`npm run build`)
4. **Env vars for all config** — no hardcoded AWS endpoints, use `.env` + Vite env
5. **Modular structure** — one component per file, easy to swap backend later
6. **Commit after every phase** — public GitHub repo, each phase gets its own commit tag

---

## Project Structure

```
future-technologies-lms/
├── CLAUDE.md
├── .claude/
│   ├── settings.json
│   ├── commands/
│   ├── skills/
│   └── project/
│       ├── high-level-user-stories.md
│       ├── roadmap.md
│       ├── features/
│       └── plans/
├── src/
│   ├── components/          # Shared UI components
│   │   ├── layout/          # Sidebar, Header, etc.
│   │   └── ui/              # Buttons, Cards, Inputs
│   ├── pages/               # One file per screen (12 screens)
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── SignUp.tsx
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Courses.tsx
│   │   ├── Homework.tsx
│   │   ├── Exams.tsx
│   │   ├── Attendance.tsx
│   │   ├── Notifications.tsx
│   │   └── Settings.tsx
│   ├── api/                 # All backend calls isolated here
│   │   ├── courses.ts       # → Lambda: GET/POST /courses
│   │   ├── auth.ts          # → Cognito
│   │   ├── progress.ts      # → DynamoDB
│   │   └── assignments.ts   # → DynamoDB
│   ├── hooks/               # Custom React hooks
│   ├── store/               # State management (Zustand or Context)
│   ├── types/               # TypeScript interfaces
│   └── styles/              # Global styles + Tailwind config
├── lambda/                  # Lambda handler functions (Phase 2+)
│   ├── courses/
│   ├── users/
│   └── progress/
├── terraform/               # IaC (Phase 4)
├── .env.example
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Feature Development Workflow

```
1. Story  -> Create in .claude/project/features/
2. Plan   -> Create in .claude/project/plans/
3. Approve -> Get user approval before coding
4. Build  -> Implement following the plan
```

Run `/implement` to start the complete workflow.

---

## Developer

- **Name:** Boluwatife (Tife) Abayomi
- **GitHub:** github.com/TifeDiceeyy
- **Stack comfort:** JavaScript, TypeScript, React, Python, AWS basics
- **Goal:** Ship this as a real, live, CV-worthy AWS portfolio project

---

## Progress Tracker

### Phase 1 — Foundation
- [ ] Project scaffolded (React + Vite + TypeScript + Tailwind)
- [ ] Landing page built (matches GP2_3 slide 1 design)
- [ ] Home page built (matches GP2_3 slide 5 design)
- [ ] `npm run build` produces clean static export
- [ ] S3 bucket created + static hosting enabled
- [ ] CloudFront distribution configured
- [ ] Route 53 domain + ACM SSL cert
- [ ] Live on custom domain ✅

### Phase 2 — Compute
- [ ] Login / Register / SignUp pages built
- [ ] AWS Cognito user pool configured
- [ ] Lambda functions for courses API
- [ ] API Gateway REST endpoints
- [ ] Courses page fetching real data

### Phase 3 — Data & Storage
- [ ] DynamoDB tables created (users, courses, progress, assignments)
- [ ] Dashboard + all inner pages built and connected to data
- [ ] CloudWatch dashboard + billing alerts

### Phase 4 — Advanced
- [ ] Dockerfile created
- [ ] ECR repo + image pushed
- [ ] ECS Fargate service live
- [ ] CodePipeline CI/CD working
- [ ] Terraform for full infrastructure
