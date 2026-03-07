# Project Roadmap

## Future Technologies LMS

This document outlines the phased implementation plan for the project.

---

## Vision

A dark-themed, modern e-learning platform that students use to access courses, track progress, and complete assignments — deployed on production AWS infrastructure.

---

## Phases Overview

| Phase | Name                          | Stories | Status      | AWS Services                        |
| ----- | ----------------------------- | ------- | ----------- | ----------------------------------- |
| 1     | Foundation (Static)           | 2       | In Progress | S3, CloudFront, Route 53            |
| 2     | Compute (Auth + Courses)      | 4       | Planned     | EC2, Lambda, API Gateway, Cognito   |
| 3     | Data & Storage                | 5       | Planned     | DynamoDB, RDS, CloudWatch           |
| 4     | Advanced (CI/CD + Containers) | 3       | Planned     | ECS Fargate, CodePipeline, Terraform |

---

## Phase 1: Foundation (S3 + CloudFront + Route 53)

**Goal:** Static React app deployed on AWS S3 with CloudFront CDN and custom domain.

**User Stories:**

- [ ] US-001: Landing page (hero + CTA)
- [ ] US-002: Home page ("Your Learning Organized in One Place")

**Key Deliverables:**

- Clean `npm run build` static export
- S3 bucket with static hosting
- CloudFront distribution
- Route 53 + ACM SSL cert
- Live on custom domain

---

## Phase 2: Compute (EC2 + Lambda + API Gateway + Cognito)

**Goal:** Auth flow and courses page backed by Lambda + Cognito.

**User Stories:**

- [ ] US-003: Sign Up page
- [ ] US-004: Register page
- [ ] US-005: Login page ("Welcome back")
- [ ] US-006: My Courses page

**Key Deliverables:**

- AWS Cognito user pool
- Lambda functions for courses API
- API Gateway REST endpoints
- EC2 + ALB option for Node.js

---

## Phase 3: Data & Storage (DynamoDB + RDS + CloudWatch)

**Goal:** Full data layer with all inner pages connected to real data.

**User Stories:**

- [ ] US-007: Dashboard (progress stats + current courses)
- [ ] US-008: Notifications
- [ ] US-009: Homework / Assignments
- [ ] US-010: Exams
- [ ] US-011: Attendance

**Key Deliverables:**

- DynamoDB tables (users, courses, progress, assignments)
- CloudWatch dashboard + SNS billing alerts
- Settings page

---

## Phase 4: Advanced (CodePipeline + ECS Fargate + Terraform)

**Goal:** Containerized app with full CI/CD pipeline and IaC.

**User Stories:**

- [ ] US-012: Dockerize + ECR
- [ ] US-013: ECS Fargate deployment
- [ ] US-014: CodePipeline CI/CD + Terraform IaC

**Key Deliverables:**

- Dockerfile + ECR image
- ECS Fargate service with ALB
- GitHub push → CodePipeline → CodeBuild → CodeDeploy
- Terraform for all infrastructure

---

## Success Criteria

**Phase 1 Complete When:**

- [ ] Landing + Home pages match GP2_3 design
- [ ] `npm run build` produces clean static export
- [ ] Live on custom domain with SSL

**Project Complete When:**

- [ ] All 12 screens built and connected to real data
- [ ] Deployed on ECS Fargate with CI/CD
- [ ] Terraform manages all infrastructure
- [ ] Public GitHub repo with commit tags per phase

---

**Last Updated:** 2026-03-06
