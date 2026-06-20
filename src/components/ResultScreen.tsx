import { RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react";
import { useEffect, useState } from "react";
import mascotImg from "@/assets/Mascot.svg";
import PrimaryCTA from "./PrimaryCTA";
import ConfettiBurst from "./ConfettiBurst";
import { useSound } from "@/hooks/useSound";
import { trackClick } from "@/lib/analytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

export type QuestionStatus = "played" | "skipped";

interface ResultScreenProps {
  onRestart: () => void;
  onChangeSettings?: () => void;
  questions?: Question[];
  statuses?: QuestionStatus[];
}

const ROW_HEIGHT = 44; // px — keeps the 10-row cap predictable

export default function ResultScreen({ onRestart, onChangeSettings, questions, statuses }: ResultScreenProps) {
  const { play } = useSound();
  const [reviewOpen, setReviewOpen] = useState(false);

  // Fanfare on mount.
  useEffect(() => {
    play("complete");
  }, [play]);

  const hasList = Array.isArray(questions) && questions.length > 0;

  return (
    <div
      className="relative flex flex-col items-center justify-center flex-1 min-h-0 overflow-hidden px-4 sm:px-6 py-4 sm:py-8 animate-slide-in-up"
      style={{ background: "hsl(var(--game-bg))" }}
    >
      <ConfettiBurst count={14} />
      {/* Glassmorphism card */}
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden backdrop-blur-xl"
        style={{
          background: "rgba(0, 0, 0, 0.45)",
          border: "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 16px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        }}
      >

        <div className="px-8 py-6 sm:py-10 flex flex-col items-center gap-5 sm:gap-6">
          {/* Character + glow */}
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

          {/* Main heading */}
          <div className="text-center space-y-3">
            <h1
              className="text-3xl sm:text-5xl font-heading font-extrabold animate-bounce-in"
              style={{ color: "hsl(42 100% 55%)" }}
            >
              Trivia Complete!
            </h1>
            <p className="text-muted-foreground text-base max-w-xs mx-auto leading-relaxed font-body font-semibold">
              Ready for another round?
            </p>
          </div>

          {/* Decorative divider */}
          <div className="w-16 h-0.5 rounded-full" style={{ background: "rgba(255, 255, 255, 0.15)" }} />

          {/* CTAs — equal width */}
          <div className="flex flex-col items-stretch gap-5 sm:gap-3 w-full max-w-[280px] mx-auto">
            <PrimaryCTA
              onClick={onRestart}
              trackId="result_play_again"
              className="group w-full"
              aria-label="Play Again"
            >
              <RotateCcw className="w-5 h-5 transition-transform duration-500 group-hover:-rotate-[360deg]" />
              Play Again
            </PrimaryCTA>
            {hasList && (
              <button
                onClick={() => { trackClick("click_review_game"); setReviewOpen(true); }}
                aria-label="Review Your Game"
                className="nav-btn w-full rounded-full px-10 min-h-14 py-2 font-body font-bold uppercase tracking-wider text-xl transition-all duration-200 active:scale-95"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "hsl(var(--game-gold))",
                }}
              >
                Review Your Game
              </button>
            )}
            {onChangeSettings && (
              <button
                onClick={() => { trackClick("click_change_settings"); onChangeSettings(); }}
                aria-label="Change Settings"
                className="nav-btn w-full rounded-full px-10 min-h-14 py-2 font-body font-bold uppercase tracking-wider text-xl transition-all duration-200 active:scale-95"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "hsl(var(--game-gold))",
                }}
              >
                Change Settings
              </button>
            )}
            <a
              href="mailto:mark.mazurek@triviolivia.com"
              className="mt-3 text-xs sm:text-sm font-body text-white/70 hover:text-white transition-colors underline-offset-4 hover:underline text-center"
            >
              Contact us at mark.mazurek@triviolivia.com
            </a>
          </div>
        </div>
      </div>

      {/* Review modal */}
      {hasList && (
        <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
          <DialogContent
            className="max-w-2xl backdrop-blur-xl text-white"
            style={{
              background: "rgba(0, 0, 0, 0.85)",
              border: "1.5px solid rgba(255, 255, 255, 0.18)",
            }}
          >
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl" style={{ color: "hsl(var(--game-gold))" }}>
                Review Your Game
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Take a look back at the questions from this round.
              </DialogDescription>
            </DialogHeader>

            <div
              className="overflow-y-auto rounded-lg border border-white/10"
              style={{ maxHeight: `${ROW_HEIGHT * 10 + 44}px` }}
            >
              <Table>
                <TableHeader className="sticky top-0 z-10" style={{ background: "rgba(0,0,0,0.9)" }}>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="w-24 text-white/70"> </TableHead>
                    <TableHead className="w-10 text-white/70">#</TableHead>
                    <TableHead className="text-white/70">Question</TableHead>
                    <TableHead className="text-white/70">Answer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions!.map((q, i) => {
                    const status = statuses?.[i] ?? "played";
                    const skipped = status === "skipped";
                    const answerText =
                      q.answers.find((a) => a.id === q.correctId)?.text ?? q.answers[0]?.text ?? "";
                    return (
                      <TableRow
                        key={i}
                        className="border-white/10 hover:bg-white/5"
                        style={{ height: ROW_HEIGHT, opacity: skipped ? 0.5 : 1 }}
                      >
                        <TableCell className="p-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              aria-label={`Mark question ${i + 1} as good`}
                              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                              onClick={() => { /* TODO: wire feedback */ }}
                            >
                              <ThumbsUp className="w-4 h-4 text-white/80" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Mark question ${i + 1} as bad`}
                              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                              onClick={() => { /* TODO: wire feedback */ }}
                            >
                              <ThumbsDown className="w-4 h-4 text-white/80" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="tabular-nums text-white/70 p-2">{i + 1}</TableCell>
                        <TableCell className="p-2 text-white/90">
                          <span>{q.text}</span>
                          {skipped && (
                            <span
                              className="ml-2 inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold align-middle"
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
                        <TableCell className="p-2 text-white/90">{answerText}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
