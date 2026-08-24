# Graph Report - D:\Codes\i-can-app  (2026-08-24)

## Corpus Check
- 32 files · ~57,971 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 201 nodes · 193 edges · 29 communities detected
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.8)
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

## God Nodes (most connected - your core abstractions)
1. `getActions()` - 7 edges
2. `navigate` - 5 edges
3. `updateActionVerification()` - 5 edges
4. `getStoredAccounts()` - 5 edges
5. `loadData()` - 4 edges
6. `hashPassword()` - 4 edges
7. `useAuthStore` - 4 edges
8. `handleAdminVerify()` - 3 edges
9. `submitGreenAction()` - 3 edges
10. `registerUser()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `loadData()` --calls--> `getActions()`  [INFERRED]
  D:\Codes\i-can-app\src\pages\AdminLtePage.tsx → D:\Codes\i-can-app\src\services\actionService.ts
- `loadData()` --calls--> `getStoredAccounts()`  [INFERRED]
  D:\Codes\i-can-app\src\pages\AdminLtePage.tsx → D:\Codes\i-can-app\src\services\authService.ts
- `handleAdminVerify()` --calls--> `updateActionVerification()`  [INFERRED]
  D:\Codes\i-can-app\src\pages\AdminLtePage.tsx → D:\Codes\i-can-app\src\services\actionService.ts
- `load()` --calls--> `getActions()`  [INFERRED]
  D:\Codes\i-can-app\src\pages\FeedPage.tsx → D:\Codes\i-can-app\src\services\actionService.ts
- `load()` --calls--> `getActions()`  [INFERRED]
  D:\Codes\i-can-app\src\pages\VerificationPage.tsx → D:\Codes\i-can-app\src\services\actionService.ts

## Communities

### Community 0 - "Community 0"

Cohesion: 0.08
Nodes (19): [aiResult, setAiResult], [campaignUrl, setCampaignUrl], CATEGORIES, [copiedHashtags, setCopiedHashtags], [copiedStoryCard, setCopiedStoryCard], fileInputRef, [groupMembers, setGroupMembers], [groupNimInput, setGroupNimInput] (+11 more)

### Community 1 - "Community 1"

Cohesion: 0.1
Nodes (20): [activeTab, setActiveTab], FACULTIES, [formValidationMsg, setFormValidationMsg], handleDemoStudent(), handleDemoVerifier(), handleLoginSubmit(), handleRegisterSubmit(), [loginIdentifier, setLoginIdentifier] (+12 more)

### Community 2 - "Community 2"

Cohesion: 0.1
Nodes (18): [actionsList, setActionsList], [activeMenu, setActiveMenu], [grantCoinsAmount, setGrantCoinsAmount], [grantReason, setGrantReason], [grantSatAmount, setGrantSatAmount], [grantSuccessMsg, setGrantSuccessMsg], handleAdminVerify(), [isWideView, setIsWideView] (+10 more)

### Community 3 - "Community 3"

Cohesion: 0.11
Nodes (19): getActions(), LOCAL_ACTIONS_KEY, SEEDED_INITIAL_ACTIONS, submitGreenAction(), updateActionVerification(), load(), handleSubmit(), confirmReject() (+11 more)

### Community 4 - "Community 4"

Cohesion: 0.2
Nodes (8): accountDropdownRef, dropdownRef, handleNotificationClick(), navigate, { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll, 
    simulateIncomingNotification 
  }, [showAccountSelector, setShowAccountSelector], [showNotifications, setShowNotifications], { user, loginAs }

### Community 5 - "Community 5"

Cohesion: 0.2
Nodes (5): AppLayout(), DEMO_PROFILES, useAuthStore, CallbackPage(), ProtectedRoute()

### Community 6 - "Community 6"

Cohesion: 0.2
Nodes (7): [activeTab, setActiveTab], defaultSamplePosts, filteredPosts, [hasLiked, setHasLiked], [likes, setLikes], [postsList, setPostsList], [reactions, setReactions]

### Community 7 - "Community 7"

Cohesion: 0.2
Nodes (8): [activeTab, setActiveTab], [copiedHashtags, setCopiedHashtags], FAQ_LIST, filteredFaqs, isOpen, officialHashtags, [openFaqIndex, setOpenFaqIndex], [searchQuery, setSearchQuery]

### Community 8 - "Community 8"
_Unable to determine domain due to missing code entities._
Cohesion: 0.22
Nodes (7): [copiedTranscript, setCopiedTranscript], defaultVerified, totalCoins, totalComserv, totalSat, { user }, [verifiedActions, setVerifiedActions]

### Community 9 - "Community 9"

Cohesion: 0.25
Nodes (6): [cheers, setCheers], flashQuests, [hasCheered, setHasCheered], Icon, programs, { user }

### Community 10 - "Community 10"

Cohesion: 0.52
Nodes (6): DEFAULT_SEEDED_ACCOUNTS, getStoredAccounts(), hashPassword(), loginWithCredentials(), registerUser(), STORAGE_ACCOUNTS_KEY

### Community 11 - "Community 11"

Cohesion: 0.4
Nodes (4): Icon, isVerifier, navItems, { user }

### Community 12 - "Community 12"

Cohesion: 0.4
Nodes (4): isLogtoConfigured, logtoAppId, logtoConfig, logtoEndpoint

### Community 13 - "Community 13"
_Unable to determine domain due to missing code entities._
Cohesion: 0.4
Nodes (4): isConfigured, supabase, supabaseAnonKey, supabaseUrl

### Community 14 - "Community 14"
_Unable to determine domain due to missing code entities._
Cohesion: 0.5
Nodes (3): baseStyles, sizeStyles, variantStyles

### Community 15 - "Community 15"
_Unable to determine domain due to missing code entities._
Cohesion: 0.5
Nodes (3): INITIAL_NOTIFICATIONS, NOTIFICATIONS_STORAGE_KEY, useNotificationStore

### Community 16 - "Community 16"
_Unable to determine domain due to missing code entities._
Cohesion: 0.67
Nodes (2): Icon, ProfilePage

### Community 17 - "Community 17"
_Unable to determine domain due to missing code entities._
Cohesion: 0.67
Nodes (1): EMISSION_FACTORS

### Community 18 - "Community 18"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"

Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"

Cohesion: 1.0
Nodes (0): 

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
Nodes (1): i-can-app Repository

## Knowledge Gaps
- **119 isolated node(s):** `{ user }`, `isVerifier`, `navItems`, `Icon`, `baseStyles` (+114 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 18`** (2 nodes): `Badge()`, `Badge.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `Card()`, `Card.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `gemini.ts`, `verifyActionWithGemini()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `imageCompressor.ts`, `compressImage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `main.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `vite-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `i-can-app Repository`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.