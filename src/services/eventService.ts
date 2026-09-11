// ==============================================================================
// I-CAN PLATFORM — CAMPUS EVENT SERVICE
// Supports direct Supabase database & storage with offline local fallback
// ==============================================================================

import { supabase, isConfigured } from '@/services/supabase';
import { CampusEvent, EventActivity, EventStatus, EventTimelineCategory } from '@/types';

const LOCAL_EVENTS_KEY = 'i_can_events';

// ============================================================
// HELPERS
// ============================================================

const generateId = (prefix: string = 'evt') =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const DEFAULT_CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: 'evt-waste-for-change',
    organizerId: 'usr-organizer-002',
    organizerName: 'Student Service Office (SSO)',
    title: 'Waste for Change: Campus Eco Fair 2026',
    description: 'Aksi pilah sampah massal dan penukaran botol plastik dengan merchandise ramah lingkungan di kampus BINUS.',
    bannerUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    timeRange: '08:00 - 15:00 WIB',
    location: 'Plaza Gedung Anggrek, Kampus BINUS',
    dressCode: 'Almamater / Kaos Hitam',
    status: 'ACTIVE',
    allowGroupMembers: true,
    maxGroupMembers: 5,
    activities: [
      {
        id: 'act-wfc-pos1',
        eventId: 'evt-waste-for-change',
        name: 'Pos 1: Drop Point Botol Plastik & PET',
        description: 'Setorkan minimal 3 botol plastik bersih ke tong daur ulang.',
        qrCodeValue: 'ican-evt-wfc-pos1',
        coinsReward: 15,
        satPointsReward: 1,
        order: 0,
      },
      {
        id: 'act-wfc-pos2',
        eventId: 'evt-waste-for-change',
        name: 'Pos 2: Edukasi Pemilahan Sampah Organik',
        description: 'Ikuti sesi edukasi pembuatan pupuk kompos cair selama 15 menit.',
        qrCodeValue: 'ican-evt-wfc-pos2',
        coinsReward: 20,
        satPointsReward: 2,
        order: 1,
      },
      {
        id: 'act-wfc-pos3',
        eventId: 'evt-waste-for-change',
        name: 'Pos 3: Pameran Inovasi Zero Waste BINUS',
        description: 'Kunjungi booth inovasi teknologi hijau karya mahasiswa dan scan QR checkpoint.',
        qrCodeValue: 'ican-evt-wfc-pos3',
        coinsReward: 15,
        satPointsReward: 1,
        order: 2,
      },
    ],
    hashtags: ['#WasteForChange', '#CampusEcoFair', '#ZeroWasteBinus', '#SDG12ResponsibleConsumption'],
    createdAt: new Date().toISOString(),
  },
];

const getLocalEvents = (): CampusEvent[] => {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    if (!raw) {
      saveLocalEvents(DEFAULT_CAMPUS_EVENTS);
      return DEFAULT_CAMPUS_EVENTS;
    }
    const list: any[] = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) {
      saveLocalEvents(DEFAULT_CAMPUS_EVENTS);
      return DEFAULT_CAMPUS_EVENTS;
    }
    return list.map(mapDbEventToModel);
  } catch {
    return DEFAULT_CAMPUS_EVENTS;
  }
};

const saveLocalEvents = (events: CampusEvent[]): void => {
  localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
};

// ============================================================
// READ OPERATIONS
// ============================================================

/**
 * Get all campus events, sorted by createdAt descending (newest first).
 * If a status filter is provided, only events matching that status are returned.
 */
