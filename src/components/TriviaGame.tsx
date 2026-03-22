import { useState, useCallback, useEffect, useRef } from "react";
import { questions } from "@/data/questions";
import GameHeader from "./GameHeader";
import QuestionCard from "./QuestionCard";

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

function pickRandomQuestions(pool: typeof questions, settings: GameSettings) {
  const { numQuestions, selectedCategories, selectedDifficulties, selectedEras } = settings;

  const filtered = pool.filter((q) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(q.category);
    const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(q.difficulty);
    const eraMatch = selectedEras.length === 0 || selectedEras.includes(q.era);
    return categoryMatch && difficultyMatch && eraMatch;
  });

  // Fall back to full pool if filters yield nothing
  const pool2 = filtered.length > 0 ? filtered : pool;
  const shuffled = [...pool2].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
}

export default function TriviaGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState(() =>
    pickRandomQuestions(questions, DEFAULT_SETTINGS)
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>("start");
  const [animKey, setAnimKey] = useState(0);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [countdown, setCountdown] = useState<number>(DEFAULT_SETTINGS.timePerQuestion);
  const [answerCountdown, setAnswerCountdown] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answerTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = activeQuestions[questionIndex];
  const isLast = questionIndex === activeQuestions.length - 1;

  // Clear question timer
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Clear answer timer
  const clearAnswerTimer = useCallback(() => {
    if (answerTimerRef.current !== null) {
      clearInterval(answerTimerRef.current);
      answerTimerRef.current = null;
    }
    setAnswerCountdown(null);
  }, []);

  // Start question countdown
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

  // Start answer countdown
  const startAnswerCountdown = useCallback((seconds: number) => {
    clearAnswerTimer();
    setAnswerCountdown(seconds);
    answerTimerRef.current = setInterval(() => {
      setAnswerCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(answerTimerRef.current!);
          answerTimerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearAnswerTimer]);

  // When question countdown hits 0, transition to answered
  useEffect(() => {
    if (countdown === 0 && gameState === "playing") {
      setGameState("answered");
    }
  }, [countdown, gameState]);

  // When game becomes answered, start the answer timer
  useEffect(() => {
    if (gameState === "answered") {
      startAnswerCountdown(settings.timePerAnswer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // When answer countdown hits 0, auto-advance
  useEffect(() => {
    if (answerCountdown === 0 && gameState === "answered") {
      clearAnswerTimer();
      if (isLast) {
        setGameState("finished");
      } else {
        setQuestionIndex((prev) => prev + 1);
        setSelected(null);
        setGameState("playing");
        setAnimKey((k) => k + 1);
        startCountdown(settings.timePerQuestion);
      }
    }
  }, [answerCountdown, gameState, isLast, clearAnswerTimer, startCountdown, settings.timePerQuestion]);

  const handleApply = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
  }, []);

  const handleStart = useCallback(() => {
    clearAnswerTimer();
    const picked = pickRandomQuestions(questions, settings);
    setActiveQuestions(picked);
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setAnimKey((k) => k + 1);
    setGameState("playing");
    startCountdown(settings.timePerQuestion);
  }, [settings.numQuestions, settings.timePerQuestion, startCountdown, clearAnswerTimer]);

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
    clearAnswerTimer();
    if (isLast) {
      setGameState("finished");
    } else {
      setQuestionIndex((prev) => prev + 1);
      setSelected(null);
      setGameState("playing");
      setAnimKey((k) => k + 1);
      startCountdown(settings.timePerQuestion);
    }
  }, [gameState, isLast, clearAnswerTimer, startCountdown, settings.timePerQuestion]);

  const handleRestart = useCallback(() => {
    clearTimer();
    clearAnswerTimer();
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setGameState("start");
    setAnimKey((k) => k + 1);
  }, [clearTimer, clearAnswerTimer]);

  // Clean up on unmount
  useEffect(() => () => { clearTimer(); clearAnswerTimer(); }, [clearTimer, clearAnswerTimer]);

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
        questionIndex={gameState === "finished" ? activeQuestions.length : questionIndex}
        totalQuestions={activeQuestions.length}
      />

      {gameState === "finished" ? (
        <ResultScreen score={score} total={activeQuestions.length} onRestart={handleRestart} />
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
              correctAnswer={
                gameState === "answered"
                  ? currentQuestion.answers.find((a) => a.id === currentQuestion.correctId)?.text
                  : undefined
              }
              answerCountdown={answerCountdown}
              totalAnswerTime={settings.timePerAnswer}
            />
          </main>

          {/* Footer */}
          <GameFooter
            question={currentQuestion}
            questionIndex={questionIndex}
            totalQuestions={activeQuestions.length}
            canAdvance={gameState === "answered"}
            isLast={isLast}
            onNext={handleNext}
            answerCountdown={answerCountdown}
            totalAnswerTime={settings.timePerAnswer}
          />
        </>
      )}
    </div>
  );
}
