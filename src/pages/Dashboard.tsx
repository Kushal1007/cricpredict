import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { IPL_TEAMS, IPL_SCHEDULE, IPL_INFO, IPL_POINTS_TABLE, IPLTeam } from '@/data/iplData';
import {
  Zap, Trophy, Target, Star, Heart, Calendar, Users, ChevronDown, ChevronUp,
  Shield, X, TrendingUp, MapPin, Check, Swords, ChevronRight, Megaphone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getTeam = (id: string): IPLTeam => IPL_TEAMS.find(t => t.id === id)!;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });

const isPlayoff = (n: number) => n >= 71;
const playoffLabel = (n: number) => {
  if (n === 71) return 'Qualifier 1';
  if (n === 72) return 'Eliminator';
  if (n === 73) return 'Qualifier 2';
  if (n === 74) return '🏆 Final';
  return `Match ${n}`;
};

// ─── Team colour map (for gradient accents) ───────────────────────────────────
const TEAM_COLORS: Record<string, { from: string; to: string; text: string }> = {
  mi:   { from: 'from-blue-600',   to: 'to-blue-400',   text: 'text-blue-400'   },
  csk:  { from: 'from-yellow-500', to: 'to-amber-400',  text: 'text-yellow-400' },
  rcb:  { from: 'from-red-600',    to: 'to-rose-400',   text: 'text-red-400'    },
  kkr:  { from: 'from-purple-600', to: 'to-violet-400', text: 'text-purple-400' },
  dc:   { from: 'from-blue-500',   to: 'to-sky-400',    text: 'text-sky-400'    },
  srh:  { from: 'from-orange-600', to: 'to-amber-500',  text: 'text-orange-400' },
  rr:   { from: 'from-pink-600',   to: 'to-rose-400',   text: 'text-pink-400'   },
  pbks: { from: 'from-red-500',    to: 'to-orange-400', text: 'text-red-400'    },
  lsg:  { from: 'from-cyan-500',   to: 'to-teal-400',   text: 'text-cyan-400'   },
  gt:   { from: 'from-sky-600',    to: 'to-cyan-400',   text: 'text-sky-400'    },
};

// ─── Form Badge ───────────────────────────────────────────────────────────────

