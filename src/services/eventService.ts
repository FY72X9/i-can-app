// ==============================================================================
// I-CAN PLATFORM — CAMPUS EVENT SERVICE
// Supports direct Supabase database & storage with offline local fallback
// ==============================================================================

import { supabase, isConfigured } from '@/services/supabase';
import { CampusEvent, EventActivity, EventStatus } from '@/types';

const LOCAL_EVENTS_KEY = 'i_can_events';

// ============================================================
// HELPERS
// ============================================================

const generateId = (prefix: string = 'evt') =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const getLocalEvents = (): CampusEvent[] => {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
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
      if (!error && data && data.length > 0) {
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
 * Get active events (status === 'ACTIVE' and within date range).
 */
export const getActiveEvents = async (): Promise<CampusEvent[]> => {
  const now = new Date().toISOString();
  const allActive = await getEvents('ACTIVE');
  return allActive.filter((e) => e.startDate <= now && e.endDate >= now);
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
    activities: eventData.activities.map((act, idx) => ({
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
  // Ensure activities have correct eventId
  if (updated.activities) {
    updated.activities = updated.activities.map((act) => ({ ...act, eventId }));
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

const mapDbEventToModel = (row: any): CampusEvent => ({
  id: row.id,
  organizerId: row.organizer_id,
  organizerName: row.organizer_name,
  title: row.title,
  description: row.description,
  bannerUrl: row.banner_url || '',
  mediaUrls: row.media_urls || [],
  startDate: row.start_date,
  endDate: row.end_date,
  status: row.status,
  activities: row.activities || [],
  createdAt: row.created_at,
});

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
  status: event.status,
  activities: event.activities,
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
  if (patch.status !== undefined) db.status = patch.status;
  if (patch.activities !== undefined) db.activities = patch.activities;
  return db;
};
