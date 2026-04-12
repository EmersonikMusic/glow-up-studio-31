import { useState, useCallback, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { questions } from "@/data/questions";
import GameHeader from "./GameHeader";
import QuestionCard from "./QuestionCard";
import GameFooter from "./GameFooter";
import ResultScreen from "./ResultScreen";
import StartScreen from "./StartScreen";
import AboutScreen from "./AboutScreen";
import SettingsPanel from "./SettingsPanel";
import type { GameSettings } from "./SettingsPanel";
import mascotImg from "@/assets/Mascot.svg";

type GameState = "start" | "about" | "playing" | "answered" | "finished";

const DEFAULT_SETTINGS: GameSettings = {
  numQuestions: 10,
  timePerQuestion: 5,
  timePerAnswer: 5,
  selectedCategories: [],
  selectedDifficulties: [],
  selectedEras: [],
};

function pickRandomQuestions(pool: typeof questions, settings: GameSettings) {
  const { numQuestions, selectedCategories, selectedDifficulties, selectedEras } = settings;
  const filtered = pool.filter((q) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(q.category);
    const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(q.difficulty);
    const eraMatch = selectedEras.length === 0 || selectedEras.includes(q.era);
    return categoryMatch && difficultyMatch && eraMatch;
  });
  const pool2 = filtered.length > 0 ? filtered : pool;
  const shuffled = [...pool2].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
}

export default function TriviaGame() {
  const isMobile = useIsMobile();
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
  const [paused, setPaused] = useState(false);
  const [panelOpen, setPanelOpen] = useState(() => !window.matchMedia("(max-width: 767px)").matches);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answerTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const gameStateRef = useRef<GameState>("start");

  const currentQuestion = activeQuestions[questionIndex];
  const isLast = questionIndex === activeQuestions.length - 1;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const clearAnswerTimer = useCallback(() => {
    if (answerTimerRef.current !== null) { clearInterval(answerTimerRef.current); answerTimerRef.current = null; }
    setAnswerCountdown(null);
  }, []);

  const startCountdown = useCallback((seconds: number) => {
    clearTimer();
    setCountdown(seconds);
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); timerRef.current = null; return 0; }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  const startAnswerCountdown = useCallback((seconds: number) => {
    clearAnswerTimer();
    setAnswerCountdown(seconds);
    answerTimerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setAnswerCountdown((prev) => {
        if (prev === null || prev <= 1) { clearInterval(answerTimerRef.current!); answerTimerRef.current = null; return 0; }
        return prev - 1;
      });
    }, 1000);
  }, [clearAnswerTimer]);

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    if (countdown === 0 && gameState === "playing") setGameState("answered");
  }, [countdown, gameState]);

  useEffect(() => {
    if (gameState === "answered") startAnswerCountdown(settings.timePerAnswer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

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

  const handleTogglePause = useCallback(() => {
    setPaused((prev) => !prev);
  }, []);

  const handleApply = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
  }, []);

  const handleStart = useCallback(() => {
    clearAnswerTimer();
    setPaused(false);
    setPanelOpen(false);
    const picked = pickRandomQuestions(questions, settings);
    setActiveQuestions(picked);
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setAnimKey((k) => k + 1);
    setGameState("playing");
    startCountdown(settings.timePerQuestion);
  }, [settings, startCountdown, clearAnswerTimer]);

  const handleSelect = useCallback(
    (id: string) => {
      if (gameState !== "playing") return;
      clearTimer();
      setSelected(id);
      if (id === currentQuestion.correctId) setScore((prev) => prev + 1);
      setGameState("answered");
    },
    [gameState, currentQuestion?.correctId, clearTimer]
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
    setPaused(false);
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setGameState("start");
    setPanelOpen(!window.matchMedia("(max-width: 767px)").matches);
    setAnimKey((k) => k + 1);
  }, [clearTimer, clearAnswerTimer]);

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
        panelOpen={panelOpen}
        onPanelToggle={() => setPanelOpen((v) => !v)}
        onPanelClose={() => setPanelOpen(false)}
      />
    );
  }

  return (
    <div
      className="min-h-screen grid grid-rows-[auto_1fr_auto] relative overflow-hidden"
      style={{ background: "hsl(var(--game-bg))" }}
    >
      {/* Ambient blobs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(280 60% 50% / 0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(210 70% 50% / 0.1) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      {/* Row 1: Header */}
      <GameHeader
        score={score}
        questionIndex={gameState === "finished" ? activeQuestions.length - 1 : questionIndex}
        totalQuestions={activeQuestions.length}
      />

      {/* Row 2: Main content */}
      {gameState === "finished" ? (
        <ResultScreen score={score} total={activeQuestions.length} onRestart={handleRestart} />
      ) : (
        <main className="flex items-stretch h-full py-3 sm:py-6 px-3 sm:px-6 md:px-8 w-full max-w-none mx-auto overflow-hidden">
          {/* Game area — 100% on mobile, 70% on desktop */}
          <div className="flex-none flex flex-col justify-center h-full w-full md:w-[70%]">
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
              paused={paused}
            />
          </div>

          {/* Right column — hidden on mobile, 30% on desktop */}
          <div
            className="hidden md:flex flex-none flex-col items-center justify-center overflow-hidden self-stretch"
            style={{
              width: "30%",
              transition: "opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
              opacity: panelOpen ? 0 : 1,
              pointerEvents: panelOpen ? "none" : "auto",
            }}
          >
            <img
              src={mascotImg}
              alt="TrivOlivia mascot"
              className="w-full h-auto object-contain drop-shadow-xl"
              style={{
                maxHeight: "clamp(220px, 40vh, 420px)",
                maxWidth: "clamp(160px, 22vw, 300px)",
                animation: "float 3s ease-in-out infinite",
                animationPlayState: paused ? "paused" : "running",
              }}
            />
          </div>
        </main>
      )}

      {/* Row 3: Footer */}
      {gameState !== "finished" && (
        <GameFooter
          question={currentQuestion}
          questionIndex={questionIndex}
          totalQuestions={activeQuestions.length}
          canAdvance={gameState === "answered"}
          isLast={isLast}
          onNext={handleNext}
          answerCountdown={answerCountdown}
          totalAnswerTime={settings.timePerAnswer}
          selected={selected}
          onSelect={handleSelect}
          paused={paused}
          onTogglePause={handleTogglePause}
        />
      )}

      {/* Settings panel — slides over the right 30% */}
      <SettingsPanel
        open={panelOpen}
        onToggle={() => setPanelOpen((v) => !v)}
        onClose={() => setPanelOpen(false)}
        onApply={handleApply}
      />
    </div>
  );
}
