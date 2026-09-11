// ==============================================================================
// I-CAN PLATFORM — CORE TYPES & DATA MODELS
// ==============================================================================

export type UserRole = 'MAHASISWA' | 'ORGANIZER' | 'SUPERADMIN';

export interface UserProfile {
  id: string;
  nim: string;
  email: string;
  fullName: string;
  role: UserRole;
  facultyId?: string;
  facultyName?: string;
  avatarUrl?: string;
  totalGreenCoins: number;
  totalSatPoints: number;
  totalCarbonSaved: number; // in kg CO2e
  streakDays: number;
  lastActionAt?: string;
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export type ActionType = 
  | 'SELF_GREEN_CAMPAIGN' 
  | 'PENYULUHAN_AKSI_NYATA' 
  | 'VIDEO_BASED_LEARNING' 
  | 'BINA_DIRI' 
  | 'BINA_LINGKUNGAN' 
  | 'VIRTUAL_VOLUNTEER' 
  | 'CSA';

export interface ActionCategory {
  id: string;
  name: string;
  type: ActionType;
  icon: string; // Lucide icon name (e.g., 'TreePine', 'Droplets', 'Video', 'CupSoda', 'Bus', 'Trash2', 'Zap')
  emissionFactor: number; // kg CO2e per action
  baseCoins: number;
  satEquivalent: number;
  comservHours?: number;
  sdgTarget?: string; // e.g., 'SDG 13', 'SDG 15', 'SDG 6', 'SDG 4'
  description: string;
}

export type ActionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type VerificationDecision = 'APPROVED_COINS_ONLY' | 'APPROVED_FULL' | 'REJECTED';

export interface GreenAction {
  id: string;
  userId: string;
  userName?: string;
  userFaculty?: string;
  userAvatar?: string;
  categoryId: string;
  categoryName?: string;
  categoryIcon?: string;
  submissionType?: ActionType;
  photoUrl: string;
  campaignUrl?: string; // Link postingan Instagram / TikTok
  videoUrl?: string; // Link Video YouTube / GDrive (VBL)
  groupMembers?: string[]; // List NIM anggota (max 3 orang)
  story?: string;
  gpsLat?: number;
  gpsLng?: number;
  status: ActionStatus;
  decision?: VerificationDecision;
  aiConfidence?: number; // 0.00 - 1.00
  aiGuidelineScore?: number;
  aiCompletenessScore?: number;
  aiAnalysisReason?: string;
  greenCoinsEarned: number;
  carbonImpactKg: number;
  satPointsEarned: number;
  comservHoursEarned?: number;
  guidelineComplied?: boolean;
  realActivityVerified?: boolean;
  isSurveyProposal?: boolean;
  actionStep?: 'SURVEY_PROPOSAL' | 'FINAL_REPORT';
  surveyLocation?: string;
  partnerName?: string; // RT/RW or partner contact
  safetyAssessed?: boolean;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  // Event-linked submission fields
  eventId?: string;           // Set if this action is part of a Campus Event
  eventActivityId?: string;   // ID of the specific event activity/station completed
  eventOrganizerId?: string;  // Organizer user ID for filtering approval queues
  // Daily Quest submission field
  questId?: string;           // Set if this action is part of a Daily Quest
  actionSource?: 'PROGRAM' | 'QUEST' | 'EVENT'; // Source discriminator
}
// ==============================================================================
// EVENT-DRIVEN ARCHITECTURE — Campus Event & Activity Models
// ==============================================================================

export type EventStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED';
export type EventTimelineCategory = 'TODAY' | 'UPCOMING' | 'PAST';

export interface EventActivity {
  id: string;
  eventId: string;
  name: string;             // e.g. "Tong 1 - Pemilahan Kertas/Kardus" or "Activity 1 - Bawa Kotak Makan"
  description: string;
  qrCodeValue: string;      // Unique QR token, e.g. "ican-evt01-act01"
  coinsReward: number;      // Green Coins reward for completing this activity
  satPointsReward?: number; // Optional: SAT Points if applicable
  order: number;            // Display order within the event
}

export interface CampusEvent {
  id: string;
  organizerId: string;      // User ID of the organizer (SSO / ASD unit account)
  organizerName: string;    // e.g. "Student Service Office (SSO)"
  title: string;            // e.g. "Waste for Change", "Breakfest"
  description: string;
  bannerUrl: string;        // Event poster / banner image URL
  mediaUrls?: string[];     // Additional event media (photos, videos)
  startDate: string;        // ISO Date string
  endDate: string;          // ISO Date string
  timeRange?: string;       // e.g. "07.00 - 10.00 WIB"
  location?: string;        // e.g. "BINUS @Bekasi"
  dressCode?: string;       // e.g. "Kaos hitam & celana panjang"
  status: EventStatus;
  activities: EventActivity[];
  createdAt: string;
}

export interface SatRecognition {
  id: string;
  userId: string;
  actionId: string;
  activityTitle: string;
  satPointsAwarded: number;
  comservHoursAwarded: number;
  status: 'VERIFIED' | 'EXPORTED' | 'SYNCED';
  recognizedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  isEarned?: boolean;
  earnedAt?: string;
}

export interface FacultyLeaderboard {
  id: string;
  name: string;
  code: string;
  totalCarbonSaved: number;
  totalActions: number;
  rank: number;
}

export type NotificationType = 'sat' | 'streak' | 'quest' | 'system' | 'rejection' | 'tfi';

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  timestamp: number;
  type: NotificationType;
  read: boolean;
  actionUrl?: string;
}

// ==============================================================================
// SUPER ADMIN MANAGEMENT — Daily Quests & Program Aksi Nyata Models
// ==============================================================================

export interface DailyQuest {
  id: string;
  title: string;
  desc: string;
  reward: string; // e.g., '+15 Green Coins'
  coinsReward: number;
  satReward?: number;
  deadline: string; // e.g., 'Sisa 3 Jam', 'Sisa Hari Ini', '23:59 WIB'
  completed?: boolean;
  actionUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ActionProgram {
  id: string;
  title: string;
  category: string; // e.g. "Penyuluhan & Aksi Nyata", "Bina Lingkungan"
  categoryType: ActionType; // 'PENYULUHAN_AKSI_NYATA' | 'BINA_DIRI' | 'BINA_LINGKUNGAN' | 'SELF_GREEN_CAMPAIGN' | 'VIDEO_BASED_LEARNING'
  satPoints: number;
  comservHours: number;
  coins: number;
  co2: string; // e.g. "5.0 kg", "0.5 kg"
  icon: string; // Lucide icon identifier e.g. 'TreePine', 'Droplets', 'Leaf', 'Zap', 'CupSoda'
  color: string; // Tailwind gradient e.g. 'from-emerald-600 to-eco-800'
  tag: string; // e.g. 'SDG 15 & 13'
  urgency: string; // e.g. 'Hot Program 🔥', 'Program Prioritas ⭐'
  description?: string;
  samplePhotos?: string[];
  suggestedPrompt?: string;
  isActive: boolean;
  order?: number;
  createdAt: string;
  updatedAt?: string;
}