export const getEvents = async (statusFilter?: EventStatus): Promise<CampusEvent[]> => {
  if (isConfigured) {
    try {
      let query = supabase.from('events').select('*').order('created_at', { ascending: false });
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query;
      // Trust Supabase's result even when it's an empty array — that is a valid
      // "no events yet" state and must not be silently replaced by stale/local data.
      if (!error && data) {
        return data.map(mapDbEventToModel);
      }
    } catch (err) {
      console.warn('[eventService] Supabase query failed, falling back to localStorage:', err);
    }
  }

  // Fallback: localStorage
  let events = getLocalEvents();
  if (statusFilter) {
    events = events.filter((e) => e.status === statusFilter);
  }
  return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

/**
 * Get a single event by its ID.
 */
export const getEventById = async (eventId: string): Promise<CampusEvent | null> => {
  if (isConfigured) {
    try {
      const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
      if (!error && data) {
        return mapDbEventToModel(data);
      }
    } catch (err) {
      console.warn('[eventService] Supabase getEventById failed:', err);
    }
  }

  // Fallback: localStorage
  const events = getLocalEvents();
  return events.find((e) => e.id === eventId) || null;
};

/**
 * Get events organized by a specific user (by organizerId).
 */
export const getEventsByOrganizer = async (organizerId: string): Promise<CampusEvent[]> => {
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', organizerId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(mapDbEventToModel);
      }
    } catch (err) {
      console.warn('[eventService] Supabase getEventsByOrganizer failed:', err);
    }
  }

  // Fallback: localStorage
  const events = getLocalEvents();
  return events
    .filter((e) => e.organizerId === organizerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

/**
 * Categorize an event into timeline bucket: 'TODAY' | 'UPCOMING' | 'PAST'.
 */
export const getEventTimelineCategory = (event: CampusEvent): EventTimelineCategory => {
  if (event.status === 'COMPLETED') return 'PAST';

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  // If the event has ended before the start of today
  if (end.getTime() < todayStart.getTime()) {
    return 'PAST';
  }

  // If the event starts strictly after today ends
  if (start.getTime() > todayEnd.getTime()) {
    return 'UPCOMING';
  }

  // Covers today (active today)
  return 'TODAY';
};

export interface CategorizedEvents {
  today: CampusEvent[];
  upcoming: CampusEvent[];
  past: CampusEvent[];
  all: CampusEvent[];
}

/**
 * Get all events categorized into today, upcoming, and past.
 */
export const getCategorizedEvents = async (statusFilter?: EventStatus): Promise<CategorizedEvents> => {
  const all = await getEvents(statusFilter);
  const today: CampusEvent[] = [];
  const upcoming: CampusEvent[] = [];
  const past: CampusEvent[] = [];

  for (const evt of all) {
    const cat = getEventTimelineCategory(evt);
    if (cat === 'TODAY') {
      today.push(evt);
    } else if (cat === 'UPCOMING') {
      upcoming.push(evt);
    } else {
      past.push(evt);
    }
  }

  return { today, upcoming, past, all };
};

/**
 * Get active events (status === 'ACTIVE' and covering today).
 */
export const getActiveEvents = async (): Promise<CampusEvent[]> => {
  const allActive = await getEvents('ACTIVE');
  return allActive.filter((e) => getEventTimelineCategory(e) === 'TODAY');
};

// ============================================================
// WRITE OPERATIONS
// ============================================================

/**
 * Create a new campus event.
 */
export const createEvent = async (
  eventData: Omit<CampusEvent, 'id' | 'createdAt'>
): Promise<CampusEvent> => {
  const newEvent: CampusEvent = {
    ...eventData,
    id: generateId('evt'),
    createdAt: new Date().toISOString(),
    activities: (eventData.activities || []).map((act, idx) => ({
      ...act,
      id: act.id || generateId('act'),
      eventId: '', // Will be patched below
      order: act.order ?? idx,
    })),
  };

  // Patch eventId into activities
  newEvent.activities = newEvent.activities.map((act) => ({ ...act, eventId: newEvent.id }));

  if (isConfigured) {
    try {
      const { error } = await supabase.from('events').insert(mapModelToDb(newEvent));
      if (!error) return newEvent;
    } catch (err) {
      console.warn('[eventService] Supabase createEvent failed, saving locally:', err);
    }
  }

  // Fallback: localStorage
  const events = getLocalEvents();
  events.unshift(newEvent);
  saveLocalEvents(events);
  return newEvent;
};

/**
 * Update an existing event by ID.
 */
export const updateEvent = async (
  eventId: string,
  patch: Partial<Omit<CampusEvent, 'id' | 'createdAt'>>
): Promise<CampusEvent | null> => {
  if (isConfigured) {
    try {
      const { error } = await supabase.from('events').update(mapPatchToDb(patch)).eq('id', eventId);
      if (!error) {
        return getEventById(eventId);
      }
    } catch (err) {
      console.warn('[eventService] Supabase updateEvent failed:', err);
    }
  }

  // Fallback: localStorage
  const events = getLocalEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) return null;

  const updated = { ...events[idx], ...patch };
  // Ensure activities have correct eventId and unique non-empty IDs
  if (updated.activities) {
    updated.activities = updated.activities.map((act, i) => ({
      ...act,
      id: act.id && String(act.id).trim() !== '' ? String(act.id) : `act-${eventId}-${i + 1}`,
      eventId,
      order: act.order ?? i,
    }));
  }
  events[idx] = updated;
  saveLocalEvents(events);
  return updated;
};

/**
 * Delete an event by ID.
 */
export const deleteEvent = async (eventId: string): Promise<boolean> => {
  if (isConfigured) {
    try {
      const { error } = await supabase.from('events').delete().eq('id', eventId);
      if (!error) return true;
    } catch (err) {
      console.warn('[eventService] Supabase deleteEvent failed:', err);
    }
  }

  // Fallback: localStorage
  const events = getLocalEvents();
  const filtered = events.filter((e) => e.id !== eventId);
  if (filtered.length === events.length) return false;
  saveLocalEvents(filtered);
  return true;
};

// ============================================================
// LEADERBOARD HELPERS
// ============================================================

export interface EventLeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  userFaculty?: string;
  totalCoins: number;
  totalActions: number;
  rank: number;
}

/**
 * Compute leaderboard for a specific event from action data.
 * This is called with pre-filtered actions (only actions belonging to the event).
 */
