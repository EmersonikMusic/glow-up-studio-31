import { Question } from "@/data/questions";
import { Pause } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  animKey: number;
  countdown: number;
  totalTime: number;
  answered: boolean;
  correctAnswer?: string;
  answerCountdown?: number | null;
  totalAnswerTime?: number;
  paused?: boolean;
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
  paused = false,
}: QuestionCardProps) {
  const progress = totalTime > 0 ? countdown / totalTime : 0;
  const isUrgent = countdown <= 5 && !answered;

  const answerProgress =
    answerCountdown !== null && answerCountdown !== undefined && totalAnswerTime > 0
      ? answerCountdown / totalAnswerTime
      : 1;

  // Arc drawing
  const size = 56;
  const strokeWidth = 4;
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
    <div
      key={animKey}
      className="w-full rounded-2xl flex flex-col justify-center gap-4 sm:gap-5 animate-slide-in-up md:h-full"
      style={{
        background: "hsl(var(--game-card))",
        border: "1.5px solid hsl(var(--game-card-border))",
        boxShadow: "0 8px 40px hsl(240 45% 10% / 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.06)",
        padding: "clamp(1rem, 4vw, 2.5rem)",
      }}
    >
      {/* Timer row */}
      <div className="flex items-center gap-3">
        {/* Circular arc timer */}
        <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
          >
            <circle
              cx={size / 2} cy={size / 2} r={r}
              fill="none" stroke="hsl(240 35% 22%)" strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2} cy={size / 2} r={r}
              fill="none"
              stroke={timerColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s ease" }}
            />
          </svg>
          <span
            className="relative z-10 font-black tabular-nums leading-none"
            style={{ fontSize: "1rem", color: timerTextColor, transition: "color 0.3s ease" }}
          >
            {paused ? <Pause className="w-4 h-4" /> : timerValue}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {paused ? "paused" : answered ? "next in" : "seconds left"}
          </span>
          {/* Thin progress bar under the label */}
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ width: 80, background: "hsl(240 35% 22%)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${(answered ? answerProgress : progress) * 100}%`,
                background: timerColor,
                transition: "width 0.9s linear, background 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Category badge — pushed right */}
        <div className="ml-auto flex items-center gap-2">
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
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: "hsl(var(--game-card-border))" }} />

      {/* Question text */}
      <p
        className="leading-relaxed font-semibold"
        style={{
          fontFamily: "'Nunito', sans-serif",
          textWrap: "balance",
          color: answered ? "hsl(0 0% 55%)" : "hsl(0 0% 97%)",
          fontSize: answered
            ? "clamp(0.8rem, 1.5vw, 0.95rem)"
            : "clamp(1.1rem, 2.5vw, 1.6rem)",
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
            className="leading-relaxed font-semibold animate-answer-reveal"
            style={{
              fontFamily: "'Nunito', sans-serif",
              textWrap: "balance",
              color: "hsl(0 0% 97%)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
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
