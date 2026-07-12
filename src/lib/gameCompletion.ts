// Records a completed game against the profile row and returns the
// badges that were newly unlocked as a result. Called from TriviaGame
// once per finished game while the user is signed in.

import { supabase } from "@/integrations/supabase/client";
import type { Badge } from "@/data/badgeData";
import {
  evaluateBadges,
  type BadgeStats,
  type GameSessionData,
} from "@/lib/badgeEvaluator";
import { encodeGameSettings } from "@/lib/gameSettingsCode";

const HISTORY_LIMIT = 50;

function bump(map: Record<string, number>, keys: string[]): Record<string, number> {
  const next = { ...map };
  for (const k of keys) next[k] = (next[k] ?? 0) + 1;
  return next;
}

export async function handleGameCompletion(
  userId: string,
  session: GameSessionData,
): Promise<Badge[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "total_games_played, unlocked_badges, category_counts, era_counts, difficulty_counts, play_history, min_timer_games, quickplay_games, custom_games, first_game_completed_at, game_settings_history",
    )
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return [];

  const completedAtIso = session.completedAt.toISOString();

  const total_games_played = (data.total_games_played ?? 0) + 1;
  const priorHistory = (data.play_history as string[] | null) ?? [];
  const play_history = [...priorHistory, completedAtIso].slice(-HISTORY_LIMIT);

  const priorSettings = Array.isArray(data.game_settings_history)
    ? (data.game_settings_history as unknown[])
    : [];
  const newSettingsEntry = encodeGameSettings({
    categories: session.categories,
    difficulties: session.difficulties,
    eras: session.eras,
    numQuestions: session.numQuestions,
    timePerQuestion: session.timePerQuestion,
    timePerAnswer: session.timePerAnswer,
    completedAt: session.completedAt,
  });
  const game_settings_history = [...priorSettings, newSettingsEntry].slice(
    -HISTORY_LIMIT,
  ) as unknown as import("@/integrations/supabase/types").Json;


  let category_counts = (data.category_counts as Record<string, number>) ?? {};
  let era_counts = (data.era_counts as Record<string, number>) ?? {};
  let difficulty_counts = (data.difficulty_counts as Record<string, number>) ?? {};
  let min_timer_games = data.min_timer_games ?? 0;
  let custom_games = data.custom_games ?? 0;
  const quickplay_games = (data.quickplay_games ?? 0) + (session.isQuickplay ? 1 : 0);


  // Quickplay only updates global stats and the quickplay counter.
  // Custom games are the only path that increments category/era/difficulty
  // JSONB counters so that all-encompassing badges require genuine variety.
  if (!session.isQuickplay) {
    category_counts = bump(category_counts, session.categories);
    era_counts = bump(era_counts, session.eras);
    difficulty_counts = bump(difficulty_counts, session.difficulties);
    min_timer_games = min_timer_games + (session.isMinimumTimer ? 1 : 0);
    custom_games = custom_games + (session.isCustom ? 1 : 0);
  }

  const stats: BadgeStats = {
    total_games_played,
    category_counts,
    era_counts,
    difficulty_counts,
    play_history,
    min_timer_games,
    quickplay_games,
    custom_games,
  };

  const satisfied = evaluateBadges(stats, session);
  const alreadyUnlocked = new Set((data.unlocked_badges as string[] | null) ?? []);
  const newlyUnlocked = satisfied.filter((b) => !alreadyUnlocked.has(b.badgeName));
  const unlocked_badges = [
    ...alreadyUnlocked,
    ...newlyUnlocked.map((b) => b.badgeName),
  ];

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      total_games_played,
      last_played_at: completedAtIso,
      first_game_completed_at: data.first_game_completed_at ?? completedAtIso,
      category_counts,
      era_counts,
      difficulty_counts,
      play_history,
      min_timer_games,
      quickplay_games,
      custom_games,
      unlocked_badges,
      game_settings_history,
    })
    .eq("id", userId);
  if (updateError) {
    console.error("[gameCompletion] profile update failed", updateError);
  }

  return newlyUnlocked;
}
