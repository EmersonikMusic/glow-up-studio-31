import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (!secret) return json({ success: false, error: "not_configured" }, 500);

    const body = await req.json().catch(() => null);
    const token = body && typeof body.token === "string" ? body.token.trim() : "";
    if (!token || token.length > 4096) {
      return json({ success: false, error: "invalid_token" }, 400);
    }

    const ip =
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "";

    const form = new URLSearchParams({ secret, response: token });
    if (ip) form.set("remoteip", ip);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const result = (await res.json()) as { success?: boolean; "error-codes"?: string[] };

    if (!result.success) {
      return json({ success: false, error: result["error-codes"]?.[0] ?? "failed" }, 403);
    }
    return json({ success: true });
  } catch {
    return json({ success: false, error: "server_error" }, 500);
  }
});
