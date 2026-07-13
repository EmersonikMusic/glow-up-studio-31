import { supabase } from "@/integrations/supabase/client";

export type RatingDirection = "up" | "down";

/**
 * Fire-and-forget increment of a question's thumbs-up or thumbs-down tally.
 * Uses a SECURITY DEFINER RPC so both guests and signed-in users can record.
 */
export function recordQuestionRating(questionId: number, direction: RatingDirection) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase.rpc as any)("increment_question_rating", {
    qid: questionId,
    direction,
  }).then(({ error }: { error: unknown }) => {
    if (error) console.warn("[questionRatings] failed to record", error);
  });
}
