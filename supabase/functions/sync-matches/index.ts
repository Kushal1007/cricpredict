import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

const CRICAPI_BASE = "https://api.cricapi.com/v1";

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

function mapStatus(apiStatus: string, matchStarted: boolean, matchEnded: boolean): string {
  if (matchEnded) return "completed";
  if (matchStarted && !matchEnded) return "live";
  return "upcoming";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("CRICAPI_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "CRICAPI_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // Fetch current matches (includes live + recent)
    const res = await fetch(`${CRICAPI_BASE}/currentMatches?apikey=${apiKey}&offset=0`);
    if (!res.ok) {
      const body = await res.text();
      console.error("CricAPI error:", res.status, body);
      return new Response(JSON.stringify({ error: "CricAPI error", status: res.status, body }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await res.json();
    if (json.status !== "success") {
      return new Response(JSON.stringify({ error: json.reason || "API failure" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const matches = json.data || [];
    // Filter IPL matches only
    const iplMatches = matches.filter((m: any) =>
      (m.series_id || "").toLowerCase().includes("ipl") ||
      (m.name || "").toLowerCase().includes("ipl") ||
      (m.matchType || "").toLowerCase() === "t20" &&
        m.teams?.some((t: string) => Object.keys(TEAM_MAP).some(k => t.includes(k.split(" ")[0])))
    );

    console.log(`Total matches: ${matches.length}, IPL filtered: ${iplMatches.length}`);

    let synced = 0;

    for (const m of iplMatches) {
      const matchId = m.id || "";
      if (!matchId) continue;

      const teams: string[] = m.teams || [];
      const team1Name = teams[0] || m.teamInfo?.[0]?.name || "TBD";
      const team2Name = teams[1] || m.teamInfo?.[1]?.name || "TBD";
      const t1 = lookupTeam(team1Name);
      const t2 = lookupTeam(team2Name);

      // Status
      const matchStarted = m.matchStarted === true;
      const matchEnded = m.matchEnded === true;
      const status = mapStatus(m.status || "", matchStarted, matchEnded);

      // Scores from score array
      const scores = m.score || [];
      const score1 = scores[0] ? `${scores[0].r}/${scores[0].w} (${scores[0].o})` : "";
      const score2 = scores[1] ? `${scores[1].r}/${scores[1].w} (${scores[1].o})` : "";
      const currentOvers = scores[0]?.o?.toString() || "";
      const runRate = scores[0]?.o > 0 ? parseFloat((scores[0].r / scores[0].o).toFixed(2)) : 0;

      // Toss
      const tossWinner = m.tpiossWinner || "";
      const tossChoice = m.tossChoice || "";

      // Result
      const result = matchEnded ? (m.status || "") : "";

      // Venue & date
      const venue = m.venue || "";
      const startTime = m.dateTimeGMT ? new Date(m.dateTimeGMT).toISOString() : null;

      const upsertData = {
        match_id: matchId,
        team1: team1Name,
        team1_short: t1.short,
        team1_img: m.teamInfo?.[0]?.img || "",
        team2: team2Name,
        team2_short: t2.short,
        team2_img: m.teamInfo?.[1]?.img || "",
        status,
        score1,
        score2,
        overs: currentOvers,
        run_rate: runRate,
        toss_winner: tossWinner,
        toss_decision: tossChoice,
        venue,
        match_type: m.matchType || "t20",
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

    return new Response(JSON.stringify({ ok: true, total: matches.length, ipl: iplMatches.length, synced }), {
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
