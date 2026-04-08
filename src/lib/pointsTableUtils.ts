import { IPL_TEAMS } from '@/data/iplData';
import type { DisplayMatch } from '@/lib/liveMatchUtils';

export interface ComputedPointsEntry {
  teamId: string;
  played: number;
  won: number;
  lost: number;
  nr: number;
  pts: number;
  nrr: number;
  form: ('W' | 'L' | 'NR')[];
}

/**
 * Compute points table from completed matches.
 * NRR is approximated from score differential since we only have total runs.
 */
export function computePointsTable(matches: DisplayMatch[]): ComputedPointsEntry[] {
  const teamMap = new Map<string, ComputedPointsEntry>();

  // Init all 10 teams
  for (const t of IPL_TEAMS) {
    teamMap.set(t.id, {
      teamId: t.id,
      played: 0,
      won: 0,
      lost: 0,
      nr: 0,
      pts: 0,
      nrr: 0,
      form: [],
    });
  }

  // Process completed matches
  const completed = matches
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  for (const m of completed) {
    const t1 = teamMap.get(m.team1Id);
    const t2 = teamMap.get(m.team2Id);
    if (!t1 || !t2) continue;

    const result = (m.result || '').toLowerCase();
    const isNoResult = result.includes('no result') || result.includes('abandoned') || result.includes('tied');

    if (isNoResult) {
      t1.played++;
      t2.played++;
      t1.nr++;
      t2.nr++;
      t1.pts += 1;
      t2.pts += 1;
      t1.form.push('NR');
      t2.form.push('NR');
      continue;
    }

    // Determine winner from result string
    const team1Name = m.team1.toLowerCase();
    const team2Name = m.team2.toLowerCase();
    const team1Short = m.team1Short.toLowerCase();
    const team2Short = m.team2Short.toLowerCase();

    let winnerId: string | null = null;

    if (result.includes(team1Short) || result.includes(team1Name.split(' ')[0])) {
      // Check it's actually about team1 winning (not "team1 lost")
      if (result.includes('won')) winnerId = m.team1Id;
    }
    if (!winnerId && (result.includes(team2Short) || result.includes(team2Name.split(' ')[0]))) {
      if (result.includes('won')) winnerId = m.team2Id;
    }

    // More robust: check which team name appears before "won"
    if (!winnerId) {
      const wonIdx = result.indexOf('won');
      if (wonIdx > 0) {
        const before = result.slice(0, wonIdx).trim();
        if (before.includes(team1Short) || before.includes(team1Name.split(' ')[0])) {
          winnerId = m.team1Id;
        } else if (before.includes(team2Short) || before.includes(team2Name.split(' ')[0])) {
          winnerId = m.team2Id;
        }
      }
    }

    t1.played++;
    t2.played++;

    if (winnerId === m.team1Id) {
      t1.won++;
      t1.pts += 2;
      t2.lost++;
      t1.form.push('W');
      t2.form.push('L');
    } else if (winnerId === m.team2Id) {
      t2.won++;
      t2.pts += 2;
      t1.lost++;
      t1.form.push('L');
      t2.form.push('W');
    } else {
      // Can't determine — treat as no result
      t1.nr++;
      t2.nr++;
      t1.pts += 1;
      t2.pts += 1;
      t1.form.push('NR');
      t2.form.push('NR');
    }

    // Approximate NRR from score differential
    const s1 = parseScore(m.score1);
    const s2 = parseScore(m.score2);
    if (s1 !== null && s2 !== null && s1 > 0 && s2 > 0) {
      // Rough NRR: (runs scored / 20) - (runs conceded / 20) accumulated
      const diff = (s1 - s2) / 20;
      t1.nrr = roundNrr((t1.nrr * (t1.played - 1) + diff) / t1.played);
      t2.nrr = roundNrr((t2.nrr * (t2.played - 1) - diff) / t2.played);
    }
  }

  // Keep only last 5 form entries
  for (const entry of teamMap.values()) {
    entry.form = entry.form.slice(-5);
  }

  return Array.from(teamMap.values()).sort(
    (a, b) => b.pts - a.pts || b.nrr - a.nrr
  );
}

function parseScore(score?: string): number | null {
  if (!score) return null;
  const num = parseInt(score.replace(/[^0-9]/g, ''), 10);
  return Number.isNaN(num) ? null : num;
}

function roundNrr(n: number): number {
  return Math.round(n * 1000) / 1000;
}
