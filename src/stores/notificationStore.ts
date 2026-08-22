import { create } from 'zustand';
import { NotificationItem, NotificationType } from '@/types';

const NOTIFICATIONS_STORAGE_KEY = 'i_can_notifications_v2';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Aksi Nyata Terverifikasi! 🌳',
    desc: '+4 SAT Points & +25 GC masuk ke transkrip kamu dari kegiatan Penanaman Pohon Tabebuya.',
    time: '12m yang lalu',
    timestamp: Date.now() - 12 * 60 * 1000,
    type: 'sat',
    read: false,
    actionUrl: '/wallet',
  },
  {
    id: 'notif-2',
    title: 'Streak 5 Hari On Fire! 🔥',
    desc: 'Kerja bagus! Kamu masuk nominasi Top 10% BEKEN Award tingkat BINUS University.',
    time: '2 jam yang lalu',
    timestamp: Date.now() - 2 * 3600 * 1000,
    type: 'streak',
    read: false,
    actionUrl: '/profile',
  },
  {
    id: 'notif-3',
    title: 'Flash Quest Selesai ⚡',
    desc: 'Bonus +15 GC dari misi tumbler kampus Gedung Anggrek telah dikreditkan.',
    time: '5 jam yang lalu',
    timestamp: Date.now() - 5 * 3600 * 1000,
    type: 'quest',
    read: true,
    actionUrl: '/home',
  },
  {
    id: 'notif-4',
    title: 'Review Aksi TFI Baru Menunggu 📋',
    desc: '2 pengajuan Video Based Learning (VBL) baru menunggu validasi tim Verifikator.',
    time: '1 hari yang lalu',
    timestamp: Date.now() - 24 * 3600 * 1000,
    type: 'tfi',
    read: true,
    actionUrl: '/verify',
  },
];

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (item: {
    title: string;
    desc: string;
    type?: NotificationType;
    actionUrl?: string;
  }) => void;
  simulateIncomingNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => {
  // Load from localStorage or fallback to initial
  const loadSaved = (): NotificationItem[] => {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  };

  const initialList = loadSaved();

  const saveAndSet = (list: NotificationItem[]) => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
    set({
      notifications: list,
      unreadCount: list.filter((n) => !n.read).length,
    });
  };

  return {
    notifications: initialList,
    unreadCount: initialList.filter((n) => !n.read).length,

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

    addNotification: ({ title, desc, type = 'system', actionUrl }) => {
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
      saveAndSet([newItem, ...get().notifications]);
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
