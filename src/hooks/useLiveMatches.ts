import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveMatch {
  id: string;
  match_id: string;
  team1: string;
  team1_short: string;
  team1_img: string | null;
  team2: string;
  team2_short: string;
  team2_img: string | null;
  status: string;
  score1: string;
  score2: string;
  overs: string;
  run_rate: number;
  toss_winner: string;
  toss_decision: string;
  venue: string;
  match_type: string;
  batting_team: string;
  result: string;
  start_time: string | null;
  last_synced_at: string;
  raw_data: any;
}

// Only allow one sync call across all hook instances within this window
let lastSyncTime = 0;
const SYNC_COOLDOWN_MS = 120_000; // 2 minutes

export function useLiveMatches() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const hasSynced = useRef(false);

  const fetchMatches = useCallback(async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('start_time', { ascending: true });
    if (!error && data) setMatches(data as LiveMatch[]);
    setLoading(false);
  }, []);

  const triggerSync = useCallback(async () => {
    const now = Date.now();
    if (now - lastSyncTime < SYNC_COOLDOWN_MS) return;
    lastSyncTime = now;

    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      await fetch(`https://${projectId}.supabase.co/functions/v1/sync-matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      await fetchMatches();
    } catch (e) {
      console.error('Sync trigger failed:', e);
    }
  }, [fetchMatches]);

  useEffect(() => {
    // Fetch from DB first (instant), then trigger a background sync
    fetchMatches().then(() => {
      if (!hasSynced.current) {
        hasSynced.current = true;
        triggerSync();
      }
    });

    // Subscribe to realtime changes
    const channel = supabase
      .channel('matches-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => {
        fetchMatches();
      })
      .subscribe();

    // Poll every 2 minutes as backup
    const interval = setInterval(fetchMatches, 120_000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchMatches, triggerSync]);

  return { matches, loading, triggerSync, refetch: fetchMatches };
}
