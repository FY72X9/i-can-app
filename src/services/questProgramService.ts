// ==============================================================================
// I-CAN PLATFORM — DAILY QUESTS & PROGRAM AKSI NYATA SERVICE
// Manages Super Admin configuration with persistent local storage and fresh seed data
// ==============================================================================

import { DailyQuest, ActionProgram } from '@/types';

const LOCAL_QUESTS_KEY = 'i_can_daily_quests_v2';
const LOCAL_PROGRAMS_KEY = 'i_can_action_programs_v2';

// ============================================================
// FRESH STARTER DATA
// ============================================================

export const DEFAULT_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'quest-tumbler',
    title: 'Campus Tumbler Boost 🥤',
    desc: 'Isi ulang air minum di Water Station Gedung Anggrek lantai 2.',
    reward: '+15 Green Coins',
    coinsReward: 15,
    satReward: 0,
    deadline: 'Sisa Hari Ini',
    completed: false,
    actionUrl: '/upload',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'quest-stair',
    title: 'Green Commute & Stairs 🚶',
    desc: 'Gunakan tangga daripada lift untuk mobilitas hemat energi antar lantai 1-3 kampus.',
    reward: '+10 Green Coins',
    coinsReward: 10,
    satReward: 0,
    deadline: 'Sisa 5 Jam',
    completed: false,
    actionUrl: '/upload',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_ACTION_PROGRAMS: ActionProgram[] = [
  {
    id: 'tree',
    title: 'Penanaman Pohon Pelindung',
    category: 'Penyuluhan & Aksi Nyata',
    categoryType: 'PENYULUHAN_AKSI_NYATA',
    satPoints: 4,
    comservHours: 2.0,
    coins: 25,
    co2: '5.0 kg',
    icon: 'TreePine',
    color: 'from-emerald-600 to-eco-800',
    tag: 'SDG 15 & 13',
    urgency: 'Hot Program 🔥',
    description: 'Minimal 5 bibit pohon produktif berbatang keras di area publik atau pemukiman binaan.',
    suggestedPrompt: 'Penanaman 5 bibit pohon keras tabebuya bersama warga dan pengelola lingkungan untuk mendukung penghijauan dan konservasi tanah.',
    samplePhotos: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=600&auto=format&fit=crop&q=80',
    ],
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'biopori',
    title: 'Pembuatan Lubang Biopori',
    category: 'Penyuluhan & Aksi Nyata',
    categoryType: 'PENYULUHAN_AKSI_NYATA',
    satPoints: 4,
    comservHours: 2.0,
    coins: 20,
    co2: '0.5 kg',
    icon: 'Droplets',
    color: 'from-cyan-600 to-blue-800',
    tag: 'SDG 6 & 15',
    urgency: 'Musim Hujan 💧',
    description: 'Minimal 5 lubang resapan biopori dengan warga sekitar untuk konservasi air tanah.',
    suggestedPrompt: 'Pembuatan 5 lubang biopori resapan air di lingkungan RT sekitar kampus untuk pencegahan genangan dan kompos organik.',
    samplePhotos: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
    ],
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'waste-bank',
    title: 'Pilah Sampah & Bank Sampah Komunitas',
    category: 'Bina Lingkungan & Sanitasi',
    categoryType: 'BINA_LINGKUNGAN',
    satPoints: 3,
    comservHours: 1.5,
    coins: 20,
    co2: '1.2 kg',
    icon: 'Trash2',
    color: 'from-amber-600 to-orange-800',
    tag: 'SDG 12 Sirkular',
    urgency: 'Edukasi Warga ♻️',
    description: 'Pendampingan warga dan pemilahan sampah organik & anorganik untuk bank sampah sekitar.',
    suggestedPrompt: 'Edukasi pemilahan sampah rumah tangga bersama warga dan penyerahan material terpilah ke bank sampah komunitas.',
    samplePhotos: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
    ],
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
  },
];

// ============================================================
// DAILY QUESTS CRUD
// ============================================================

export const getDailyQuests = async (): Promise<DailyQuest[]> => {
  try {
    const raw = localStorage.getItem(LOCAL_QUESTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_QUESTS_KEY, JSON.stringify(DEFAULT_DAILY_QUESTS));
      return DEFAULT_DAILY_QUESTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[questService] Failed to read quests from localStorage:', err);
    return DEFAULT_DAILY_QUESTS;
  }
};

