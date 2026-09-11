import { create } from 'zustand';
import { NotificationItem, NotificationType, UserProfile } from '@/types';
import { getActions } from '@/services/actionService';

const NOTIFICATIONS_PREFIX = 'i_can_user_notifications_v3_';

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  currentUserId: string | null;
  loadUserNotifications: (user: UserProfile | null) => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (item: {
    title: string;
    desc: string;
    type?: NotificationType;
    actionUrl?: string;
    userId?: string;
  }) => void;
  simulateIncomingNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => {
  const getStorageKey = (userId?: string | null) => {
    return `${NOTIFICATIONS_PREFIX}${userId || 'guest'}`;
  };

  const saveAndSet = (list: NotificationItem[], userId?: string | null) => {
    const key = getStorageKey(userId || get().currentUserId);
    localStorage.setItem(key, JSON.stringify(list));
    set({
      notifications: list,
      unreadCount: list.filter((n) => !n.read).length,
    });
  };

  return {
    notifications: [],
    unreadCount: 0,
    currentUserId: null,

    loadUserNotifications: async (user: UserProfile | null) => {
      if (!user) {
        set({ notifications: [], unreadCount: 0, currentUserId: null });
        return;
      }

      const key = getStorageKey(user.id);
      const raw = localStorage.getItem(key);

      if (raw) {
        try {
          const parsed: NotificationItem[] = JSON.parse(raw);
          set({
            notifications: parsed,
            unreadCount: parsed.filter((n) => !n.read).length,
            currentUserId: user.id,
          });
          return;
        } catch {
          // fallback to generate from actual activities
        }
      }

      // Generate real notifications from user's actual actions in actionService
      const allActions = await getActions();
      const generatedNotifs: NotificationItem[] = [];

      if (user.role === 'ORGANIZER') {
        const pendingCount = allActions.filter((a) => a.status === 'PENDING').length;
        if (pendingCount > 0) {
          generatedNotifs.push({
            id: `notif-verif-${Date.now()}-1`,
            title: 'Antrean Aksi TFI Baru Menunggu Review 📋',
            desc: `Terdapat ${pendingCount} pengajuan aksi mahasiswa yang membutuhkan validasi dual-track (SAT & Green Coins).`,
            time: '10m yang lalu',
            timestamp: Date.now() - 10 * 60000,
            type: 'tfi',
            read: false,
            actionUrl: '/verify',
          });
        }
        generatedNotifs.push({
          id: `notif-verif-${Date.now()}-2`,
          title: 'Audit Transkrip SAT Semester Aktif 🎓',
          desc: '14 pengajuan aksi lapangan telah berhasil diverifikasi dan masuk ke log portofolio myBINUS.',
          time: '3 jam yang lalu',
          timestamp: Date.now() - 3 * 3600000,
          type: 'sat',
          read: true,
          actionUrl: '/verify',
        });
      } else {
        // Find actions belonging to this student
        const userActions = allActions.filter(
          (a) => a.userId === user.id || (user.fullName && a.userName && a.userName.includes(user.fullName.split(' ')[0]))
        );

        userActions.slice(0, 6).forEach((act, idx) => {
          const timeOffset = (idx + 1) * 3600 * 1000 * (idx === 0 ? 0.5 : idx * 4);
          const timeAgoStr = idx === 0 ? '45m yang lalu' : idx === 1 ? '3 jam yang lalu' : `${idx + 1} hari lalu`;

          if (act.status === 'APPROVED' && act.decision === 'APPROVED_FULL') {
            generatedNotifs.push({
              id: `notif-${act.id}`,
              title: 'Aksi Nyata Disetujui Penuh! 🌳',
              desc: `+${act.satPointsEarned} SAT Points & +${act.greenCoinsEarned} GC masuk ke transkrip kamu dari kegiatan "${act.categoryName}".`,
              time: timeAgoStr,
              timestamp: Date.now() - timeOffset,
              type: 'sat',
              read: idx > 1,
              actionUrl: '/wallet',
            });
          } else if (act.status === 'APPROVED' && act.decision === 'APPROVED_COINS_ONLY') {
            generatedNotifs.push({
              id: `notif-${act.id}`,
              title: 'Aksi Disetujui untuk Green Coins! ⚡',
              desc: `+${act.greenCoinsEarned} GC dikreditkan untuk reputasi BEKEN dari postingan "${act.categoryName}".`,
              time: timeAgoStr,
              timestamp: Date.now() - timeOffset,
              type: 'quest',
              read: idx > 0,
              actionUrl: '/home',
            });
          } else if (act.status === 'PENDING') {
            generatedNotifs.push({
              id: `notif-${act.id}`,
              title: 'Laporan Aksi Sedang Ditinjau ⏳',
              desc: `Pengajuan "${act.categoryName}" telah masuk ke antrean verifikator SSO/TFI.`,
              time: timeAgoStr,
              timestamp: Date.now() - timeOffset,
              type: 'tfi',
              read: false,
              actionUrl: '/wallet',
            });
          } else if (act.status === 'REJECTED') {
            generatedNotifs.push({
              id: `notif-${act.id}`,
              title: 'Laporan Perlu Perbaikan ⚠️',
              desc: `Catatan verifikator untuk "${act.categoryName}": ${act.rejectionReason || 'Mohon lengkapi atribut almamater.'}`,
              time: timeAgoStr,
              timestamp: Date.now() - timeOffset,
              type: 'rejection',
              read: false,
              actionUrl: '/upload',
            });
          }
        });

        // Add streak / achievement notification if active
        if (user.streakDays && user.streakDays >= 3) {
          generatedNotifs.unshift({
            id: `notif-streak-${user.id}`,
            title: `Streak ${user.streakDays} Hari On Fire! 🔥`,
            desc: `Kerja luar biasa! Kamu aktif melakukan aksi hijau dan masuk nominasi BEKEN Award.`,
            time: '15m yang lalu',
            timestamp: Date.now() - 15 * 60000,
            type: 'streak',
            read: false,
            actionUrl: '/leaderboard',
          });
        }
      }

      saveAndSet(generatedNotifs, user.id);
      set({ currentUserId: user.id });
    },

    markAsRead: (id: string) => {
      const updated = get().notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      saveAndSet(updated);
    },

    markAllAsRead: () => {
      const updated = get().notifications.map((n) => ({ ...n, read: true }));
      saveAndSet(updated);
    },

    deleteNotification: (id: string) => {
      const updated = get().notifications.filter((n) => n.id !== id);
      saveAndSet(updated);
    },

    clearAll: () => {
      saveAndSet([]);
    },

    addNotification: ({ title, desc, type = 'system', actionUrl, userId }) => {
      const newItem: NotificationItem = {
        id: `notif-${Date.now()}`,
        title,
        desc,
        time: 'Baru saja',
        timestamp: Date.now(),
        type,
        read: false,
        actionUrl,
      };
      saveAndSet([newItem, ...get().notifications], userId || get().currentUserId);
    },

    simulateIncomingNotification: () => {
      const samples: Array<{ title: string; desc: string; type: NotificationType; actionUrl?: string }> = [
        {
          title: 'Aksi Biopori Terverifikasi! 💧',
          desc: 'Admin SSO menyetujui laporan biopori kelompokmu. +4 SAT Point & +20 GC berhasil dikreditkan!',
          type: 'sat',
          actionUrl: '/wallet',
        },
        {
          title: 'Leaderboard Update: SOCS Naik ke Rank #1! 🏆',
          desc: 'Fakultas School of Computer Science menduduki posisi puncak dengan 1,450 GC.',
          type: 'system',
          actionUrl: '/home',
        },
        {
          title: 'Daily Quest Baru Tersedia ⚡',
          desc: 'Misi Hari Ini: Bawa kotak makan guna ulang ke Food Court BINUS Kijang (+15 GC).',
          type: 'quest',
          actionUrl: '/upload',
        },
        {
          title: 'Verifikasi Video VBL Disetujui 🎬',
          desc: 'Video edukasi Zero Waste Anda telah dipublikasikan ke Storytelling Gallery!',
          type: 'tfi',
          actionUrl: '/feed',
        },
      ];

      const randomSample = samples[Math.floor(Math.random() * samples.length)];
      get().addNotification(randomSample);
    },
  };
});
