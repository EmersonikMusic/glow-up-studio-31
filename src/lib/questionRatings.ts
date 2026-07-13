import { supabase } from "@/integrations/supabase/client";

export type RatingDirection = "up" | "down";

const STORAGE_KEY = "triviolivia:ratedQuestionIds";

/**
 * Fire-and-forget increment of a question's thumbs-up or thumbs-down tally.
 * Uses a SECURITY DEFINER RPC so both guests and signed-in users can record.
 */
export function recordQuestionRating(questionId: number, direction: RatingDirection) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase.rpc as any)("increment_question_rating", {
    qid: questionId,
    direction,
  }).then(({ error }: { error: unknown }) => {
    if (error) console.warn("[questionRatings] failed to record", error);
  });
}

export function loadRatedQuestionIds(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n) => typeof n === "number"));
  } catch {
    return new Set();
  }
}

export function saveRatedQuestionIds(ids: Set<number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore quota / privacy-mode errors
  }
}
