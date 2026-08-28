// Records a started game once per round — guests and signed-in users alike.
// Mirrors handleAnonymousGameCompletion's fire-and-forget pattern: builds the
// same settings_code string used by anonymous_plays so the two tables are
// directly comparable, then inserts into game_starts. Errors are logged but
// never surfaced (analytics must never break gameplay).

import { supabase } from "@/integrations/supabase/client";
import { encodeGameSettings } from "@/lib/gameSettingsCode";
import { getDeviceId } from "@/lib/deviceId";
import type { GameSettings } from "@/data/gameOptions";

export async function recordGameStart(params: {
  userId: string | null;
  settings: GameSettings;
  isKidsMode: boolean;
  isQuickplay: boolean;
  isCustom: boolean;
  isMinimumTimer: boolean;
}): Promise<void> {
  try {
    const settings_code = encodeGameSettings({
      categories: params.settings.selectedCategories,
      difficulties: params.settings.selectedDifficulties,
      eras: params.settings.selectedEras,
      numQuestions: params.settings.numQuestions,
      timePerQuestion: params.settings.timePerQuestion,
      timePerAnswer: params.settings.timePerAnswer,
      completedAt: new Date(),
      isKidsMode: params.isKidsMode,
    });
    const { error } = await supabase.from("game_starts").insert({
      user_id: params.userId,
      device_id: getDeviceId(),
      settings_code,
      is_kids_mode: !!params.isKidsMode,
      is_quickplay: !!params.isQuickplay,
      is_custom: !!params.isCustom,
      is_minimum_timer: !!params.isMinimumTimer,
      started_at: new Date().toISOString(),
    });
    if (error) {
      console.error("[gameStart] insert failed", error);
    }
  } catch (err) {
    console.error("[gameStart] insert threw", err);
  }
}
