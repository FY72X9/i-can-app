# Graph Report - i-can-app  (2026-09-11)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 470 nodes · 955 edges · 42 communities (25 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7fd9fd57`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- src/App.tsx
- package.json
- eventService.ts
- useAuthStore
- i-can-app/src/pages/AdminLtePage.tsx
- i-can-app/src/pages/UploadPage.tsx
- src/pages/AdminLtePage.tsx
- i-can-app/src/pages/LoginPage.tsx
- src/types/index.ts
- Guide Page & FAQ
- i-can-app/src/pages/VerificationPage.tsx
- i-can-app/src/components/common/TopNavbar.tsx
- useAuthStore
- i-can-app/src/pages/FeedPage.tsx
- i-can-app/src/pages/GuidePage.tsx
- getActions
- i-can-app/src/pages/WalletPage.tsx
- src/services/gemini.ts
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
1. `useAuthStore` - 40 edges
2. `AdminLtePage()` - 26 edges
3. `react` - 24 edges
4. `getActions()` - 20 edges
5. `lucide-react` - 19 edges
6. `react-router-dom` - 19 edges
7. `compilerOptions` - 17 edges
8. `getStoredAccounts()` - 14 edges
9. `Badge()` - 11 edges
10. `Card()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `handleAdminVerify()` --calls--> `updateActionVerification()`  [INFERRED]
  D:/Codes/i-can-app/src/pages/AdminLtePage.tsx → D:/Codes/i-can-app/src/services/actionService.ts
- `confirmReject()` --calls--> `updateActionVerification()`  [INFERRED]
  D:/Codes/i-can-app/src/pages/VerificationPage.tsx → D:/Codes/i-can-app/src/services/actionService.ts
- `handleDecision()` --calls--> `updateActionVerification()`  [INFERRED]
  D:/Codes/i-can-app/src/pages/VerificationPage.tsx → D:/Codes/i-can-app/src/services/actionService.ts
- `loadData()` --calls--> `getActions()`  [INFERRED]
  D:/Codes/i-can-app/src/pages/AdminLtePage.tsx → D:/Codes/i-can-app/src/services/actionService.ts
- `load()` --calls--> `getActions()`  [INFERRED]
  D:/Codes/i-can-app/src/pages/FeedPage.tsx → D:/Codes/i-can-app/src/services/actionService.ts

## Import Cycles
- None detected.

## Communities (42 total, 5 thin omitted)

### Community 0 - "src/App.tsx"
Cohesion: 0.09
Nodes (47): clsx, @logto/react, lucide-react, react, react-router-dom, tailwind-merge, zustand, App() (+39 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (42): dependencies, canvas-confetti, clsx, @logto/react, lucide-react, react, react-dom, react-router-dom (+34 more)

### Community 2 - "eventService.ts"
Cohesion: 0.14
Nodes (29): @supabase/supabase-js, QrScannerModal(), QrScannerModalProps, EventDetailPage(), EventsPage(), HomePage(), resolveProgramIcon(), LeaderboardPage() (+21 more)

### Community 3 - "useAuthStore"
Cohesion: 0.22
Nodes (26): getRoleDefaultPath(), ProtectedRoute(), ProtectedRouteProps, CallbackPage(), LoginPage(), createAccountByAdmin(), DEFAULT_SEEDED_ACCOUNTS, editAccountByAdmin() (+18 more)

### Community 4 - "i-can-app/src/pages/AdminLtePage.tsx"
Cohesion: 0.08
Nodes (24): [actionsList, setActionsList], [activeMenu, setActiveMenu], [grantCoinsAmount, setGrantCoinsAmount], [grantReason, setGrantReason], [grantSatAmount, setGrantSatAmount], [grantSuccessMsg, setGrantSuccessMsg], handleAdminVerify(), [isWideView, setIsWideView] (+16 more)

### Community 5 - "i-can-app/src/pages/UploadPage.tsx"
Cohesion: 0.08
Nodes (19): [aiResult, setAiResult], [campaignUrl, setCampaignUrl], CATEGORIES, [copiedHashtags, setCopiedHashtags], [copiedStoryCard, setCopiedStoryCard], fileInputRef, [groupMembers, setGroupMembers], [groupNimInput, setGroupNimInput] (+11 more)

### Community 6 - "src/pages/AdminLtePage.tsx"
Cohesion: 0.21
Nodes (22): AdminLtePage(), PROGRAM_COLORS_LIST, PROGRAM_ICONS_LIST, renderProgramIconHelper(), createActionProgram(), createDailyQuest(), DEFAULT_ACTION_PROGRAMS, DEFAULT_DAILY_QUESTS (+14 more)

### Community 7 - "i-can-app/src/pages/LoginPage.tsx"
Cohesion: 0.10
Nodes (20): [activeTab, setActiveTab], FACULTIES, [formValidationMsg, setFormValidationMsg], handleDemoStudent(), handleDemoVerifier(), handleLoginSubmit(), handleRegisterSubmit(), [loginIdentifier, setLoginIdentifier] (+12 more)

### Community 8 - "src/types/index.ts"
Cohesion: 0.14
Nodes (19): CategoryOption, DEFAULT_CATEGORIES, mapProgramToCategoryOption(), resolveCategoryIcon(), UploadPage(), submitGreenAction(), verifyActionWithGemini, NotificationState (+11 more)

### Community 9 - "Guide Page & FAQ"
Cohesion: 0.10
Nodes (19): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+11 more)

### Community 10 - "i-can-app/src/pages/VerificationPage.tsx"
Cohesion: 0.18
Nodes (11): updateActionVerification(), confirmReject(), defaultSampleQueue, filteredQueue, handleDecision(), [loading, setLoading], presetReasons, [queue, setQueue] (+3 more)

### Community 11 - "i-can-app/src/components/common/TopNavbar.tsx"
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

### Community 12 - "useAuthStore"
Cohesion: 0.20
Nodes (5): AppLayout(), DEMO_PROFILES, useAuthStore, CallbackPage(), ProtectedRoute()

### Community 13 - "i-can-app/src/pages/FeedPage.tsx"
Cohesion: 0.20
Nodes (7): [activeTab, setActiveTab], defaultSamplePosts, filteredPosts, [hasLiked, setHasLiked], [likes, setLikes], [postsList, setPostsList], [reactions, setReactions]

### Community 14 - "i-can-app/src/pages/GuidePage.tsx"
Cohesion: 0.20
Nodes (8): [activeTab, setActiveTab], [copiedHashtags, setCopiedHashtags], FAQ_LIST, filteredFaqs, isOpen, officialHashtags, [openFaqIndex, setOpenFaqIndex], [searchQuery, setSearchQuery]

### Community 15 - "getActions"
Cohesion: 0.25
Nodes (8): getActions(), LOCAL_ACTIONS_KEY, SEEDED_INITIAL_ACTIONS, submitGreenAction(), load(), handleSubmit(), load(), load()

### Community 16 - "i-can-app/src/pages/WalletPage.tsx"
Cohesion: 0.22
Nodes (7): [copiedTranscript, setCopiedTranscript], defaultVerified, totalCoins, totalComserv, totalSat, { user }, [verifiedActions, setVerifiedActions]

### Community 17 - "src/services/gemini.ts"
Cohesion: 0.44
Nodes (8): AiVerificationResult, buildVerificationPrompt(), callGemini(), callNvidiaNim(), callOpenRouter(), mockSimulationAnalysis(), parseAiJsonResponse(), verifyActionWithMultimodalAI()

### Community 18 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, strict, include

### Community 19 - "i-can-app/src/pages/HomePage.tsx"
Cohesion: 0.25
Nodes (6): [cheers, setCheers], flashQuests, [hasCheered, setHasCheered], Icon, programs, { user }

### Community 20 - "i-can-app/src/components/common/BottomNav.tsx"
Cohesion: 0.40
Nodes (4): Icon, isVerifier, navItems, { user }

### Community 21 - "i-can-app/src/services/logto.ts"
Cohesion: 0.40
Nodes (4): isLogtoConfigured, logtoAppId, logtoConfig, logtoEndpoint

### Community 22 - "i-can-app/src/services/supabase.ts"
Cohesion: 0.40
Nodes (4): isConfigured, supabase, supabaseAnonKey, supabaseUrl

### Community 23 - "i-can-app/src/components/common/Button.tsx"
Cohesion: 0.50
Nodes (3): baseStyles, sizeStyles, variantStyles

### Community 24 - "i-can-app/src/stores/notificationStore.ts"
Cohesion: 0.50
Nodes (3): INITIAL_NOTIFICATIONS, NOTIFICATIONS_STORAGE_KEY, useNotificationStore

## Knowledge Gaps
- **211 isolated node(s):** `BadgeProps`, `ButtonProps`, `CardProps`, `TopNavbarProps`, `FaqItem` (+206 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 251 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getActions()` connect `getActions` to `i-can-app/src/pages/VerificationPage.tsx`, `i-can-app/src/pages/AdminLtePage.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `react` connect `src/App.tsx` to `package.json`, `eventService.ts`, `useAuthStore`, `src/pages/AdminLtePage.tsx`, `src/types/index.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `BadgeProps`, `ButtonProps`, `CardProps` to the rest of the system?**
  _211 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08857808857808858 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `eventService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1361344537815126 - nodes in this community are weakly interconnected._
- **Should `i-can-app/src/pages/AdminLtePage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08374384236453201 - nodes in this community are weakly interconnected._