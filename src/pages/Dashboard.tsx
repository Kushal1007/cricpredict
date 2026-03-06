import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { IPL_TEAMS, IPL_SCHEDULE, IPL_INFO, IPLTeam } from '@/data/iplData';
import { Zap, Trophy, Target, Star, Heart, Calendar, Users, ChevronDown, ChevronUp, Shield } from 'lucide-react';

// ─── Small helpers ────────────────────────────────────────────────────────────

const getTeam = (id: string): IPLTeam => IPL_TEAMS.find(t => t.id === id)!;

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });
};

const isPlayoff = (matchNumber: number) => matchNumber >= 71;
const playoffLabel = (matchNumber: number) => {
  if (matchNumber === 71) return 'Qualifier 1';
  if (matchNumber === 72) return 'Eliminator';
  if (matchNumber === 73) return 'Qualifier 2';
  if (matchNumber === 74) return '🏆 Final';
  return `Match ${matchNumber}`;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; colorClass: string }> = ({ icon, label, value, colorClass }) => (
  <div className="card-surface rounded-xl p-4 flex flex-col gap-1.5">
    <div className={`flex items-center gap-1.5 text-xs text-muted-foreground`}>
      <span className={colorClass}>{icon}</span>
      {label}
    </div>
    <div className={`font-rajdhani text-2xl font-bold ${colorClass}`}>{value}</div>
  </div>
);

// ─── Team Badge ───────────────────────────────────────────────────────────────

