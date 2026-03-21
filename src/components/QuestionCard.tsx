import { Question } from "@/data/questions";
import olivia from "@/assets/olivia-character.png";

interface QuestionCardProps {
  question: Question;
  animKey: number;
}

export default function QuestionCard({ question, animKey }: QuestionCardProps) {
  return (
    <div className="relative flex items-stretch gap-4 px-6 md:px-8">
      {/* Question card */}
      <div
        key={animKey}
        className="flex-1 flex items-center justify-center rounded-2xl p-8 md:p-10 animate-slide-in-up"
        style={{
          background: "hsl(var(--game-card))",
          border: "1.5px solid hsl(var(--game-card-border))",
          boxShadow: "0 8px 40px hsl(240 45% 10% / 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.06)",
          minHeight: 220,
        }}
      >
        <p
          className="text-center text-xl md:text-2xl font-semibold leading-relaxed"
          style={{
            fontFamily: "'Nunito', sans-serif",
            textWrap: "balance",
            color: "hsl(0 0% 97%)",
          }}
        >
          {question.text}
        </p>
      </div>

      {/* Olivia character — overlapping right side on md+ */}
      <div className="hidden md:flex flex-col items-center justify-end flex-shrink-0 w-36 relative">
        <div
          className="absolute inset-0 rounded-full animate-float"
          style={{
            background: "radial-gradient(circle at center, hsl(200 60% 70% / 0.25) 0%, transparent 70%)",
            top: "auto",
            height: "160px",
            bottom: 0,
          }}
        />
        <img
          src={olivia}
          alt="Olivia the explorer"
          className="relative z-10 w-36 h-36 object-contain animate-float drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 8px 24px hsl(200 60% 50% / 0.4))" }}
        />
      </div>
    </div>
  );
}
