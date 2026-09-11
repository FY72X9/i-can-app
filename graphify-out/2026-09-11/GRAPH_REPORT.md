# Graph Report - i-can-app  (2026-09-11)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 485 nodes · 1025 edges · 38 communities (21 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `db892683`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- src/types/index.ts
- src/pages/AdminLtePage.tsx
- package.json
- i-can-app/src/pages/VerificationPage.tsx
- src/App.tsx
- useAuthStore
- i-can-app/src/pages/AdminLtePage.tsx
- i-can-app/src/pages/UploadPage.tsx
- i-can-app/src/pages/LoginPage.tsx
- Guide Page & FAQ
- src/services/gemini.ts
- ImportUsersModal.tsx
- i-can-app/src/components/common/TopNavbar.tsx
- useAuthStore
- compilerOptions
- i-can-app/src/pages/HomePage.tsx
- i-can-app/src/components/common/BottomNav.tsx
- i-can-app/src/services/logto.ts
- i-can-app/src/services/supabase.ts
- i-can-app/src/components/common/Button.tsx
- i-can-app/src/stores/notificationStore.ts
- src/utils/carbonCalc.ts
- i-can-app/src/utils/carbonCalc.ts
- i-can-app/src/pages/ProfilePage.tsx
- src/vite-env.d.ts
- i-can-app Repository

