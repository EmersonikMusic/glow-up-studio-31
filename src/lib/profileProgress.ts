import { supabase } from "@/integrations/supabase/client";

export async function recordGameCompletion(userId: string) {
  // Fetch current values then update (avoids needing an RPC for increment).
  const { data, error } = await supabase
    .from("profiles")
    .select("games_completed, first_game_completed_at")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return;

  const now = new Date().toISOString();
  await supabase
    .from("profiles")
    .update({
      games_completed: (data.games_completed ?? 0) + 1,
      last_played_at: now,
      first_game_completed_at: data.first_game_completed_at ?? now,
    })
    .eq("id", userId);
}
