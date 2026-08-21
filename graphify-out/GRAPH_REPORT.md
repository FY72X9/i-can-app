# Graph Report - D:\Codes\i-can-app  (2026-08-21)

## Corpus Check
- 25 files · ~16,956 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 88 nodes · 69 edges · 24 communities detected
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
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

## God Nodes (most connected - your core abstractions)
1. `getActions()` - 5 edges
2. `updateActionVerification()` - 4 edges
3. `LoginPage()` - 2 edges
4. `load()` - 2 edges
5. `handleDecision()` - 2 edges
6. `confirmReject()` - 2 edges
7. `load()` - 2 edges
8. `submitGreenAction()` - 2 edges
9. `useAuthStore` - 2 edges
10. `{ user }` - 1 edges

## Surprising Connections (you probably didn't know these)
- `load()` --calls--> `getActions()`  [INFERRED]
  D:\Codes\i-can-app\src\pages\VerificationPage.tsx → D:\Codes\i-can-app\src\services\actionService.ts
- `load()` --calls--> `getActions()`  [INFERRED]
  D:\Codes\i-can-app\src\pages\WalletPage.tsx → D:\Codes\i-can-app\src\services\actionService.ts
- `LoginPage()` --calls--> `useAuthStore`  [INFERRED]
  D:\Codes\i-can-app\src\pages\LoginPage.tsx → D:\Codes\i-can-app\src\stores\authStore.ts
- `handleDecision()` --calls--> `updateActionVerification()`  [INFERRED]
  D:\Codes\i-can-app\src\pages\VerificationPage.tsx → D:\Codes\i-can-app\src\services\actionService.ts
- `confirmReject()` --calls--> `updateActionVerification()`  [INFERRED]
  D:\Codes\i-can-app\src\pages\VerificationPage.tsx → D:\Codes\i-can-app\src\services\actionService.ts

## Communities

### Community 0 - "Community 0"

Cohesion: 0.17
Nodes (13): getActions(), LOCAL_ACTIONS_KEY, submitGreenAction(), updateActionVerification(), confirmReject(), defaultSampleQueue, handleDecision(), load() (+5 more)

### Community 1 - "Community 1"

Cohesion: 0.22
Nodes (7): [copiedTranscript, setCopiedTranscript], defaultVerified, totalCoins, totalComserv, totalSat, { user }, [verifiedActions, setVerifiedActions]

### Community 2 - "Community 2"

Cohesion: 0.25
Nodes (7): currentSat, Icon, navigate, quickActions, satPercentage, satTarget, { user }

### Community 3 - "Community 3"

Cohesion: 0.29
Nodes (5): [activeTab, setActiveTab], filteredPosts, [hasLiked, setHasLiked], [likes, setLikes], samplePosts

### Community 4 - "Community 4"

Cohesion: 0.4
Nodes (4): Icon, isVerifier, navItems, { user }

### Community 5 - "Community 5"

Cohesion: 0.4
Nodes (3): DEMO_PROFILES, useAuthStore, LoginPage()

### Community 6 - "Community 6"

Cohesion: 0.4
Nodes (4): isConfigured, supabase, supabaseAnonKey, supabaseUrl

### Community 7 - "Community 7"

Cohesion: 0.5
Nodes (3): baseStyles, sizeStyles, variantStyles

### Community 8 - "Community 8"
_Unable to determine domain due to missing code entities._
Cohesion: 0.67
Nodes (0): 

### Community 9 - "Community 9"

Cohesion: 0.67
Nodes (1): { user, loginAs }

### Community 10 - "Community 10"

Cohesion: 0.67
Nodes (2): Icon, ProfilePage

### Community 11 - "Community 11"

Cohesion: 0.67
Nodes (2): CATEGORIES, UploadPage

### Community 12 - "Community 12"

Cohesion: 0.67
Nodes (1): EMISSION_FACTORS

### Community 13 - "Community 13"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
_Unable to determine domain due to missing code entities._
Cohesion: 1.0
Nodes (0): 

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
Nodes (1): i-can-app Repository

## Knowledge Gaps
- **44 isolated node(s):** `{ user }`, `isVerifier`, `navItems`, `Icon`, `baseStyles` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 13`** (2 nodes): `Badge()`, `Badge.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (2 nodes): `Card()`, `Card.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `gemini.ts`, `verifyActionWithGemini()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `imageCompressor.ts`, `compressImage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `main.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `vite-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `i-can-app Repository`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.