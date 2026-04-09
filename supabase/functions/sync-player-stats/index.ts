import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CRICAPI_BASE = "https://api.cricapi.com/v1";

// Map CricAPI team names to local team IDs
const TEAM_ID_MAP: Record<string, string> = {
  "mumbai indians": "mi",
  "chennai super kings": "csk",
  "royal challengers bengaluru": "rcb",
  "royal challengers bangalore": "rcb",
  "kolkata knight riders": "kkr",
  "delhi capitals": "dc",
  "sunrisers hyderabad": "srh",
  "rajasthan royals": "rr",
  "punjab kings": "pbks",
  "lucknow super giants": "lsg",
  "gujarat titans": "gt",
};

function resolveTeamId(teamName: string): string {
  const lower = teamName.toLowerCase().trim();
  if (TEAM_ID_MAP[lower]) return TEAM_ID_MAP[lower];
  // Fuzzy
  for (const [key, id] of Object.entries(TEAM_ID_MAP)) {
    if (lower.includes(key.split(" ")[0]) && lower.includes(key.split(" ").pop()!)) return id;
  }
  return lower.slice(0, 3);
}

function classifyRole(player: any): string {
  const role = (player.role || player.playingRole || "").toLowerCase();
  if (role.includes("bowl")) return "bowl";
  if (role.includes("all")) return "all";
  return "bat";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const cricApiKey = Deno.env.get("CRICAPI_KEY");
  const supabase = createClient(supabaseUrl, serviceKey);

  if (!cricApiKey) {
    return new Response(JSON.stringify({ error: "CRICAPI_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Step 1: Find the IPL 2026 series ID
    const searchRes = await fetch(
      `${CRICAPI_BASE}/series?apikey=${cricApiKey}&offset=0&search=Indian Premier League`
    );
    const searchJson = await searchRes.json();

    if (searchJson.status !== "success" || !searchJson.data?.length) {
      console.error("Series search failed:", searchJson);
      return new Response(JSON.stringify({ error: "Could not find IPL series", detail: searchJson.info || searchJson.reason }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find IPL 2026 (or most recent IPL)
    const currentYear = new Date().getUTCFullYear();
    const iplSeries = searchJson.data.find((s: any) => {
      const name = (s.name || s.seriesName || "").toLowerCase();
      return (
        name.includes("indian premier league") &&
        (name.includes(String(currentYear)) || name.includes("ipl"))
      );
    }) || searchJson.data[0];

    const seriesId = iplSeries?.id || iplSeries?.seriesId;
    if (!seriesId) {
      return new Response(JSON.stringify({ error: "No IPL series ID found" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found IPL series: ${iplSeries.name || iplSeries.seriesName}, ID: ${seriesId}`);

    // Step 2: Fetch player statistics for the series
    // Try both "batting" and "bowling" stat types
    const [battingRes, bowlingRes] = await Promise.all([
      fetch(`${CRICAPI_BASE}/series_statistics?apikey=${cricApiKey}&id=${seriesId}&statsType=batting`),
      fetch(`${CRICAPI_BASE}/series_statistics?apikey=${cricApiKey}&id=${seriesId}&statsType=bowling`),
    ]);

    const battingJson = await battingRes.json();
    const bowlingJson = await bowlingRes.json();

    console.log("Batting stats status:", battingJson.status, "count:", battingJson.data?.length || 0);
    console.log("Bowling stats status:", bowlingJson.status, "count:", bowlingJson.data?.length || 0);

    const playerMap = new Map<string, any>();

    // Process batting stats
    if (battingJson.status === "success" && battingJson.data) {
      for (const p of battingJson.data.slice(0, 30)) {
        const name = p.name || p.playerName || "";
        const teamName = p.team || p.teamName || "";
        const teamId = resolveTeamId(teamName);
        const key = `${name}__${teamId}`;

        playerMap.set(key, {
          player_name: name,
          team_id: teamId,
          role: classifyRole(p),
          matches: parseInt(p.matches || p.mat || "0") || 0,
          runs: parseInt(p.runs || "0") || 0,
          innings: parseInt(p.innings || p.inns || "0") || 0,
          high_score: parseInt(String(p.highScore || p.hs || "0").replace("*", "")) || 0,
          average: parseFloat(p.average || p.avg || "0") || 0,
          strike_rate: parseFloat(p.strikeRate || p.sr || "0") || 0,
          fifties: parseInt(p.fifties || p["50s"] || p.fifty || "0") || 0,
          hundreds: parseInt(p.hundreds || p["100s"] || p.hundred || "0") || 0,
          fours: parseInt(p.fours || p["4s"] || "0") || 0,
          sixes: parseInt(p.sixes || p["6s"] || "0") || 0,
          wickets: 0,
          bowling_innings: 0,
          economy: 0,
          best_figures: "-",
          five_wickets: 0,
          season: currentYear,
          last_updated_at: new Date().toISOString(),
        });
      }
    }

    // Process bowling stats
    if (bowlingJson.status === "success" && bowlingJson.data) {
      for (const p of bowlingJson.data.slice(0, 30)) {
        const name = p.name || p.playerName || "";
        const teamName = p.team || p.teamName || "";
        const teamId = resolveTeamId(teamName);
        const key = `${name}__${teamId}`;

        const existing = playerMap.get(key) || {
          player_name: name,
          team_id: teamId,
          role: classifyRole(p),
          matches: parseInt(p.matches || p.mat || "0") || 0,
          runs: 0,
          innings: 0,
          high_score: 0,
          average: 0,
          strike_rate: 0,
          fifties: 0,
          hundreds: 0,
          fours: 0,
          sixes: 0,
          season: currentYear,
          last_updated_at: new Date().toISOString(),
        };

        existing.wickets = parseInt(p.wickets || p.wkts || "0") || 0;
        existing.bowling_innings = parseInt(p.innings || p.inns || "0") || 0;
        existing.economy = parseFloat(p.economy || p.econ || "0") || 0;
        existing.best_figures = p.bestFigures || p.bbi || p.best || "-";
        existing.five_wickets = parseInt(p.fiveWickets || p["5w"] || "0") || 0;
        if (existing.wickets > 0 && existing.runs === 0) existing.role = "bowl";
        if (existing.wickets > 0 && existing.runs > 0) existing.role = "all";

        playerMap.set(key, existing);
      }
    }

    // Step 3: Upsert into database
    let synced = 0;
    for (const stats of playerMap.values()) {
      const { error } = await supabase
        .from("player_season_stats")
        .upsert(stats, { onConflict: "player_name,team_id,season" });

      if (error) {
        console.error(`Upsert error for ${stats.player_name}:`, error);
      } else {
        synced++;
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      seriesId,
      seriesName: iplSeries.name || iplSeries.seriesName,
      battingCount: battingJson.data?.length || 0,
      bowlingCount: bowlingJson.data?.length || 0,
      synced,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Sync player stats error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
