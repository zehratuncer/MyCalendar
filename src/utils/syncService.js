import { supabase, isSupabaseConfigured } from './supabaseClient';

// BroadcastChannel for instant local multi-tab / multi-window PWA sync
let broadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('mycalendar_data_sync_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported', e);
}

let syncListeners = [];
let realtimeChannel = null;
let isSyncing = false;
let lastSyncedAt = null;

export const getSyncState = () => ({
  isCloudConfigured: isSupabaseConfigured,
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
 * Push data to Supabase cloud table (app_sync_data)
 */
export const syncWithCloud = async (data) => {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, reason: 'not_configured' };
  }

  isSyncing = true;
  try {
    const payload = {
      id: 'global_calendar_data',
      app_data: data,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('app_sync_data')
      .upsert(payload);

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
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('app_sync_data')
      .select('app_data, updated_at')
      .eq('id', 'global_calendar_data')
      .single();

    if (error) {
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
 * Initialize real-time sync service across all devices
 */
export const initSyncService = (onDataUpdate) => {
  // 1. BroadcastChannel (for same browser multi-tabs)
  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'DATA_UPDATE' && event.data?.payload) {
        notifyListeners(event.data.payload, 'broadcast');
        if (onDataUpdate) onDataUpdate(event.data.payload);
      }
    };
  }

  // 2. Fallback: window storage event
  const handleStorageEvent = (e) => {
    if (e.key && e.key.startsWith('mycal_')) {
      try {
        if (e.newValue) {
          const parsed = JSON.parse(e.newValue);
          notifyListeners(parsed, 'storage');
        }
      } catch (err) {
        // ignore
      }
    }
  };
  window.addEventListener('storage', handleStorageEvent);

  // 3. Supabase Realtime & Initial Cloud Fetch
  if (isSupabaseConfigured && supabase) {
    // Initial fetch from cloud
    fetchCloudData().then((cloudData) => {
      if (cloudData && typeof cloudData === 'object') {
        if (onDataUpdate) onDataUpdate(cloudData);
      }
    });

    // Subscribe to live Postgres changes on app_sync_data
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
    }

    realtimeChannel = supabase
      .channel('app_sync_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_sync_data'
        },
        (payload) => {
          if (payload.new && payload.new.app_data) {
            lastSyncedAt = new Date();
            notifyListeners(payload.new.app_data, 'cloud');
            if (onDataUpdate) onDataUpdate(payload.new.app_data);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime cloud sync active across all devices!');
        }
      });
  }

  return () => {
    window.removeEventListener('storage', handleStorageEvent);
    if (realtimeChannel && supabase) {
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }
  };
};