export const createDailyQuest = async (
  data: Omit<DailyQuest, 'id' | 'createdAt'>
): Promise<DailyQuest> => {
  const quests = await getDailyQuests();
  const newQuest: DailyQuest = {
    ...data,
    id: `quest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newQuest, ...quests];
  localStorage.setItem(LOCAL_QUESTS_KEY, JSON.stringify(updated));
  return newQuest;
};

export const updateDailyQuest = async (
  id: string,
  data: Partial<DailyQuest>
): Promise<DailyQuest | null> => {
  const quests = await getDailyQuests();
  const index = quests.findIndex((q) => q.id === id);
  if (index === -1) return null;

  const updatedQuest: DailyQuest = {
    ...quests[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  quests[index] = updatedQuest;
  localStorage.setItem(LOCAL_QUESTS_KEY, JSON.stringify(quests));
  return updatedQuest;
};

export const deleteDailyQuest = async (id: string): Promise<boolean> => {
  const quests = await getDailyQuests();
  const filtered = quests.filter((q) => q.id !== id);
  if (filtered.length === quests.length) return false;
  localStorage.setItem(LOCAL_QUESTS_KEY, JSON.stringify(filtered));
  return true;
};

export const toggleDailyQuestStatus = async (id: string): Promise<DailyQuest | null> => {
  const quests = await getDailyQuests();
  const quest = quests.find((q) => q.id === id);
  if (!quest) return null;
  return updateDailyQuest(id, { isActive: !quest.isActive });
};

export const resetDailyQuestsToDefault = async (): Promise<DailyQuest[]> => {
  localStorage.setItem(LOCAL_QUESTS_KEY, JSON.stringify(DEFAULT_DAILY_QUESTS));
  return DEFAULT_DAILY_QUESTS;
};

// ============================================================
// PROGRAM AKSI NYATA CRUD
// ============================================================

export const getActionPrograms = async (): Promise<ActionProgram[]> => {
  try {
    const raw = localStorage.getItem(LOCAL_PROGRAMS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PROGRAMS_KEY, JSON.stringify(DEFAULT_ACTION_PROGRAMS));
      return DEFAULT_ACTION_PROGRAMS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[programService] Failed to read programs from localStorage:', err);
    return DEFAULT_ACTION_PROGRAMS;
  }
};

export const createActionProgram = async (
  data: Omit<ActionProgram, 'id' | 'createdAt'>
): Promise<ActionProgram> => {
  const programs = await getActionPrograms();
  const idSlug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .slice(0, 20);
  const newProgram: ActionProgram = {
    ...data,
    id: `prog-${idSlug}-${Date.now().toString(36).slice(-4)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [...programs, newProgram];
  localStorage.setItem(LOCAL_PROGRAMS_KEY, JSON.stringify(updated));
  return newProgram;
};

export const updateActionProgram = async (
  id: string,
  data: Partial<ActionProgram>
): Promise<ActionProgram | null> => {
  const programs = await getActionPrograms();
  const index = programs.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedProgram: ActionProgram = {
    ...programs[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  programs[index] = updatedProgram;
  localStorage.setItem(LOCAL_PROGRAMS_KEY, JSON.stringify(programs));
  return updatedProgram;
};

export const deleteActionProgram = async (id: string): Promise<boolean> => {
  const programs = await getActionPrograms();
  const filtered = programs.filter((p) => p.id !== id);
  if (filtered.length === programs.length) return false;
  localStorage.setItem(LOCAL_PROGRAMS_KEY, JSON.stringify(filtered));
  return true;
};

export const toggleActionProgramStatus = async (id: string): Promise<ActionProgram | null> => {
  const programs = await getActionPrograms();
  const program = programs.find((p) => p.id === id);
  if (!program) return null;
  return updateActionProgram(id, { isActive: !program.isActive });
};

export const resetActionProgramsToDefault = async (): Promise<ActionProgram[]> => {
  localStorage.setItem(LOCAL_PROGRAMS_KEY, JSON.stringify(DEFAULT_ACTION_PROGRAMS));
  return DEFAULT_ACTION_PROGRAMS;
};

