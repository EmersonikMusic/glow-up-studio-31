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
      className="w-full rounded-2xl flex flex-col justify-center items-center animate-slide-in-up h-full backdrop-blur-xl"
      style={{
        background: "rgba(0, 0, 0, 0.45)",
        border: "1.5px solid rgba(255, 255, 255, 0.18)",
        boxShadow: "0 12px 48px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.25)",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        gap: 0,
      }}
    >

      {/* Question text — smooth shrink via CSS scale transform instead of font-size */}
      <p
        className="leading-relaxed font-body font-semibold text-center w-full"
        style={{
          textWrap: "balance",
          color: answered ? "hsl(0 0% 60%)" : "hsl(0 0% 97%)",
          fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)",
          transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), color 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease",
          transform: answered ? "scale(0.65)" : "scale(1)",
          transformOrigin: "center center",
          opacity: answered ? 0.7 : 1,
          lineHeight: 1.5,
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
            className="w-2/3 mx-auto animate-answer-reveal"
            style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
              margin: "clamp(1rem, 2.5vw, 1.5rem) auto",
            }}
          />

          <p
            className="leading-relaxed font-body font-semibold animate-answer-reveal text-center w-full"
            style={{
              textWrap: "balance",
              color: "hsl(0 0% 97%)",
              fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)",
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
  );
}
