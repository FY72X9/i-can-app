# Graph Report - docs  (2026-09-10)

## Corpus Check
- 8 files · ~22,860 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 254 nodes · 260 edges · 32 communities (19 shown, 3 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Revision Notes & Features
- Upload Page & AI
- Login Page & Authentication
- Admin LTE Page & Grants
- Action Service & State
- Presentation Materials
- Top Navbar Component
- App Router & Auth Store
- Feed Page & Posts
- Guide Page & FAQ
- Wallet Page & Transcripts
- Home Page & Quests
- Auth Service & Users
- Bottom Nav Component
- Logto Service
- Supabase Service
- Button Component
- Notification Store
- Feedback & Super Admin
- Carbon Calculator Utils
- Profile Page
- Readme

## God Nodes (most connected - your core abstractions)
1. `Dual-Track Reward System` - 14 edges
2. `I-CAN Comprehensive Presentation Material & Academic Study` - 10 edges
3. `getActions()` - 7 edges
4. `Innovation Award 5 Evaluation Criteria` - 7 edges
5. `5-Minute High-Impact Pitch Deck` - 6 edges
6. `Innovation Project Evaluation Rubric` - 6 edges
7. `updateActionVerification()` - 5 edges
8. `getStoredAccounts()` - 5 edges
9. `navigate` - 5 edges
10. `MVP Implementation Checklist` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Seamless Frictionless Reporting Flow` --semantically_similar_to--> `Client-Side Canvas Image Compression`  [INFERRED] [semantically similar]
  FEATURE_REVISION_NOTES.md → MVP_IMPLEMENTATION_CHECKLIST.md
- `Dual-Track Reward System` --conceptually_related_to--> `Three-Branch Verifier Triage Decision Matrix`  [INFERRED]
  FEATURE_REVISION_NOTES.md → presentation/presentation_5min_pitch.md
- `TFI Regulations Alignment` --conceptually_related_to--> `Dual-Track Reward System`  [INFERRED]
  idea_revision.md → FEATURE_REVISION_NOTES.md
- `Dual-Track Pitch Strategy` --conceptually_related_to--> `Dual-Track Reward System`  [INFERRED]
  presentation/presentation_5min_pitch.md → FEATURE_REVISION_NOTES.md
- `Deci & Ryan (2000) - Self-Determination Theory` --rationale_for--> `Dual-Track Reward System`  [INFERRED]
  presentation/presentation_material.md → FEATURE_REVISION_NOTES.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dual-Track Regulatory Compliance Architecture** — docs_feature_revision_notes_dual_track_system, docs_feature_revision_notes_direct_activity_mapping, docs_idea_revision_tfi_regulations_alignment, docs_presentation_presentation_material_deci_ryan_2000 [INFERRED 0.95]
- **Zero-Cost Edge Client Compression & Verification Pipeline** — docs_mvp_implementation_checklist_zero_cost_architecture, docs_mvp_implementation_checklist_canvas_image_compression, docs_presentation_presentation_material_multimodal_vision_pipeline [INFERRED 0.85]
- **Innovation Award Evaluation Alignment** — docs_presentation_presentation_guideline_evaluation_criteria, docs_presentation_presentation_material_doc, docs_presentation_presentation_5min_pitch_doc [EXTRACTED 1.00]
- **Core Evaluation Criteria for Project Assessment** — docs_presentation_image_literature_study_knowledge_foundation, docs_presentation_image_risk_sustainability_management, docs_presentation_image_impact_realization, docs_presentation_image_implementation_maturity, docs_presentation_image_novelty_strategic_value [EXTRACTED 1.00]

## Communities (32 total, 3 thin omitted)

### Community 0 - "Revision Notes & Features"
Cohesion: 0.07
Nodes (34): Gemini 1.5 Flash AI Pre-Verification, BEKEN Award (BINUS Eco-Ksatria Environmental Network Award), Direct Activity Mapping, Feature Revision Notes v2.0, Dual-Track Reward System, Green Coins Gamification Token, Penyuluhan dan Aksi Nyata (TFI Standard), Seamless Frictionless Reporting Flow (+26 more)

### Community 1 - "Upload Page & AI"
Cohesion: 0.08
Nodes (19): [aiResult, setAiResult], [campaignUrl, setCampaignUrl], CATEGORIES, [copiedHashtags, setCopiedHashtags], [copiedStoryCard, setCopiedStoryCard], fileInputRef, [groupMembers, setGroupMembers], [groupNimInput, setGroupNimInput] (+11 more)

### Community 2 - "Login Page & Authentication"
Cohesion: 0.10
Nodes (20): [activeTab, setActiveTab], FACULTIES, [formValidationMsg, setFormValidationMsg], handleDemoStudent(), handleDemoVerifier(), handleLoginSubmit(), handleRegisterSubmit(), [loginIdentifier, setLoginIdentifier] (+12 more)

### Community 3 - "Admin LTE Page & Grants"
Cohesion: 0.10
Nodes (18): [actionsList, setActionsList], [activeMenu, setActiveMenu], [grantCoinsAmount, setGrantCoinsAmount], [grantReason, setGrantReason], [grantSatAmount, setGrantSatAmount], [grantSuccessMsg, setGrantSuccessMsg], handleAdminVerify(), [isWideView, setIsWideView] (+10 more)

### Community 4 - "Action Service & State"
Cohesion: 0.11
Nodes (19): getActions(), LOCAL_ACTIONS_KEY, SEEDED_INITIAL_ACTIONS, submitGreenAction(), updateActionVerification(), load(), handleSubmit(), confirmReject() (+11 more)

### Community 5 - "Presentation Materials"
Cohesion: 0.18
Nodes (15): Zero-Cost Cloud Architecture, BINUS Group Intelligent Society Impact, Innovation Project Evaluation Rubric, Impact Realization (Output & Outcome) Criterion (30%), Implementation Maturity Criterion (30%), KM Portal Knowledge Documentation, Literature Study & Knowledge Foundation Criterion (10%), Novelty & Strategic Value Creation Criterion (15%) (+7 more)

### Community 6 - "Top Navbar Component"
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

### Community 7 - "App Router & Auth Store"
Cohesion: 0.20
Nodes (5): AppLayout(), DEMO_PROFILES, useAuthStore, CallbackPage(), ProtectedRoute()

### Community 8 - "Feed Page & Posts"
Cohesion: 0.20
Nodes (7): [activeTab, setActiveTab], defaultSamplePosts, filteredPosts, [hasLiked, setHasLiked], [likes, setLikes], [postsList, setPostsList], [reactions, setReactions]

### Community 9 - "Guide Page & FAQ"
Cohesion: 0.20
Nodes (8): [activeTab, setActiveTab], [copiedHashtags, setCopiedHashtags], FAQ_LIST, filteredFaqs, isOpen, officialHashtags, [openFaqIndex, setOpenFaqIndex], [searchQuery, setSearchQuery]

### Community 10 - "Wallet Page & Transcripts"
Cohesion: 0.22
Nodes (7): [copiedTranscript, setCopiedTranscript], defaultVerified, totalCoins, totalComserv, totalSat, { user }, [verifiedActions, setVerifiedActions]

### Community 11 - "Home Page & Quests"
Cohesion: 0.25
Nodes (6): [cheers, setCheers], flashQuests, [hasCheered, setHasCheered], Icon, programs, { user }

### Community 12 - "Auth Service & Users"
Cohesion: 0.52
Nodes (6): DEFAULT_SEEDED_ACCOUNTS, getStoredAccounts(), hashPassword(), loginWithCredentials(), registerUser(), STORAGE_ACCOUNTS_KEY

### Community 13 - "Bottom Nav Component"
Cohesion: 0.40
Nodes (4): Icon, isVerifier, navItems, { user }

### Community 14 - "Logto Service"
Cohesion: 0.40
Nodes (4): isLogtoConfigured, logtoAppId, logtoConfig, logtoEndpoint

### Community 15 - "Supabase Service"
Cohesion: 0.40
Nodes (4): isConfigured, supabase, supabaseAnonKey, supabaseUrl

### Community 16 - "Button Component"
Cohesion: 0.50
Nodes (3): baseStyles, sizeStyles, variantStyles

### Community 17 - "Notification Store"
Cohesion: 0.50
Nodes (3): INITIAL_NOTIFICATIONS, NOTIFICATIONS_STORAGE_KEY, useNotificationStore

### Community 18 - "Feedback & Super Admin"
Cohesion: 0.50
Nodes (4): User Feedback 22 August 2026, Super Admin Panel AdminLTE Implementation, UI Simplification and Standalone Guide/FAQ Page, Super Admin Panel AdminLTE Module

## Knowledge Gaps
- **134 isolated node(s):** `accountDropdownRef`, `dropdownRef`, `{ 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll, 
    simulateIncomingNotification 
  }`, `[showAccountSelector, setShowAccountSelector]`, `[showNotifications, setShowNotifications]` (+129 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 172 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getActions()` connect `Action Service & State` to `Admin LTE Page & Grants`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `handleSubmit()` connect `Action Service & State` to `Upload Page & AI`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Dual-Track Reward System` (e.g. with `Three-Branch Verifier Triage Decision Matrix` and `TFI Regulations Alignment`) actually correct?**
  _`Dual-Track Reward System` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getActions()` (e.g. with `loadData()` and `load()`) actually correct?**
  _`getActions()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `accountDropdownRef`, `dropdownRef`, `{ 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll, 
    simulateIncomingNotification 
  }` to the rest of the system?**
  _134 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Revision Notes & Features` be split into smaller, more focused modules?**
  _Cohesion score 0.0748663101604278 - nodes in this community are weakly interconnected._
- **Should `Upload Page & AI` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._