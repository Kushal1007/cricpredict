import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

const CRICBUZZ_BASE = "https://cricbuzz-live.vercel.app/v1";

// IPL team name → short code mapping
const TEAM_SHORT: Record<string, string> = {
  "Mumbai Indians": "MI",
  "Chennai Super Kings": "CSK",
  "Royal Challengers Bengaluru": "RCB",
  "Royal Challengers Bangalore": "RCB",
  "Kolkata Knight Riders": "KKR",
  "Delhi Capitals": "DC",
  "Sunrisers Hyderabad": "SRH",
  "Rajasthan Royals": "RR",
  "Punjab Kings": "PBKS",
  "Lucknow Super Giants": "LSG",
  "Gujarat Titans": "GT",
};

const TEAM_ID: Record<string, string> = {
  MI: "mi", CSK: "csk", RCB: "rcb", KKR: "kkr", DC: "dc",
  SRH: "srh", RR: "rr", PBKS: "pbks", LSG: "lsg", GT: "gt",
};

const TEAM_EMOJI: Record<string, string> = {
  mi: "💙", csk: "🦁", rcb: "🔴", kkr: "💜", dc: "🔵",
  srh: "🔶", rr: "💗", pbks: "🔴", lsg: "🩵", gt: "🩵",
};

function getShort(name: string): string {
  for (const [full, short] of Object.entries(TEAM_SHORT)) {
    if (name.toLowerCase().includes(full.toLowerCase())) return short;
  }
  // Try partial match
  for (const [full, short] of Object.entries(TEAM_SHORT)) {
    const words = full.toLowerCase().split(" ");
    if (words.some((w) => name.toLowerCase().includes(w) && w.length > 3))
      return short;
  }
  return name.slice(0, 3).toUpperCase();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // 1. Fetch live matches from CricBuzz (league = IPL)
    const liveRes = await fetch(`${CRICBUZZ_BASE}/matches/live?type=league`);
    if (!liveRes.ok) {
      console.error("CricBuzz live API error:", liveRes.status);
      return new Response(JSON.stringify({ error: "CricBuzz API error", status: liveRes.status }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const liveData = await liveRes.json();
    const matches = liveData?.data || [];
    console.log(`Found ${matches.length} live/recent matches`);

    let synced = 0;

    for (const match of matches) {
      const matchId = String(match.id || match.matchId || "");
      if (!matchId) continue;

      // 2. Fetch detailed score for each match
      let scoreData: any = {};
      try {
        const scoreRes = await fetch(`${CRICBUZZ_BASE}/score/${matchId}`);
        if (scoreRes.ok) {
          scoreData = await scoreRes.json();
        }
      } catch (e) {
        console.warn(`Score fetch failed for ${matchId}:`, e);
      }

      // Parse team names
      const title = match.title || scoreData?.title || "";
      const teams = title.split(" vs ").map((t: string) => t.trim());
      const team1Name = teams[0] || "TBD";
      const team2Name = teams[1] || "TBD";
      const team1Short = getShort(team1Name);
      const team2Short = getShort(team2Name);

      // Determine status
      const overview = (match.overview || scoreData?.status || "").toLowerCase();
      let status = "upcoming";
      if (overview.includes("won") || overview.includes("tied") || overview.includes("no result")) {
        status = "completed";
      } else if (overview.includes("need") || overview.includes("trail") || overview.includes("lead") || overview.includes("crr") || match.overview?.includes("*")) {
        status = "live";
      }

      // Extract scores
      const score1 = scoreData?.score1 || scoreData?.batsmanOneRun || "";
      const score2 = scoreData?.score2 || "";
      const overs = scoreData?.overs || scoreData?.batsmanOneBall || "";
      const runRate = parseFloat(scoreData?.crr || scoreData?.currentRunRate || "0") || 0;

      // Toss info from raw data
      const tossWinner = scoreData?.tossWinner || "";
      const tossDecision = scoreData?.tossDecision || "";

      // Batting team
      const battingTeam = scoreData?.battingTeam || "";

      // Result
      const result = status === "completed" ? (match.overview || scoreData?.status || "") : "";

      const upsertData = {
        match_id: matchId,
        team1: team1Name,
        team1_short: team1Short,
        team2: team2Name,
        team2_short: team2Short,
        status,
        score1: String(score1),
        score2: String(score2),
        overs: String(overs),
        run_rate: runRate,
        toss_winner: tossWinner,
        toss_decision: tossDecision,
        venue: match.venue || scoreData?.venue || "",
        match_type: "T20",
        batting_team: battingTeam,
        result,
        last_synced_at: new Date().toISOString(),
        raw_data: { match, score: scoreData },
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

    // Also fetch recent completed matches
    try {
      const recentRes = await fetch(`${CRICBUZZ_BASE}/matches/recent?type=league`);
      if (recentRes.ok) {
        const recentData = await recentRes.json();
        const recentMatches = recentData?.data || [];
        
        for (const match of recentMatches) {
          const matchId = String(match.id || match.matchId || "");
          if (!matchId) continue;

          let scoreData: any = {};
          try {
            const scoreRes = await fetch(`${CRICBUZZ_BASE}/score/${matchId}`);
            if (scoreRes.ok) scoreData = await scoreRes.json();
          } catch (_) { /* skip */ }

          const title = match.title || scoreData?.title || "";
          const teams = title.split(" vs ").map((t: string) => t.trim());
          const team1Name = teams[0] || "TBD";
          const team2Name = teams[1] || "TBD";

          const { error } = await supabase.from("matches").upsert({
            match_id: matchId,
            team1: team1Name,
            team1_short: getShort(team1Name),
            team2: team2Name,
            team2_short: getShort(team2Name),
            status: "completed",
            score1: String(scoreData?.score1 || ""),
            score2: String(scoreData?.score2 || ""),
            result: match.overview || scoreData?.status || "",
            venue: match.venue || "",
            match_type: "T20",
            last_synced_at: new Date().toISOString(),
            raw_data: { match, score: scoreData },
          }, { onConflict: "match_id" });

          if (!error) synced++;
        }
      }
    } catch (e) {
      console.warn("Recent matches fetch failed:", e);
    }

    return new Response(JSON.stringify({ ok: true, synced }), {
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
