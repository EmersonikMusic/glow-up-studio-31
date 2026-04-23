import { Question } from "@/data/questions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLayoutEffect, useRef, useState } from "react";

interface QuestionCardProps {
  question: Question;
  animKey: number;
  answered: boolean;
  correctAnswer?: string;
}

const FONT_SCALE_FLOOR = 0.7;
const FONT_SCALE_STEP = 0.05;

export default function QuestionCard({
  question,
  animKey,
  answered,
  correctAnswer,
}: QuestionCardProps) {
  const isMobile = useIsMobile();

  const questionRef = useRef<HTMLParagraphElement | null>(null);
  const answerRef = useRef<HTMLParagraphElement | null>(null);
  const questionContainerRef = useRef<HTMLDivElement | null>(null);
  const answerContainerRef = useRef<HTMLDivElement | null>(null);

  const [qFontScale, setQFontScale] = useState(1);
  const [aFontScale, setAFontScale] = useState(1);

  // Auto-fit fallback: shrink font-size if content would overflow its band.
  useLayoutEffect(() => {
    if (!isMobile) {
      setQFontScale(1);
      return;
    }
    const el = questionRef.current;
    const container = questionContainerRef.current;
    if (!el || !container) return;

    let scale = 1;
    el.style.setProperty("--q-font-scale", String(scale));
    // Force a reflow read.
    while (
      scale > FONT_SCALE_FLOOR &&
      el.scrollHeight > container.clientHeight + 1
    ) {
      scale = Math.max(FONT_SCALE_FLOOR, scale - FONT_SCALE_STEP);
      el.style.setProperty("--q-font-scale", String(scale));
    }
    setQFontScale(scale);
  }, [question.text, isMobile, answered]);

  useLayoutEffect(() => {
    if (!isMobile || !answered || !correctAnswer) {
      setAFontScale(1);
      return;
    }
    const el = answerRef.current;
    const container = answerContainerRef.current;
    if (!el || !container) return;

    let scale = 1;
    el.style.setProperty("--a-font-scale", String(scale));
    while (
      scale > FONT_SCALE_FLOOR &&
      el.scrollHeight > container.clientHeight + 1
    ) {
      scale = Math.max(FONT_SCALE_FLOOR, scale - FONT_SCALE_STEP);
      el.style.setProperty("--a-font-scale", String(scale));
    }
    setAFontScale(scale);
  }, [correctAnswer, answered, isMobile]);

  const questionStyle: React.CSSProperties = {
    textWrap: "balance",
    color: answered ? "hsl(0 0% 60%)" : "hsl(0 0% 97%)",
    transition:
      "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.5s ease, opacity 0.5s ease",
    transform: answered ? (isMobile ? "scale(0.85)" : "scale(0.65)") : "scale(1)",
    transformOrigin: isMobile ? "bottom center" : "center center",
    opacity: answered ? 0.7 : 1,
    marginBottom: 0,
    ...(isMobile
      ? {
          fontSize: "calc(clamp(1.25rem, 3.6vw, 2.4rem) * var(--q-font-scale, 1))",
          ["--q-font-scale" as any]: String(qFontScale),
        }
      : {}),
  };

  const answerStyle: React.CSSProperties = {
    textWrap: "balance",
    color: "hsl(0 0% 97%)",
    ...(isMobile
      ? {
          fontSize: "calc(clamp(1.25rem, 3.6vw, 2.4rem) * var(--a-font-scale, 1))",
          ["--a-font-scale" as any]: String(aFontScale),
        }
      : {}),
  };

  return (
    <div
      key={animKey}
      data-testid="question-card"
      className="w-full rounded-2xl flex flex-col justify-start md:justify-center items-center animate-slide-in-up h-full backdrop-blur-xl min-h-0 overflow-hidden p-[28px] md:pt-[clamp(0.75rem,2.5vw,2.5rem)] md:pb-[clamp(0.75rem,2.5vw,2.5rem)] md:px-[clamp(0.875rem,3vw,2.5rem)]"
      style={{
        background: "rgba(0, 0, 0, 0.45)",
        border: "1.5px solid rgba(255, 255, 255, 0.18)",
        boxShadow:
          "0 12px 48px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.25)",
        gap: 0,
      }}
    >
      {isMobile ? (
        // ─── MOBILE: 3-zone anchored layout ─────────────────────────────
        <div className="w-full flex-1 flex flex-col items-center mt-[12px] mb-[165px] min-h-0">
          {/* Question zone — bottom-aligned to divider, grows upward */}
          <div
            ref={questionContainerRef}
            className="flex-[3] w-full flex items-end justify-center min-h-0 overflow-hidden"
          >
            <p
              ref={questionRef}
              className="font-body font-semibold text-center w-full leading-[1.4]"
              style={questionStyle}
            >
              {question.text}
            </p>
          </div>

          {/* Divider — anchored Y, fades in when answered */}
          <div
            className="w-2/3 my-[clamp(0.5rem,1.5vw,1rem)] flex-shrink-0"
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
              opacity: answered ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          />

          {/* Answer zone — top-aligned to divider, grows downward */}
          <div
            ref={answerContainerRef}
            className="flex-[2] w-full flex items-start justify-center min-h-0 overflow-hidden"
          >
            {answered && correctAnswer && (
              <p
                ref={answerRef}
                className="font-body font-semibold animate-answer-reveal text-center w-full leading-[1.4]"
                style={answerStyle}
              >
                {correctAnswer}
              </p>
            )}
            {answered && !correctAnswer && (
              <div
                className="rounded-xl px-5 py-3 animate-answer-reveal"
                style={{
                  background: "hsl(var(--game-wrong) / 0.25)",
                  border: "1px solid hsl(var(--game-wrong) / 0.5)",
                  alignSelf: "flex-start",
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
      ) : (
        // ─── DESKTOP / TABLET: original single-flow layout ──────────────
        <div className="w-full flex flex-col items-center">
          <p
            className="font-body font-semibold text-center w-full text-[clamp(1.6rem,4.5vw,2.4rem)] leading-[1.5]"
            style={questionStyle}
          >
            {question.text}
          </p>

          {answered && correctAnswer && (
            <>
              <div
                className="w-2/3 mx-auto animate-answer-reveal my-[clamp(1rem,2.5vw,1.5rem)]"
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                }}
              />
              <p
                className="leading-relaxed font-body font-semibold animate-answer-reveal text-center w-full text-[clamp(1.6rem,4.5vw,2.4rem)] leading-[1.45]"
                style={answerStyle}
              >
                {correctAnswer}
              </p>
            </>
          )}

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
      )}
    </div>
  );
}
