import { IPL_TEAMS } from '@/data/iplData';
import type { LiveMatch } from '@/hooks/useLiveMatches';

const normalize = (value?: string | null) => (value ?? '').toLowerCase().replace(/[^a-z]/g, '');

const resolveTeam = (name: string, short: string) => {
  const normalizedName = normalize(name);
  const normalizedShort = normalize(short);

  return IPL_TEAMS.find((team) => {
    const teamName = normalize(team.name);
    const teamShort = normalize(team.shortName);

    return (
      (!!normalizedShort && teamShort === normalizedShort) ||
      teamName === normalizedName ||
      teamName.includes(normalizedName) ||
      normalizedName.includes(teamName)
    );
  });
};

const formatTime = (value: string | null) => {
  if (!value) return 'TBD';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'TBD';

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(date).toUpperCase();
};

/**
 * Format a raw score (e.g. "203") into a cricket-style display.
 * TheSportsDB only provides total runs for cricket, so we show "203 runs".
 */
const formatScore = (score: string | null | undefined): string | undefined => {
  if (!score || score.trim() === '') return undefined;
  const num = Number(score);
  if (Number.isNaN(num)) return score; // already formatted
  return `${num} runs`;
};

export interface DisplayMatch {
  id: string;
  matchId: string;
  matchNumber: number;
  team1: string;
  team1Id: string;
  team1Short: string;
  team1Emoji: string;
  team1Img: string | null;
  team2: string;
  team2Id: string;
  team2Short: string;
  team2Emoji: string;
  team2Img: string | null;
  status: 'live' | 'upcoming' | 'completed';
  score1?: string;
  score2?: string;
  overs?: string;
  runRate?: number;
  venue: string;
  city: string;
  matchType: string;
  startTime: string;
  date: string;
  time: string;
  result: string;
}

const statusOrder: Record<DisplayMatch['status'], number> = {
  live: 0,
  upcoming: 1,
  completed: 2,
};

export const mapLiveMatchesForDisplay = (matches: LiveMatch[]): DisplayMatch[] => {
  const mapped = matches.map((match) => {
    const team1 = resolveTeam(match.team1, match.team1_short);
    const team2 = resolveTeam(match.team2, match.team2_short);
    const startDate = match.start_time ? new Date(match.start_time) : null;
    const safeDate = startDate && !Number.isNaN(startDate.getTime()) ? startDate : null;

    return {
      id: match.match_id,
      matchId: match.match_id,
      matchNumber: 0,
      team1: match.team1,
      team1Id: team1?.id ?? 'mi',
      team1Short: match.team1_short || team1?.shortName || match.team1.slice(0, 3).toUpperCase(),
      team1Emoji: team1?.emoji ?? '🏏',
      team1Img: match.team1_img || null,
      team2: match.team2,
      team2Id: team2?.id ?? 'csk',
      team2Short: match.team2_short || team2?.shortName || match.team2.slice(0, 3).toUpperCase(),
      team2Emoji: team2?.emoji ?? '🏏',
      team2Img: match.team2_img || null,
      status: match.status as DisplayMatch['status'],
      score1: formatScore(match.score1),
      score2: formatScore(match.score2),
      overs: match.overs || undefined,
      runRate: typeof match.run_rate === 'number' && match.run_rate > 0 ? match.run_rate : undefined,
      venue: match.venue || 'Venue TBA',
      city: match.venue?.split(',').pop()?.trim() || 'TBA',
      matchType: (match.match_type || 'T20').toUpperCase(),
      startTime: safeDate?.toISOString() || '',
      date: safeDate?.toISOString().slice(0, 10) || '',
      time: formatTime(match.start_time),
      result: match.result || '',
    };
  });

  mapped.sort((a, b) => {
    if (a.status !== b.status) return statusOrder[a.status] - statusOrder[b.status];

    const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
    const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;

    if (a.status === 'completed') return bTime - aTime; // newest completed first
    return aTime - bTime; // nearest upcoming first
  });

  return mapped.map((match, index) => ({
    ...match,
    matchNumber: index + 1,
  }));
};
