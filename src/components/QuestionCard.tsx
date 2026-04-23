import { Question } from "@/data/questions";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuestionCardProps {
  question: Question;
  animKey: number;
  answered: boolean;
  correctAnswer?: string;
}

export default function QuestionCard({
  question,
  animKey,
  answered,
  correctAnswer,
}: QuestionCardProps) {
  const isMobile = useIsMobile();

  return (
    <div
      key={animKey}
      data-testid="question-card"
      className="w-full rounded-2xl flex flex-col justify-start md:justify-center items-center animate-slide-in-up h-full backdrop-blur-xl min-h-0 overflow-hidden p-[28px] md:pt-[clamp(0.75rem,2.5vw,2.5rem)] md:pb-[clamp(0.75rem,2.5vw,2.5rem)] md:px-[clamp(0.875rem,3vw,2.5rem)]"
      style={{
        background: "rgba(0, 0, 0, 0.45)",
        border: "1.5px solid rgba(255, 255, 255, 0.18)",
        boxShadow: "0 12px 48px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.25)",
        gap: 0,
      }}
    >
      {/* Inner text wrapper — pushes content above the mascot's animated peak on mobile */}
      <div className="w-full flex flex-col items-center mt-[12px] mb-[165px] md:mt-0 md:mb-0">
        {/* Question text */}
        <p
          className="font-body font-semibold text-center w-full text-[clamp(1.25rem,3.6vw,2.4rem)] md:text-[clamp(1.6rem,4.5vw,2.4rem)] leading-[1.4] md:leading-[1.5]"
          style={{
            textWrap: "balance",
            color: answered ? "hsl(0 0% 60%)" : "hsl(0 0% 97%)",
            transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), font-size 0.8s cubic-bezier(0.16, 1, 0.3, 1), color 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease",
            // Mobile: shrink via font-size to preserve full width (matches answer's side padding).
            // Desktop/tablet: keep existing scale transform behavior.
            transform: isMobile ? "none" : answered ? "scale(0.65)" : "scale(1)",
            transformOrigin: "center center",
            fontSize: isMobile && answered ? "clamp(0.95rem, 2.7vw, 1.8rem)" : undefined,
            opacity: answered ? 0.7 : 1,
            marginBottom: 0,
          }}
        >
          {question.text}
        </p>

        {/* Correct answer reveal */}
        {answered && correctAnswer && (
          <>
            {/* Divider between question and answer */}
            <div
              className="w-2/3 mx-auto animate-answer-reveal my-[clamp(0.5rem,1.5vw,1rem)] md:my-[clamp(1rem,2.5vw,1.5rem)]"
              style={{
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
              }}
            />

            <p
              className="leading-relaxed font-body font-semibold animate-answer-reveal text-center w-full text-[clamp(1.25rem,3.6vw,2.4rem)] md:text-[clamp(1.6rem,4.5vw,2.4rem)] leading-[1.4] md:leading-[1.45]"
              style={{
                textWrap: "balance",
                color: "hsl(0 0% 97%)",
              }}
            >
              {correctAnswer}
            </p>
          </>
        )}

        {/* Time's up indicator when timer expired without answer */}
        {answered && !correctAnswer && (
          <div
            className="rounded-xl px-5 py-3 animate-answer-reveal mt-6"
            style={{
              background: "hsl(var(--game-wrong) / 0.25)",
              border: "1px solid hsl(var(--game-wrong) / 0.5)",
            }}
          >
            <p
              className="text-sm font-subheading font-bold"
              style={{ color: "hsl(0 70% 70%)" }}
            >
              Time's up!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
