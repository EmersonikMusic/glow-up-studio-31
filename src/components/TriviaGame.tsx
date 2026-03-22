import { useState, useCallback, useEffect, useRef } from "react";
import { questions } from "@/data/questions";
import GameHeader from "./GameHeader";
import QuestionCard from "./QuestionCard";
import AnswerGrid from "./AnswerGrid";
import GameFooter from "./GameFooter";
import ResultScreen from "./ResultScreen";
import StartScreen from "./StartScreen";
import AboutScreen from "./AboutScreen";
import type { GameSettings } from "./SettingsPanel";

type GameState = "start" | "about" | "playing" | "answered" | "finished";

const DEFAULT_SETTINGS: GameSettings = {
  numQuestions: 10,
  timePerQuestion: 5,
  timePerAnswer: 5,
  selectedCategories: [],
  selectedDifficulties: ["Average", "Hard"],
  selectedEras: ["1990s", "2000s", "2010s", "2020s"],
};

export default function TriviaGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>("start");
  const [animKey, setAnimKey] = useState(0);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [countdown, setCountdown] = useState<number>(DEFAULT_SETTINGS.timePerQuestion);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = questions[questionIndex];
  const isLast = questionIndex === questions.length - 1;

  // Clear any running interval
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start countdown for current question
  const startCountdown = useCallback((seconds: number) => {
    clearTimer();
    setCountdown(seconds);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  // When countdown hits 0 and we're still in "playing" state, auto-advance
  useEffect(() => {
    if (countdown === 0 && gameState === "playing") {
      // Time's up — treat as unanswered (no score, move on)
      setGameState("answered");
    }
  }, [countdown, gameState]);

  const handleApply = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
  }, []);

  const handleStart = useCallback(() => {
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setAnimKey((k) => k + 1);
    setGameState("playing");
    startCountdown(settings.timePerQuestion);
  }, [settings.timePerQuestion, startCountdown]);

  const handleSelect = useCallback(
    (id: string) => {
      if (gameState !== "playing") return;
      clearTimer();
      setSelected(id);
      if (id === currentQuestion.correctId) {
        setScore((prev) => prev + 1);
      }
      setGameState("answered");
    },
    [gameState, currentQuestion.correctId, clearTimer]
  );

  const handleNext = useCallback(() => {
    if (gameState !== "answered") return;
    if (isLast) {
      clearTimer();
      setGameState("finished");
    } else {
      setQuestionIndex((prev) => prev + 1);
      setSelected(null);
      setGameState("playing");
      setAnimKey((k) => k + 1);
      startCountdown(settings.timePerQuestion);
    }
  }, [gameState, isLast, clearTimer, startCountdown, settings.timePerQuestion]);

  const handleRestart = useCallback(() => {
    clearTimer();
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setGameState("start");
    setAnimKey((k) => k + 1);
  }, [clearTimer]);

  // Clean up on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  if (gameState === "about") {
    return <AboutScreen onClose={() => setGameState("start")} />;
  }

  if (gameState === "start") {
    return (
      <StartScreen
        onStart={handleStart}
        onAbout={() => setGameState("about")}
        onApply={handleApply}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "hsl(var(--game-bg))" }}
    >
      {/* Ambient light blobs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(280 60% 50% / 0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(210 70% 50% / 0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Header */}
      <GameHeader
        score={score}
        questionIndex={gameState === "finished" ? questions.length : questionIndex}
        totalQuestions={questions.length}
      />

      {gameState === "finished" ? (
        <ResultScreen score={score} total={questions.length} onRestart={handleRestart} />
      ) : (
        <>
          {/* Main content */}
          <main className="flex-1 flex flex-col justify-center gap-5 py-4">
            <QuestionCard
              question={currentQuestion}
              animKey={animKey}
              countdown={countdown}
              totalTime={settings.timePerQuestion}
              answered={gameState === "answered"}
            />
            {gameState === "answered" && (
              <AnswerGrid
                answers={currentQuestion.answers}
                selected={selected}
                correctId={currentQuestion.correctId}
                onSelect={handleSelect}
              />
            )}
          </main>

          {/* Footer */}
          <GameFooter
            question={currentQuestion}
            questionIndex={questionIndex}
            totalQuestions={questions.length}
            canAdvance={gameState === "answered"}
            isLast={isLast}
            onNext={handleNext}
          />
        </>
      )}
    </div>
  );
}
