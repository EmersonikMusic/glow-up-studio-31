import { RotateCcw, ThumbsUp, ThumbsDown, ChevronsLeft } from "lucide-react";
import SecondaryCTA from "./SecondaryCTA";
import { useEffect, useState, useMemo } from "react";
import mascotImg from "@/assets/Mascot.svg";
import PrimaryCTA from "./PrimaryCTA";
import ConfettiBurst from "./ConfettiBurst";
import LegalFooter from "./LegalFooter";
import { useSound } from "@/hooks/useSound";
import { trackClick } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { Question } from "@/data/questions";
import {
  recordQuestionRating,
  loadRatedQuestionIds,
  saveRatedQuestionIds,
} from "@/lib/questionRatings";

export type QuestionStatus = "played" | "skipped";

interface ResultScreenProps {
  onRestart: () => void;
  onChangeSettings?: () => void;
  onBackToStart?: () => void;
  onPrivacy: () => void;
  questions?: Question[];
  statuses?: QuestionStatus[];
}

const ROW_HEIGHT = 56;

type Feedback = "up" | "down";

export default function ResultScreen({ onRestart, onChangeSettings, onBackToStart, onPrivacy, questions, statuses }: ResultScreenProps) {
  const { play } = useSound();
  const { toast } = useToast();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [feedback, setFeedback] = useState<Record<number, Feedback | undefined>>({});
  const [bump, setBump] = useState<Record<string, boolean>>({});
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [ratedIds, setRatedIds] = useState<Set<number>>(() => loadRatedQuestionIds());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    play("complete");
  }, [play]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const hasList = Array.isArray(questions) && questions.length > 0;

  const stagedCount = useMemo(
    () => Object.values(feedback).filter((v) => v !== undefined).length,
    [feedback]
  );

  const handleVote = (i: number, choice: Feedback) => {
    const q = questions?.[i];
    // Locked: already rated in a prior session.
    if (q && ratedIds.has(q.id)) return;
    // Guests: show nudge, don't stage.
    if (!isSignedIn) {
      toast({
        title: "Sign in to rate questions",
        description: "Ratings are only saved for signed-in players.",
      });
      return;
    }
    if (submitted || submitting) return;
    setFeedback((prev) => {
      const current = prev[i];
      const next = current === choice ? undefined : choice;
      return { ...prev, [i]: next };
    });
    const key = `${i}-${choice}`;
    setBump((prev) => ({ ...prev, [key]: true }));
    window.setTimeout(() => {
      setBump((prev) => ({ ...prev, [key]: false }));
    }, 220);
  };

  const handleSubmitRatings = async () => {
    if (!isSignedIn || submitting || submitted || stagedCount === 0 || !questions) return;
    setSubmitting(true);
    const entries: Array<{ id: number; dir: Feedback }> = [];
    Object.entries(feedback).forEach(([idx, dir]) => {
      if (!dir) return;
      const q = questions[Number(idx)];
      if (!q) return;
      if (ratedIds.has(q.id)) return;
      entries.push({ id: q.id, dir });
    });
    try {
      await Promise.all(entries.map((e) => recordQuestionRating(e.id, e.dir)));
    } catch (err) {
      console.warn("[ResultScreen] submit ratings error", err);
    }
    const next = new Set(ratedIds);
    entries.forEach((e) => next.add(e.id));
    setRatedIds(next);
    saveRatedQuestionIds(next);
    setSubmitting(false);
    setSubmitted(true);
    trackClick("submit_question_ratings");
    toast({ title: "Ratings submitted", description: "Thanks for your feedback!" });
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center flex-1 min-h-0 overflow-hidden px-4 sm:px-6 py-4 sm:py-8 animate-slide-in-up"
      style={{ background: "hsl(var(--game-bg))" }}
    >
      <ConfettiBurst count={14} />
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden backdrop-blur-xl"
        style={{
          background: "rgba(0, 0, 0, 0.45)",
          border: "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 16px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        }}
      >
        <div className="px-8 py-6 sm:py-10 flex flex-col items-center gap-5 sm:gap-6">
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(42 100% 55% / 0.35) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            <img
              src={mascotImg}
              alt="Olivia the mascot"
              className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-2xl animate-float"
            />
          </div>

          <div className="text-center space-y-3">
            <h1
              className="text-3xl sm:text-4xl font-heading font-extrabold uppercase leading-none tracking-tight whitespace-nowrap animate-bounce-in"
              style={{
                background: "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.05,
              }}
            >
              Trivia Complete!
            </h1>
            <p className="text-sm font-body font-semibold text-white leading-relaxed max-w-xs mx-auto">
              Ready for another round?
            </p>
          </div>

          <div className="w-16 h-0.5 rounded-full" style={{ background: "rgba(255, 255, 255, 0.15)" }} />

          <div className="flex flex-col items-stretch w-full max-w-[280px] mx-auto">
            <PrimaryCTA
              onClick={onRestart}
              trackId="result_play_again"
              className="group w-full"
              aria-label="Play Again"
            >
              <RotateCcw className="w-5 h-5 transition-transform duration-500 group-hover:-rotate-[360deg]" />
              Play Again
            </PrimaryCTA>
            {onChangeSettings && (
              <SecondaryCTA
                onClick={onChangeSettings}
                trackId="change_settings"
                className="mt-2 sm:mt-3 w-full"
                aria-label="Change Settings"
              >
                Change Settings
              </SecondaryCTA>
            )}

            {hasList && (
              <button
                onClick={() => { trackClick("click_review_game"); setReviewOpen(true); }}
                className="howto-link mt-[22px] text-xs font-body font-semibold underline underline-offset-[5px] text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))] transition-colors"
              >
                Review Your Game
              </button>
            )}

            <p className="mt-6 sm:mt-7 text-xs font-body font-semibold text-white text-center">
              Contact us at
              <br />
              <a
                href="mailto:mark.mazurek@triviolivia.com"
                className="howto-link text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))] transition-colors"
              >
                mark.mazurek@triviolivia.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {hasList && (
        <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
          <DialogContent
            className="w-[calc(100%-2rem)] max-w-2xl text-white p-0 overflow-hidden flex flex-col top-4 sm:top-1/2 translate-y-0 sm:-translate-y-1/2 max-h-[calc(100dvh-2rem)] [&>button:last-of-type]:hidden"


            overlayClassName="bg-[hsl(var(--game-bg))] overflow-hidden"
            overlayChildren={
              <>
                <div
                  className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, hsl(280 60% 50% / 0.14) 0%, transparent 70%)",
                    filter: "blur(60px)",
                  }}
                />
                <div
                  className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, hsl(210 70% 50% / 0.1) 0%, transparent 70%)",
                    filter: "blur(60px)",
                  }}
                />
              </>
            }
            style={{
              background: "rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1.5px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
            }}
          >
            {/* Back/close button — matches About screen */}
            <DialogClose
              className="nav-btn absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-95"
              aria-label="Close"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <ChevronsLeft className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.5} />
            </DialogClose>




            <DialogHeader className="px-6 md:px-8 pt-10 pb-5 shrink-0" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <p
                className="text-sm font-subheading font-bold tracking-[0.2em] uppercase mb-2"
                style={{ color: "hsl(185 70% 55%)" }}
              >
                Round Recap
              </p>
              <DialogTitle
                className="text-3xl sm:text-2xl font-heading font-extrabold uppercase leading-none tracking-tight sm:whitespace-nowrap"

                style={{
                  background: "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.05,
                }}
              >
                Review Your Game
              </DialogTitle>
              <DialogDescription className="text-sm font-body font-semibold text-white leading-relaxed mt-2">
                Think you can do better?{" "}
                <button
                  type="button"
                  onClick={() => {
                    trackClick("click_review_play_again");
                    onBackToStart?.();
                  }}
                  className="font-black underline underline-offset-[5px] text-[hsl(185_70%_55%)] [@media(hover:hover)]:hover:text-[hsl(var(--game-gold))] transition-colors"
                >
                  Play Again
                </button>
              </DialogDescription>
            </DialogHeader>

            <div className="px-3 sm:px-6 md:px-8 pb-6 pt-2 sm:py-6 flex-1 min-h-0 flex flex-col">
              <div
                className="overflow-y-auto rounded-2xl flex-1 min-h-0"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  background: "rgba(0, 0, 0, 0.2)",
                }}
              >

                <Table>
                  <TableHeader
                    className="sticky top-0 z-10"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
                  >
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead
                        className="w-8 sm:w-10 px-2 sm:px-3 text-center text-[10px] sm:text-xs font-subheading font-bold tracking-[0.14em] sm:tracking-[0.18em] uppercase"
                        style={{ color: "hsl(185 70% 55%)" }}
                      >
                        #
                      </TableHead>
                      <TableHead
                        className="px-2 sm:px-3 text-[10px] sm:text-xs font-subheading font-bold tracking-[0.14em] sm:tracking-[0.18em] uppercase"
                        style={{ color: "hsl(185 70% 55%)" }}
                      >
                        Question
                      </TableHead>
                      <TableHead
                        className="px-2 sm:px-3 text-[10px] sm:text-xs font-subheading font-bold tracking-[0.14em] sm:tracking-[0.18em] uppercase"
                        style={{ color: "hsl(185 70% 55%)" }}
                      >
                        Answer
                      </TableHead>
                      <TableHead
                        className="w-[96px] sm:w-24 px-2 sm:px-3 text-center text-[10px] sm:text-xs font-subheading font-bold tracking-[0.14em] sm:tracking-[0.18em] uppercase"
                        style={{ color: "hsl(185 70% 55%)" }}
                      >
                        Rate
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions!.map((q, i) => {
                      const status = statuses?.[i] ?? "played";
                      const skipped = status === "skipped";
                      const answerText =
                        q.answers.find((a) => a.id === q.correctId)?.text ?? q.answers[0]?.text ?? "";
                      const vote = feedback[i];
                      const locked = ratedIds.has(q.id);
                      const disabledRow = locked || submitted || submitting;
                      return (
                        <TableRow
                          key={i}
                          className="border-white/10 hover:bg-transparent"
                          style={{ opacity: skipped ? 0.55 : 1 }}
                        >
                          <TableCell className="tabular-nums text-white/60 px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-body font-semibold align-top">
                            {i + 1}
                          </TableCell>
                          <TableCell className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-body font-semibold text-white/90 align-top leading-snug break-words">
                            <span>{q.text}</span>
                            {skipped && (
                              <span
                                className="ml-2 inline-block px-2 py-0.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-subheading font-bold align-middle"
                                style={{
                                  color: "hsl(var(--game-gold))",
                                  border: "1px solid rgba(255,255,255,0.12)",
                                  background: "rgba(255,255,255,0.04)",
                                }}
                              >
                                Skipped
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-body font-semibold text-white/90 align-top leading-snug break-words">
                            {answerText}
                          </TableCell>
                          <TableCell className="px-1 sm:px-3 py-2 sm:py-3 align-top">
                            <div className="flex items-center justify-center gap-2">
                              {(["up", "down"] as const).map((dir) => {
                                const active = vote === dir;
                                const bumping = bump[`${i}-${dir}`];
                                const Icon = dir === "up" ? ThumbsUp : ThumbsDown;
                                return (
                                  <button
                                    key={dir}
                                    type="button"
                                    aria-label={`Mark question ${i + 1} as ${dir === "up" ? "good" : "bad"}`}
                                    aria-pressed={active}
                                    aria-disabled={disabledRow}
                                    title={locked ? "You've already rated this question" : undefined}
                                    onClick={() => {
                                      if (disabledRow) {
                                        if (locked) {
                                          toast({
                                            title: "Already rated",
                                            description: "You've already rated this question.",
                                          });
                                        }
                                        return;
                                      }
                                      handleVote(i, dir);
                                    }}
                                    className="flex items-center justify-center w-11 h-11 sm:w-9 sm:h-9 rounded-full transition-transform duration-150 ease-out active:scale-95"
                                    style={{
                                      transform: bumping ? "scale(1.25)" : "scale(1)",
                                      opacity: locked ? 0.35 : 1,
                                      cursor: disabledRow ? "not-allowed" : "pointer",
                                    }}
                                  >
                                    <Icon
                                      className={`w-5 h-5 transition-colors ${active ? "text-[hsl(var(--game-gold))]" : "text-white/65"} ${disabledRow ? "" : "[@media(hover:hover)]:hover:text-[hsl(var(--game-gold))]"}`}
                                      stroke="currentColor"
                                      fill="none"
                                    />

                                  </button>
                                );
                              })}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Submit ratings */}
              <div className="mt-4 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmitRatings}
                  disabled={!isSignedIn || submitted || submitting || stagedCount === 0}
                  className="px-5 py-2.5 rounded-full text-sm font-subheading font-bold uppercase tracking-[0.14em] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: submitted
                      ? "rgba(255,255,255,0.08)"
                      : "hsl(var(--game-gold) / 0.9)",
                    color: submitted ? "hsl(var(--game-gold))" : "#111",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {submitted ? "Ratings Submitted" : submitting ? "Submitting…" : "Submit Ratings"}
                </button>
                {!isSignedIn && (
                  <p className="text-[11px] font-body text-white/60 text-center">
                    Sign in to submit ratings.
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Copyright legal line — matches Start screen position */}
      <div className="absolute bottom-[12px] left-0 w-full flex justify-center">
        <LegalFooter onPrivacy={onPrivacy} className="animate-fade-in" />
      </div>
    </div>
  );
}
