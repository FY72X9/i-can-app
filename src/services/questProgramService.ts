// ==============================================================================
// I-CAN PLATFORM — DAILY QUESTS & PROGRAM AKSI NYATA SERVICE
// Manages Super Admin configuration with Supabase-first, localStorage fallback
// ==============================================================================

import { supabase, isConfigured } from '@/services/supabase';
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
    actionUrl: '/upload?source=quest&questId=quest-tumbler',
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
    actionUrl: '/upload?source=quest&questId=quest-stair',
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
// DB MAPPING HELPERS — DailyQuest
// ============================================================

function mapDbRowToQuest(row: any): DailyQuest {
  return {
    id: row.id,
    title: row.title,
    desc: row.desc,
    reward: row.reward || '',
    coinsReward: row.coins_reward ?? 0,
    satReward: row.sat_reward ?? 0,
    deadline: row.deadline || 'Sisa Hari Ini',
    completed: row.completed ?? false,
    actionUrl: row.action_url,
    hashtags: row.hashtags || [],
    isActive: row.is_active ?? true,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at,
  };
}

function mapQuestToDbRow(quest: DailyQuest): any {
  return {
    id: quest.id,
    title: quest.title,
    desc: quest.desc,
    reward: quest.reward,
    coins_reward: quest.coinsReward,
    sat_reward: quest.satReward || 0,
    deadline: quest.deadline,
    completed: quest.completed || false,
    action_url: quest.actionUrl,
    hashtags: quest.hashtags || [],
    is_active: quest.isActive,
    created_at: quest.createdAt,
    updated_at: quest.updatedAt,
  };
}

// ============================================================
// DB MAPPING HELPERS — ActionProgram
// ============================================================

function mapDbRowToProgram(row: any): ActionProgram {
  return {
    id: row.id,
    title: row.title,
    category: row.category || '',
    categoryType: row.category_type || 'SELF_GREEN_CAMPAIGN',
    satPoints: row.sat_points ?? 0,
    comservHours: Number(row.comserv_hours ?? 0),
    coins: row.coins ?? 0,
    co2: row.co2 || '0.0 kg',
    icon: row.icon || 'Leaf',
    color: row.color || 'from-emerald-600 to-eco-800',
    tag: row.tag || '',
    urgency: row.urgency || '',
    description: row.description || '',
    samplePhotos: row.sample_photos || [],
    suggestedPrompt: row.suggested_prompt,
    hashtags: row.hashtags || [],
    isActive: row.is_active ?? true,
    order: row.order ?? 0,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at,
  };
}

function mapProgramToDbRow(prog: ActionProgram): any {
  return {
    id: prog.id,
    title: prog.title,
    category: prog.category,
    category_type: prog.categoryType,
    sat_points: prog.satPoints,
    comserv_hours: prog.comservHours,
    coins: prog.coins,
    co2: prog.co2,
    icon: prog.icon,
    color: prog.color,
    tag: prog.tag,
    urgency: prog.urgency,
    description: prog.description,
    sample_photos: prog.samplePhotos || [],
    suggested_prompt: prog.suggestedPrompt,
    hashtags: prog.hashtags || [],
    is_active: prog.isActive,
    order: prog.order ?? 0,
    created_at: prog.createdAt,
    updated_at: prog.updatedAt,
  };
}

// ============================================================
// DAILY QUESTS CRUD — Supabase-first, localStorage fallback
// ============================================================

export const getDailyQuests = async (): Promise<DailyQuest[]> => {
  // Try Supabase first
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('daily_quests')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        if (data.length === 0) {
          // Table genuinely empty (first run) — seed centrally so every user sees the same defaults
          try {
            await supabase.from('daily_quests').upsert(DEFAULT_DAILY_QUESTS.map(mapQuestToDbRow), { onConflict: 'id' });
          } catch { /* ignore */ }
          localStorage.setItem(LOCAL_QUESTS_KEY, JSON.stringify(DEFAULT_DAILY_QUESTS));
          return DEFAULT_DAILY_QUESTS;
        }
        const quests = data.map(mapDbRowToQuest);
        // Mirror to localStorage
        localStorage.setItem(LOCAL_QUESTS_KEY, JSON.stringify(quests));
        return quests;
      }
    } catch (err) {
      console.warn('[questService] Supabase read failed, falling back to localStorage:', err);
    }
  }

  // Fallback: localStorage
  try {
    const raw = localStorage.getItem(LOCAL_QUESTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_QUESTS_KEY, JSON.stringify(DEFAULT_DAILY_QUESTS));
      // Seed to Supabase
      if (isConfigured) {
        try {
          await supabase.from('daily_quests').upsert(DEFAULT_DAILY_QUESTS.map(mapQuestToDbRow), { onConflict: 'id' });
        } catch { /* ignore */ }
      }
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

  // Sync to Supabase
  if (isConfigured) {
    try {
      const { error } = await supabase.from('daily_quests').insert(mapQuestToDbRow(newQuest));
      if (error) console.warn('[questService] Supabase insert quest error:', error.message);
    } catch (err) {
      console.warn('[questService] Supabase insert quest failed:', err);
    }
  }

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

  // Sync to Supabase
  if (isConfigured) {
    try {
      const { error } = await supabase
        .from('daily_quests')
        .update(mapQuestToDbRow(updatedQuest))
        .eq('id', id);
      if (error) console.warn('[questService] Supabase update quest error:', error.message);
    } catch (err) {
      console.warn('[questService] Supabase update quest failed:', err);
    }
  }

  return updatedQuest;
};

