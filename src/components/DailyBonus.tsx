import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/context/AppContext';

const DAY_REWARDS = [100, 150, 150, 200, 200, 250, 500];
const STREAK_LABELS = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7+'];

interface BonusState {
  canClaim: boolean;
  streakDay: number;
  nextClaimAt: Date | null;
  lastClaim: Date | null;
  loading: boolean;
  claiming: boolean;
  claimed: boolean; // just claimed this session
}

const DailyBonus: React.FC = () => {
  const { user, updateCoins, triggerCoinAnimation } = useApp();
  const [state, setState] = useState<BonusState>({
    canClaim: false, streakDay: 1, nextClaimAt: null, lastClaim: null,
    loading: true, claiming: false, claimed: false,
  });

  const checkBonus = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('daily_bonus_claims' as any)
      .select('claimed_at, streak_day, coins_given')
      .eq('user_id', user.id)
      .order('claimed_at', { ascending: false })
      .limit(1)
      .maybeSingle() as any;

    const now = new Date();
    if (!data) {
      setState(s => ({ ...s, canClaim: true, streakDay: 1, loading: false }));
      return;
    }

    const last = new Date(data.claimed_at);
    const hoursSince = (now.getTime() - last.getTime()) / 3600000;
    const daysSince = Math.floor(hoursSince / 24);

    // Streak: within 48h keeps streak, otherwise resets
    const streakDay = daysSince <= 1 ? Math.min(data.streak_day + 1, 7) : 1;
    const nextClaim = new Date(last.getTime() + 24 * 3600 * 1000);

    setState(s => ({
      ...s,
      canClaim: hoursSince >= 24,
      streakDay,
      nextClaimAt: hoursSince < 24 ? nextClaim : null,
      lastClaim: last,
      loading: false,
    }));
  }, [user]);

  useEffect(() => { checkBonus(); }, [checkBonus]);

  const claim = async () => {
    if (!user || !state.canClaim || state.claiming) return;
    setState(s => ({ ...s, claiming: true }));

    const coinsToGive = DAY_REWARDS[Math.min(state.streakDay - 1, 6)];

    const { error } = await supabase
      .from('daily_bonus_claims' as any)
      .insert({ user_id: user.id, streak_day: state.streakDay, coins_given: coinsToGive }) as any;

    if (error) { setState(s => ({ ...s, claiming: false })); return; }

    // Log transaction
    await supabase.from('coin_transactions' as any).insert({
      user_id: user.id,
      amount: coinsToGive,
      type: 'bonus_daily',
      description: `Daily bonus — Day ${state.streakDay} streak`,
    }) as any;

    await updateCoins(coinsToGive);
    triggerCoinAnimation(coinsToGive);

    const next = new Date(Date.now() + 24 * 3600 * 1000);
    setState(s => ({ ...s, claiming: false, canClaim: false, claimed: true, nextClaimAt: next }));
  };

  const formatCountdown = (target: Date) => {
    const diff = Math.max(0, target.getTime() - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const [countdown, setCountdown] = useState('');
  useEffect(() => {
    if (!state.nextClaimAt) return;
    const t = setInterval(() => setCountdown(formatCountdown(state.nextClaimAt!)), 1000);
    setCountdown(formatCountdown(state.nextClaimAt));
    return () => clearInterval(t);
  }, [state.nextClaimAt]);

  if (!user) return null;

  const todayReward = DAY_REWARDS[Math.min(state.streakDay - 1, 6)];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-yellow-400/30 bg-card/70">
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/8 via-transparent to-transparent pointer-events-none" />

      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-yellow-400/15 border border-yellow-400/25 flex items-center justify-center text-lg">🎁</div>
            <div>
              <div className="font-rajdhani font-black text-sm leading-tight">Daily Bonus</div>
              <div className="text-[10px] text-muted-foreground">
                {state.streakDay > 1 ? `🔥 ${state.streakDay}-Day Streak` : 'Login daily for multipliers'}
              </div>
            </div>
          </div>
          {state.claimed && (
            <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-1 rounded-lg font-bold">✓ Claimed!</span>
          )}
        </div>

        {/* 7-day strip */}
        <div className="flex gap-1.5 mb-3">
          {DAY_REWARDS.map((coins, i) => {
            const dayNum = i + 1;
            const isPast = state.streakDay > dayNum;
            const isToday = state.streakDay === dayNum;
            const isFuture = state.streakDay < dayNum;
            return (
              <div
                key={i}
                className={`flex-1 rounded-lg py-1.5 px-0.5 text-center border transition-all ${
                  isToday
                    ? 'bg-yellow-400/20 border-yellow-400/60 shadow-[0_0_8px_hsl(48_100%_50%/0.3)]'
                    : isPast
                    ? 'bg-primary/10 border-primary/25'
                    : 'bg-muted/30 border-border/30 opacity-50'
                }`}
              >
                <div className="text-[9px] text-muted-foreground mb-0.5">
                  {i === 6 ? 'D7+' : `D${dayNum}`}
                </div>
                <div className={`text-[10px] font-black ${isToday ? 'text-yellow-400' : isPast ? 'text-primary' : 'text-muted-foreground'}`}>
                  {isPast ? '✓' : `${coins}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {state.loading ? (
          <div className="h-10 bg-muted/40 rounded-xl animate-pulse" />
        ) : state.canClaim ? (
          <button
            onClick={claim}
            disabled={state.claiming}
            className="w-full py-2.5 font-rajdhani font-black text-base rounded-xl text-background transition-all disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, hsl(48 100% 45%), hsl(38 100% 55%))' }}
          >
            {state.claiming ? 'Claiming…' : `Claim +${todayReward} 🪙`}
          </button>
        ) : (
          <div className="flex items-center justify-between bg-muted/30 rounded-xl px-3 py-2.5 border border-border/40">
            <span className="text-xs text-muted-foreground">Next bonus in</span>
            <span className="font-rajdhani font-black text-sm text-yellow-400 tabular-nums">{countdown || '…'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyBonus;
