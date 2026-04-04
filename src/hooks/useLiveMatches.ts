import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveMatch {
  id: string;
  match_id: string;
  team1: string;
  team1_short: string;
  team2: string;
  team2_short: string;
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

export function useLiveMatches() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('last_synced_at', { ascending: false });
    if (!error && data) setMatches(data as LiveMatch[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMatches();

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
  }, []);

  // Manual trigger sync
  const triggerSync = async () => {
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
  };

  return { matches, loading, triggerSync, refetch: fetchMatches };
}