const FormBadge: React.FC<{ result: 'W' | 'L' | 'NR' }> = ({ result }) => {
  const styles = result === 'W'
    ? 'bg-primary/20 text-primary border-primary/30'
    : result === 'L'
    ? 'bg-destructive/20 text-destructive border-destructive/30'
    : 'bg-muted text-muted-foreground border-border';
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold border ${styles}`}>
      {result}
    </span>
  );
};

// ─── Points Table ─────────────────────────────────────────────────────────────

const PointsTable: React.FC<{ favTeamId: string | null }> = ({ favTeamId }) => {
  const [expanded, setExpanded] = useState(false);
  const rows = IPL_POINTS_TABLE
    .map(entry => ({ entry, team: IPL_TEAMS.find(t => t.id === entry.teamId)! }))
    .sort((a, b) => b.entry.pts - a.entry.pts || b.entry.nrr - a.entry.nrr);

  const visibleRows = expanded ? rows : rows.slice(0, 5);
  const seasonStarted = rows.some(r => r.entry.played > 0);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-rajdhani text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          Points Table
        </h2>
        <span className="text-xs bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-2.5 py-0.5 rounded-full font-semibold">
          IPL 2026
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden border border-border/60 bg-card/50 backdrop-blur-sm">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-2 md:gap-x-3 px-4 py-2.5 bg-muted/60 text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest border-b border-border/50">
          <span>Team</span>
          <span className="text-center w-7 md:w-8">P</span>
          <span className="text-center w-7 md:w-8">W</span>
          <span className="text-center w-7 md:w-8">L</span>
          <span className="text-center w-12 md:w-14">NRR</span>
          <span className="text-center w-8 md:w-9 text-yellow-400">Pts</span>
        </div>

        {visibleRows.map(({ entry, team }, idx) => {
          const rank = idx + 1;
          const isFav = team.id === favTeamId;
          const isQualified = seasonStarted && rank <= 4;
          const tc = TEAM_COLORS[team.id];
          return (
            <div
              key={team.id}
              className={`grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-2 md:gap-x-3 px-4 py-3 border-b border-border/30 last:border-0 items-center transition-all
                ${isFav ? 'bg-primary/8 border-l-2 border-l-primary' : ''}
                ${isQualified && rank === 4 ? 'border-b-2 border-b-primary/40' : ''}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-[10px] font-bold w-5 shrink-0 text-center ${isQualified ? 'text-primary' : 'text-muted-foreground'}`}>
                  {isQualified ? <span className="text-primary font-black">{rank}</span> : rank}
                </span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 bg-gradient-to-br ${tc.from} ${tc.to} shadow-sm`}>
                  {team.emoji}
                </div>
                <div className="min-w-0">
                  <div className={`font-rajdhani font-bold text-xs md:text-sm leading-tight ${isFav ? 'text-primary' : 'text-foreground'}`}>
                    {team.shortName}
                    {isFav && <span className="ml-1 text-[9px] text-primary">♥</span>}
                  </div>
                  <div className="hidden sm:flex items-center gap-0.5 mt-0.5">
                    {entry.form.slice(-4).map((r, i) => <FormBadge key={i} result={r} />)}
                  </div>
                </div>
              </div>
              <span className="text-center w-7 md:w-8 text-xs text-muted-foreground">{entry.played}</span>
              <span className="text-center w-7 md:w-8 text-xs font-bold text-primary">{entry.won}</span>
              <span className="text-center w-7 md:w-8 text-xs font-bold text-destructive">{entry.lost}</span>
              <span className={`text-center w-12 md:w-14 text-xs font-mono ${entry.nrr >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {entry.nrr >= 0 ? '+' : ''}{entry.nrr.toFixed(3)}
              </span>
              <div className="flex justify-center w-8 md:w-9">
                <span className={`font-rajdhani font-black text-sm md:text-base ${entry.pts > 0 ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                  {entry.pts}
                </span>
              </div>
            </div>
          );
        })}

        <button
          className="w-full py-3 text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-all hover:bg-muted/30"
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Show Top 5</> : <><ChevronDown className="w-3.5 h-3.5" /> Show All 10 Teams</>}
        </button>
      </div>

      {!seasonStarted && (
        <p className="text-[11px] text-muted-foreground mt-2 px-1 text-center">
          🗓️ Season starts 22 March 2026 — standings update after each match
        </p>
      )}
    </div>
  );
};

// ─── Favourite Team Selector Modal ────────────────────────────────────────────

