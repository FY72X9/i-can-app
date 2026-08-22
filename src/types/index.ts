// ==============================================================================
// I-CAN PLATFORM — CORE TYPES & DATA MODELS
// ==============================================================================

export type UserRole = 'STUDENT' | 'VERIFIER' | 'ADMIN';

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
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
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

export interface SatConversion {
  id: string;
  userId: string;
  greenCoinsSpent: number;
  satPointsReceived: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
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
