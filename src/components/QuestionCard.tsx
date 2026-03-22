import { Question } from "@/data/questions";
import olivia from "@/assets/olivia-character.png";

interface QuestionCardProps {
  question: Question;
  animKey: number;
  countdown: number;
  totalTime: number;
  answered: boolean;
  correctAnswer?: string;
  answerCountdown?: number | null;
  totalAnswerTime?: number;
}

export default function QuestionCard({
  question,
  animKey,
  countdown,
  totalTime,
  answered,
  correctAnswer,
  answerCountdown,
  totalAnswerTime = 5,
}: QuestionCardProps) {
  const progress = totalTime > 0 ? countdown / totalTime : 0;
  const isUrgent = countdown <= 5 && !answered;

  // Answer countdown progress
  const answerProgress =
    answerCountdown !== null && answerCountdown !== undefined && totalAnswerTime > 0
      ? answerCountdown / totalAnswerTime
      : 1;

  // Arc drawing for circular countdown
  const size = 48;
  const strokeWidth = 3.5;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  const dashOffset = answered
    ? circumference * (1 - answerProgress)
    : circumference * (1 - progress);

  const timerValue = answered ? (answerCountdown ?? 0) : countdown;
  const timerColor = answered
    ? "hsl(185 70% 50%)"
    : isUrgent
    ? "hsl(0 80% 60%)"
    : "hsl(185 70% 50%)";
  const timerTextColor = answered
    ? "hsl(185 70% 65%)"
    : isUrgent
    ? "hsl(0 80% 65%)"
    : "hsl(185 70% 65%)";

  return (
    <div className="relative flex items-stretch gap-4 px-6 md:px-8">
      {/* Question card */}
      <div
        key={animKey}
        className="flex-1 flex flex-col rounded-2xl animate-slide-in-up"
        style={{
          background: "hsl(var(--game-card))",
          border: "1.5px solid hsl(var(--game-card-border))",
          boxShadow: "0 8px 40px hsl(240 45% 10% / 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.06)",
          minHeight: answered ? 100 : 220,
          padding: answered ? "1.25rem 2rem" : "2rem 2.5rem",
          transition: "min-height 0.4s ease, padding 0.4s ease",
        }}
      >
        {/* Countdown row — question timer OR answer timer */}
        <div className="flex items-center gap-3 mb-4 self-start">
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
                stroke={timerColor}
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
                color: timerTextColor,
                transition: "color 0.3s ease",
              }}
            >
              {timerValue}
            </span>
          </div>
          <span
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            seconds
          </span>
        </div>

        {/* Question text — shrinks and dims when answered */}
        <div className={`flex items-center ${answered ? "justify-start" : "justify-center"} flex-1`}>
          <p
            className="leading-relaxed font-semibold"
            style={{
              fontFamily: "'Nunito', sans-serif",
              textWrap: "balance",
              color: answered ? "hsl(0 0% 50%)" : "hsl(0 0% 97%)",
              fontSize: answered ? "0.8rem" : "clamp(1.1rem, 2vw, 1.5rem)",
              transition: "font-size 0.4s ease, color 0.4s ease",
            }}
          >
            {question.text}
          </p>
        </div>

        {/* Correct answer reveal */}
        {answered && correctAnswer && (
          <div
            className="mt-4 px-5 py-3 rounded-xl font-black text-xl animate-answer-reveal"
            style={{
              background: "hsl(var(--game-correct))",
              color: "hsl(0 0% 100%)",
              boxShadow: "0 0 0 2px hsl(140 65% 60%), 0 4px 20px hsl(140 60% 40% / 0.35)",
              letterSpacing: "-0.01em",
            }}
          >
            {correctAnswer}
          </div>
        )}
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
