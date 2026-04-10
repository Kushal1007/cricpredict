import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CRICAPI_BASE = "https://api.cricapi.com/v1";
const IPL_SERIES_ID = "87c62aac-bc3c-4738-ab93-19da0690488f"; // IPL 2026

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
  for (const [key, id] of Object.entries(TEAM_ID_MAP)) {
    if (lower.includes(key.split(" ")[0]) && lower.includes(key.split(" ").pop()!)) return id;
  }
  return lower.slice(0, 3);
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
    // Fetch points table from CricAPI
    const pointsRes = await fetch(
      `${CRICAPI_BASE}/series_points?apikey=${cricApiKey}&id=${IPL_SERIES_ID}`
    );
    const pointsJson = await pointsRes.json();

    if (pointsJson.status !== "success" || !pointsJson.data?.length) {
      console.error("Points table fetch failed:", pointsJson);
      return new Response(JSON.stringify({ error: "Could not fetch points table", detail: pointsJson.info || pointsJson.reason }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`CricAPI points table fetched: ${pointsJson.data.length} teams`);

    // Fetch match list for completed matches with detailed info
    const seriesRes = await fetch(
      `${CRICAPI_BASE}/series_info?apikey=${cricApiKey}&id=${IPL_SERIES_ID}&offset=0`
    );
    const seriesJson = await seriesRes.json();
    const matchList = seriesJson.data?.matchList || [];
    const completedMatches = matchList.filter((m: any) => m.matchEnded);

    console.log(`Completed matches: ${completedMatches.length}`);

    return new Response(JSON.stringify({
      ok: true,
      pointsTable: pointsJson.data,
      completedMatchCount: completedMatches.length,
      totalMatches: matchList.length,
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
