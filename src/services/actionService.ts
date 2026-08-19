// ==============================================================================
// I-CAN PLATFORM — ACTION INGESTION & PERSISTENCE SERVICE
// Supports direct Supabase database & storage with offline local fallback
// ==============================================================================

import { supabase, isConfigured } from '@/services/supabase';
import { GreenAction } from '@/types';

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
          photoUrl: item.photo_url,
          story: item.story,
          gpsLat: item.gps_lat,
          gpsLng: item.gps_lng,
          status: item.status,
          aiConfidence: item.ai_confidence,
          aiAnalysisReason: item.ai_analysis_reason,
          greenCoinsEarned: item.green_coins_earned,
          carbonImpactKg: item.carbon_impact_kg,
          satPointsEarned: item.sat_points_earned,
          submittedAt: item.submitted_at,
          verifiedAt: item.verified_at,
          verifiedBy: item.verified_by,
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
        photo_url: newAction.photoUrl,
        story: newAction.story,
        gps_lat: newAction.gpsLat,
        gps_lng: newAction.gpsLng,
        status: newAction.status,
        ai_confidence: newAction.aiConfidence,
        ai_analysis_reason: newAction.aiAnalysisReason,
        green_coins_earned: newAction.greenCoinsEarned,
        carbon_impact_kg: newAction.carbonImpactKg,
        sat_points_earned: newAction.satPointsEarned,
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