export const computeEventLeaderboard = (
  eventActions: Array<{ userId: string; userName?: string; userAvatar?: string; userFaculty?: string; greenCoinsEarned: number; status: string }>
): EventLeaderboardEntry[] => {
  const userMap = new Map<string, { userName: string; userAvatar?: string; userFaculty?: string; totalCoins: number; totalActions: number }>();

  for (const action of eventActions) {
    if (action.status !== 'APPROVED') continue;
    const existing = userMap.get(action.userId);
    if (existing) {
      existing.totalCoins += action.greenCoinsEarned || 0;
      existing.totalActions += 1;
    } else {
      userMap.set(action.userId, {
        userName: action.userName || 'Unknown',
        userAvatar: action.userAvatar,
        userFaculty: action.userFaculty,
        totalCoins: action.greenCoinsEarned || 0,
        totalActions: 1,
      });
    }
  }

  const sorted = Array.from(userMap.entries())
    .map(([userId, data]) => ({ userId, ...data, rank: 0 }))
    .sort((a, b) => b.totalCoins - a.totalCoins);

  sorted.forEach((entry, idx) => { entry.rank = idx + 1; });
  return sorted;
};

// ============================================================
// DB MAPPING HELPERS (Supabase snake_case <-> TypeScript camelCase)
// ============================================================

const mapDbEventToModel = (row: any): CampusEvent => {
  const eventId = row.id || generateId('evt');
  const rawActivities = row.activities || [];
  const activities: EventActivity[] = Array.isArray(rawActivities)
    ? rawActivities.map((act: any, idx: number) => ({
        id: act.id && String(act.id).trim() !== '' ? String(act.id) : `act-${eventId}-${idx + 1}`,
        eventId: act.eventId || eventId,
        name: act.name || `Pos ${idx + 1}`,
        description: act.description || '',
        coinsReward: Number(act.coinsReward) || 10,
        satPointsReward: Number(act.satPointsReward) || 0,
        qrCodeValue: act.qrCodeValue || `ican-${eventId}-act${idx + 1}`,
        order: act.order ?? idx,
      }))
    : [];

  return {
    id: eventId,
    organizerId: row.organizer_id || row.organizerId || 'usr-organizer-002',
    organizerName: row.organizer_name || row.organizerName || 'Student Service Office (SSO)',
    title: row.title || 'Event Kampus Hijau',
    description: row.description || '',
    bannerUrl: row.banner_url || row.bannerUrl || '',
    mediaUrls: row.media_urls || row.mediaUrls || [],
    startDate: row.start_date || row.startDate || new Date().toISOString(),
    endDate: row.end_date || row.endDate || new Date(Date.now() + 7 * 86400000).toISOString(),
    timeRange: row.time_range || row.timeRange,
    location: row.location,
    dressCode: row.dress_code || row.dressCode,
    status: row.status || 'ACTIVE',
    allowGroupMembers: row.allow_group_members ?? row.allowGroupMembers ?? false,
    maxGroupMembers: Number(row.max_group_members ?? row.maxGroupMembers ?? 3),
    activities,
    hashtags: row.hashtags || ['#WasteForChange', '#CampusEcoFair', '#ZeroWasteBinus'],
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
};

const mapModelToDb = (event: CampusEvent): any => ({
  id: event.id,
  organizer_id: event.organizerId,
  organizer_name: event.organizerName,
  title: event.title,
  description: event.description,
  banner_url: event.bannerUrl,
  media_urls: event.mediaUrls || [],
  start_date: event.startDate,
  end_date: event.endDate,
  time_range: event.timeRange,
  location: event.location,
  dress_code: event.dressCode,
  status: event.status,
  allow_group_members: event.allowGroupMembers,
  max_group_members: event.maxGroupMembers,
  activities: event.activities,
  hashtags: event.hashtags || [],
  created_at: event.createdAt,
});

const mapPatchToDb = (patch: Partial<Omit<CampusEvent, 'id' | 'createdAt'>>): any => {
  const db: any = {};
  if (patch.organizerId !== undefined) db.organizer_id = patch.organizerId;
  if (patch.organizerName !== undefined) db.organizer_name = patch.organizerName;
  if (patch.title !== undefined) db.title = patch.title;
  if (patch.description !== undefined) db.description = patch.description;
  if (patch.bannerUrl !== undefined) db.banner_url = patch.bannerUrl;
  if (patch.mediaUrls !== undefined) db.media_urls = patch.mediaUrls;
  if (patch.startDate !== undefined) db.start_date = patch.startDate;
  if (patch.endDate !== undefined) db.end_date = patch.endDate;
  if (patch.timeRange !== undefined) db.time_range = patch.timeRange;
  if (patch.location !== undefined) db.location = patch.location;
  if (patch.dressCode !== undefined) db.dress_code = patch.dressCode;
  if (patch.status !== undefined) db.status = patch.status;
  if (patch.allowGroupMembers !== undefined) db.allow_group_members = patch.allowGroupMembers;
  if (patch.maxGroupMembers !== undefined) db.max_group_members = patch.maxGroupMembers;
  if (patch.activities !== undefined) db.activities = patch.activities;
  if (patch.hashtags !== undefined) db.hashtags = patch.hashtags;
  return db;
};

