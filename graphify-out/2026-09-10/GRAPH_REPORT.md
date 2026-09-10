# Graph Report - i-can-app  (2026-09-10)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 440 nodes · 838 edges · 38 communities (20 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `524b0bd4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- src/types/index.ts
- src/App.tsx
- package.json
- i-can-app/src/pages/VerificationPage.tsx
- i-can-app/src/pages/AdminLtePage.tsx
- eventService.ts
- i-can-app/src/pages/UploadPage.tsx
- i-can-app/src/pages/LoginPage.tsx
- compilerOptions
- i-can-app/src/components/common/TopNavbar.tsx
- src/services/gemini.ts
- useAuthStore
- i-can-app/src/pages/GuidePage.tsx
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
- src/utils/imageCompressor.ts
- src/vite-env.d.ts
- i-can-app Repository

## God Nodes (most connected - your core abstractions)
1. `useAuthStore` - 37 edges
2. `react` - 24 edges
3. `getActions()` - 22 edges
4. `lucide-react` - 19 edges
5. `react-router-dom` - 19 edges
6. `compilerOptions` - 17 edges
7. `Badge()` - 11 edges
8. `Card()` - 11 edges
9. `getStoredAccounts()` - 11 edges
10. `AdminLtePage()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `load()` --calls--> `getActions()`  [EXTRACTED]
  src/pages/FeedPage.tsx → src/services/actionService.ts
- `loadRecent()` --calls--> `getActions()`  [EXTRACTED]
  src/pages/HomePage.tsx → src/services/actionService.ts
- `loadActivities()` --calls--> `getActions()`  [EXTRACTED]
  src/pages/ProfilePage.tsx → src/services/actionService.ts
- `load()` --calls--> `getActions()`  [EXTRACTED]
  src/pages/WalletPage.tsx → src/services/actionService.ts
- `handleAdminVerify()` --calls--> `updateActionVerification()`  [INFERRED]
  D:/Codes/i-can-app/src/pages/AdminLtePage.tsx → D:/Codes/i-can-app/src/services/actionService.ts

## Import Cycles
- None detected.

## Communities (38 total, 6 thin omitted)

### Community 0 - "src/types/index.ts"
Cohesion: 0.11
Nodes (40): clsx, lucide-react, react, react-router-dom, tailwind-merge, Badge(), BadgeProps, Button() (+32 more)

### Community 1 - "src/App.tsx"
Cohesion: 0.10
Nodes (43): @logto/react, App(), AppLayout(), BottomNav(), getRoleDefaultPath(), ProtectedRoute(), ProtectedRouteProps, TopNavbar() (+35 more)

### Community 2 - "package.json"
Cohesion: 0.05
Nodes (43): dependencies, canvas-confetti, clsx, @logto/react, lucide-react, react, react-dom, react-router-dom (+35 more)

### Community 3 - "i-can-app/src/pages/VerificationPage.tsx"
Cohesion: 0.06
Nodes (33): getActions(), LOCAL_ACTIONS_KEY, SEEDED_INITIAL_ACTIONS, submitGreenAction(), updateActionVerification(), [activeTab, setActiveTab], defaultSamplePosts, filteredPosts (+25 more)

### Community 4 - "i-can-app/src/pages/AdminLtePage.tsx"
Cohesion: 0.08
Nodes (24): [actionsList, setActionsList], [activeMenu, setActiveMenu], [grantCoinsAmount, setGrantCoinsAmount], [grantReason, setGrantReason], [grantSatAmount, setGrantSatAmount], [grantSuccessMsg, setGrantSuccessMsg], handleAdminVerify(), [isWideView, setIsWideView] (+16 more)

### Community 5 - "eventService.ts"
Cohesion: 0.16
Nodes (25): @supabase/supabase-js, QrScannerModal(), AdminLtePage(), EventDetailPage(), EventsPage(), LeaderboardPage(), computeEventLeaderboard(), createEvent() (+17 more)

### Community 6 - "i-can-app/src/pages/UploadPage.tsx"
Cohesion: 0.08
Nodes (19): [aiResult, setAiResult], [campaignUrl, setCampaignUrl], CATEGORIES, [copiedHashtags, setCopiedHashtags], [copiedStoryCard, setCopiedStoryCard], fileInputRef, [groupMembers, setGroupMembers], [groupNimInput, setGroupNimInput] (+11 more)

### Community 7 - "i-can-app/src/pages/LoginPage.tsx"
Cohesion: 0.10
Nodes (20): [activeTab, setActiveTab], FACULTIES, [formValidationMsg, setFormValidationMsg], handleDemoStudent(), handleDemoVerifier(), handleLoginSubmit(), handleRegisterSubmit(), [loginIdentifier, setLoginIdentifier] (+12 more)

### Community 8 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+11 more)

### Community 9 - "i-can-app/src/components/common/TopNavbar.tsx"
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

### Community 10 - "src/services/gemini.ts"
Cohesion: 0.33
Nodes (10): UploadPage(), AiVerificationResult, buildVerificationPrompt(), callGemini(), callNvidiaNim(), callOpenRouter(), mockSimulationAnalysis(), parseAiJsonResponse() (+2 more)

### Community 11 - "useAuthStore"
Cohesion: 0.20
Nodes (5): AppLayout(), DEMO_PROFILES, useAuthStore, CallbackPage(), ProtectedRoute()

### Community 12 - "i-can-app/src/pages/GuidePage.tsx"
Cohesion: 0.20
Nodes (8): [activeTab, setActiveTab], [copiedHashtags, setCopiedHashtags], FAQ_LIST, filteredFaqs, isOpen, officialHashtags, [openFaqIndex, setOpenFaqIndex], [searchQuery, setSearchQuery]

### Community 13 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include

### Community 14 - "i-can-app/src/pages/HomePage.tsx"
Cohesion: 0.25
Nodes (6): [cheers, setCheers], flashQuests, [hasCheered, setHasCheered], Icon, programs, { user }

### Community 15 - "i-can-app/src/components/common/BottomNav.tsx"
Cohesion: 0.40
Nodes (4): Icon, isVerifier, navItems, { user }

### Community 16 - "i-can-app/src/services/logto.ts"
Cohesion: 0.40
Nodes (4): isLogtoConfigured, logtoAppId, logtoConfig, logtoEndpoint

### Community 17 - "i-can-app/src/services/supabase.ts"
Cohesion: 0.40
Nodes (4): isConfigured, supabase, supabaseAnonKey, supabaseUrl

### Community 18 - "i-can-app/src/components/common/Button.tsx"
Cohesion: 0.50
Nodes (3): baseStyles, sizeStyles, variantStyles

### Community 19 - "i-can-app/src/stores/notificationStore.ts"
Cohesion: 0.50
Nodes (3): INITIAL_NOTIFICATIONS, NOTIFICATIONS_STORAGE_KEY, useNotificationStore

## Knowledge Gaps
- **209 isolated node(s):** `BadgeProps`, `ButtonProps`, `CardProps`, `QrScannerModalProps`, `FaqItem` (+204 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 251 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getActions()` connect `i-can-app/src/pages/VerificationPage.tsx` to `i-can-app/src/pages/AdminLtePage.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `react` connect `src/types/index.ts` to `src/App.tsx`, `package.json`, `eventService.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `BadgeProps`, `ButtonProps`, `CardProps` to the rest of the system?**
  _209 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10929281122150789 - nodes in this community are weakly interconnected._
- **Should `src/App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10062893081761007 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `i-can-app/src/pages/VerificationPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05512820512820513 - nodes in this community are weakly interconnected._