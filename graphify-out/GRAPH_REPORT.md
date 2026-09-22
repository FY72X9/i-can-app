# Graph Report - i-can-app  (2026-09-22)

## Corpus Check
- 62 files · ~115,611 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 406 nodes · 1061 edges · 46 communities (17 shown, 29 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.86)
- Token cost: 1,250 input · 850 output

## Community Hubs (Navigation)
- Core React & UI Framework
- AdminLTE 3.4 & Supabase Services
- Authentication & Role Guards
- Upload & Multimodal AI Verification
- User Import & State Stores
- Partner Form & QR Modals
- SDG 17 Partner Dashboard Widgets
- TypeScript Compiler Options
- Database Schema & Actions Table
- SSO & TFI Governance Documents
- Auth Users & Action Categories
- TypeScript Node Configuration
- Faculties & Quest Programs
- Bottom Navigation Elements
- Online Multiuser Account Sync
- Button Component Styles
- Vite Bundler Configuration
- IPCC Carbon Calculator
- Route Protection System
- Partner Database Tables
- Vercel Deployment Rewrites
- UI/UX Accessibility Feedback
- Institutional Value Revision
- Pitch Presentation Guidelines
- Pitch Presentation Visuals
- Autoprefixer CSS Tool
- ClassNames Helper Clsx
- PostCSS Core Plugin
- Tailwind Merge Utility
- Tailwind CSS Package
- Canvas Confetti Types
- Node Type Definitions
- React Type Definitions
- React DOM Type Definitions
- TypeScript Core Package
- Public Actions Table Migration
- Public Actions Fix Script
- Public Users Fix Script

