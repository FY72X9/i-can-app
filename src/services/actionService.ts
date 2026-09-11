// ==============================================================================
// I-CAN PLATFORM — ACTION INGESTION & PERSISTENCE SERVICE
// Supports direct Supabase database & storage with offline local fallback
// ==============================================================================

import { supabase, isConfigured } from '@/services/supabase';
import { GreenAction, VerificationDecision } from '@/types';

const LOCAL_ACTIONS_KEY = 'i_can_submitted_actions';
const SEED_VERSION_KEY = 'i_can_seed_version_v2_2weeks';

// Generate dynamic ISO timestamp relative to now
const daysAgo = (days: number, hours: number = 0) => 
  new Date(Date.now() - days * 86400000 - hours * 3600000).toISOString();

export const SEEDED_INITIAL_ACTIONS: GreenAction[] = [];

// Retrieve all actions (from Supabase or LocalStorage fallback)
export async function getActions(): Promise<GreenAction[]> {
  if (isConfigured) {
    try {
      // No embedded relationship joins — user_id/category_id are plain text
      // with no FK (see fix_actions_schema_mismatch.sql), so name/icon are
      // read from the denormalized columns written at submission time.
      const { data, error } = await supabase
        .from('actions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          userName: item.user_name || 'Mahasiswa BINUS',
          categoryId: item.category_id,
          categoryName: item.category_name || 'Aksi Hijau',
          categoryIcon: item.category_icon || 'Leaf',
          submissionType: item.submission_type,
          isSurveyProposal: item.is_survey_proposal,
          actionStep: item.action_step,
          surveyLocation: item.survey_location,
          partnerName: item.partner_name,
          safetyAssessed: item.safety_assessed,
          photoUrl: item.photo_url || item.photoUrl,
          groupPhotoUrl: item.group_photo_url || item.groupPhotoUrl,
          additionalPhotos: item.additional_photos || item.additionalPhotos || [],
          campaignUrl: item.campaign_url,
          videoUrl: item.video_url,
          groupMembers: item.group_members,
          story: item.story,
          gpsLat: item.gps_lat,
          gpsLng: item.gps_lng,
          status: item.status,
          decision: item.decision,
          aiConfidence: item.ai_confidence,
          aiGuidelineScore: item.ai_guideline_score,
          aiCompletenessScore: item.ai_completeness_score,
          aiAnalysisReason: item.ai_analysis_reason,
          greenCoinsEarned: item.green_coins_earned,
          carbonImpactKg: item.carbon_impact_kg,
          satPointsEarned: item.sat_points_earned,
          comservHoursEarned: item.comserv_hours,
          guidelineComplied: item.guideline_complied,
          realActivityVerified: item.real_activity_verified,
          submittedAt: item.submitted_at,
          verifiedAt: item.verified_at,
          verifiedBy: item.verified_by,
          rejectionReason: item.rejection_reason,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local store:', err);
    }
  }

  // Check version to ensure latest records are populated
  const savedVersion = localStorage.getItem(SEED_VERSION_KEY);
  if (savedVersion !== 'v2.4_empty') {
    localStorage.setItem(LOCAL_ACTIONS_KEY, JSON.stringify(SEEDED_INITIAL_ACTIONS));
    localStorage.setItem(SEED_VERSION_KEY, 'v2.4_empty');
    return SEEDED_INITIAL_ACTIONS;
  }

  // Local fallback
  const raw = localStorage.getItem(LOCAL_ACTIONS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }

  localStorage.setItem(LOCAL_ACTIONS_KEY, JSON.stringify(SEEDED_INITIAL_ACTIONS));
  return SEEDED_INITIAL_ACTIONS;
}

// Submit a new action
export async function submitGreenAction(
  actionData: Omit<GreenAction, 'id' | 'submittedAt'>,
  photoBlob?: Blob
): Promise<GreenAction> {
  let photoUrl = actionData.photoUrl;

  // 1. Upload photo to Supabase Storage if configured
  if (isConfigured && photoBlob) {
    try {
      const fileName = `${actionData.userId}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('action-photos')
        .upload(fileName, photoBlob, { contentType: 'image/jpeg' });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('action-photos')
          .getPublicUrl(fileName);
        photoUrl = publicUrlData.publicUrl;
      }
    } catch (err) {
      console.warn('Storage upload error, using local data URL:', err);
    }
  }

  const newAction: GreenAction = {
    ...actionData,
    id: `act-${Date.now()}`,
    photoUrl,
    submittedAt: new Date().toISOString(),
  };

  // 2. Insert record into Supabase table
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('actions')
        .insert({
          id: newAction.id,
          user_id: newAction.userId,
          user_name: newAction.userName,
          category_id: newAction.categoryId,
          category_name: newAction.categoryName,
          category_icon: newAction.categoryIcon,
          submission_type: newAction.submissionType,
          event_id: newAction.eventId,
          event_activity_id: newAction.eventActivityId,
          quest_id: newAction.questId,
          action_source: newAction.actionSource,
          photo_url: newAction.photoUrl,
          group_photo_url: newAction.groupPhotoUrl,
          additional_photos: newAction.additionalPhotos,
          campaign_url: newAction.campaignUrl,
          video_url: newAction.videoUrl,
          group_members: newAction.groupMembers,
          story: newAction.story,
          gps_lat: newAction.gpsLat,
          gps_lng: newAction.gpsLng,
          status: newAction.status,
          decision: newAction.decision,
          ai_confidence: newAction.aiConfidence,
          ai_guideline_score: newAction.aiGuidelineScore,
          ai_completeness_score: newAction.aiCompletenessScore,
          ai_analysis_reason: newAction.aiAnalysisReason,
          green_coins_earned: newAction.greenCoinsEarned,
          carbon_impact_kg: newAction.carbonImpactKg,
          sat_points_earned: newAction.satPointsEarned,
          comserv_hours: newAction.comservHoursEarned,
          guideline_complied: newAction.guidelineComplied,
          real_activity_verified: newAction.realActivityVerified,
          submitted_at: newAction.submittedAt,
        })
        .select()
        .single();

      if (!error && data) {
        return newAction;
      }
    } catch (err) {
      console.warn('Supabase insert failed, persisting locally:', err);
    }
  }

  // 3. Offline/Local persistence
  const actions = await getActions();
  const updated = [newAction, ...actions];
  localStorage.setItem(LOCAL_ACTIONS_KEY, JSON.stringify(updated));

  return newAction;
}

// Verifier Decision Update
export async function updateActionVerification(
  actionId: string,
  decision: VerificationDecision,
  verifierIdOrReason?: string,
  verifierName?: string,
  rejectionReason?: string
): Promise<GreenAction | null> {
  const isApproved = decision === 'APPROVED_FULL' || decision === 'APPROVED_COINS_ONLY';
  const status = isApproved ? 'APPROVED' : 'REJECTED';
  const now = new Date().toISOString();

  let finalVerifierId = 'usr-verifier-002';
  let finalVerifierName = 'Siska Amanda (SSO)';
  let finalReason = rejectionReason;

  if (verifierIdOrReason && verifierIdOrReason.startsWith('usr-')) {
    finalVerifierId = verifierIdOrReason;
    if (verifierName) finalVerifierName = verifierName;
  } else if (verifierIdOrReason) {
    finalReason = verifierIdOrReason;
  }

  if (verifierName && !verifierName.startsWith('usr-')) {
    finalVerifierName = verifierName;
  }

  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('actions')
        .update({
          status,
          decision,
          verified_at: now,
          verified_by: finalVerifierName,
          rejection_reason: finalReason,
        })
        .eq('id', actionId)
        .select()
        .single();

      if (!error && data) {
        return {
          ...data,
          status,
          decision,
          verifiedAt: now,
          verifiedBy: finalVerifierName,
          rejectionReason: finalReason,
        };
      }
    } catch (err) {
      console.warn('Supabase update failed, updating locally:', err);
    }
  }

  // Local fallback update
  const actions = await getActions();
  const targetIndex = actions.findIndex((a) => a.id === actionId);
  if (targetIndex === -1) return null;

  const target = actions[targetIndex];
  const updatedAction: GreenAction = {
    ...target,
    status,
    decision,
    verifiedAt: now,
    verifiedBy: finalVerifierName,
    rejectionReason: finalReason || target.rejectionReason,
    // If coins only, sat points becomes 0
    satPointsEarned: decision === 'APPROVED_COINS_ONLY' ? 0 : target.satPointsEarned,
    comservHoursEarned: decision === 'APPROVED_COINS_ONLY' ? 0 : target.comservHoursEarned,
    realActivityVerified: decision === 'APPROVED_FULL',
  };

  actions[targetIndex] = updatedAction;
  localStorage.setItem(LOCAL_ACTIONS_KEY, JSON.stringify(actions));

  return updatedAction;
}

// Get user specific actions
export async function getUserActions(userId: string): Promise<GreenAction[]> {
  const all = await getActions();
  return all.filter((a) => a.userId === userId);
}
