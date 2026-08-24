# Implementation Roadmap

This roadmap outlines the phases of implementation for Flowra.

## PHASE 0 - Current State Audit
- [x] Complete project audit (`docs/CURRENT_STATE_AUDIT.md`)
- [x] Define Roadmap (`docs/ROADMAP.md`)
- [x] Baseline architectural documents

## PHASE 1 - Foundation
- [ ] Authentication (UI polish, verification)
- [ ] Organizations (Settings, tenant switching)
- [ ] Tenant Isolation (Middleware / Prisma extensions)
- [ ] RBAC (Role-based access control enforcement)

## PHASE 2 - Workflow Data Model
- [ ] Workflow CRUD UI (List, Create, Delete, Pause)
- [ ] Workflow Versioning (Draft vs. Published)
- [ ] Database Schema Finalization for Executions

## PHASE 3 - Automation Engine
- [ ] Trigger Registry (API/Webhook endpoints)
- [ ] Action Registry (Internal execution layer)
- [ ] Condition Engine (Deterministic logic evaluator)

## PHASE 4 - Background Execution
- [ ] Integration of Graphile Worker (or similar PostgreSQL-based queue)
- [ ] Workflow Execution orchestrator
- [ ] Retries and Scheduling

## PHASE 5 - Forms
- [ ] Visual No-code Form Builder
- [ ] Form Submission Handlers
- [ ] Form Triggers for Workflows

## PHASE 6 - Leads / CRM
- [ ] Leads Dashboard (List, Board view)
- [ ] Lead Details Page
- [ ] CRM Actions (Create Lead, Update Status)

## PHASE 7 - Email / SMTP
- [ ] SMTP Provider Configuration
- [ ] Email Action Node
- [ ] Email Templates

## PHASE 8 - HTTP / Webhooks
- [ ] Webhook Trigger (Incoming)
- [ ] HTTP Request Action (Outgoing)
- [ ] Credential / Header secure storage

## PHASE 9 - Templates
- [ ] Template Marketplace UI
- [ ] Template to Workflow cloning logic

## PHASE 10 - Execution History
- [ ] Execution Logs Dashboard
- [ ] Observability (Metrics, Success Rates)
- [ ] Error Reporting & Retry UI

## PHASE 11 - Professional Workflow Builder
- [ ] Sync React Flow Canvas with Database
- [ ] Node Configuration Panels (Slide-outs)
- [ ] Variable Resolution UI (Dropdown for previous step data)

## PHASE 12 - AI-assisted Workflow Creation
- [ ] AI Provider Abstraction (Groq/OpenAI adapter)
- [ ] Structured Output Generation (Zod validation)
- [ ] AI Copilot UI for Workflow generation (replaces raw chat)

## PHASE 13 - Marketing Website
- [ ] Hero, Social Proof, Problems/Solutions Sections
- [ ] Features and Integrations showcase
- [ ] Finalize marketing copy per specification

## PHASE 14 - Pricing / Billing Architecture
- [ ] UI for Plans (Free, Pro, Business)
- [ ] Usage tracking (Execution limits, Team member limits)
- [ ] Stripe Integration (Deferred until needed)

## PHASE 15 - Production Hardening
- [ ] End-to-end Testing
- [ ] Security Audits (Rate limiting, CSRF)
- [ ] Performance Optimization (Dynamic imports, Caching)