## God Nodes (most connected - your core abstractions)
1. `useAuthStore` - 40 edges
2. `AdminLtePage()` - 35 edges
3. `getActions()` - 25 edges
4. `react` - 22 edges
5. `lucide-react` - 21 edges
6. `getStoredAccounts()` - 20 edges
7. `compilerOptions` - 17 edges
8. `react-router-dom` - 14 edges
9. `getDailyQuests()` - 14 edges
10. `UploadPage()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `I-CAN MVP Core Implementation Checklist` --references--> `I-CAN Platform (Integrated Gamified Carbon-Neutral Campus)`  [EXTRACTED]
  docs/MVP_IMPLEMENTATION_CHECKLIST.md → README.md
- `5-Minute Pitch Narrative for BINUS Stakeholders & Jury` --references--> `I-CAN Platform (Integrated Gamified Carbon-Neutral Campus)`  [EXTRACTED]
  docs/presentation/presentation_5min_pitch.md → README.md
- `I-CAN PWA Web Application Shell` --references--> `I-CAN Platform (Integrated Gamified Carbon-Neutral Campus)`  [EXTRACTED]
  index.html → README.md
- `SSO & TFI Regulation Alignment v2.0` --rationale_for--> `Dual-Track Recognition System`  [INFERRED]
  docs/FEATURE_REVISION_NOTES.md → README.md
- `3-Branch Verifier Approval Decision Flow` --conceptually_related_to--> `Multimodal Vision AI Pre-Scan & Verification`  [INFERRED]
  docs/FEATURE_REVISION_NOTES.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dual-Track SSO/TFI Academic & Gamification Governance** — readme_dual_track_system, readme_tfi_two_phase_flow, docs_feature_revision_notes_sso_tfi_regulation, docs_feature_revision_notes_three_way_approval [EXTRACTED 1.00]
- **AdminLTE 3.4 SDG 17 & Campus Activity Oversight** — readme_sdg17_partner_management, readme_student_activity_monitor, readme_trial_demo_accounts [INFERRED 0.95]

## Communities (46 total, 29 thin omitted)

### Community 0 - "Core React & UI Framework"
Cohesion: 0.08
Nodes (54): @logto/react, lucide-react, react, react-dom, react-router-dom, App(), AppLayout(), StudentGreenActivityMonitor() (+46 more)

### Community 1 - "AdminLTE 3.4 & Supabase Services"
Cohesion: 0.10
Nodes (46): @supabase/supabase-js, AdminLtePage(), PROGRAM_COLORS_LIST, PROGRAM_ICONS_LIST, renderProgramIconHelper(), applyRewardToUser(), addDocumentToPartner(), addProgramToPartner() (+38 more)

### Community 2 - "Authentication & Role Guards"
Cohesion: 0.16
Nodes (41): src_components_common_protectedroute_getroledefaultpath, CallbackPage(), ProfilePage(), loadActivities(), batchImportAccounts(), BatchImportOptions, BatchImportResult, BatchImportUserItem (+33 more)

### Community 3 - "Upload & Multimodal AI Verification"
Cohesion: 0.12
Nodes (25): canvas-confetti, jspdf, ActionPillar, resolveIcon(), UploadPage(), generateActionId(), submitGreenAction(), AiVerificationResult (+17 more)

### Community 4 - "User Import & State Stores"
Cohesion: 0.12
Nodes (24): xlsx, zustand, ImportUsersModal(), ImportUsersModalProps, cellToString(), downloadStudentTemplate(), ExcelParseResult, matchHeaders() (+16 more)

### Community 5 - "Partner Form & QR Modals"
Cohesion: 0.17
Nodes (24): PartnerFormModalProps, QrScannerModal(), QrScannerModalProps, EventsPage(), HomePage(), resolveProgramIcon(), CategorizedEvents, createEvent() (+16 more)

### Community 6 - "SDG 17 Partner Dashboard Widgets"
Cohesion: 0.15
Nodes (19): CATEGORY_COLORS, CATEGORY_NAMES, PartnerDashboardWidget(), PartnerDashboardWidgetProps, CATEGORY_LABELS, PartnerDetailModal(), PartnerDetailModalProps, CATEGORY_OPTIONS (+11 more)

### Community 7 - "TypeScript Compiler Options"
Cohesion: 0.10
Nodes (19): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+11 more)

### Community 8 - "Database Schema & Actions Table"
Cohesion: 0.18
Nodes (12): public.action_categories, public.action_programs, public.actions, public.badges, public.daily_quests, public.events, public.faculties, public.sat_recognitions (+4 more)

### Community 9 - "SSO & TFI Governance Documents"
Cohesion: 0.14
Nodes (14): 3 Mandatory TFI Official Campaign Hashtags, SSO & TFI Regulation Alignment v2.0, 3-Branch Verifier Approval Decision Flow, I-CAN MVP Core Implementation Checklist, 5-Minute Pitch Narrative for BINUS Stakeholders & Jury, I-CAN PWA Web Application Shell, Dual-Track Recognition System, I-CAN Platform (Integrated Gamified Carbon-Neutral Campus) (+6 more)

### Community 10 - "Auth Users & Action Categories"
Cohesion: 0.40
Nodes (9): auth.users, public.action_categories, public.actions, public.badges, public.faculties, public.sat_recognitions, public.user_badges, public.users (+1 more)

### Community 11 - "TypeScript Node Configuration"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include

### Community 12 - "Faculties & Quest Programs"
Cohesion: 0.33
Nodes (5): public.faculties, public.action_programs, public.daily_quests, public.events, public.users

### Community 13 - "Bottom Navigation Elements"
Cohesion: 0.40
Nodes (4): Icon, isOrganizer, navItems, { user }

### Community 14 - "Online Multiuser Account Sync"
Cohesion: 0.50
Nodes (3): public.login_local_account(), public.user_credentials, public.users

### Community 15 - "Button Component Styles"
Cohesion: 0.50
Nodes (3): baseStyles, sizeStyles, variantStyles

### Community 16 - "Vite Bundler Configuration"
Cohesion: 0.50
Nodes (3): ref_path, vite, @vitejs/plugin-react

## Knowledge Gaps
- **107 isolated node(s):** `{ user }`, `isOrganizer`, `navItems`, `Icon`, `baseStyles` (+102 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 141 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuthStore` connect `Authentication & Role Guards` to `Core React & UI Framework`, `AdminLTE 3.4 & Supabase Services`, `Upload & Multimodal AI Verification`, `User Import & State Stores`, `Partner Form & QR Modals`, `Route Protection System`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `AdminLtePage()` connect `AdminLTE 3.4 & Supabase Services` to `Core React & UI Framework`, `Authentication & Role Guards`, `Partner Form & QR Modals`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `react` connect `Core React & UI Framework` to `AdminLTE 3.4 & Supabase Services`, `Authentication & Role Guards`, `Upload & Multimodal AI Verification`, `User Import & State Stores`, `Partner Form & QR Modals`, `SDG 17 Partner Dashboard Widgets`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `{ user }`, `isOrganizer`, `navItems` to the rest of the system?**
  _107 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core React & UI Framework` be split into smaller, more focused modules?**
  _Cohesion score 0.08209255533199195 - nodes in this community are weakly interconnected._
- **Should `AdminLTE 3.4 & Supabase Services` be split into smaller, more focused modules?**
  _Cohesion score 0.10105580693815988 - nodes in this community are weakly interconnected._
- **Should `Upload & Multimodal AI Verification` be split into smaller, more focused modules?**
  _Cohesion score 0.12433862433862433 - nodes in this community are weakly interconnected._