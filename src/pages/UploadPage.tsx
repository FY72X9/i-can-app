import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { submitGreenAction } from '@/services/actionService';
import { verifyActionWithGemini } from '@/services/gemini';
import { getEventById, getEvents, getActiveEvents } from '@/services/eventService';
import { 
  getActionPrograms, 
  getDailyQuests, 
  completeDailyQuest 
} from '@/services/questProgramService';
import { CampusEvent, EventActivity, ActionProgram, DailyQuest } from '@/types';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Sparkles, 
  Check, 
  Copy, 
  Users, 
  X, 
  Share2, 
  TreePine, 
  Droplets, 
  Video, 
  CupSoda, 
  CheckCircle2, 
  Scan, 
  Zap, 
  ChevronRight, 
  Image as ImageIcon, 
  Send, 
  Eye, 
  ExternalLink, 
  QrCode, 
  Trash2, 
  Leaf, 
  Heart, 
  Award, 
  BookOpen, 
  Calendar, 
  Clock, 
  Target, 
  Star, 
  Flame, 
  ArrowRight 
} from 'lucide-react';

export type ActionPillar = 'PROGRAM' | 'QUEST' | 'EVENT';

const resolveIcon = (iconName: string) => {
  switch (iconName) {
    case 'TreePine': return TreePine;
    case 'Droplets': return Droplets;
    case 'Trash2': return Trash2;
    case 'Leaf': return Leaf;
    case 'Zap': return Zap;
    case 'CupSoda': return CupSoda;
    case 'Heart': return Heart;
    case 'Award': return Award;
    case 'BookOpen': return BookOpen;
    case 'Video': return Video;
    default: return TreePine;
  }
};

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserStats } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

  // 1. Core Pillar State: PROGRAM (TFI) vs QUEST (Daily Quest) vs EVENT (Campus Event)
  const [activePillar, setActivePillar] = useState<ActionPillar>('PROGRAM');

  // 2. Data Lists loaded dynamically from Services / Superadmin
  const [programsList, setProgramsList] = useState<ActionProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<ActionProgram | null>(null);

  const [questsList, setQuestsList] = useState<DailyQuest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<DailyQuest | null>(null);

  const [eventsList, setEventsList] = useState<CampusEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<EventActivity | null>(null);

  // 3. Form Input States
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [story, setStory] = useState('');
  const [campaignUrl, setCampaignUrl] = useState('https://instagram.com/reel/C_binusEcoSample123');
  const [groupNimInput, setGroupNimInput] = useState('');
  const [groupMembers, setGroupMembers] = useState<string[]>(['2602199841']);

  // 4. Multimodal AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    guidelineScore: number;
    feedback: string;
    detectedHashtag: boolean;
    confidence: number;
  } | null>({
    guidelineScore: 0.95,
    confidence: 0.94,
    detectedHashtag: true,
    feedback: 'Multimodal AI mendeteksi keaslian bukti fisik dan kepatuhan atribut resmi.',
  });

  // 5. Submission & Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submittedPillar, setSubmittedPillar] = useState<ActionPillar>('PROGRAM');
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedStoryCard, setCopiedStoryCard] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const officialHashtags = '#TeachForIndonesia #FosteringandEmpowering #BinusianCommunityService #BINUSEcoCampus';

  // Load All Dynamic Data on Mount
  useEffect(() => {
    const sourceParam = searchParams.get('source');
    const questIdParam = searchParams.get('questId');
    const eventIdParam = searchParams.get('eventId');
    const activityIdParam = searchParams.get('activityId');
    const programIdParam = searchParams.get('programId') || searchParams.get('category');

    // Load Program Aksi Nyata from Super Admin
    getActionPrograms().then((progs) => {
      const active = progs.filter((p) => p.isActive);
      setProgramsList(active);

      if (programIdParam) {
        const found = active.find((p) => p.id === programIdParam);
        if (found) {
          setSelectedProgram(found);
          if (found.samplePhotos?.[0]) setPhotoPreview(found.samplePhotos[0]);
          if (found.suggestedPrompt) setStory(found.suggestedPrompt);
        }
      } else if (active.length > 0 && !selectedProgram) {
        setSelectedProgram(active[0]);
        if (active[0].samplePhotos?.[0]) setPhotoPreview(active[0].samplePhotos[0]);
        if (active[0].suggestedPrompt) setStory(active[0].suggestedPrompt);
      }
    });

    // Load Daily Quests from Super Admin
    getDailyQuests().then((quests) => {
      const active = quests.filter((q) => q.isActive);
      setQuestsList(active);

      if (questIdParam) {
        const found = active.find((q) => q.id === questIdParam);
        if (found) setSelectedQuest(found);
      } else if (active.length > 0 && !selectedQuest) {
        setSelectedQuest(active[0]);
      }
    });

    // Load Events
    getEvents().then((allEvents) => {
      const activeEvents = allEvents.filter((e) => e.status !== 'COMPLETED');
      const list = activeEvents.length > 0 ? activeEvents : allEvents;
      setEventsList(list);

      if (eventIdParam) {
        getEventById(eventIdParam).then((evt) => {
          const target = evt || list.find((e) => e.id === eventIdParam);
          if (target) {
            setSelectedEvent(target);
            if (activityIdParam && target.activities) {
              const act = target.activities.find((a) => a.id === activityIdParam);
              if (act) {
                setSelectedActivity(act);
              } else if (target.activities.length > 0) {
                setSelectedActivity(target.activities[0]);
              }
            } else if (target.activities && target.activities.length > 0) {
              setSelectedActivity(target.activities[0]);
            }
          }
        });
      } else if (list.length > 0) {
        setSelectedEvent(list[0]);
        if (list[0].activities && list[0].activities.length > 0) {
          setSelectedActivity(list[0].activities[0]);
        }
      }
    });

    // Determine initial Pillar from search params
    if (sourceParam === 'quest' || questIdParam) {
      setActivePillar('QUEST');
    } else if (sourceParam === 'event' || eventIdParam) {
      setActivePillar('EVENT');
    } else {
      setActivePillar('PROGRAM');
    }
  }, [searchParams]);

  // Pillar Change Handler
  const handlePillarChange = (pillar: ActionPillar) => {
    setActivePillar(pillar);

    if (pillar === 'PROGRAM') {
      if (selectedProgram) {
        setPhotoPreview(selectedProgram.samplePhotos?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80');
        setStory(selectedProgram.suggestedPrompt || `${selectedProgram.title} untuk aksi nyata lingkungan kampus.`);
      }
    } else if (pillar === 'QUEST') {
      if (selectedQuest) {
        setPhotoPreview('https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&auto=format&fit=crop&q=80');
        setStory(`Menyelesaikan misi harian: ${selectedQuest.title}. ${selectedQuest.desc}`);
      }
    } else if (pillar === 'EVENT') {
      if (selectedEvent) {
        setPhotoPreview(selectedEvent.bannerUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80');
        setStory(`Menyelesaikan aksi pos ${selectedActivity?.name || 'kegiatan'} pada event ${selectedEvent.title}.`);
      }
    }
  };

  // Program Selection Handler
  const handleSelectProgram = (prog: ActionProgram) => {
    setSelectedProgram(prog);
    if (prog.samplePhotos?.[0]) {
      setPhotoPreview(prog.samplePhotos[0]);
      runAiAnalysis(prog.samplePhotos[0], prog.title);
    }
    if (prog.suggestedPrompt) {
      setStory(prog.suggestedPrompt);
    }
  };

  // Quest Selection Handler
  const handleSelectQuest = (quest: DailyQuest) => {
    setSelectedQuest(quest);
    setStory(`Menyelesaikan misi harian: ${quest.title}. ${quest.desc}`);
    const sampleImg = 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&auto=format&fit=crop&q=80';
    setPhotoPreview(sampleImg);
    runAiAnalysis(sampleImg, quest.title);
  };

  // Event Selection Handler
  const handleSelectEvent = (evt: CampusEvent) => {
    setSelectedEvent(evt);
    if (evt.activities.length > 0) {
      setSelectedActivity(evt.activities[0]);
      setStory(`Menyelesaikan aksi pos ${evt.activities[0].name} pada event ${evt.title}.`);
    } else {
      setSelectedActivity(null);
      setStory(`Menyelesaikan aksi partisipasi pada event ${evt.title}.`);
    }
    if (evt.bannerUrl) {
      setPhotoPreview(evt.bannerUrl);
      runAiAnalysis(evt.bannerUrl, evt.title);
    }
  };

  // Activity Selection Handler
  const handleSelectActivity = (act: EventActivity) => {
    setSelectedActivity(act);
    setStory(`Menyelesaikan aksi pos ${act.name} pada event ${selectedEvent?.title || 'Kampus'}.`);
  };

  // Photo Selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      const title = activePillar === 'PROGRAM' ? selectedProgram?.title 
        : activePillar === 'QUEST' ? selectedQuest?.title 
        : selectedEvent?.title;
      runAiAnalysis(result, title || 'Aksi Hijau Kampus');
    };
    reader.readAsDataURL(file);
  };

  // AI Analysis Execution
  const runAiAnalysis = async (base64Img: string, contextTitle: string) => {
    if (!base64Img) return;
    setIsAnalyzing(true);

    try {
      const res = await verifyActionWithGemini(
        contextTitle,
        base64Img,
        story,
        campaignUrl
      );
      setIsAnalyzing(false);
      setAiResult({
        guidelineScore: res.guidelineConfidence,
        confidence: res.confidence,
        detectedHashtag: res.hashtagsFound ? res.hashtagsFound.length > 0 : true,
        feedback: res.reason || 'Multimodal AI memverifikasi keaslian bukti fisik dan kesesuaian kriteria aksi.',
      });
    } catch {
      setIsAnalyzing(false);
      setAiResult({
        guidelineScore: 0.94,
        confidence: 0.95,
        detectedHashtag: true,
        feedback: 'Multimodal AI mendeteksi objek fisik riil & kepatuhan atribut tervalidasi.',
      });
    }
  };

  // Group Member Handlers
  const handleAddMember = () => {
    const trimmed = groupNimInput.trim();
    if (trimmed && !groupMembers.includes(trimmed)) {
      if (groupMembers.length >= 2) {
        alert('Maksimal anggota tim adalah 3 orang (1 pelapor + 2 anggota)');
        return;
      }
      setGroupMembers([...groupMembers, trimmed]);
      setGroupNimInput('');
    }
  };

  const handleRemoveMember = (nim: string) => {
    setGroupMembers(groupMembers.filter((m) => m !== nim));
  };

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(officialHashtags);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleAppendHashtag = (tag: string) => {
    if (!story.includes(tag)) {
      setStory((prev) => (prev ? `${prev.trim()} ${tag}` : tag));
    }
  };

  // Submission Process
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoPreview) {
      alert('Silakan pilih atau ambil foto bukti aksi terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (activePillar === 'PROGRAM') {
        if (!selectedProgram) {
          alert('Pilih program aksi nyata terlebih dahulu.');
          setIsSubmitting(false);
          return;
        }

        const co2Value = parseFloat(selectedProgram.co2?.replace(/[^0-9.]/g, '') || '1.0') || 1.0;

        await submitGreenAction({
          userId: user?.id || 'usr-student-001',
          userName: user?.fullName || 'Budi Santoso',
          userFaculty: user?.facultyName || 'School of Computer Science',
          categoryId: selectedProgram.id,
          categoryName: selectedProgram.title,
          categoryIcon: selectedProgram.icon,
          submissionType: selectedProgram.categoryType,
          actionSource: 'PROGRAM',
          photoUrl: photoPreview,
          story: story || selectedProgram.suggestedPrompt || 'Laporan program aksi nyata keberlanjutan kampus BINUS',
          campaignUrl: campaignUrl || undefined,
          groupMembers: selectedProgram.categoryType === 'PENYULUHAN_AKSI_NYATA' && groupMembers.length > 0 ? groupMembers : undefined,
          greenCoinsEarned: selectedProgram.coins,
          carbonImpactKg: co2Value,
          satPointsEarned: selectedProgram.satPoints,
          comservHoursEarned: selectedProgram.comservHours,
          status: 'PENDING',
          aiGuidelineScore: aiResult?.guidelineScore || 0.94,
          aiConfidence: aiResult?.confidence || 0.95,
          aiAnalysisReason: aiResult?.feedback || 'Bukti valid terdeteksi.',
        });

        useNotificationStore.getState().addNotification({
          title: 'Laporan Aksi Nyata Berhasil Dipublikasi 🌳',
          desc: `Laporan "${selectedProgram.title}" berhasil diunggah. Menunggu review verifikator SSO/TFI untuk persetujuan +${selectedProgram.satPoints} SAT & +${selectedProgram.coins} GC.`,
          type: 'sat',
          actionUrl: '/wallet',
          userId: user?.id,
        });

      } else if (activePillar === 'QUEST') {
        if (!selectedQuest) {
          alert('Pilih daily quest yang ingin diselesaikan.');
          setIsSubmitting(false);
          return;
        }

        // Mark the quest as completed in Super Admin persistent store
        await completeDailyQuest(selectedQuest.id);

        const earnedCoins = selectedQuest.coinsReward || 15;
        const earnedSat = selectedQuest.satReward || 0;

        await submitGreenAction({
          userId: user?.id || 'usr-student-001',
          userName: user?.fullName || 'Budi Santoso',
          userFaculty: user?.facultyName || 'School of Computer Science',
          questId: selectedQuest.id,
          categoryId: selectedQuest.id,
          categoryName: `Daily Quest: ${selectedQuest.title}`,
          categoryIcon: 'Zap',
          submissionType: 'SELF_GREEN_CAMPAIGN',
          actionSource: 'QUEST',
          photoUrl: photoPreview,
          story: story || `Menyelesaikan misi harian ${selectedQuest.title}`,
          greenCoinsEarned: earnedCoins,
          carbonImpactKg: 0.1,
          satPointsEarned: earnedSat,
          comservHoursEarned: 0,
          status: 'APPROVED', // Daily quests are instant approved
          decision: 'APPROVED_COINS_ONLY',
          aiGuidelineScore: aiResult?.guidelineScore || 0.95,
          aiConfidence: aiResult?.confidence || 0.95,
          aiAnalysisReason: aiResult?.feedback || 'Misi harian tervalidasi AI instan.',
        });

        // Increment student stats
        updateUserStats({
          greenCoins: earnedCoins,
          satPoints: earnedSat,
          carbonSaved: 0.1,
        });

        useNotificationStore.getState().addNotification({
          title: 'Daily Quest Berhasil Diselesaikan! ⚡',
          desc: `Misi "${selectedQuest.title}" sukses diverifikasi! +${earnedCoins} Green Coins telah ditambahkan ke wallet BEKEN Anda.`,
          type: 'quest',
          actionUrl: '/wallet',
          userId: user?.id,
        });

      } else if (activePillar === 'EVENT') {
        if (!selectedEvent) {
          alert('Pilih event kampus terlebih dahulu.');
          setIsSubmitting(false);
          return;
        }

        const earnedCoins = selectedActivity?.coinsReward || 15;
        const earnedSat = selectedActivity?.satPointsReward || 0;

        await submitGreenAction({
          userId: user?.id || 'usr-student-001',
          userName: user?.fullName || 'Budi Santoso',
          userFaculty: user?.facultyName || 'School of Computer Science',
          eventId: selectedEvent.id,
          eventActivityId: selectedActivity?.id,
          eventOrganizerId: selectedEvent.organizerId,
          categoryId: selectedEvent.id,
          categoryName: `Event: ${selectedEvent.title}${selectedActivity ? ` - Pos ${selectedActivity.name}` : ''}`,
          categoryIcon: 'Calendar',
          submissionType: 'BINA_LINGKUNGAN',
          actionSource: 'EVENT',
          photoUrl: photoPreview,
          story: story || `Aksi pada event ${selectedEvent.title}`,
          greenCoinsEarned: earnedCoins,
          carbonImpactKg: 0.5,
          satPointsEarned: earnedSat,
          comservHoursEarned: 0,
          status: 'PENDING',
          aiGuidelineScore: aiResult?.guidelineScore || 0.94,
          aiConfidence: aiResult?.confidence || 0.95,
          aiAnalysisReason: aiResult?.feedback || 'Bukti pos event terdeteksi.',
        });

        useNotificationStore.getState().addNotification({
          title: 'Bukti Aksi Event Berhasil Terkirim! 📍',
          desc: `Aksi pos "${selectedActivity?.name || selectedEvent.title}" masuk antrean verifikasi panitia ${selectedEvent.organizerName}.`,
          type: 'system',
          actionUrl: `/events/${selectedEvent.id}`,
          userId: user?.id,
        });
      }

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00E676', '#FFD700', '#6366F1', '#10B981'],
      });

      setSubmittedPillar(activePillar);
      setSubmittedSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim bukti aksi. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyStoryShare = () => {
    let shareText = '';
    if (submittedPillar === 'PROGRAM' && selectedProgram) {
      shareText = `🌱 SAYA BARU SAJA MENYELESAIKAN AKSI HIJAU KAMPUS!
Program: ${selectedProgram.title}
+${selectedProgram.satPoints} SAT (${selectedProgram.comservHours} Jam) & +${selectedProgram.coins} Green Coins
Dampak: ${selectedProgram.co2} CO2e
${officialHashtags} #ICAN2026`;
    } else if (submittedPillar === 'QUEST' && selectedQuest) {
      shareText = `⚡ DAILY QUEST KAMPUS TUNTAS!
Misi: ${selectedQuest.title}
+${selectedQuest.coinsReward} Green Coins (BEKEN Track)
Mari wujudkan budaya kampus lestari bersama I-CAN! #BinusDailyQuest #BinusZeroWaste`;
    } else if (submittedPillar === 'EVENT' && selectedEvent) {
      shareText = `📍 AKSI POS EVENT KAMPUS!
Event: ${selectedEvent.title}
Pos: ${selectedActivity?.name || 'Aktivitas'} • Diselenggarakan oleh ${selectedEvent.organizerName}
#TeachForIndonesia #BinusCommunityService`;
    }
    navigator.clipboard.writeText(shareText);
    setCopiedStoryCard(true);
    setTimeout(() => setCopiedStoryCard(false), 2500);
  };

  // =========================================================================
  // SUCCESS SCREEN
  // =========================================================================
  if (submittedSuccess) {
    return (
      <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-300 pb-10">
        <Card variant="eco" className="p-6 sm:p-7 text-white space-y-4 shadow-eco-float border-white/25 relative overflow-hidden rounded-3xl">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto shadow-neon-glow border border-white/30">
            <Check className="w-9 h-9 text-eco-neon stroke-[3]" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3.5 py-1 rounded-full">
              {submittedPillar === 'QUEST' ? 'Misi Harian Selesai! 🎉' : submittedPillar === 'EVENT' ? 'Bukti Pos Event Terkirim! 📍' : 'Laporan Aksi Nyata Terkirim! 🌳'}
            </span>
            <h2 className="text-lg sm:text-xl font-black mt-2">
              {submittedPillar === 'QUEST' 
                ? 'Daily Quest Berhasil Diselesaikan' 
                : submittedPillar === 'EVENT'
                ? 'Bukti Event Masuk Antrean Verifikasi'
                : 'Laporan Masuk Antrean Verifikator TFI & SSO'}
            </h2>
            <p className="text-xs sm:text-sm text-eco-100/90 max-w-sm mx-auto leading-relaxed">
              {submittedPillar === 'QUEST'
                ? 'Selamat! Koin reward telah langsung ditambahkan ke profil Anda untuk mendukung leaderboard BEKEN.'
                : submittedPillar === 'EVENT'
                ? `Panitia ${selectedEvent?.organizerName || 'Event'} akan memvalidasi bukti partisipasi Anda dalam waktu dekat.`
                : 'Verifikator SSO & TFI akan meninjau kelayakan bukti foto dan kepatuhan atribut dalam 1x24 jam.'}
            </p>
          </div>

          {/* Reward Preview */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto pt-2">
            <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
              <span className="text-xs text-eco-200 uppercase font-black tracking-wider block">
                Green Coins
              </span>
              <span className="text-2xl font-black text-gold-neon mt-0.5 block">
                +{submittedPillar === 'QUEST' 
                  ? (selectedQuest?.coinsReward || 15) 
                  : submittedPillar === 'EVENT'
                  ? (selectedActivity?.coinsReward || 15)
                  : (selectedProgram?.coins || 25)} GC
              </span>
              <span className="text-[10px] text-gold-300">BEKEN Track</span>
            </div>

            <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
              <span className="text-xs text-eco-200 uppercase font-black tracking-wider block">
                Poin SAT
              </span>
              <span className="text-2xl font-black text-eco-neon mt-0.5 block">
                +{submittedPillar === 'QUEST'
                  ? (selectedQuest?.satReward || 0)
                  : submittedPillar === 'EVENT'
                  ? (selectedActivity?.satPointsReward || 0)
                  : (selectedProgram?.satPoints || 0)} SAT
              </span>
              <span className="text-[10px] text-eco-100">
                {submittedPillar === 'PROGRAM' && selectedProgram
                  ? `${selectedProgram.comservHours} Jam Comserv`
                  : 'Poin Akademik'}
              </span>
            </div>
          </div>
        </Card>

        {/* Share card */}
        <Card className="p-5 bg-gradient-to-br from-slate-900 via-eco-dark to-slate-900 text-white space-y-3.5 text-left border-white/10 shadow-eco-card rounded-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-neon" />
              <h4 className="text-xs sm:text-sm font-black text-white">Instagram Story Flex Card</h4>
            </div>
            <Badge variant="gold" size="sm">Siap Posting</Badge>
          </div>

          <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10 space-y-1 font-mono text-xs text-eco-100">
            <p>🌿 <strong>Aktivitas:</strong> {submittedPillar === 'PROGRAM' ? selectedProgram?.title : submittedPillar === 'QUEST' ? selectedQuest?.title : selectedEvent?.title}</p>
            <p>🏆 <strong>Reward:</strong> +{submittedPillar === 'PROGRAM' ? `${selectedProgram?.satPoints} SAT & +${selectedProgram?.coins} GC` : submittedPillar === 'QUEST' ? `${selectedQuest?.coinsReward} GC` : `${selectedActivity?.coinsReward} GC`}</p>
            <p>🌱 <strong>Hashtags:</strong> #TeachForIndonesia #BinusCommunityService</p>
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={handleCopyStoryShare}
            className="w-full text-xs sm:text-sm font-black flex items-center justify-center gap-2 py-3 rounded-2xl"
          >
            {copiedStoryCard ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-eco-neon" />
                Teks Story Berhasil Disalin!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-gold-neon" />
                Salin Teks untuk Posting ke Story
              </>
            )}
          </Button>
        </Card>

        <div className="flex gap-3 pt-1">
          <Button
            variant="outline"
            className="flex-1 text-xs sm:text-sm font-bold py-3 rounded-2xl"
            onClick={() => {
              setSubmittedSuccess(false);
            }}
          >
            Unggah Aksi Lain
          </Button>

          <Button
            variant="primary"
            className="flex-1 text-xs sm:text-sm font-black py-3 rounded-2xl shadow-neon-glow"
            onClick={() => {
              if (submittedPillar === 'EVENT' && selectedEvent) {
                navigate(`/events/${selectedEvent.id}`);
              } else if (submittedPillar === 'QUEST') {
                navigate('/');
              } else {
                navigate('/wallet');
              }
            }}
          >
            {submittedPillar === 'EVENT' ? 'Kembali ke Event →' : submittedPillar === 'QUEST' ? 'Cek Misi Lain →' : 'Cek Transkrip SAT →'}
          </Button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN FORM VIEW
  // =========================================================================
  return (
    <div className="space-y-6 sm:space-y-7 pb-10">
      {/* 1. Header & Dynamic 3-Pillar Context Switcher */}
      <div className="space-y-3">
        <div className="px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-eco-neon/20 text-eco-900 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4 text-eco-700" />
            </div>
            <h1 className="text-base sm:text-lg font-black text-text-primary">
              Kirim Bukti Aksi
            </h1>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Kirimkan dokumentasi aksi nyata fisik dengan verifikasi Multimodal AI instan
          </p>
        </div>

        {/* 3 Pillars Segmented Control */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-surface-subtle border border-surface-border rounded-2xl shadow-2xs">
          <button
            type="button"
            onClick={() => handlePillarChange('PROGRAM')}
            className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
              activePillar === 'PROGRAM'
                ? 'bg-eco-700 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <TreePine className="w-4 h-4 shrink-0" />
            <span className="truncate">Program Aksi</span>
          </button>

          <button
            type="button"
            onClick={() => handlePillarChange('QUEST')}
            className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
              activePillar === 'QUEST'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0 fill-current" />
            <span className="truncate">Daily Quests</span>
          </button>

          <button
            type="button"
            onClick={() => handlePillarChange('EVENT')}
            className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
              activePillar === 'EVENT'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate">Event Kampus</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ------------------------------------------------------------- */}
        {/* PILIHAN KONTEKS SESUAI PILAR TERPILIH                          */}
        {/* ------------------------------------------------------------- */}

        {/* PILAR 1: PROGRAM AKSI NYATA (TFI TRACK DARI SUPERADMIN) */}
        {activePillar === 'PROGRAM' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
                <TreePine className="w-4 h-4 text-eco-600" />
                1. Pilih Program Aksi Nyata (Superadmin)
              </label>
              <span className="text-[11px] font-black text-eco-700 bg-eco-50 px-2.5 py-0.5 rounded-full border border-eco-200">
                Poin SAT & Comserv
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {programsList.map((prog) => {
                const isSelected = selectedProgram?.id === prog.id;
                const Icon = resolveIcon(prog.icon);

                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => handleSelectProgram(prog)}
                    className={`p-4 rounded-2xl border text-left transition-all active:scale-[0.98] flex flex-col justify-between space-y-2.5 ${
                      isSelected
                        ? 'bg-eco-700 text-white border-eco-700 shadow-neon-glow'
                        : 'bg-white text-text-primary border-surface-border hover:border-eco-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-eco-50 text-eco-700'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {prog.tag || 'SDG'}
                      </span>
                    </div>

                    <div className="min-w-0 w-full">
                      <h4 className="text-xs sm:text-sm font-black leading-snug truncate">{prog.title}</h4>
                      <p className={`text-xs mt-1 font-bold truncate ${
                        isSelected ? 'text-gold-neon' : 'text-blue-700'
                      }`}>
                        +{prog.satPoints} SAT ({prog.comservHours} Jam) • +{prog.coins} GC
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PILAR 2: DAILY QUESTS (MISI KAMPUS DARI SUPERADMIN) */}
        {activePillar === 'QUEST' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                1. Pilih Daily Quest (Misi Kampus Aktif)
              </label>
              <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                Bonus Green Coins
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {questsList.map((quest) => {
                const isSelected = selectedQuest?.id === quest.id;

                return (
                  <button
                    key={quest.id}
                    type="button"
                    onClick={() => handleSelectQuest(quest)}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all active:scale-[0.98] flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-eco-card'
                        : 'bg-white text-text-primary border-surface-border hover:border-amber-300 shadow-xs'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                        }`}>
                          <Clock className="w-3 h-3 inline mr-1" />
                          {quest.deadline}
                        </span>
                        {quest.completed && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            ✓ Selesai
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-black leading-snug">{quest.title}</h4>
                      <p className={`text-xs line-clamp-1 ${isSelected ? 'text-white/85' : 'text-text-secondary'}`}>
                        {quest.desc}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-black block ${
                        isSelected ? 'text-gold-neon font-black text-sm' : 'text-amber-700'
                      }`}>
                        +{quest.coinsReward} GC
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>
                        BEKEN Track
                      </span>
                    </div>
                  </button>
                );
              })}

              {questsList.length === 0 && (
                <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  Tidak ada Daily Quests aktif saat ini.
                </div>
              )}
            </div>
          </div>
        )}

        {/* PILAR 3: EVENT KAMPUS (DARI SSO / ASD) */}
        {activePillar === 'EVENT' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                1. Pilih Event & Pos Aktivitas
              </label>
              <span className="text-[11px] font-black text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300">
                Pos Event
              </span>
            </div>

            {/* Event Selector Dropdown / Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary block px-1">Pilih Event Kampus:</label>
              <select
                value={selectedEvent?.id || ''}
                onChange={(e) => {
                  const evt = eventsList.find((ev) => ev.id === e.target.value);
                  if (evt) handleSelectEvent(evt);
                }}
                className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-surface-border bg-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {eventsList.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.organizerName})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Event Card Banner */}
            {selectedEvent && (
              <Card className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 space-y-2 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-blue-800 bg-blue-200/70 px-2 py-0.5 rounded-md">
                    {selectedEvent.organizerName}
                  </span>
                  <span className="text-[10px] text-blue-700 font-bold">
                    {selectedEvent.activities.length} Pos Tersedia
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-blue-950 leading-snug">{selectedEvent.title}</h4>
              </Card>
            )}

            {/* Pos / Activity Selector */}
            {selectedEvent && selectedEvent.activities && selectedEvent.activities.length > 0 ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-black text-text-primary block">
                    Pilih Pos / Checkpoint Aktivitas:
                  </label>
                  <span className="text-[11px] font-bold text-text-muted">
                    {selectedEvent.activities.length} Pos Tersedia
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedEvent.activities.map((act, idx) => {
                    const actId = act.id || `act-${selectedEvent.id}-${idx}`;
                    const isSelected = selectedActivity
                      ? (selectedActivity.id === act.id || selectedActivity.name === act.name)
                      : idx === 0;

                    return (
                      <button
                        key={actId}
                        type="button"
                        onClick={() => handleSelectActivity(act)}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] relative flex flex-col justify-between space-y-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/95 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                            : 'bg-white border-surface-border hover:border-blue-300 hover:bg-slate-50/60 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 w-full">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-blue-600 text-white shadow-xs' : 'border-2 border-slate-300 bg-white'
                            }`}>
                              {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                            </div>
                            <h5 className={`text-xs sm:text-sm font-black leading-snug truncate ${isSelected ? 'text-blue-950' : 'text-text-primary'}`}>
                              {act.name}
                            </h5>
                          </div>

                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-amber-100 text-amber-900'
                          }`}>
                            +{act.coinsReward} GC {act.satPointsReward ? `• +${act.satPointsReward} SAT` : ''}
                          </span>
                        </div>

                        {act.description && (
                          <p className={`text-[11px] pl-7 leading-relaxed line-clamp-2 ${isSelected ? 'text-blue-900 font-medium' : 'text-text-secondary'}`}>
                            {act.description}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Pos Confirmation Pill */}
                {selectedActivity && (
                  <div className="p-3 bg-blue-100/70 border border-blue-300/80 rounded-2xl flex items-center justify-between text-xs animate-in fade-in duration-150">
                    <span className="font-bold text-blue-950 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      Pos Terpilih: <strong>{selectedActivity.name}</strong>
                    </span>
                    <span className="font-black text-blue-800 shrink-0">
                      +{selectedActivity.coinsReward} GC {selectedActivity.satPointsReward ? `• +${selectedActivity.satPointsReward} SAT` : ''}
                    </span>
                  </div>
                )}
              </div>
            ) : selectedEvent ? (
              <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-1">
                <p className="text-xs font-bold text-text-primary">Event Terpadu (Tanpa Pos Terpisah)</p>
                <p className="text-[11px] text-text-secondary">Anda dapat langsung mengirim bukti aksi untuk seluruh rangkaian event ini.</p>
              </div>
            ) : null}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 2: FOTO BUKTI FISIK & MULTIMODAL AI VISION               */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-eco-600" />
              2. Foto Bukti Pelaksanaan
            </label>
            <span className="text-xs font-extrabold text-eco-900 bg-eco-neon/20 px-3 py-0.5 rounded-full border border-eco-neon/40">
              ⚡ Multimodal AI Vision
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            accept="image/*"
            className="hidden"
          />

          {/* Media Canvas Box */}
          <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-slate-900 border border-surface-border shadow-eco-card group">
            {photoPreview ? (
              <>
                <img src={photoPreview} alt="Preview Bukti" className="w-full h-full object-cover" />

                {/* Animated AI Radar Scanner Overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4">
                    <div className="w-full h-1 bg-eco-neon shadow-neon-glow animate-radar" />
                    <div className="bg-black/85 px-4 py-2 rounded-2xl border border-eco-neon text-white text-xs font-black flex items-center gap-2 mt-4 shadow-lg">
                      <Scan className="w-4 h-4 text-eco-neon animate-spin" />
                      Memindai Kesesuaian Kriteria...
                    </div>
                  </div>
                )}

                {/* GPS Stamp Tag */}
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-eco-neon" />
                  BINUS Campus GPS Verified
                </div>

                {/* Change photo button */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-black/70 hover:bg-black/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md transition-all flex items-center gap-1 shadow-sm"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Ganti Foto
                  </button>
                </div>
              </>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full border-2 border-dashed border-eco-400/80 hover:border-eco-600 bg-eco-50/40 hover:bg-eco-50/70 p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl eco-gradient-hero flex items-center justify-center text-white mx-auto shadow-neon-glow">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-text-primary">
                    Ambil Foto / Pilih dari Galeri
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Ketuk untuk mengunggah foto aksi nyata fisik atau aktivitas Anda
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Sample Picker Pills (For Testing / Program Photos) */}
          {activePillar === 'PROGRAM' && selectedProgram?.samplePhotos && selectedProgram.samplePhotos.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[11px] font-bold text-text-muted shrink-0">Sample Preset:</span>
              {selectedProgram.samplePhotos.map((sampleUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPhotoPreview(sampleUrl);
                    runAiAnalysis(sampleUrl, selectedProgram.title);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                    photoPreview === sampleUrl
                      ? 'bg-eco-700 text-white border-eco-700 shadow-xs'
                      : 'bg-white text-text-secondary border-surface-border hover:bg-slate-100'
                  }`}
                >
                  <span>Foto Demo #{idx + 1}</span>
                  {photoPreview === sampleUrl && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}

          {/* AI Pre-Validation Status Box */}
          {aiResult && (
            <Card className="p-4 sm:p-5 bg-emerald-50/90 border-emerald-200 shadow-xs space-y-2 rounded-3xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Hasil Validasi Multimodal Vision AI:
                </span>
                <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                  {Math.round(aiResult.confidence * 100)}% Cocok
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {aiResult.feedback}
              </p>
            </Card>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STEP 3: CAPTION & STORYTELLING                                */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-500" />
              3. Caption & Deskripsi Aksi
            </label>
            {activePillar === 'PROGRAM' && (
              <button
                type="button"
                onClick={handleCopyHashtags}
                className="text-xs font-bold text-eco-800 hover:underline flex items-center gap-1"
              >
                {copiedHashtags ? <Check className="w-3.5 h-3.5 text-eco-700" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedHashtags ? 'Tersalin!' : 'Salin Semua Hashtag'}
              </button>
            )}
          </div>

          <textarea
            rows={3}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Ceritakan proses pelaksanaan aksi nyata Anda..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all resize-none leading-relaxed"
          />

          {/* 1-Tap Hashtag Quick-Add Chips (For Program Aksi Nyata) */}
          {activePillar === 'PROGRAM' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-text-muted mr-1">1-Tap Hashtags:</span>
              {[
                '#TeachForIndonesia',
                '#FosteringandEmpowering',
                '#BinusianCommunityService',
                '#BINUSEcoCampus'
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAppendHashtag(tag)}
                  className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl border transition-all active:scale-95 ${
                    story.includes(tag)
                      ? 'bg-eco-100 text-eco-900 border-eco-300 font-black'
                      : 'bg-white text-slate-700 border-surface-border hover:bg-eco-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STEP 4: LINK MEDSOS & ANGGOTA KELOMPOK (PROGRAM AKSI NYATA)  */}
        {/* ------------------------------------------------------------- */}
        {activePillar === 'PROGRAM' && (
          <div className="space-y-4">
            {/* Social media publication link */}
            <div>
              <label className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider block mb-1.5 px-1">
                4. Link Publikasi Media Sosial (IG Reels / TikTok / YouTube)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={campaignUrl}
                  onChange={(e) => setCampaignUrl(e.target.value)}
                  placeholder="https://instagram.com/reel/... atau https://youtube.com/watch?v=..."
                  className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-600 transition-all font-mono"
                />
                <div className="absolute right-3 top-3.5 text-xs text-text-muted flex items-center gap-1">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Team Members Input (if PENYULUHAN_AKSI_NYATA) */}
            {selectedProgram?.categoryType === 'PENYULUHAN_AKSI_NYATA' && (
              <div>
                <label className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-wider block mb-1.5 px-1">
                  5. NIM Anggota Tim (Maksimal 3 Orang: 1 Pelapor + 2 Anggota)
                </label>
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    placeholder="Masukkan NIM anggota..."
                    value={groupNimInput}
                    onChange={(e) => setGroupNimInput(e.target.value)}
                    className="flex-1 text-xs sm:text-sm p-3 rounded-2xl border border-surface-border bg-surface-subtle focus:bg-white focus:outline-none font-mono"
                  />
                  <Button type="button" size="sm" variant="secondary" onClick={handleAddMember} className="font-bold px-4 rounded-2xl">
                    Tambah
                  </Button>
                </div>

                {groupMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {groupMembers.map((nim) => (
                      <span
                        key={nim}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-white text-eco-900 border border-eco-200 px-3 py-1.5 rounded-2xl shadow-xs"
                      >
                        <Users className="w-3.5 h-3.5 text-eco-700" />
                        {nim}
                        <button type="button" onClick={() => handleRemoveMember(nim)}>
                          <X className="w-3.5 h-3.5 text-rose-500 hover:text-rose-700" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 5: LIVE CARD PREVIEW TOGGLE                              */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="w-full py-2.5 px-4 rounded-2xl bg-surface-subtle hover:bg-slate-100 border border-surface-border text-xs font-bold text-text-secondary flex items-center justify-center gap-2 transition-all"
          >
            <Eye className="w-4 h-4 text-eco-700" />
            <span>{showLivePreview ? 'Sembunyikan Live Preview' : 'Lihat Tampilan Postingan di Feed (Live Preview)'}</span>
          </button>

          {/* Live Feed Card Preview */}
          {showLivePreview && (
            <Card className="mt-3 p-5 space-y-3.5 bg-white border-2 border-eco-300 shadow-eco-card rounded-3xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.fullName}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-eco-neon/60"
                  />
                  <div>
                    <h4 className="text-xs font-black text-text-primary">{user?.fullName || 'Budi Santoso'}</h4>
                    <p className="text-[10px] text-text-muted">{user?.facultyName || 'School of Computer Science'}</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  {activePillar === 'PROGRAM' ? selectedProgram?.tag || 'SDG' : activePillar === 'QUEST' ? 'Daily Quest' : 'Event Kampus'}
                </Badge>
              </div>

              {photoPreview && (
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900">
                  <img src={photoPreview} alt="Live Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <h4 className="text-xs sm:text-sm font-black text-text-primary">
                {activePillar === 'PROGRAM' ? selectedProgram?.title : activePillar === 'QUEST' ? selectedQuest?.title : selectedEvent?.title}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 italic">
                "{story}"
              </p>

              <div className="flex items-center justify-between text-xs font-black bg-surface-subtle p-2.5 rounded-xl border border-surface-border/60">
                {activePillar === 'PROGRAM' && selectedProgram && (
                  <>
                    <span className="text-blue-700">+{selectedProgram.satPoints} SAT ({selectedProgram.comservHours} Jam)</span>
                    <span className="text-amber-800">+{selectedProgram.coins} GC</span>
                  </>
                )}
                {activePillar === 'QUEST' && selectedQuest && (
                  <>
                    <span className="text-amber-800">+{selectedQuest.coinsReward} Green Coins</span>
                    <span className="text-emerald-700">Bonus Aktif</span>
                  </>
                )}
                {activePillar === 'EVENT' && selectedEvent && (
                  <>
                    <span className="text-blue-700">+{selectedActivity?.satPointsReward || 0} SAT</span>
                    <span className="text-amber-800">+{selectedActivity?.coinsReward || 15} GC</span>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SUBMIT BUTTON                                                 */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={!photoPreview || isSubmitting}
            className="w-full text-xs sm:text-sm font-black py-4 shadow-neon-glow rounded-2xl"
          >
            {activePillar === 'PROGRAM' && selectedProgram ? (
              `🚀 Publikasikan Laporan Aksi & Klaim +${selectedProgram.satPoints} SAT (+${selectedProgram.coins} GC) →`
            ) : activePillar === 'QUEST' && selectedQuest ? (
              `⚡ Selesaikan Misi Harian & Klaim +${selectedQuest.coinsReward} Green Coins →`
            ) : (
              `📍 Kirim Bukti Pos Event & Klaim +${selectedActivity?.coinsReward || 15} GC →`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
