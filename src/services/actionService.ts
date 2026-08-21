// ==============================================================================
// I-CAN PLATFORM — ACTION INGESTION & PERSISTENCE SERVICE
// Supports direct Supabase database & storage with offline local fallback
// ==============================================================================

import { supabase, isConfigured } from '@/services/supabase';
import { GreenAction, VerificationDecision } from '@/types';

const LOCAL_ACTIONS_KEY = 'i_can_submitted_actions';

// Retrieve all actions (from Supabase or LocalStorage fallback)
export async function getActions(): Promise<GreenAction[]> {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('actions')
        .select(`
          *,
          users (full_name, nim),
          action_categories (name, icon, emission_factor, base_coins)
        `)
        .order('submitted_at', { ascending: false });

      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          userName: item.users?.full_name || 'Mahasiswa BINUS',
          categoryId: item.category_id,
          categoryName: item.action_categories?.name || 'Aksi Hijau',
          categoryIcon: item.action_categories?.icon || 'Leaf',
          submissionType: item.submission_type,
          photoUrl: item.photo_url,
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

  // Local fallback
  const raw = localStorage.getItem(LOCAL_ACTIONS_KEY);
  return raw ? JSON.parse(raw) : [];
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

  // 2. Insert record into Supabase actions table
  if (isConfigured) {
    try {
      await supabase.from('actions').insert({
        user_id: newAction.userId,
        category_id: newAction.categoryId,
        submission_type: newAction.submissionType,
        photo_url: newAction.photoUrl,
        campaign_url: newAction.campaignUrl,
        video_url: newAction.videoUrl,
        group_members: newAction.groupMembers,
        story: newAction.story,
        gps_lat: newAction.gpsLat,
        gps_lng: newAction.gpsLng,
        status: newAction.status,
        ai_confidence: newAction.aiConfidence,
        ai_guideline_score: newAction.aiGuidelineScore,
        ai_completeness_score: newAction.aiCompletenessScore,
        ai_analysis_reason: newAction.aiAnalysisReason,
        green_coins_earned: newAction.greenCoinsEarned,
        carbon_impact_kg: newAction.carbonImpactKg,
        sat_points_earned: newAction.satPointsEarned,
        comserv_hours: newAction.comservHoursEarned,
      });
    } catch (err) {
      console.warn('DB insert failed, saving locally:', err);
    }
  }

  // 3. Save to LocalStorage for offline persistence & immediate UI sync
  const existing = await getActions();
  localStorage.setItem(LOCAL_ACTIONS_KEY, JSON.stringify([newAction, ...existing]));

  return newAction;
}

// Update Action Decision (by Verifier / SSO Admin)
export async function updateActionVerification(
  actionId: string,
  decision: VerificationDecision,
  notes?: string,
  rejectionReason?: string
): Promise<void> {
  const actions = await getActions();
  const updated = actions.map((a) => {
    if (a.id === actionId) {
      const isFull = decision === 'APPROVED_FULL';
      const isCoinsOnly = decision === 'APPROVED_COINS_ONLY';
      const isRejected = decision === 'REJECTED';

      return {
        ...a,
        status: (isRejected ? 'REJECTED' : 'APPROVED') as 'APPROVED' | 'REJECTED',
        decision,
        verifiedAt: new Date().toISOString(),
        rejectionReason: isRejected ? (rejectionReason || notes) : undefined,
        satPointsEarned: isFull ? a.satPointsEarned : 0,
        comservHoursEarned: isFull ? a.comservHoursEarned : 0,
        greenCoinsEarned: isRejected ? 0 : a.greenCoinsEarned,
        guidelineComplied: isCoinsOnly || isFull,
        realActivityVerified: isFull,
      };
    }
    return a;
  });

  localStorage.setItem(LOCAL_ACTIONS_KEY, JSON.stringify(updated));

  if (isConfigured) {
    try {
      const target = updated.find((a) => a.id === actionId);
      if (target) {
        await supabase
          .from('actions')
          .update({
            status: target.status,
            verified_at: target.verifiedAt,
            green_coins_earned: target.greenCoinsEarned,
            sat_points_earned: target.satPointsEarned,
            rejection_reason: target.rejectionReason,
          })
          .eq('id', actionId);
      }
    } catch (err) {
      console.warn('Supabase verification update failed:', err);
    }
  }
}
