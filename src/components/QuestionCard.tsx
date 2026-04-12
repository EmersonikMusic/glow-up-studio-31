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
      className="w-full rounded-2xl flex flex-col justify-center items-center animate-slide-in-up md:h-full backdrop-blur-xl"
      style={{
        background: "rgba(0, 0, 0, 0.45)",
        border: "1.5px solid rgba(255, 255, 255, 0.18)",
        boxShadow: "0 12px 48px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.25)",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        gap: 0,
      }}
    >

      {/* Question text */}
      <p
        className="leading-relaxed font-semibold text-center w-full"
        style={{
          fontFamily: "'Nunito', sans-serif",
          textWrap: "balance",
          color: answered ? "hsl(0 0% 60%)" : "hsl(0 0% 97%)",
          fontSize: answered
            ? "clamp(0.85rem, 1.5vw, 1rem)"
            : "clamp(1.4rem, 3.5vw, 2.2rem)",
          transition: "font-size 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          lineHeight: 1.5,
          marginBottom: answered ? "0" : "0",
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
            className="leading-relaxed font-semibold animate-answer-reveal text-center w-full"
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
          className="rounded-xl px-5 py-3 animate-answer-reveal mt-6"
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
