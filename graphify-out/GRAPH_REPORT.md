# Graph Report - D:\Codes\i-can-app  (2026-09-14)

## Corpus Check
- 42 files · ~132,662 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 453 nodes · 514 edges · 58 communities detected
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]

## God Nodes (most connected - your core abstractions)
1. `getStoredAccounts()` - 14 edges
2. `getActions()` - 8 edges
3. `getLocalEvents()` - 8 edges
4. `hashPassword()` - 7 edges
5. `createAccountByAdmin()` - 7 edges
6. `registerUser()` - 7 edges
7. `navigate` - 6 edges
8. `normalizeUserRole()` - 6 edges
9. `loginWithCredentials()` - 6 edges
10. `editAccountByAdmin()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `useAuthStore` --calls--> `ProtectedRoute()`  [INFERRED]
  D:\Codes\i-can-app\src\stores\authStore.ts → D:\Codes\i-can-app\src\components\common\ProtectedRoute.tsx
- `loadActiveEvents()` --calls--> `getActiveEvents()`  [INFERRED]
  D:\Codes\i-can-app\src\components\common\QrScannerModal.tsx → D:\Codes\i-can-app\src\services\eventService.ts
- `loadEvent()` --calls--> `getActions()`  [INFERRED]
  D:\Codes\i-can-app\src\pages\EventDetailPage.tsx → D:\Codes\i-can-app\src\services\actionService.ts
- `loadEvents()` --calls--> `getEvents()`  [INFERRED]
  D:\Codes\i-can-app\src\pages\EventsPage.tsx → D:\Codes\i-can-app\src\services\eventService.ts
- `loadEventLeaderboard()` --calls--> `getActions()`  [INFERRED]
  D:\Codes\i-can-app\src\pages\LeaderboardPage.tsx → D:\Codes\i-can-app\src\services\actionService.ts

## Communities

### Community 0 - "Community 0"

Cohesion: 0.03
Nodes (56): verifyActionWithGemini, act, actId, active, activeEvents, [activePillar, setActivePillar], activityIdParam, additionalFileInputRef (+48 more)

### Community 1 - "Community 1"

Cohesion: 0.05
Nodes (40): generateActionId(), getActions(), getUserActions(), LOCAL_ACTIONS_KEY, SEED_VERSION_KEY, SEEDED_INITIAL_ACTIONS, submitGreenAction(), updateActionVerification() (+32 more)

### Community 2 - "Community 2"

Cohesion: 0.08
Nodes (27): [activeTab, setActiveTab], async(), FACULTIES, [formValidationMsg, setFormValidationMsg], handleDemoStudent(), handleDemoVerifier(), handleLoginSubmit(), handleRegisterSubmit() (+19 more)

### Community 3 - "Community 3"

Cohesion: 0.13
Nodes (24): loadEvent(), computeEventLeaderboard(), createEvent(), DEFAULT_CAMPUS_EVENTS, deleteEvent(), generateId(), getActiveEvents(), getCategorizedEvents() (+16 more)

### Community 4 - "Community 4"

Cohesion: 0.2
Nodes (25): batchImportAccounts(), createAccountByAdmin(), DEFAULT_SEEDED_ACCOUNTS, deleteAccountFromSupabase(), editAccountByAdmin(), getAllUsersList(), getNeutralAvatarUrl(), getStoredAccounts() (+17 more)

### Community 5 - "Community 5"

Cohesion: 0.09
Nodes (17): cellToString(), matchHeaders(), parseStudentExcel(), [customPassword, setCustomPassword], displayedRows, [dragActive, setDragActive], [duplicateAction, setDuplicateAction], fileInputRef (+9 more)

### Community 6 - "Community 6"

Cohesion: 0.08
Nodes (22): [activeTab, setActiveTab], [cheers, setCheers], computedFaculties, computedStudents, currentUserRank, [eventLeaderboard, setEventLeaderboard], [events, setEvents], f (+14 more)

### Community 7 - "Community 7"

Cohesion: 0.15
Nodes (18): completeDailyQuest(), createActionProgram(), createDailyQuest(), DEFAULT_ACTION_PROGRAMS, DEFAULT_DAILY_QUESTS, deleteActionProgram(), deleteDailyQuest(), getActionPrograms() (+10 more)

### Community 8 - "Community 8"
_Unable to determine domain due to missing code entities._
Cohesion: 0.1
Nodes (16): [activeTab, setActiveTab], filteredPosts, handleManualRefresh(), [hasLiked, setHasLiked], [isLoading, setIsLoading], [isRealtimeActive, setIsRealtimeActive], [isRefreshing, setIsRefreshing], [likes, setLikes] (+8 more)

### Community 9 - "Community 9"

Cohesion: 0.12
Nodes (12): AdminLtePage(), canDeactivate, canRestore, category, isDeactivated, isLastSuperadmin, isSelf, PROGRAM_COLORS_LIST (+4 more)

### Community 10 - "Community 10"

Cohesion: 0.13
Nodes (13): [activeTab, setActiveTab], category, [event, setEvent], { id }, isActionOpen, isMe, [leaderboard, setLeaderboard], [loading, setLoading] (+5 more)

### Community 11 - "Community 11"

Cohesion: 0.16
Nodes (11): accountDropdownRef, canSwitchRoles, dropdownRef, handleAvatarClick(), handleNotificationClick(), { mode, isDemoMode, isPrototypeMode, toggleMode }, navigate, { 
    notifications, 
    unreadCount, 
    loadUserNotifications,
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll, 
    simulateIncomingNotification 
  } (+3 more)

### Community 12 - "Community 12"

Cohesion: 0.22
Nodes (9): [activeEvents, setActiveEvents], [cameraError, setCameraError], handleSimulationSelect(), loadActiveEvents(), navigate, [showSimulation, setShowSimulation], stopCamera(), streamRef (+1 more)

### Community 13 - "Community 13"
_Unable to determine domain due to missing code entities._
Cohesion: 0.18
Nodes (9): [actionPrograms, setActionPrograms], [categorizedEvents, setCategorizedEvents], category, [dailyQuests, setDailyQuests], endDateFormatted, [eventTimelineFilter, setEventTimelineFilter], Icon, startDateFormatted (+1 more)

### Community 14 - "Community 14"
_Unable to determine domain due to missing code entities._
Cohesion: 0.31
Nodes (9): buildVerificationPrompt(), callGemini(), callNvidiaNim(), callOpenRouter(), generateActionCaption(), mockSimulationAnalysis(), parseAiJsonResponse(), verifyActionWithMultimodalAI() (+1 more)

### Community 15 - "Community 15"
_Unable to determine domain due to missing code entities._
Cohesion: 0.29
Nodes (6): canSwitchAccounts, isActive, isAdmin, isOrganizer, { mode, isDemoMode, isPrototypeMode, toggleMode }, { user, usersList, loadUsersList, loginAs }

### Community 16 - "Community 16"
_Unable to determine domain due to missing code entities._
Cohesion: 0.29
Nodes (6): Icon, isApprovedFull, isCoinsOnly, isPending, isRejected, ProfilePage

### Community 17 - "Community 17"
_Unable to determine domain due to missing code entities._
Cohesion: 0.4
Nodes (4): Icon, isOrganizer, navItems, { user }

### Community 18 - "Community 18"
_Unable to determine domain due to missing code entities._
Cohesion: 0.4
Nodes (4): isLogtoConfigured, logtoAppId, logtoConfig, logtoEndpoint

### Community 19 - "Community 19"
_Unable to determine domain due to missing code entities._
Cohesion: 0.6
Nodes (4): downloadActionPdfReport(), loadImage(), sanitizeText(), handleDownloadPdfReport()

### Community 20 - "Community 20"
_Unable to determine domain due to missing code entities._
Cohesion: 0.4
Nodes (4): isConfigured, supabase, supabaseAnonKey, supabaseUrl

### Community 21 - "Community 21"
_Unable to determine domain due to missing code entities._
Cohesion: 0.5
Nodes (3): baseStyles, sizeStyles, variantStyles

### Community 22 - "Community 22"
_Unable to determine domain due to missing code entities._
Cohesion: 0.67
Nodes (1): FormattedText

### Community 23 - "Community 23"

Cohesion: 0.67
Nodes (2): APP_MODE_KEY, useAppModeStore

### Community 24 - "Community 24"
_Unable to determine domain due to missing code entities._
Cohesion: 0.67
Nodes (2): NOTIFICATIONS_PREFIX, useNotificationStore

### Community 25 - "Community 25"

Cohesion: 0.67
Nodes (1): EMISSION_FACTORS

### Community 26 - "Community 26"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"

Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"

Cohesion: 1.0
Nodes (1): @logto/react

### Community 36 - "Community 36"

Cohesion: 1.0
Nodes (1): zustand

### Community 37 - "Community 37"
_It constructs a valid class name string from mixed boolean, string, and array inputs, filtering out falsey values, commonly used in UI frameworks._
Cohesion: 1.0
Nodes (1): clsx

### Community 38 - "Community 38"
_Provides a set of SVG icons packaged as React components for consistent icon usage across applications._
Cohesion: 1.0
Nodes (1): lucide-react

### Community 39 - "Community 39"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
_Handles navigation, URL routing, and view rendering in React web applications._
Cohesion: 1.0
Nodes (1): react-router-dom

### Community 41 - "Community 41"
_Merges Tailwind utility classes, resolving conflicts and ensuring a single, optimized class string._
Cohesion: 1.0
Nodes (1): tailwind-merge

### Community 42 - "Community 42"

Cohesion: 1.0
Nodes (1): xlsx

### Community 43 - "Community 43"
_Adds vendor prefixes to CSS rules for cross-browser compatibility._
Cohesion: 1.0
Nodes (1): autoprefixer

### Community 44 - "Community 44"

Cohesion: 1.0
Nodes (1): postcss

### Community 45 - "Community 45"
_Provides the interface for rendering React components to the browser's DOM, handling mounting, updating, and unmounting logic._
Cohesion: 1.0
Nodes (1): react-dom

### Community 46 - "Community 46"
_Provides low-level utility classes for styling UI elements in web applications._
Cohesion: 1.0
Nodes (1): tailwindcss

### Community 47 - "Community 47"

Cohesion: 1.0
Nodes (1): @types/canvas-confetti

### Community 48 - "Community 48"
_Provides type declarations for Node.js core modules, enabling TypeScript to type-check Node runtime APIs._
Cohesion: 1.0
Nodes (1): @types/node

### Community 49 - "Community 49"
_Provides TypeScript type definitions for the React library, enabling static type checking and IntelliSense for React components._
Cohesion: 1.0
Nodes (1): @types/react

### Community 50 - "Community 50"
_Provides TypeScript type definitions for React's DOM rendering API, enabling type safety and editor IntelliSense in React applications._
Cohesion: 1.0
Nodes (1): @types/react-dom

### Community 51 - "Community 51"
_It provides optional static typing, transpilation to JavaScript, and tooling support to improve code safety and developer experience._
Cohesion: 1.0
Nodes (1): typescript

### Community 52 - "Community 52"

Cohesion: 1.0
Nodes (1): vite

### Community 53 - "Community 53"
_Enables seamless integration of React into Vite projects, handling JSX compilation and hot module replacement._
Cohesion: 1.0
Nodes (1): @vitejs/plugin-react

### Community 54 - "Community 54"

Cohesion: 1.0
Nodes (1): canvas-confetti

### Community 55 - "Community 55"

Cohesion: 1.0
Nodes (1): @supabase/supabase-js

### Community 56 - "Community 56"

Cohesion: 1.0
Nodes (1): jspdf

### Community 57 - "Community 57"

Cohesion: 1.0
Nodes (1): i-can-app Repository

## Knowledge Gaps
- **258 isolated node(s):** `{ user, usersList, loadUsersList, loginAs }`, `{ mode, isDemoMode, isPrototypeMode, toggleMode }`, `canSwitchAccounts`, `isActive`, `isOrganizer` (+253 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 26`** (2 nodes): `Badge()`, `Badge.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `Card()`, `Card.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `imageCompressor.ts`, `compressImage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `main.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `vite-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `@logto/react`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `zustand`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `clsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `lucide-react`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `react`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `react-router-dom`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `tailwind-merge`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `xlsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `autoprefixer`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `postcss`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `react-dom`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `tailwindcss`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `@types/canvas-confetti`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `@types/node`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `@types/react`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `@types/react-dom`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `typescript`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `vite`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `@vitejs/plugin-react`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `canvas-confetti`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `@supabase/supabase-js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `jspdf`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `i-can-app Repository`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.