export interface Env {
  DB: D1Database;
  OPENAI_API_KEY: string;
  GEMINI_API_KEY: string;
  ADMIN_TOKEN: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const authHeader = request.headers.get("Authorization");

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      // --- CHAT ENDPOINT ---
      if (url.pathname === "/api/chat" && request.method === "POST") {
        const { prompt, provider = "openai" } = await request.json() as any;
        
        let responseText = "";
        if (provider === "openai") {
          const resp = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { 
              "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
              "Content-Type": "application/json" 
            },
            body: JSON.stringify({
              model: "gpt-4o",
              messages: [{ role: "user", content: prompt }]
            })
          });
          const data = await resp.json() as any;
          responseText = data.choices[0].message.content;
        }

        await env.DB.prepare("INSERT INTO logs (user_id, action, provider) VALUES (?, ?, ?)")
          .bind("client_user", "chat", provider).run();

        return new Response(JSON.stringify({ response: responseText }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // --- VIDEO GENERATION ENDPOINT ---
      if (url.pathname === "/api/generate-video" && request.method === "POST") {
        const { prompt } = await request.json() as any;
        // Mocking logic for Video Provider (e.g. Luma/Runway API)
        const mockVideoUrl = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4";
        
        await env.DB.prepare("INSERT INTO logs (user_id, action, provider) VALUES (?, ?, ?)")
          .bind("client_user", "video_gen", "luma").run();

        return new Response(JSON.stringify({ video_url: mockVideoUrl, status: "completed" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // --- ADMIN: GET LOGS ---
      if (url.pathname === "/api/admin/logs") {
        if (authHeader !== `Bearer ${env.ADMIN_TOKEN}`) return new Response("Unauthorized", { status: 401 });
        const { results } = await env.DB.prepare("SELECT * FROM logs ORDER BY timestamp DESC LIMIT 50").all();
        return new Response(JSON.stringify(results), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response("Not Found", { status: 404 });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
  },
};
