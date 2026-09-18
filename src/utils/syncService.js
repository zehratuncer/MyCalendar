import { supabase, isSupabaseConfigured } from './supabaseClient';

// BroadcastChannel for instant local multi-tab / multi-window PWA sync
let broadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('mycalendar_data_sync_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported in this environment', e);
}

// In-memory sync state
let syncListeners = [];
let currentAuthUser = null;
let realtimeSubscription = null;
let isSyncing = false;
let lastSyncedAt = null;

export const getSyncState = () => ({
  isCloudConfigured: isSupabaseConfigured,
  isAuthenticated: Boolean(currentAuthUser),
  user: currentAuthUser,
  lastSyncedAt,
  isSyncing
});

export const addSyncListener = (callback) => {
  syncListeners.push(callback);
  return () => {
    syncListeners = syncListeners.filter((cb) => cb !== callback);
  };
};

const notifyListeners = (newData, source = 'local') => {
  syncListeners.forEach((cb) => {
    try {
      cb(newData, source);
    } catch (e) {
      console.error('Error in sync listener callback:', e);
    }
  });
};

/**
 * Broadcast local change to other tabs/windows
 */
export const broadcastLocalChange = (data) => {
  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'DATA_UPDATE',
        payload: data,
        timestamp: Date.now()
      });
    }
  } catch (e) {
    console.warn('Broadcast message failed', e);
  }
};

/**
 * Push data to Supabase cloud if user is authenticated
 */
export const syncWithCloud = async (data) => {
  if (!isSupabaseConfigured || !supabase || !currentAuthUser) {
    return { success: false, reason: 'unauthenticated' };
  }

  isSyncing = true;
  try {
    const payload = {
      user_id: currentAuthUser.id,
      app_data: data,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('user_sync_data')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.warn('Supabase sync upsert error:', error.message);
      return { success: false, error };
    }

    lastSyncedAt = new Date();
    return { success: true, timestamp: lastSyncedAt };
  } catch (err) {
    console.error('Failed to push data to Supabase:', err);
    return { success: false, error: err };
  } finally {
    isSyncing = false;
  }
};

/**
 * Fetch latest data from Supabase cloud
 */
export const fetchCloudData = async () => {
  if (!isSupabaseConfigured || !supabase || !currentAuthUser) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_sync_data')
      .select('app_data, updated_at')
      .eq('user_id', currentAuthUser.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn('Error fetching cloud data:', error.message);
      return null;
    }

    if (data && data.app_data) {
      lastSyncedAt = new Date(data.updated_at || Date.now());
      return data.app_data;
    }
  } catch (err) {
    console.error('Fetch cloud data error:', err);
  }
  return null;
};

/**
 * Initialize sync listeners (BroadcastChannel, Storage events, Supabase Realtime, and Auth)
 */
export const initSyncService = (onDataUpdate) => {
  // 1. Listen to BroadcastChannel (same browser, other tabs / installed PWA)
  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'DATA_UPDATE' && event.data?.payload) {
        notifyListeners(event.data.payload, 'broadcast');
        if (onDataUpdate) onDataUpdate(event.data.payload);
      }
    };
  }

  // 2. Fallback: Listen to window storage events
  const handleStorageEvent = (e) => {
    if (e.key && e.key.startsWith('mycal_')) {
      // Storage item changed elsewhere
      try {
        if (e.newValue) {
          const parsed = JSON.parse(e.newValue);
          notifyListeners(parsed, 'storage');
        }
      } catch (err) {
        // ignore JSON parse error
      }
    }
  };
  window.addEventListener('storage', handleStorageEvent);

  // 3. Supabase Auth & Realtime setup
  if (isSupabaseConfigured && supabase) {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        currentAuthUser = session.user;
        subscribeToSupabaseRealtime(session.user.id, onDataUpdate);
        fetchCloudData().then((cloudData) => {
          if (cloudData && onDataUpdate) {
            onDataUpdate(cloudData);
          }
        });
      }
    });

    // Listen to Auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      currentAuthUser = session?.user || null;
      if (currentAuthUser) {
        subscribeToSupabaseRealtime(currentAuthUser.id, onDataUpdate);
        fetchCloudData().then((cloudData) => {
          if (cloudData && onDataUpdate) {
            onDataUpdate(cloudData);
          }
        });
      } else {
        if (realtimeSubscription) {
          supabase.removeChannel(realtimeSubscription);
          realtimeSubscription = null;
        }
      }
    });
  }

  return () => {
    window.removeEventListener('storage', handleStorageEvent);
    if (realtimeSubscription && supabase) {
      supabase.removeChannel(realtimeSubscription);
      realtimeSubscription = null;
    }
  };
};

/**
 * Subscribe to Supabase Realtime for this user's row
 */
const subscribeToSupabaseRealtime = (userId, onDataUpdate) => {
  if (!supabase) return;

  if (realtimeSubscription) {
    supabase.removeChannel(realtimeSubscription);
  }

  realtimeSubscription = supabase
    .channel(`public:user_sync_data:user_id=eq.${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_sync_data',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        if (payload.new && payload.new.app_data) {
          lastSyncedAt = new Date();
          notifyListeners(payload.new.app_data, 'cloud');
          if (onDataUpdate) onDataUpdate(payload.new.app_data);
        }
      }
    )
    .subscribe();
};
