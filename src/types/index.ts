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

export type ActionType = 'BINA_DIRI' | 'BINA_LINGKUNGAN' | 'VIRTUAL_VOLUNTEER' | 'CSA';

export interface ActionCategory {
  id: string;
  name: string;
  type: ActionType;
  icon: string; // Lucide icon name (e.g., 'CupSoda', 'Bus', 'Trash2', 'Zap')
  emissionFactor: number; // kg CO2e per action
  baseCoins: number;
  satEquivalent: number;
  description: string;
}

export type ActionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface GreenAction {
  id: string;
  userId: string;
  userName?: string;
  userFaculty?: string;
  userAvatar?: string;
  categoryId: string;
  categoryName?: string;
  categoryIcon?: string;
  photoUrl: string;
  story?: string;
  gpsLat?: number;
  gpsLng?: number;
  status: ActionStatus;
  aiConfidence?: number; // 0.00 - 1.00
  aiAnalysisReason?: string;
  greenCoinsEarned: number;
  carbonImpactKg: number;
  satPointsEarned: number;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
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