## God Nodes (most connected - your core abstractions)
1. `useAuthStore` - 42 edges
2. `AdminLtePage()` - 26 edges
3. `react` - 24 edges
4. `getActions()` - 20 edges
5. `lucide-react` - 19 edges
6. `react-router-dom` - 17 edges
7. `compilerOptions` - 17 edges
8. `getStoredAccounts()` - 15 edges
9. `getEvents()` - 13 edges
10. `UploadPage()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `loadActivities()` --calls--> `getActions()`  [EXTRACTED]
  src/pages/ProfilePage.tsx → src/services/actionService.ts
- `getActions()` --calls--> `loadData()`  [INFERRED]
  D:/Codes/i-can-app/src/services/actionService.ts → D:/Codes/i-can-app/src/pages/AdminLtePage.tsx
- `getActions()` --calls--> `load()`  [INFERRED]
  D:/Codes/i-can-app/src/services/actionService.ts → D:/Codes/i-can-app/src/pages/FeedPage.tsx
- `getActions()` --calls--> `load()`  [INFERRED]
  D:/Codes/i-can-app/src/services/actionService.ts → D:/Codes/i-can-app/src/pages/VerificationPage.tsx
- `getActions()` --calls--> `load()`  [INFERRED]
  D:/Codes/i-can-app/src/services/actionService.ts → D:/Codes/i-can-app/src/pages/WalletPage.tsx

## Import Cycles
- None detected.

## Communities (38 total, 5 thin omitted)

### Community 0 - "src/types/index.ts"
Cohesion: 0.08
Nodes (50): clsx, jspdf, lucide-react, react, react-router-dom, tailwind-merge, Badge(), BadgeProps (+42 more)

### Community 1 - "src/pages/AdminLtePage.tsx"
Cohesion: 0.10
Nodes (48): QrScannerModal(), AdminLtePage(), PROGRAM_COLORS_LIST, PROGRAM_ICONS_LIST, renderProgramIconHelper(), EventsPage(), HomePage(), resolveProgramIcon() (+40 more)

### Community 2 - "package.json"
Cohesion: 0.05
Nodes (43): dependencies, canvas-confetti, clsx, jspdf, @logto/react, lucide-react, react, react-dom (+35 more)

### Community 3 - "i-can-app/src/pages/VerificationPage.tsx"
Cohesion: 0.06
Nodes (33): getActions(), LOCAL_ACTIONS_KEY, SEEDED_INITIAL_ACTIONS, submitGreenAction(), updateActionVerification(), [activeTab, setActiveTab], defaultSamplePosts, filteredPosts (+25 more)

### Community 4 - "src/App.tsx"
Cohesion: 0.13
Nodes (22): canvas-confetti, @logto/react, zustand, App(), AppLayout(), BottomNav(), getRoleDefaultPath(), ProtectedRoute() (+14 more)

### Community 5 - "useAuthStore"
Cohesion: 0.20
Nodes (28): @supabase/supabase-js, ProtectedRouteProps, batchImportAccounts(), BatchImportOptions, BatchImportResult, BatchImportUserItem, createAccountByAdmin(), DEFAULT_SEEDED_ACCOUNTS (+20 more)

### Community 6 - "i-can-app/src/pages/AdminLtePage.tsx"
Cohesion: 0.08
Nodes (24): [actionsList, setActionsList], [activeMenu, setActiveMenu], [grantCoinsAmount, setGrantCoinsAmount], [grantReason, setGrantReason], [grantSatAmount, setGrantSatAmount], [grantSuccessMsg, setGrantSuccessMsg], handleAdminVerify(), [isWideView, setIsWideView] (+16 more)

### Community 7 - "i-can-app/src/pages/UploadPage.tsx"
Cohesion: 0.08
Nodes (19): [aiResult, setAiResult], [campaignUrl, setCampaignUrl], CATEGORIES, [copiedHashtags, setCopiedHashtags], [copiedStoryCard, setCopiedStoryCard], fileInputRef, [groupMembers, setGroupMembers], [groupNimInput, setGroupNimInput] (+11 more)

### Community 8 - "i-can-app/src/pages/LoginPage.tsx"
Cohesion: 0.10
Nodes (20): [activeTab, setActiveTab], FACULTIES, [formValidationMsg, setFormValidationMsg], handleDemoStudent(), handleDemoVerifier(), handleLoginSubmit(), handleRegisterSubmit(), [loginIdentifier, setLoginIdentifier] (+12 more)

### Community 9 - "Guide Page & FAQ"
Cohesion: 0.10
Nodes (19): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+11 more)

### Community 10 - "src/services/gemini.ts"
Cohesion: 0.22
Nodes (14): resolveIcon(), UploadPage(), AiVerificationResult, buildVerificationPrompt(), callGemini(), callNvidiaNim(), callOpenRouter(), generateActionCaption() (+6 more)

### Community 11 - "ImportUsersModal.tsx"
Cohesion: 0.31
Nodes (11): xlsx, ImportUsersModal(), ImportUsersModalProps, cellToString(), downloadStudentTemplate(), ExcelParseResult, matchHeaders(), normalizeHeaderKey() (+3 more)

### Community 12 - "i-can-app/src/components/common/TopNavbar.tsx"
Cohesion: 0.20
Nodes (8): accountDropdownRef, dropdownRef, handleNotificationClick(), navigate, { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll, 
    simulateIncomingNotification 
  }, [showAccountSelector, setShowAccountSelector], [showNotifications, setShowNotifications], { user, loginAs }

### Community 13 - "useAuthStore"
Cohesion: 0.20
Nodes (5): AppLayout(), DEMO_PROFILES, useAuthStore, CallbackPage(), ProtectedRoute()

### Community 14 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include

### Community 15 - "i-can-app/src/pages/HomePage.tsx"
Cohesion: 0.25
Nodes (6): [cheers, setCheers], flashQuests, [hasCheered, setHasCheered], Icon, programs, { user }

### Community 16 - "i-can-app/src/components/common/BottomNav.tsx"
Cohesion: 0.40
Nodes (4): Icon, isVerifier, navItems, { user }

### Community 17 - "i-can-app/src/services/logto.ts"
Cohesion: 0.40
Nodes (4): isLogtoConfigured, logtoAppId, logtoConfig, logtoEndpoint

### Community 18 - "i-can-app/src/services/supabase.ts"
Cohesion: 0.40
Nodes (4): isConfigured, supabase, supabaseAnonKey, supabaseUrl

### Community 19 - "i-can-app/src/components/common/Button.tsx"
Cohesion: 0.50
Nodes (3): baseStyles, sizeStyles, variantStyles

### Community 20 - "i-can-app/src/stores/notificationStore.ts"
Cohesion: 0.50
Nodes (3): INITIAL_NOTIFICATIONS, NOTIFICATIONS_STORAGE_KEY, useNotificationStore

## Knowledge Gaps
- **204 isolated node(s):** `BadgeProps`, `ButtonProps`, `CardProps`, `LeaderboardUser`, `FormattedTextProps` (+199 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 243 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `CampusEvent` (2× useful, score=1.997027456) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `src/types/index.ts` to `src/pages/AdminLtePage.tsx`, `package.json`, `ImportUsersModal.tsx`, `src/App.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `getActions()` connect `i-can-app/src/pages/VerificationPage.tsx` to `i-can-app/src/pages/AdminLtePage.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `BadgeProps`, `ButtonProps`, `CardProps` to the rest of the system?**
  _204 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08428446005267778 - nodes in this community are weakly interconnected._
- **Should `src/pages/AdminLtePage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10377358490566038 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `i-can-app/src/pages/VerificationPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05512820512820513 - nodes in this community are weakly interconnected._