import { Question } from "@/data/questions";

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
  return (
    <div
      key={animKey}
      className="w-full rounded-2xl flex flex-col justify-center items-start gap-4 sm:gap-5 animate-slide-in-up md:h-full backdrop-blur-xl"
      style={{
        background: "rgba(0, 0, 0, 0.45)",
        border: "1.5px solid rgba(255, 255, 255, 0.18)",
        boxShadow: "0 12px 48px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.25)",
        padding: "clamp(1rem, 4vw, 2.5rem)",
      }}
    >
      {/* Category badge */}
      <div className="flex items-center justify-end w-full">
        <span
          className="hidden sm:inline text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-lg"
          style={{
            background: "hsl(240 42% 15%)",
            color: "hsl(var(--muted-foreground))",
            border: "1px solid hsl(var(--game-card-border))",
          }}
        >
          {question.category}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: "hsl(var(--game-card-border))" }} />

      {/* Question text */}
      <p
        className="leading-relaxed font-semibold text-left w-full"
        style={{
          fontFamily: "'Nunito', sans-serif",
          textWrap: "balance",
          color: answered ? "hsl(0 0% 55%)" : "hsl(0 0% 97%)",
          fontSize: answered
            ? "clamp(1rem, 2vw, 1.2rem)"
            : "clamp(1.4rem, 3.5vw, 2.2rem)",
          transition: "font-size 0.4s ease, color 0.4s ease",
          lineHeight: 1.45,
        }}
      >
        {question.text}
      </p>

      {/* Correct answer reveal */}
      {answered && correctAnswer && (
        <>
          {/* Divider between question and answer */}
          <div className="h-px animate-answer-reveal" style={{ background: "hsl(var(--game-card-border))" }} />

          <p
            className="leading-relaxed font-semibold animate-answer-reveal text-left w-full"
            style={{
              fontFamily: "'Nunito', sans-serif",
              textWrap: "balance",
              color: "hsl(0 0% 97%)",
              fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
              lineHeight: 1.45,
            }}
          >
            {correctAnswer}
          </p>
        </>
      )}

      {/* Time's up indicator when timer expired without answer */}
      {answered && !correctAnswer && (
        <div
          className="rounded-xl px-5 py-3 animate-answer-reveal"
          style={{
            background: "hsl(var(--game-wrong) / 0.25)",
            border: "1px solid hsl(var(--game-wrong) / 0.5)",
          }}
        >
          <p
            className="text-sm font-black"
            style={{ color: "hsl(0 70% 70%)" }}
          >
            Time's up!
          </p>
        </div>
      )}
    </div>
  );
}