const FavTeamModal: React.FC<{
  favTeamId: string | null;
  onSelect: (id: string | null) => void;
  onClose: () => void;
}> = ({ favTeamId, onSelect, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
    <div
      className="relative z-10 bg-card border border-border rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}
    >
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-1 sm:hidden">
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
      </div>

      <div className="px-5 pt-4 pb-2 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-rajdhani font-bold text-xl">Pick Your Team</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Your matches will be highlighted everywhere</p>
        </div>
        <button className="p-2 rounded-xl hover:bg-muted transition-colors" onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 grid grid-cols-2 gap-2.5">
        {/* No favourite option */}
        <button
          onClick={() => { onSelect(null); onClose(); }}
          className={`col-span-2 flex items-center justify-between p-3 rounded-xl border transition-all ${
            !favTeamId ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border hover:border-border/80 hover:bg-muted/30'
          }`}
        >
          <span className="text-sm font-semibold">🌍 Follow All Teams</span>
          {!favTeamId && <Check className="w-4 h-4 text-primary" />}
        </button>

        {IPL_TEAMS.map(team => {
          const tc = TEAM_COLORS[team.id];
          const isSel = favTeamId === team.id;
          return (
            <button
              key={team.id}
              onClick={() => { onSelect(team.id); onClose(); }}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                isSel
                  ? `border-primary/60 bg-primary/10`
                  : 'border-border hover:border-border/60 hover:bg-muted/20'
              }`}
            >
              {isSel && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-background" />
                </div>
              )}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${tc.from} ${tc.to} shadow-lg`}>
                {team.emoji}
              </div>
              <div className="text-center">
                <div className={`font-rajdhani font-bold text-sm ${isSel ? 'text-primary' : 'text-foreground'}`}>
                  {team.shortName}
                </div>
                <div className="text-[10px] text-muted-foreground">{team.city}</div>
              </div>
              {team.titles > 0 && (
                <div className="flex items-center gap-0.5 text-[10px] text-yellow-400 font-semibold">
                  {'🏆'.repeat(Math.min(team.titles, 3))} {team.titles}×
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
  gradient?: string;
}> = ({ icon, label, value, colorClass, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl p-4 border border-border/60 ${gradient || 'bg-card/70'} backdrop-blur-sm`}>
    <div className={`absolute inset-0 opacity-5 ${gradient ? '' : ''}`} />
    <div className={`flex items-center gap-1.5 text-xs text-muted-foreground mb-2`}>
      <span className={colorClass}>{icon}</span>
      <span>{label}</span>
    </div>
    <div className={`font-rajdhani text-2xl font-black ${colorClass}`}>{value}</div>
  </div>
);

// ─── Team Card ────────────────────────────────────────────────────────────────

const TeamCard: React.FC<{
  team: IPLTeam;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  onClick: (id: string) => void;
}> = ({ team, isFav, onToggleFav, onClick }) => {
  const tc = TEAM_COLORS[team.id];
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-200 group ${
        isFav
          ? 'border-primary/50 shadow-[0_0_20px_hsl(150_100%_50%/0.12)]'
          : 'border-border/60 hover:border-border hover:shadow-lg'
      }`}
      onClick={() => onClick(team.id)}
    >
      {/* Gradient top strip */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${tc.from} ${tc.to}`} />

      <div className="p-3 bg-card/60 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${tc.from} ${tc.to} shadow-md`}>
            {team.emoji}
          </div>
          <button
            className={`p-1.5 rounded-lg transition-all ${isFav ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
            onClick={e => { e.stopPropagation(); onToggleFav(team.id); }}
          >
            <Heart className="w-3.5 h-3.5" fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="font-rajdhani font-bold text-sm leading-tight">{team.shortName}</div>
        <div className="text-muted-foreground text-[10px] leading-tight mb-2">{team.city}</div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-yellow-400 font-semibold">
            {team.titles > 0 ? <><Trophy className="w-3 h-3" />{team.titles}×</> : <span className="text-muted-foreground">No titles</span>}
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </div>
  );
};

// ─── Team Detail Modal ────────────────────────────────────────────────────────

const TeamDetailSheet: React.FC<{ team: IPLTeam; onClose: () => void }> = ({ team, onClose }) => {
  const [showAll, setShowAll] = useState(false);
  const visiblePlayers = showAll ? team.players : team.players.slice(0, 6);
  const tc = TEAM_COLORS[team.id];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className="relative z-10 bg-card border border-border rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg lg:max-w-xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Gradient header */}
        <div className={`h-1.5 w-full rounded-t-3xl sm:rounded-t-2xl bg-gradient-to-r ${tc.from} ${tc.to}`} />

        {/* Handle (mobile) */}
        <div className="flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${tc.from} ${tc.to} shadow-lg`}>
              {team.emoji}
            </div>
            <div>
              <div className="font-rajdhani font-bold text-lg leading-tight">{team.name}</div>
              <div className="text-muted-foreground text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {team.city} · {team.homeGround}
              </div>
            </div>
          </div>
          <button className="text-muted-foreground p-2 rounded-xl hover:bg-muted transition-colors" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Titles */}
          {team.titles > 0 ? (
            <div className="flex flex-wrap gap-2">
              {team.titleYears.map(y => (
                <span key={y} className="text-xs bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-3 py-1.5 rounded-xl font-bold">
                  🏆 {y} Champions
                </span>
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-xl px-4 py-3 text-sm text-muted-foreground text-center">
              No titles yet — the journey continues! 💪
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[['👑 Captain', team.captain], ['🎯 Coach', team.coach]].map(([label, val]) => (
              <div key={label} className="bg-muted/30 rounded-xl p-3 border border-border/50">
                <div className="text-[11px] text-muted-foreground mb-1">{label}</div>
                <div className="font-rajdhani font-bold text-sm">{val}</div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div>
            <h4 className="font-rajdhani font-bold text-base mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" /> Club Records
            </h4>
            <div className="space-y-2">
              {team.achievements.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-muted/20 rounded-xl px-3 py-2.5 border border-border/30">
                  <span className="text-primary mt-0.5 shrink-0 text-sm">✓</span>
                  <span className="text-sm text-muted-foreground leading-snug">{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Players */}
          <div>
            <h4 className="font-rajdhani font-bold text-base mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" /> Squad
            </h4>
            <div className="space-y-2">
              {visiblePlayers.map((p, i) => (
                <div key={i} className="bg-muted/20 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 border border-border/30">
                  <div className="flex items-center gap-2 min-w-0">
                    {p.isStar && <span className="text-yellow-400 text-xs shrink-0">⭐</span>}
                    <span className="font-medium text-sm truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block">{p.role}</span>
                    <span className="text-[10px] bg-muted/60 border border-border/50 px-2 py-0.5 rounded-lg text-muted-foreground">{p.nationality}</span>
                  </div>
                </div>
              ))}
              {team.players.length > 6 && (
                <button
                  className="w-full text-xs text-primary flex items-center justify-center gap-1 py-2 border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> All {team.players.length} Players</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Match Card ───────────────────────────────────────────────────────────────

const MatchCard: React.FC<{
  matchNumber: number;
  team1Id: string;
  team2Id: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  status: string;
  favTeamId: string | null;
  onPredict: () => void;
}> = ({ matchNumber, team1Id, team2Id, date, time, venue, city, status, favTeamId, onPredict }) => {
  const t1 = getTeam(team1Id);
  const t2 = getTeam(team2Id);
  const playoff = isPlayoff(matchNumber);
  const hasFav = !!(favTeamId && (team1Id === favTeamId || team2Id === favTeamId));
  const tc1 = TEAM_COLORS[team1Id];
  const tc2 = TEAM_COLORS[team2Id];
  const isLive = status === 'live';

  return (
    <div className={`relative overflow-hidden rounded-2xl border transition-all duration-200 group ${
      isLive
        ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
        : hasFav
        ? 'border-primary/40 shadow-[0_0_16px_hsl(150_100%_50%/0.1)]'
        : 'border-border/60 hover:border-border hover:shadow-lg'
    }`}>
      {/* Top accent line */}
      {hasFav && !isLive && (
        <div className="h-0.5 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      )}
      {isLive && (
        <div className="h-0.5 w-full bg-gradient-to-r from-red-600/60 via-red-500 to-red-600/60 animate-pulse" />
      )}

      <div className="p-4 bg-card/60 backdrop-blur-sm">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
              playoff
                ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
                : 'bg-muted/60 border-border/50 text-muted-foreground'
            }`}>
              {playoff ? playoffLabel(matchNumber) : `Match ${matchNumber}`}
            </span>
            {hasFav && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary font-bold flex items-center gap-1">
                <Heart className="w-2.5 h-2.5" fill="currentColor" /> Your Team
              </span>
            )}
            {isLive && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-bold flex items-center gap-1.5">
                <span className="live-pulse w-1.5 h-1.5 bg-red-400 rounded-full inline-block" /> LIVE
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold text-foreground">{formatDate(date)}</div>
            <div className="text-[11px] text-muted-foreground">{time} IST</div>
          </div>
        </div>

        {/* Teams VS section */}
        <div className="flex items-center gap-3 mb-3">
          {/* Team 1 */}
          <div className="flex-1 flex items-center gap-2.5">
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${tc1.from} ${tc1.to} shadow-md`}>
              {t1.emoji}
            </div>
            <div className="min-w-0">
              <div className="font-rajdhani font-black text-base leading-tight">{t1.shortName}</div>
              <div className="text-[10px] text-muted-foreground hidden sm:block truncate">{t1.name}</div>
            </div>
          </div>

          {/* VS badge */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-muted/60 border border-border/50 flex items-center justify-center">
              <Swords className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex-1 flex items-center gap-2.5 justify-end">
            <div className="min-w-0 text-right">
              <div className="font-rajdhani font-black text-base leading-tight">{t2.shortName}</div>
              <div className="text-[10px] text-muted-foreground hidden sm:block truncate">{t2.name}</div>
            </div>
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${tc2.from} ${tc2.to} shadow-md`}>
              {t2.emoji}
            </div>
          </div>
        </div>

        {/* Venue + CTA */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground min-w-0">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{venue}, {city}</span>
          </div>
          <button
            onClick={onPredict}
            className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              isLive
                ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                : hasFav
                ? 'bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25'
                : 'bg-muted/60 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {isLive ? '🔴 Predict Live' : '🎯 Predict'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const { user, setCurrentPage, setSelectedMatchId, updateFavTeam } = useApp();

  // Derive fav from user profile (Supabase) or localStorage fallback
  const [favTeamId, setFavTeamId] = useState<string | null>(
    () => (user as any)?.fav_team_id ?? localStorage.getItem('favTeamId')
  );
  const [showFavPicker, setShowFavPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'fav'>('all');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'group' | 'playoffs'>('all');
  const [announcements, setAnnouncements] = useState<{ id: string; title: string; message: string; type: string }[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]')); }
    catch { return new Set(); }
  });

  // Sync fav from user profile whenever it updates
  useEffect(() => {
    const fromProfile = (user as any)?.fav_team_id;
    if (fromProfile !== undefined) setFavTeamId(fromProfile);
  }, [(user as any)?.fav_team_id]);

  // Fetch active announcements
  useEffect(() => {
    (supabase.from('announcements' as any) as any)
      .select('id, title, message, type')
      .eq('is_active', true)
      .then(({ data }: any) => { if (data) setAnnouncements(data); });
  }, []);

  const dismissAnnouncement = (id: string) => {
    const next = new Set(dismissedIds);
    next.add(id);
    setDismissedIds(next);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify([...next]));
  };

  const visibleAnnouncements = announcements.filter(a => !dismissedIds.has(a.id));

  const accuracy = user ? Math.round((user.correctPredictions / Math.max(user.totalPredictions, 1)) * 100) : 0;
  const levelProgress = user ? ((user.points % 3000) / 3000) * 100 : 0;
  const favTeam = favTeamId ? IPL_TEAMS.find(t => t.id === favTeamId) : null;

  const handleSetFav = async (id: string | null) => {
    setFavTeamId(id);
    if (id) setActiveTab('fav');
    else setActiveTab('all');
    await updateFavTeam(id);
  };

  const toggleFav = (id: string) => {
    const next = favTeamId === id ? null : id;
    handleSetFav(next);
  };

  const filteredSchedule = IPL_SCHEDULE.filter(m => {
    const teamMatch = activeTab === 'fav' && favTeamId ? (m.team1Id === favTeamId || m.team2Id === favTeamId) : true;
    const typeMatch = scheduleFilter === 'group' ? m.matchNumber <= 70 : scheduleFilter === 'playoffs' ? m.matchNumber > 70 : true;
    return teamMatch && typeMatch;
  });

  const selectedTeam = selectedTeamId ? IPL_TEAMS.find(t => t.id === selectedTeamId) : null;

  return (
    <div className="min-h-screen bg-background pt-16 pb-6">

      {/* ── Live Ticker ──────────────────────────────────────── */}
      <div className="bg-surface border-b border-border overflow-hidden">
        <div className="flex items-center">
          <div className="shrink-0 bg-red-500 text-white text-xs font-black px-3 py-2 flex items-center gap-1.5">
            <span className="live-pulse w-2 h-2 bg-white rounded-full" /> IPL 2026
          </div>
          <div className="overflow-hidden flex-1">
            <div className="ticker-animation whitespace-nowrap text-xs text-muted-foreground py-2 px-4">
              🏏 Season 19 · Starts 22 March 2026 &nbsp;·&nbsp; 10 Teams · 74 Matches · Prize Pool ₹20 Crore 🔥 &nbsp;·&nbsp; Get Ready to Predict Every Match!
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 md:py-6 max-w-5xl">

        {/* ── IPL Hero Banner ──────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl p-5 md:p-7 mb-6 border border-primary/20">
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-primary/5" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-3 py-1 text-primary text-xs font-bold mb-2">
                  <span className="live-pulse w-1.5 h-1.5 bg-primary rounded-full" />
                  Season {IPL_INFO.season} · {IPL_INFO.startDate}
                </div>
                <h1 className="font-rajdhani text-3xl sm:text-4xl md:text-5xl font-black leading-none">
                  IPL <span className="neon-text-green">{IPL_INFO.year}</span>
                </h1>
                <p className="text-muted-foreground text-sm mt-1">{IPL_INFO.tagline}</p>
              </div>
              <div className="text-5xl md:text-6xl drop-shadow-xl">🏆</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                ['74', 'Matches', 'text-primary'],
                ['10', 'Teams', 'text-secondary'],
                ['₹20 Cr', 'Prize Pool', 'text-yellow-400'],
                [IPL_INFO.startDate, 'Kickoff', 'text-neon-orange'],
              ].map(([val, lbl, cls]) => (
                <div key={lbl} className="bg-muted/40 backdrop-blur-sm rounded-xl p-3 border border-border/40 text-center">
                  <div className={`font-rajdhani text-base md:text-xl font-black ${cls}`}>{val}</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Fav Team CTA Banner ──────────────────────────────── */}
        {favTeam ? (
          <button
            onClick={() => setShowFavPicker(true)}
            className="w-full mb-6 rounded-2xl overflow-hidden border border-primary/30 group hover:border-primary/50 transition-all"
          >
            <div className={`h-1 w-full bg-gradient-to-r ${TEAM_COLORS[favTeam.id].from} ${TEAM_COLORS[favTeam.id].to}`} />
            <div className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/8 transition-colors">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${TEAM_COLORS[favTeam.id].from} ${TEAM_COLORS[favTeam.id].to} shadow-lg`}>
                {favTeam.emoji}
              </div>
              <div className="flex-1 text-left">
                <div className="font-rajdhani font-black text-base text-primary">
                  ♥ {favTeam.shortName} — Your Favourite Team
                </div>
                <div className="text-xs text-muted-foreground">{favTeam.name} · Tap to change</div>
              </div>
              <ChevronRight className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
            </div>
          </button>
        ) : (
          <button
            onClick={() => setShowFavPicker(true)}
            className="w-full mb-6 rounded-2xl border border-dashed border-border hover:border-primary/50 transition-all p-4 flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-xl bg-muted/60 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Heart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-rajdhani font-bold text-base group-hover:text-primary transition-colors">Pick Your Favourite Team</div>
              <div className="text-xs text-muted-foreground">Highlight your team's matches & see their schedule</div>
            </div>
            <span className="text-xs bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-xl font-bold">
              Choose →
            </span>
          </button>
        )}

        {/* ── Points Table ─────────────────────────────────────── */}
        <PointsTable favTeamId={favTeamId} />

        {/* ── Two-column layout on tablet/desktop ─────────────── */}
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">

          {/* ── Left column ──────────────────────────────────────── */}
          <div className="lg:col-span-2">

            {/* User Stats */}
            {user && (
              <>
                <div className="mb-3">
                  <p className="font-rajdhani text-lg md:text-xl font-black">
                    Hey, <span className="neon-text-green">{user.username}</span> 👋
                  </p>
                  <p className="text-xs text-muted-foreground">Ready to predict IPL 2026?</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <StatCard icon={<Trophy className="w-4 h-4" />} label="Points" value={user.points.toLocaleString()} colorClass="text-secondary" />
                  <StatCard icon={<span className="text-sm">🪙</span>} label="Coins" value={user.coins.toLocaleString()} colorClass="text-yellow-400" />
                  <StatCard icon={<Zap className="w-4 h-4" />} label="Hot Streak" value={`${user.streak} 🔥`} colorClass="text-neon-orange" />
                  <StatCard icon={<Target className="w-4 h-4" />} label="Accuracy" value={`${accuracy}%`} colorClass="text-primary" />
                </div>

                {/* Level bar */}
                <div className="relative overflow-hidden rounded-2xl p-4 border border-border/60 bg-card/70 mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-rajdhani font-black text-base">{user.levelName}</span>
                      <span className="text-muted-foreground text-xs ml-2">Level {user.level}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{(3000 - (user.points % 3000)).toLocaleString()} pts to next</span>
                  </div>
                  <div className="h-2.5 bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 shadow-neon-green"
                      style={{
                        width: `${levelProgress}%`,
                        background: 'linear-gradient(90deg, hsl(150 100% 40%), hsl(150 100% 60%))'
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                    <span>{user.points % 3000} / 3000 pts</span>
                    <span>{Math.round(levelProgress)}%</span>
                  </div>
                </div>
              </>
            )}

            {/* Teams Section */}
            <div className="mb-5 md:mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-rajdhani text-lg font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secondary" /> IPL 2026 Teams
                </h2>
                <button
                  onClick={() => setShowFavPicker(true)}
                  className="text-[11px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-colors font-semibold"
                >
                  Pick Fav
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {IPL_TEAMS.map(team => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    isFav={favTeamId === team.id}
                    onToggleFav={toggleFav}
                    onClick={setSelectedTeamId}
                  />
                ))}
              </div>
            </div>

            {/* Daily Bonus */}
            <div className="relative overflow-hidden rounded-2xl p-4 border border-yellow-400/25 bg-card/70 mb-5 lg:mb-0">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-yellow-400/15 border border-yellow-400/20 flex items-center justify-center text-xl">🎁</div>
                  <div>
                    <div className="font-rajdhani font-black text-sm">Daily Bonus</div>
                    <div className="text-xs text-muted-foreground">Day {user?.loginStreak || 1} streak — claim now!</div>
                  </div>
                </div>
                <button className="shrink-0 px-3 py-2 bg-yellow-400/15 border border-yellow-400/35 text-yellow-400 font-rajdhani font-black text-sm rounded-xl hover:bg-yellow-400/25 transition-colors">
                  +{((user?.loginStreak || 1) * 50 + 50)} 🪙
                </button>
              </div>
            </div>
          </div>

          {/* ── Right column: Schedule ────────────────────────────── */}
          <div className="lg:col-span-3 mt-6 lg:mt-0">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-secondary" />
              <h2 className="font-rajdhani text-xl font-black">Match Schedule</h2>
              <span className="ml-auto text-xs text-muted-foreground bg-muted/50 border border-border/50 px-2 py-0.5 rounded-lg">
                {filteredSchedule.length} matches
              </span>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
              {/* All / Fav toggle */}
              <div className="flex shrink-0 bg-muted/50 rounded-xl p-1 gap-1 border border-border/40">
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'all' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setActiveTab('all')}
                >All</button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'fav' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => { if (!favTeamId) setShowFavPicker(true); else setActiveTab('fav'); }}
                >
                  <Heart className="w-3 h-3" fill={activeTab === 'fav' ? 'currentColor' : 'none'} />
                  {favTeamId ? getTeam(favTeamId).shortName : 'My Team'}
                </button>
              </div>

              {/* Group / Playoff */}
              <div className="flex shrink-0 bg-muted/50 rounded-xl p-1 gap-1 border border-border/40">
                {(['all', 'group', 'playoffs'] as const).map(f => (
                  <button
                    key={f}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${scheduleFilter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setScheduleFilter(f)}
                  >{f}</button>
                ))}
              </div>
            </div>

            {/* Fav team quick info strip */}
            {activeTab === 'fav' && favTeam && (
              <div className={`flex items-center gap-2.5 p-3 rounded-xl mb-3 border bg-gradient-to-r ${TEAM_COLORS[favTeam.id].from}/10 to-transparent border-primary/20`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br ${TEAM_COLORS[favTeam.id].from} ${TEAM_COLORS[favTeam.id].to}`}>
                  {favTeam.emoji}
                </div>
                <div>
                  <div className="font-rajdhani font-bold text-sm text-primary">{favTeam.name}</div>
                  <div className="text-[11px] text-muted-foreground">{filteredSchedule.length} scheduled matches</div>
                </div>
              </div>
            )}

            {/* Schedule list */}
            {activeTab === 'fav' && !favTeamId ? (
              <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-rajdhani font-bold text-base mb-1">No favourite team yet</p>
                <p className="text-muted-foreground text-xs mb-4">Pick a team to see only their matches</p>
                <button
                  onClick={() => setShowFavPicker(true)}
                  className="px-5 py-2 bg-primary text-background font-rajdhani font-bold text-sm rounded-xl hover:shadow-neon-green transition-all"
                >
                  Pick Your Team 🏏
                </button>
              </div>
            ) : filteredSchedule.length === 0 ? (
              <div className="rounded-2xl border border-border/60 p-8 text-center">
                <p className="text-muted-foreground text-sm">No matches for the selected filters.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[75vh] lg:max-h-none overflow-y-auto no-scrollbar lg:overflow-visible">
                {filteredSchedule.map(m => (
                  <MatchCard
                    key={m.id}
                    matchNumber={m.matchNumber}
                    team1Id={m.team1Id}
                    team2Id={m.team2Id}
                    date={m.date}
                    time={m.time}
                    venue={m.venue}
                    city={m.city}
                    status={m.status}
                    favTeamId={favTeamId}
                    onPredict={() => { setSelectedMatchId(m.id); setCurrentPage('matches'); }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedTeam && <TeamDetailSheet team={selectedTeam} onClose={() => setSelectedTeamId(null)} />}
      {showFavPicker && (
        <FavTeamModal favTeamId={favTeamId} onSelect={handleSetFav} onClose={() => setShowFavPicker(false)} />
      )}
    </div>
  );
};

export default Dashboard;