export const deleteDailyQuest = async (id: string): Promise<boolean> => {
  const quests = await getDailyQuests();
  const filtered = quests.filter((q) => q.id !== id);
  if (filtered.length === quests.length) return false;
  localStorage.setItem(LOCAL_QUESTS_KEY, JSON.stringify(filtered));

  // Delete from Supabase
  if (isConfigured) {
    try {
      const { error } = await supabase.from('daily_quests').delete().eq('id', id);
      if (error) console.warn('[questService] Supabase delete quest error:', error.message);
    } catch (err) {
      console.warn('[questService] Supabase delete quest failed:', err);
    }
  }

  return true;
};

export const toggleDailyQuestStatus = async (id: string): Promise<DailyQuest | null> => {
  const quests = await getDailyQuests();
  const quest = quests.find((q) => q.id === id);
  if (!quest) return null;
  return updateDailyQuest(id, { isActive: !quest.isActive });
};

export const getDailyQuestById = async (id: string): Promise<DailyQuest | null> => {
  const quests = await getDailyQuests();
  return quests.find((q) => q.id === id) || null;
};

export const completeDailyQuest = async (id: string): Promise<DailyQuest | null> => {
  return updateDailyQuest(id, { completed: true });
};

export const resetDailyQuestsToDefault = async (): Promise<DailyQuest[]> => {
  localStorage.setItem(LOCAL_QUESTS_KEY, JSON.stringify(DEFAULT_DAILY_QUESTS));

  // Reset in Supabase too
  if (isConfigured) {
    try {
      await supabase.from('daily_quests').delete().neq('id', '');
      await supabase.from('daily_quests').insert(DEFAULT_DAILY_QUESTS.map(mapQuestToDbRow));
    } catch (err) {
      console.warn('[questService] Supabase reset quests failed:', err);
    }
  }

  return DEFAULT_DAILY_QUESTS;
};

// ============================================================
// PROGRAM AKSI NYATA CRUD — Supabase-first, localStorage fallback
// ============================================================

export const getActionPrograms = async (): Promise<ActionProgram[]> => {
  // Try Supabase first
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('action_programs')
        .select('*')
        .order('order', { ascending: true });
      if (!error && data) {
        if (data.length === 0) {
          // Table genuinely empty (first run) — seed centrally so every user sees the same defaults
          try {
            await supabase.from('action_programs').upsert(DEFAULT_ACTION_PROGRAMS.map(mapProgramToDbRow), { onConflict: 'id' });
          } catch { /* ignore */ }
          localStorage.setItem(LOCAL_PROGRAMS_KEY, JSON.stringify(DEFAULT_ACTION_PROGRAMS));
          return DEFAULT_ACTION_PROGRAMS;
        }
        const programs = data.map(mapDbRowToProgram);
        // Mirror to localStorage
        localStorage.setItem(LOCAL_PROGRAMS_KEY, JSON.stringify(programs));
        return programs;
      }
    } catch (err) {
      console.warn('[programService] Supabase read failed, falling back to localStorage:', err);
    }
  }

  // Fallback: localStorage
  try {
    const raw = localStorage.getItem(LOCAL_PROGRAMS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PROGRAMS_KEY, JSON.stringify(DEFAULT_ACTION_PROGRAMS));
      // Seed to Supabase
      if (isConfigured) {
        try {
          await supabase.from('action_programs').upsert(DEFAULT_ACTION_PROGRAMS.map(mapProgramToDbRow), { onConflict: 'id' });
        } catch { /* ignore */ }
      }
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

  // Sync to Supabase
  if (isConfigured) {
    try {
      const { error } = await supabase.from('action_programs').insert(mapProgramToDbRow(newProgram));
      if (error) console.warn('[programService] Supabase insert program error:', error.message);
    } catch (err) {
      console.warn('[programService] Supabase insert program failed:', err);
    }
  }

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

  // Sync to Supabase
  if (isConfigured) {
    try {
      const { error } = await supabase
        .from('action_programs')
        .update(mapProgramToDbRow(updatedProgram))
        .eq('id', id);
      if (error) console.warn('[programService] Supabase update program error:', error.message);
    } catch (err) {
      console.warn('[programService] Supabase update program failed:', err);
    }
  }

  return updatedProgram;
};

export const deleteActionProgram = async (id: string): Promise<boolean> => {
  const programs = await getActionPrograms();
  const filtered = programs.filter((p) => p.id !== id);
  if (filtered.length === programs.length) return false;
  localStorage.setItem(LOCAL_PROGRAMS_KEY, JSON.stringify(filtered));

  // Delete from Supabase
  if (isConfigured) {
    try {
      const { error } = await supabase.from('action_programs').delete().eq('id', id);
      if (error) console.warn('[programService] Supabase delete program error:', error.message);
    } catch (err) {
      console.warn('[programService] Supabase delete program failed:', err);
    }
  }

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

  // Reset in Supabase too
  if (isConfigured) {
    try {
      await supabase.from('action_programs').delete().neq('id', '');
      await supabase.from('action_programs').insert(DEFAULT_ACTION_PROGRAMS.map(mapProgramToDbRow));
    } catch (err) {
      console.warn('[programService] Supabase reset programs failed:', err);
    }
  }

  return DEFAULT_ACTION_PROGRAMS;
};
