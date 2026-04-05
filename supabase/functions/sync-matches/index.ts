import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

const SPORTS_DB_BASE = "https://www.thesportsdb.com/api/v1/json/3";
const IPL_LEAGUE_ID = "4460";

// IPL team name → local id mapping
const TEAM_MAP: Record<string, { id: string; short: string; emoji: string }> = {
  "Mumbai Indians":                { id: "mi",   short: "MI",   emoji: "💙" },
  "Chennai Super Kings":           { id: "csk",  short: "CSK",  emoji: "🦁" },
  "Royal Challengers Bengaluru":   { id: "rcb",  short: "RCB",  emoji: "🔴" },
  "Royal Challengers Bangalore":   { id: "rcb",  short: "RCB",  emoji: "🔴" },
  "Kolkata Knight Riders":         { id: "kkr",  short: "KKR",  emoji: "💜" },
  "Delhi Capitals":                { id: "dc",   short: "DC",   emoji: "🔵" },
  "Sunrisers Hyderabad":           { id: "srh",  short: "SRH",  emoji: "🔶" },
  "Rajasthan Royals":              { id: "rr",   short: "RR",   emoji: "💗" },
  "Punjab Kings":                  { id: "pbks", short: "PBKS", emoji: "🔴" },
  "Lucknow Super Giants":         { id: "lsg",  short: "LSG",  emoji: "🩵" },
  "Gujarat Titans":                { id: "gt",   short: "GT",   emoji: "🩵" },
};

function lookupTeam(name: string) {
  // Direct match
  if (TEAM_MAP[name]) return TEAM_MAP[name];
  // Fuzzy match
  const lower = name.toLowerCase();
  for (const [full, info] of Object.entries(TEAM_MAP)) {
    if (lower.includes(full.toLowerCase().split(" ")[0]) && full.split(" ").length > 1) {
      const lastWord = full.toLowerCase().split(" ").pop()!;
      if (lower.includes(lastWord)) return info;
    }
  }
  return { id: name.slice(0, 3).toLowerCase(), short: name.slice(0, 3).toUpperCase(), emoji: "🏏" };
}

function mapStatus(apiStatus: string, homeScore?: string | null, awayScore?: string | null): string {
  const status = apiStatus.toLowerCase();

  if (status.includes("finished") || status.includes("ended") || status.includes("complete")) {
    return "completed";
  }

  if (
    status.includes("not started") ||
    status.includes("scheduled") ||
    status.includes("postponed") ||
    status.includes("cancelled")
  ) {
    return "upcoming";
  }

  if (homeScore || awayScore) {
    return "completed";
  }

  return "live";
}

function toIsoStartTime(event: Record<string, any>): string | null {
  if (event.strTimestamp) {
    const parsed = new Date(event.strTimestamp);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  if (event.dateEvent && event.strTime) {
    const parsed = new Date(`${event.dateEvent}T${event.strTime}Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  if (event.dateEvent) {
    const parsed = new Date(`${event.dateEvent}T00:00:00Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  return null;
}

function buildResult(event: Record<string, any>, status: string): string {
  if (event.strResult) return event.strResult;
  if (status !== "completed") return "";

  const homeScore = Number(event.intHomeScore);
  const awayScore = Number(event.intAwayScore);

  if (!Number.isNaN(homeScore) && !Number.isNaN(awayScore)) {
    if (homeScore > awayScore) return `${event.strHomeTeam} won`;
    if (awayScore > homeScore) return `${event.strAwayTeam} won`;
    return "Match tied";
  }

  return event.strStatus || "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const season = new Date().getUTCFullYear().toString();
    const res = await fetch(`${SPORTS_DB_BASE}/eventsseason.php?id=${IPL_LEAGUE_ID}&s=${season}`);
    if (!res.ok) {
      const body = await res.text();
      console.error("Sports DB error:", res.status, body);
      return new Response(JSON.stringify({ error: "Sports DB error", status: res.status, body }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await res.json();
    const matches = (json.events || []).filter((event: any) =>
      event?.strSport === "Cricket" &&
      (event?.strLeague || "").toLowerCase().includes("indian premier league")
    );

    if (matches.length === 0) {
      return new Response(JSON.stringify({ error: json.reason || "API failure" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`IPL events fetched from TheSportsDB: ${matches.length}`);

    let synced = 0;

    for (const m of matches) {
      const matchId = m.idEvent || "";
      if (!matchId) continue;

      const team1Name = m.strHomeTeam || "TBD";
      const team2Name = m.strAwayTeam || "TBD";
      const t1 = lookupTeam(team1Name);
      const t2 = lookupTeam(team2Name);

      const status = mapStatus(m.strStatus || "", m.intHomeScore, m.intAwayScore);
      const score1 = m.intHomeScore ? String(m.intHomeScore) : "";
      const score2 = m.intAwayScore ? String(m.intAwayScore) : "";
      const venue = m.strVenue || m.strCity || "";
      const startTime = toIsoStartTime(m);
      const result = buildResult(m, status);

      const upsertData = {
        match_id: matchId,
        team1: team1Name,
        team1_short: t1.short,
        team1_img: m.strHomeTeamBadge || "",
        team2: team2Name,
        team2_short: t2.short,
        team2_img: m.strAwayTeamBadge || "",
        status,
        score1,
        score2,
        overs: "",
        run_rate: 0,
        toss_winner: "",
        toss_decision: "",
        venue,
        match_type: "t20",
        start_time: startTime,
        batting_team: "",
        result,
        last_synced_at: new Date().toISOString(),
        raw_data: m,
      };

      const { error } = await supabase
        .from("matches")
        .upsert(upsertData, { onConflict: "match_id" });

      if (error) {
        console.error(`Upsert error for ${matchId}:`, error);
      } else {
        synced++;
      }
    }

    return new Response(JSON.stringify({ ok: true, total: matches.length, synced, source: "TheSportsDB", season }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Sync error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
