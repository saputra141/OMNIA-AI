/**
 * OMNIA AI Backend - Cloudflare Workers Implementation
 * Tech Stack: TypeScript, Hono-like architecture
 */

interface Env {
  DB: any; // Cloudflare D1 Binding
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (path === "/api/stats") {
        const stats = {
          totalUsers: 1240,
          activeRequests: 85,
          serverHealth: "Optimal",
          uptime: "99.99%"
        };
        return Response.json(stats, { headers: corsHeaders });
      }

      if (path === "/api/users" && request.method === "GET") {
        // Dummy data for example - Integrate with env.DB.prepare() in production
        const users = [
          { id: 1, name: "Admin Omnia", email: "admin@omnia.ai", role: "admin", status: "active" },
          { id: 2, name: "User Test", email: "user@test.com", role: "user", status: "suspended" }
        ];
        return Response.json(users, { headers: corsHeaders });
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
  },
};
