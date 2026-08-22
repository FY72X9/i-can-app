// ==============================================================================
// I-CAN PLATFORM — ACTION INGESTION & PERSISTENCE SERVICE
// Supports direct Supabase database & storage with offline local fallback
// ==============================================================================

import { supabase, isConfigured } from '@/services/supabase';
import { GreenAction, VerificationDecision } from '@/types';

const LOCAL_ACTIONS_KEY = 'i_can_submitted_actions';

const SEEDED_INITIAL_ACTIONS: GreenAction[] = [
  {
    id: 'act-seed-001',
    userId: 'usr-student-001',
    userName: 'Ahmad Fauzi & Tim',
    userFaculty: 'School of Computer Science (SOCS)',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    categoryId: 'tree',
    categoryName: 'Penanaman Bibit Pohon Keras (TFI)',
    categoryIcon: 'TreePine',
    submissionType: 'PENYULUHAN_AKSI_NYATA',
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    campaignUrl: 'https://www.instagram.com/reel/C_samplePohon123',
    groupMembers: ['2602199841', '2602188412'],
    story: 'Penyuluhan pentingnya penghijauan kota di IG Reels dan penanaman 5 bibit pohon tabebuya bersama pengelola taman setempat. #TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService 🌳',
    gpsLat: -6.2017,
    gpsLng: 106.7822,
    status: 'APPROVED',
    decision: 'APPROVED_FULL',
    aiConfidence: 0.94,
    aiGuidelineScore: 0.92,
    aiCompletenessScore: 0.90,
    aiAnalysisReason: 'Terdeteksi 5 bibit pohon ditanam di tanah, caption IG memuat hashtag resmi TFI & almamater tervalidasi.',
    greenCoinsEarned: 25,
    carbonImpactKg: 5.0,
    satPointsEarned: 4,
    comservHoursEarned: 2.0,
    guidelineComplied: true,
    realActivityVerified: true,
    submittedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    verifiedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    verifiedBy: 'Siska Amanda (SSO)',
  },
  {
    id: 'act-seed-002',
    userId: 'usr-student-003',
    userName: 'Clarissa Putri',
    userFaculty: 'School of Design (SOD)',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    categoryId: 'vbl',
    categoryName: 'Video Based Learning (VBL)',
    categoryIcon: 'Video',
    submissionType: 'VIDEO_BASED_LEARNING',
    photoUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&auto=format&fit=crop&q=80',
    campaignUrl: 'https://youtube.com/watch?v=sampleVBL_ZeroWaste',
    videoUrl: 'https://youtube.com/watch?v=sampleVBL_ZeroWaste',
    story: 'Membuat video edukasi 8 menit berjaket almamater BINUS "Prinsip Zero Waste Mahasiswa". Sitasi format APA style terlampir lengkap di akhir video!',
    gpsLat: -6.2001,
    gpsLng: 106.7845,
    status: 'APPROVED',
    decision: 'APPROVED_FULL',
    aiConfidence: 0.92,
    aiGuidelineScore: 0.95,
    aiCompletenessScore: 0.90,
    aiAnalysisReason: 'Logo TFI di awal video terdeteksi, jaket almamater dikenakan, sitasi format APA Style ada di penutup.',
    greenCoinsEarned: 25,
    carbonImpactKg: 0.1,
    satPointsEarned: 3,
    comservHoursEarned: 1.5,
    guidelineComplied: true,
    realActivityVerified: true,
    submittedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    verifiedBy: 'Siska Amanda (SSO)',
  },
  {
    id: 'act-seed-003',
    userId: 'usr-student-001',
    userName: 'Budi Santoso',
    userFaculty: 'School of Computer Science',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    categoryId: 'tumbler',
    categoryName: 'Pakai Tumbler & Zero Waste',
    categoryIcon: 'CupSoda',
    submissionType: 'SELF_GREEN_CAMPAIGN',
    photoUrl: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&auto=format&fit=crop&q=80',
    story: 'Hari ke-5 bawa tumbler dan kotak makan guna ulang ke kantin lantai 2 BINUS Anggrek.',
    gpsLat: -6.2017,
    gpsLng: 106.7822,
    status: 'APPROVED',
    decision: 'APPROVED_COINS_ONLY',
    aiConfidence: 0.96,
    aiGuidelineScore: 0.88,
    aiCompletenessScore: 0.92,
    aiAnalysisReason: 'Objek tumbler dan lokasi kampus terverifikasi akurat.',
    greenCoinsEarned: 10,
    carbonImpactKg: 0.05,
    satPointsEarned: 0,
    comservHoursEarned: 0.0,
    guidelineComplied: true,
    realActivityVerified: false,
    submittedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    verifiedAt: new Date(Date.now() - 10 * 3600000).toISOString(),
  },
  {
    id: 'act-seed-004',
    userId: 'usr-student-003',
    userName: 'Nadia Safira & Tim',
    userFaculty: 'School of Design (SOD)',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    categoryId: 'biopori',
    categoryName: 'Pembuatan Lubang Biopori (TFI)',
    categoryIcon: 'Droplets',
    submissionType: 'PENYULUHAN_AKSI_NYATA',
    photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
    campaignUrl: 'https://www.tiktok.com/@nadia.eco/video/sampleBioporiBINUS',
    groupMembers: ['2602234567', '2602998811'],
    story: 'Edukasi resapan air hujan di TikTok dan membuat 5 lubang biopori di area resapan air RT sekitar kampus.',
    gpsLat: -6.2025,
    gpsLng: 106.7811,
    status: 'PENDING',
    aiConfidence: 0.93,
    aiGuidelineScore: 0.91,
    aiCompletenessScore: 0.89,
    aiAnalysisReason: 'Terdeteksi pembuatan lubang biopori fisik dengan pipa PVC & bor biopori sesuai standar TFI.',
    greenCoinsEarned: 20,
    carbonImpactKg: 0.5,
    satPointsEarned: 4,
    comservHoursEarned: 2.0,
    submittedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'act-seed-005',
    userId: 'usr-student-004',
    userName: 'Farhan Ramadhan',
    userFaculty: 'Faculty of Engineering',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    categoryId: 'vbl',
    categoryName: 'Video Based Learning (VBL)',
    categoryIcon: 'Video',
    submissionType: 'VIDEO_BASED_LEARNING',
    photoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    campaignUrl: 'https://youtube.com/watch?v=sampleVBL_Ewaste',
    story: 'Video edukasi 6 menit "Cara Memilah & Mengelola Sampah Elektronik Rumah Tangga" dengan referensi APA Style.',
    gpsLat: -6.2012,
    gpsLng: 106.783,
    status: 'PENDING',
    aiConfidence: 0.90,
    aiGuidelineScore: 0.94,
    aiCompletenessScore: 0.88,
    aiAnalysisReason: 'Pengecekan visual mendeteksi jaket almamater dan durasi video memenuhi standar (6 min).',
    greenCoinsEarned: 25,
    carbonImpactKg: 0.1,
    satPointsEarned: 3,
    comservHoursEarned: 1.5,
    submittedAt: new Date(Date.now() - 50 * 60000).toISOString(),
  },
  {
    id: 'act-seed-006',
    userId: 'usr-student-002',
    userName: 'Kevin Pratama',
    userFaculty: 'School of Information Systems',
    categoryId: 'tumbler',
    categoryName: 'Pemilahan Daur Ulang Drop Point',
    categoryIcon: 'Trash2',
    submissionType: 'SELF_GREEN_CAMPAIGN',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    story: 'Memilah 3 jenis botol plastik di Drop Point Recycling BINUS Syahdan.',
    gpsLat: -6.2005,
    gpsLng: 106.784,
    status: 'PENDING',
    aiConfidence: 0.95,
    aiGuidelineScore: 0.85,
    aiCompletenessScore: 0.90,
    aiAnalysisReason: 'Objek pemilahan sampah terdeteksi akurat di lokasi kampus.',
    greenCoinsEarned: 10,
    carbonImpactKg: 0.08,
    satPointsEarned: 0,
    comservHoursEarned: 0.0,
    submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'act-seed-007',
    userId: 'usr-student-002',
    userName: 'Rian Wijaya',
    userFaculty: 'BINUS Business School',
    categoryId: 'tumbler',
    categoryName: 'Kampanye Hemat Energi',
    categoryIcon: 'Zap',
    submissionType: 'SELF_GREEN_CAMPAIGN',
    photoUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80',
    story: 'Mematikan lampu ruangan kelas setelah selesai kuliah.',
    gpsLat: -6.2017,
    gpsLng: 106.7822,
    status: 'REJECTED',
    decision: 'REJECTED',
    rejectionReason: 'Foto bukti terlalu gelap dan tidak memuat atribut identitas mahasiswa/kampus.',
    greenCoinsEarned: 0,
    carbonImpactKg: 0,
    satPointsEarned: 0,
    comservHoursEarned: 0,
    submittedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    verifiedAt: new Date(Date.now() - 22 * 3600000).toISOString(),
    verifiedBy: 'Siska Amanda (SSO)',
  },
];

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

  // Local fallback with diverse seed items
  const raw = localStorage.getItem(LOCAL_ACTIONS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
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