const TeamBadge: React.FC<{
  team: IPLTeam;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  onClick: (id: string) => void;
}> = ({ team, isFav, onToggleFav, onClick }) => (
  <div
    className={`card-surface rounded-xl p-4 cursor-pointer transition-all duration-200 border ${isFav ? 'border-primary/50 shadow-[0_0_16px_hsl(150_100%_50%/0.15)]' : 'border-border hover:border-border/80'}`}
    onClick={() => onClick(team.id)}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{team.emoji}</span>
        <div>
          <div className="font-rajdhani font-bold text-base leading-tight">{team.shortName}</div>
          <div className="text-muted-foreground text-xs leading-tight line-clamp-1">{team.name}</div>
        </div>
      </div>
      <button
        className={`p-1.5 rounded-lg transition-colors ${isFav ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
        onClick={e => { e.stopPropagation(); onToggleFav(team.id); }}
        aria-label={isFav ? 'Unfavourite' : 'Favourite'}
      >
        <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
      </button>
    </div>
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Trophy className="w-3 h-3 text-yellow-400 shrink-0" />
      <span>{team.titles > 0 ? `${team.titles}× Champ` : 'No titles yet'}</span>
    </div>
    <div className="text-xs text-muted-foreground mt-1 truncate">
      👤 {team.captain}
    </div>
  </div>
);

// ─── Team Detail Modal ────────────────────────────────────────────────────────

const TeamDetailSheet: React.FC<{ team: IPLTeam; onClose: () => void }> = ({ team, onClose }) => {
  const [showAll, setShowAll] = useState(false);
  const visiblePlayers = showAll ? team.players : team.players.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className="relative z-10 bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{team.emoji}</span>
            <div>
              <div className="font-rajdhani font-bold text-xl leading-tight">{team.name}</div>
              <div className="text-muted-foreground text-xs">{team.city} · {team.homeGround}</div>
            </div>
          </div>
          <button className="text-muted-foreground p-2 rounded-lg hover:text-foreground" onClick={onClose}>✕</button>
        </div>

        <div className="p-5 space-y-5">
          {/* Titles */}
          <div className="flex flex-wrap gap-2">
            {team.titles > 0 ? (
              team.titleYears.map(y => (
                <span key={y} className="text-xs bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-3 py-1 rounded-full font-semibold">
                  🏆 {y}
                </span>
              ))
            ) : (
              <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">No titles yet — hungry for first!</span>
            )}
          </div>

          {/* Info row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card-surface-elevated rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Captain</div>
              <div className="font-rajdhani font-bold text-sm">{team.captain}</div>
            </div>
            <div className="card-surface-elevated rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Coach</div>
              <div className="font-rajdhani font-bold text-sm">{team.coach}</div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h4 className="font-rajdhani font-bold text-base mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" /> Achievements
            </h4>
            <ul className="space-y-1.5">
              {team.achievements.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5 shrink-0">✓</span> {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Players */}
          <div>
            <h4 className="font-rajdhani font-bold text-base mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" /> Squad
            </h4>
            <div className="space-y-2">
              {visiblePlayers.map((p, i) => (
                <div key={i} className="card-surface-elevated rounded-lg px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {p.isStar && <span className="text-yellow-400 text-xs">⭐</span>}
                    <span className="font-medium text-sm">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{p.role}</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{p.nationality}</span>
                  </div>
                </div>
              ))}
              {team.players.length > 5 && (
                <button
                  className="w-full text-xs text-primary flex items-center justify-center gap-1 py-1.5 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? (<><ChevronUp className="w-3 h-3" /> Show Less</>) : (<><ChevronDown className="w-3 h-3" /> Show All {team.players.length} Players</>)}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Match Schedule Row ───────────────────────────────────────────────────────

const MatchRow: React.FC<{
  matchId: string;
  matchNumber: number;
  team1Id: string;
  team2Id: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  status: string;
  favTeamId: string | null;
}> = ({ matchId, matchNumber, team1Id, team2Id, date, time, venue, city, status, favTeamId }) => {
  const t1 = getTeam(team1Id);
  const t2 = getTeam(team2Id);
  const playoff = isPlayoff(matchNumber);
  const hasFav = favTeamId && (team1Id === favTeamId || team2Id === favTeamId);

  return (
    <div className={`card-surface rounded-xl p-4 transition-all ${hasFav ? 'border-primary/40 shadow-[0_0_12px_hsl(150_100%_50%/0.1)]' : ''}`}>
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${playoff ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400' : 'bg-muted border-border text-muted-foreground'}`}>
            {playoff ? playoffLabel(matchNumber) : `Match ${matchNumber}`}
          </span>
          {hasFav && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center gap-1">
              <Heart className="w-2.5 h-2.5" fill="currentColor" /> Your Team
            </span>
          )}
          {status === 'live' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-1">
              <span className="live-pulse w-1.5 h-1.5 bg-red-400 rounded-full inline-block" /> LIVE
            </span>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs font-semibold text-foreground">{formatDate(date)}</div>
          <div className="text-xs text-muted-foreground">{time} IST</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl shrink-0">{t1.emoji}</span>
          <div className="min-w-0">
            <div className="font-rajdhani font-bold text-base leading-tight">{t1.shortName}</div>
            <div className="text-xs text-muted-foreground truncate">{t1.name}</div>
          </div>
        </div>

        <div className="text-center px-2 shrink-0">
          <div className="font-rajdhani text-xs text-muted-foreground font-bold">VS</div>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <div className="min-w-0 text-right">
            <div className="font-rajdhani font-bold text-base leading-tight">{t2.shortName}</div>
            <div className="text-xs text-muted-foreground truncate">{t2.name}</div>
          </div>
          <span className="text-xl shrink-0">{t2.emoji}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Shield className="w-3 h-3 shrink-0" />
        <span className="truncate">{venue}, {city}</span>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const { user, setCurrentPage } = useApp();

  const [favTeamId, setFavTeamId] = useState<string | null>(() => localStorage.getItem('favTeamId'));
  const [activeTab, setActiveTab] = useState<'all' | 'fav'>('all');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'group' | 'playoffs'>('all');

  const accuracy = user ? Math.round((user.correctPredictions / Math.max(user.totalPredictions, 1)) * 100) : 0;
  const levelProgress = user ? ((user.points % 3000) / 3000) * 100 : 0;

  const toggleFav = (id: string) => {
    const next = favTeamId === id ? null : id;
    setFavTeamId(next);
    if (next) localStorage.setItem('favTeamId', next);
    else localStorage.removeItem('favTeamId');
  };

  const filteredSchedule = IPL_SCHEDULE.filter(m => {
    const teamMatch = activeTab === 'fav' && favTeamId ? (m.team1Id === favTeamId || m.team2Id === favTeamId) : true;
    const typeMatch = scheduleFilter === 'group' ? m.matchNumber <= 70 : scheduleFilter === 'playoffs' ? m.matchNumber > 70 : true;
    return teamMatch && typeMatch;
  });

  const selectedTeam = selectedTeamId ? IPL_TEAMS.find(t => t.id === selectedTeamId) : null;

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">

      {/* Live Ticker */}
      <div className="bg-surface border-b border-border overflow-hidden">
        <div className="flex items-center">
          <div className="shrink-0 bg-red-500 text-white text-xs font-bold px-3 py-2 flex items-center gap-1">
            <span className="live-pulse w-2 h-2 bg-white rounded-full" />IPL
          </div>
          <div className="overflow-hidden flex-1">
            <div className="ticker-animation whitespace-nowrap text-xs text-muted-foreground py-2 px-4">
              🏏 IPL 2026 Season 19 Starts 22 March 2026 · 10 Teams · 74 Matches · Prize Pool ₹20 Crore 🔥 Get Ready to Predict Every Ball!
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">

        {/* IPL 2026 Hero Banner */}
        <div className="card-surface rounded-2xl p-5 mb-6 border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-primary font-semibold tracking-widest uppercase mb-1">Season {IPL_INFO.season}</div>
              <h1 className="font-rajdhani text-3xl font-bold leading-tight">
                IPL <span className="neon-text-green">{IPL_INFO.year}</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">{IPL_INFO.tagline}</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-muted/50 rounded-lg p-2.5 text-center">
              <div className="font-rajdhani text-xl font-bold text-primary">{IPL_INFO.totalMatches}</div>
              <div className="text-xs text-muted-foreground">Total Matches</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5 text-center">
              <div className="font-rajdhani text-xl font-bold text-secondary">{IPL_INFO.totalTeams}</div>
              <div className="text-xs text-muted-foreground">Teams</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5 text-center col-span-2">
              <div className="font-rajdhani text-sm font-bold text-yellow-400">{IPL_INFO.startDate} → {IPL_INFO.endDate}</div>
              <div className="text-xs text-muted-foreground">Season Dates</div>
            </div>
          </div>
          <ul className="mt-3 space-y-1">
            {IPL_INFO.highlights.map((h, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-primary shrink-0 mt-0.5">•</span>{h}
              </li>
            ))}
          </ul>
        </div>

        {/* User Stats */}
        {user && (
          <>
            <div className="mb-1.5">
              <p className="font-rajdhani text-lg font-bold">
                Welcome, <span className="neon-text-green">{user.username}</span> 👋
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatCard icon={<Trophy className="w-4 h-4" />} label="Points" value={user.points.toLocaleString()} colorClass="text-secondary" />
              <StatCard icon={<span className="text-sm">🪙</span>} label="Coins" value={user.coins.toLocaleString()} colorClass="text-yellow-400" />
              <StatCard icon={<Zap className="w-4 h-4" />} label="Streak" value={`${user.streak} 🔥`} colorClass="text-neon-orange" />
              <StatCard icon={<Target className="w-4 h-4" />} label="Accuracy" value={`${accuracy}%`} colorClass="text-primary" />
            </div>
            {/* Level bar */}
            <div className="card-surface rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-rajdhani font-bold">{user.levelName} <span className="text-muted-foreground text-sm font-normal">Lv.{user.level}</span></span>
                <span className="text-xs text-muted-foreground">{3000 - (user.points % 3000)} pts to next</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700 shadow-neon-green" style={{ width: `${levelProgress}%` }} />
              </div>
            </div>
          </>
        )}

        {/* ── Teams Section ───────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-rajdhani text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" /> IPL 2026 Teams
            </h2>
            <span className="text-xs text-muted-foreground">Tap ♥ to favourite</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {IPL_TEAMS.map(team => (
              <TeamBadge
                key={team.id}
                team={team}
                isFav={favTeamId === team.id}
                onToggleFav={toggleFav}
                onClick={setSelectedTeamId}
              />
            ))}
          </div>
        </div>

        {/* ── Schedule Section ────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-secondary" />
            <h2 className="font-rajdhani text-xl font-bold">Match Schedule</h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
            {/* All / Fav toggle */}
            <div className="flex shrink-0 bg-muted rounded-lg p-1 gap-1">
              <button
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'all' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('all')}
              >All</button>
              <button
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${activeTab === 'fav' ? 'bg-card text-primary shadow' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab('fav')}
              >
                <Heart className="w-3 h-3" fill={activeTab === 'fav' ? 'currentColor' : 'none'} />
                {favTeamId ? getTeam(favTeamId).shortName : 'My Team'}
              </button>
            </div>

            {/* Group / Playoff */}
            <div className="flex shrink-0 bg-muted rounded-lg p-1 gap-1">
              {(['all', 'group', 'playoffs'] as const).map(f => (
                <button
                  key={f}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${scheduleFilter === f ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setScheduleFilter(f)}
                >{f}</button>
              ))}
            </div>
          </div>

          {activeTab === 'fav' && !favTeamId ? (
            <div className="card-surface rounded-xl p-8 text-center">
              <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-rajdhani font-bold text-lg mb-1">No favourite team yet</p>
              <p className="text-muted-foreground text-sm">Tap the ♥ on any team above to see only their matches here.</p>
            </div>
          ) : filteredSchedule.length === 0 ? (
            <div className="card-surface rounded-xl p-8 text-center">
              <p className="text-muted-foreground text-sm">No matches found for the selected filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSchedule.map(m => (
                <MatchRow
                  key={m.id}
                  matchId={m.id}
                  matchNumber={m.matchNumber}
                  team1Id={m.team1Id}
                  team2Id={m.team2Id}
                  date={m.date}
                  time={m.time}
                  venue={m.venue}
                  city={m.city}
                  status={m.status}
                  favTeamId={favTeamId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Daily Bonus */}
        <div className="mt-6 card-surface rounded-xl p-4 border border-yellow-400/20">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-xl shrink-0">🎁</div>
              <div>
                <div className="font-rajdhani font-bold text-sm">Daily Login Bonus</div>
                <div className="text-xs text-muted-foreground">Day {user?.loginStreak || 1} — Claim reward!</div>
              </div>
            </div>
            <button className="shrink-0 px-4 py-2 bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 font-rajdhani font-bold text-sm rounded-lg hover:bg-yellow-400/20 transition-colors">
              +{((user?.loginStreak || 1) * 50 + 50)} Coins
            </button>
          </div>
        </div>
      </div>

      {/* Team detail sheet */}
      {selectedTeam && <TeamDetailSheet team={selectedTeam} onClose={() => setSelectedTeamId(null)} />}
    </div>
  );
};

export default Dashboard;
