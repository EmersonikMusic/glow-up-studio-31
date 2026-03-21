import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface AnswerGridProps {
  answers: { id: string; text: string }[];
  selected: string | null;
  correctId: string;
  onSelect: (id: string) => void;
}

const answerColors = [
  { bg: "hsl(var(--game-answer-a))", label: "A" },
  { bg: "hsl(var(--game-answer-b))", label: "B" },
  { bg: "hsl(var(--game-answer-c))", label: "C" },
  { bg: "hsl(var(--game-answer-d))", label: "D" },
];

export default function AnswerGrid({ answers, selected, correctId, onSelect }: AnswerGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-6 md:px-8">
      {answers.map((answer, index) => {
        const color = answerColors[index];
        const isSelected = selected === answer.id;
        const isCorrect = answer.id === correctId;
        const hasAnswered = selected !== null;

        let stateStyle: React.CSSProperties = { background: color.bg };
        let icon = null;

        if (hasAnswered) {
          if (isCorrect) {
            stateStyle = { background: "hsl(var(--game-correct))", boxShadow: "0 0 0 2px hsl(140 65% 60%)" };
            icon = <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />;
          } else if (isSelected && !isCorrect) {
            stateStyle = { background: "hsl(var(--game-wrong))", boxShadow: "0 0 0 2px hsl(0 70% 65%)" };
            icon = <XCircle className="w-5 h-5 text-white flex-shrink-0" />;
          } else {
            stateStyle = { background: "hsl(var(--game-card))", opacity: 0.5 };
          }
        }

        return (
          <button
            key={answer.id}
            disabled={hasAnswered}
            onClick={() => onSelect(answer.id)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-5 py-4 text-left font-bold text-white transition-all duration-300",
              "animate-answer-reveal",
              !hasAnswered && "hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]",
              hasAnswered && "cursor-default"
            )}
            style={{
              ...stateStyle,
              animationDelay: `${index * 80}ms`,
              boxShadow: stateStyle.boxShadow ?? "0 4px 16px hsl(240 45% 10% / 0.4)",
            }}
          >
            {/* Letter badge */}
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black flex-shrink-0"
              style={{ background: "hsl(0 0% 0% / 0.2)" }}
            >
              {color.label}
            </span>
            <span className="text-sm md:text-base leading-snug flex-1">{answer.text}</span>
            {icon}
          </button>
        );
      })}
    </div>
  );
}
