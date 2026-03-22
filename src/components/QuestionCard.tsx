import { Question } from "@/data/questions";
import olivia from "@/assets/olivia-character.png";

interface QuestionCardProps {
  question: Question;
  animKey: number;
  countdown: number;
  totalTime: number;
  answered: boolean;
}

export default function QuestionCard({ question, animKey, countdown, totalTime, answered }: QuestionCardProps) {
  const progress = totalTime > 0 ? countdown / totalTime : 0;
  const isUrgent = countdown <= 5 && !answered;

  // Arc drawing for circular countdown
  const size = 48;
  const strokeWidth = 3.5;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative flex items-stretch gap-4 px-6 md:px-8">
      {/* Question card */}
      <div
        key={animKey}
        className="flex-1 flex flex-col rounded-2xl p-8 md:p-10 animate-slide-in-up"
        style={{
          background: "hsl(var(--game-card))",
          border: "1.5px solid hsl(var(--game-card-border))",
          boxShadow: "0 8px 40px hsl(240 45% 10% / 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.06)",
          minHeight: 220,
        }}
      >
        {/* Countdown row */}
        {!answered && (
          <div className="flex items-center gap-3 mb-5 self-start">
            {/* Circular arc timer */}
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
              {/* Background ring */}
              <svg
                width={size}
                height={size}
                style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
              >
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke="hsl(240 35% 22%)"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={isUrgent ? "hsl(0 80% 60%)" : "hsl(185 70% 50%)"}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s ease" }}
                />
              </svg>
              {/* Number */}
              <span
                className="relative z-10 font-black tabular-nums leading-none"
                style={{
                  fontSize: "0.95rem",
                  color: isUrgent ? "hsl(0 80% 65%)" : "hsl(185 70% 65%)",
                  transition: "color 0.3s ease",
                }}
              >
                {countdown}
              </span>
            </div>
            <span
              className="text-[10px] font-black tracking-widest uppercase"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              seconds
            </span>
          </div>
        )}

        {/* Question text — centred vertically when answered */}
        <div className="flex flex-1 items-center justify-center">
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
