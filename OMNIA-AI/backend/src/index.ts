export interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;
  LITELLM_BASE_URL?: string;
  LITELLM_MASTER_KEY?: string;
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...cors, "Content-Type": "application/json" },
  });
}
function authorized(request: Request, env: Env) {
  return request.headers.get("Authorization") === `Bearer ${env.ADMIN_TOKEN}`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({ name: "OMNIA AI", status: "ok", version: "0.1.0" });
    }

    if (url.pathname === "/api/models" && request.method === "GET") {
      return json({
        chat: [
          { id: "openai", label: "OpenAI", configured: Boolean(env.OPENAI_API_KEY) },
          { id: "gemini", label: "Google Gemini", configured: Boolean(env.GEMINI_API_KEY) },
          { id: "litellm", label: "LiteLLM Gateway", configured: Boolean(env.LITELLM_BASE_URL && env.LITELLM_MASTER_KEY) }
        ],
        video: [
          { id: "veo", label: "Google Veo", status: "not_configured" },
          { id: "kling", label: "Kling", status: "not_configured" },
          { id: "runway", label: "Runway", status: "not_configured" },
          { id: "minimax", label: "MiniMax", status: "not_configured" },
          { id: "fal", label: "fal.ai", status: "not_configured" }
        ]
      });
    }

    if (url.pathname.startsWith("/api/admin/")) {
      if (!authorized(request, env)) return json({ error: "Unauthorized" }, 401);
      if (url.pathname === "/api/admin/overview") {
        const row = await env.DB.prepare("SELECT COUNT(*) AS jobs FROM video_jobs").first<{jobs:number}>();
        return json({ videoJobs: row?.jobs ?? 0, note: "Usage metering must be connected to provider callbacks." });
      }
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      // Route through a configured LiteLLM gateway. Do not expose provider keys to clients.
      if (!env.LITELLM_BASE_URL || !env.LITELLM_MASTER_KEY) {
        return json({ error: "AI gateway belum dikonfigurasi oleh administrator." }, 503);
      }
      const body = await request.json() as { model?: string; messages?: Array<{role:string;content:string}> };
      if (!body.model || !Array.isArray(body.messages)) return json({ error: "model dan messages wajib diisi" }, 400);
      const upstream = await fetch(`${env.LITELLM_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${env.LITELLM_MASTER_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: body.model, messages: body.messages })
      });
      return new Response(upstream.body, { status: upstream.status, headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (url.pathname === "/api/video/jobs" && request.method === "POST") {
      // Provider-specific adapters must be implemented and tested before enabling render.
      return json({ error: "Video provider belum diaktifkan. Admin harus memasang adapter dan kredensial provider terlebih dahulu." }, 501);
    }

    return json({ error: "Not found" }, 404);
  }
};
