import { Pause, Play } from "lucide-react";
import { Question } from "@/data/questions";

interface GameFooterProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  canAdvance: boolean;
  isLast: boolean;
  onNext: () => void;
  countdown: number;
  totalQuestionTime: number;
  answerCountdown: number | null;
  totalAnswerTime: number;
  paused: boolean;
  onTogglePause: () => void;
}

const difficultyColor: Record<string, string> = {
  Casual: "hsl(160 65% 50%)",
  Easy: "hsl(160 65% 50%)",
  Average: "hsl(42 100% 55%)",
  Hard: "hsl(28 90% 52%)",
  Genius: "hsl(340 70% 60%)",
};

export default function GameFooter({
  question,
  questionIndex,
  totalQuestions,
  canAdvance,
  isLast,
  onNext,
  countdown,
  totalQuestionTime,
  answerCountdown,
  totalAnswerTime,
  paused,
  onTogglePause,
}: GameFooterProps) {

  const isAnswerPhase = answerCountdown !== null;

  return (
    <footer className="px-3 sm:px-6 md:px-8 pb-5 sm:pb-6 pt-2 w-full">
      <div className="flex items-center gap-3 w-full md:w-[70%]">
        {/* Metadata pill with integrated timer */}
        <div
          className="relative flex-1 flex items-center justify-center gap-x-2 rounded-full px-10 py-2.5 text-xs font-semibold overflow-hidden min-w-0 backdrop-blur-md"
          style={{ background: "rgba(0, 0, 0, 0.35)", border: "1.5px solid rgba(255, 255, 255, 0.18)" }}
        >
          {/* Animated time bar */}
          <div
            key={`${questionIndex}-${isAnswerPhase ? "answer" : "question"}`}
            className="absolute inset-y-0 left-0 rounded-full pointer-events-none"
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              animation: isAnswerPhase
                ? `bar-fill ${totalAnswerTime}s linear forwards`
                : `bar-deplete ${totalQuestionTime}s linear forwards`,
              animationPlayState: paused ? "paused" : "running",
            }}
          />

          {/* Content — all relative z-10 to sit above the bar */}
          <span className="relative z-10 text-muted-foreground tabular-nums whitespace-nowrap">
            Q{questionIndex + 1}/{totalQuestions}
          </span>
          <span className="relative z-10 opacity-40">·</span>
          <span className="relative z-10 text-muted-foreground truncate">{question.category}</span>
          <span className="relative z-10 opacity-40 hidden sm:inline">·</span>
          <span
            className="relative z-10 font-black hidden sm:inline whitespace-nowrap"
            style={{ color: difficultyColor[question.difficulty] ?? "hsl(var(--muted-foreground))" }}
          >
            {question.difficulty}
          </span>
          <span className="relative z-10 opacity-40 hidden md:inline">·</span>
          <span className="relative z-10 hidden md:inline text-muted-foreground truncate">{question.era}</span>

          {/* Timer — absolute right */}
          <span className="absolute right-4 z-10 flex-shrink-0">
            <span
              className="tabular-nums font-black"
              style={{ color: isAnswerPhase ? "hsl(185 70% 55%)" : "hsl(var(--muted-foreground))" }}
            >
              {isAnswerPhase ? (answerCountdown ?? 0) : countdown}s
            </span>
          </span>
        </div>

        {/* Pause / Play — matches gear icon style */}
        <button
          onClick={onTogglePause}
          className="flex items-center justify-center flex-shrink-0 w-9 h-9 rounded-full transition-all duration-200 active:scale-95 hover:brightness-110"
          style={{
            background: "rgba(0, 0, 0, 0.35)",
            border: "1.5px solid rgba(255, 255, 255, 0.18)",
          }}
          aria-label={paused ? "Resume" : "Pause"}
        >
          {paused ? (
            <Play className="w-4 h-4 ml-0.5" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.5} />
          ) : (
            <Pause className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.5} />
          )}
        </button>
      </div>
    </footer>
  );
}
