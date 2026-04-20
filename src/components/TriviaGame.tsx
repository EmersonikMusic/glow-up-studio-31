import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Question } from "@/data/questions";
import { categoryColors } from "@/data/categoryColors";
import { fetchAndStartGame } from "@/lib/triviaApi";
import GameHeader from "./GameHeader";
import QuestionCard from "./QuestionCard";
import GameFooter from "./GameFooter";
import ResultScreen from "./ResultScreen";
import StartScreen from "./StartScreen";
import AboutScreen from "./AboutScreen";
import HowToPlayScreen from "./HowToPlayScreen";
import SettingsPanel from "./SettingsPanel";
import LoginScreen from "./LoginScreen";
import type { GameSettings } from "./SettingsPanel";
import mascotImg from "@/assets/Mascot.svg";
import { getMascotForCategory } from "@/data/categoryMascots";

type GameState = "start" | "about" | "playing" | "answered" | "finished";

const ALL_CATEGORIES = [
  "Art", "Economy", "Food & Drink", "Games", "Geography", "History",
  "Human Body", "Language", "Law", "Literature", "Math", "Miscellaneous",
  "Movies", "Music", "Nature", "Performing Arts", "Philosophy", "Politics",
  "Pop Culture", "Science", "Sports", "Technology", "Television", "Theology",
  "Video Games",
];
const ALL_DIFFICULTIES = ["Casual", "Easy", "Average", "Hard", "Genius"];
const ALL_ERAS = [
  "Pre-1500", "1500-1800", "1800-1900", "1900-1950", "1950s", "1960s",
  "1970s", "1980s", "1990s", "2000s", "2010s", "2020s",
];

const DEFAULT_SETTINGS: GameSettings = {
  numQuestions: 10,
  timePerQuestion: 5,
  timePerAnswer: 5,
  selectedCategories: [...ALL_CATEGORIES],
  selectedDifficulties: [...ALL_DIFFICULTIES],
  selectedEras: [...ALL_ERAS],
};

export default function TriviaGame() {
  const isMobile = useIsMobile();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState>("start");
  const [animKey, setAnimKey] = useState(0);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [countdown, setCountdown] = useState<number>(DEFAULT_SETTINGS.timePerQuestion);
  const [answerCountdown, setAnswerCountdown] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [panelOpen, setPanelOpen] = useState(() => !window.matchMedia("(max-width: 767px)").matches);
  const [showLogin, setShowLogin] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

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
        setGameState("playing");
        setAnimKey((k) => k + 1);
        startCountdown(settings.timePerQuestion);
      }
    }
  }, [answerCountdown, gameState, isLast, clearAnswerTimer, startCountdown, settings.timePerQuestion]);

  const handleTogglePause = useCallback(() => {
    setPaused((prev) => !prev);
  }, []);

  const handleApply = useCallback(async (newSettings: GameSettings) => {
    setSettings(newSettings);
    const wasInGame =
      gameStateRef.current === "playing" || gameStateRef.current === "answered";
    if (!wasInGame) return;

    // Seamless restart with new settings
    clearTimer();
    clearAnswerTimer();
    setLoading(true);
    try {
      const data = await fetchAndStartGame(newSettings);
      if (!data.length) {
        toast.error("No questions matched your filters. Try widening them.");
        return;
      }
      setActiveQuestions(data);
      setQuestionIndex(0);
      setScore(0);
      setAnimKey((k) => k + 1);
      setPaused(false);
      setPanelOpen(false);
      setGameState("playing");
      startCountdown(newSettings.timePerQuestion);
    } catch (err) {
      console.error("fetchAndStartGame failed:", err);
      toast.error("Couldn't load questions. Check your connection or try again.");
    } finally {
      setLoading(false);
    }
  }, [clearTimer, clearAnswerTimer, startCountdown]);

  const handleStart = useCallback(async () => {
    if (loading) return;
    clearAnswerTimer();
    setLoading(true);
    try {
      const data = await fetchAndStartGame(settings);
      if (!data.length) {
        toast.error("No questions matched your filters. Try widening them.");
        return;
      }
      setActiveQuestions(data);
      setQuestionIndex(0);
      setScore(0);
      setAnimKey((k) => k + 1);
      setPaused(false);
      setPanelOpen(false);
      setGameState("playing");
      startCountdown(settings.timePerQuestion);
    } catch (err) {
      console.error("fetchAndStartGame failed:", err);
      toast.error("Couldn't load questions. Check your connection or try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, settings, startCountdown, clearAnswerTimer]);

  const handleNext = useCallback(() => {
    if (gameState !== "answered") return;
    clearAnswerTimer();
    if (isLast) {
      setGameState("finished");
    } else {
      setQuestionIndex((prev) => prev + 1);
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
    setScore(0);
    setGameState("start");
    setPanelOpen(!window.matchMedia("(max-width: 767px)").matches);
    setAnimKey((k) => k + 1);
  }, [clearTimer, clearAnswerTimer]);

  useEffect(() => () => { clearTimer(); clearAnswerTimer(); }, [clearTimer, clearAnswerTimer]);

  if (gameState === "about") {
    return (
      <>
        <StartScreen
          onStart={handleStart}
          onAbout={() => setGameState("about")}
          onLogin={() => setShowLogin(true)}
          onHowToPlay={() => setShowHowToPlay(true)}
          onApply={handleApply}
          panelOpen={panelOpen}
          onPanelToggle={() => setPanelOpen((v) => !v)}
          onPanelClose={() => setPanelOpen(false)}
          loading={loading}
        />
        <AboutScreen onClose={() => setGameState("start")} />
        {showLogin && <LoginScreen onClose={() => setShowLogin(false)} />}
        {showHowToPlay && <HowToPlayScreen onClose={() => setShowHowToPlay(false)} />}
      </>
    );
  }

  if (gameState === "start") {
    return (
      <>
        <StartScreen
          onStart={handleStart}
          onAbout={() => setGameState("about")}
          onLogin={() => setShowLogin(true)}
          onHowToPlay={() => setShowHowToPlay(true)}
          onApply={handleApply}
          panelOpen={panelOpen}
          onPanelToggle={() => setPanelOpen((v) => !v)}
          onPanelClose={() => setPanelOpen(false)}
          loading={loading}
        />
        {showLogin && <LoginScreen onClose={() => setShowLogin(false)} />}
        {showHowToPlay && <HowToPlayScreen onClose={() => setShowHowToPlay(false)} />}
      </>
    );
  }

  const bgGradient = currentQuestion && gameState !== "finished" ? categoryColors[currentQuestion.category] : undefined;

  return (
    <div
      className="min-h-screen grid grid-rows-[auto_1fr_auto] relative overflow-hidden"
      style={{
        background: bgGradient || "hsl(var(--game-bg))",
        transition: "background 0.6s ease",
      }}
    >

      {/* Row 1: Header */}
      <GameHeader
        onSettingsToggle={() => setPanelOpen((v) => !v)}
        onAbout={() => setGameState("about")}
        onLogin={() => setShowLogin(true)}
        settingsOpen={panelOpen}
      />

      {/* Row 2: Main content */}
      {gameState === "finished" ? (
        <ResultScreen onRestart={handleRestart} />
      ) : (
        <main className="relative flex items-center md:items-stretch h-full py-2 sm:py-6 px-2 sm:px-6 md:px-8 w-full max-w-none mx-auto overflow-visible">
          {/* Game area */}
          <div className="flex-none flex flex-col justify-center md:h-full w-full md:w-[70%]">
            <QuestionCard
              question={currentQuestion}
              animKey={animKey}
              answered={gameState === "answered"}
              correctAnswer={
                gameState === "answered"
                  ? currentQuestion.answers.find((a) => a.id === currentQuestion.correctId)?.text
                  : undefined
              }
            />
          </div>

          {/* Right column — mascot, hidden on mobile, 30% on desktop */}
          <div
            className="hidden md:flex flex-none flex-col items-center justify-center overflow-visible self-stretch"
            style={{
              width: "30%",
              transition: "opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
              opacity: panelOpen ? 0 : 1,
              pointerEvents: panelOpen ? "none" : "auto",
            }}
          >
            <div
              className="relative flex items-center justify-center"
              style={{
                width: "clamp(140px, 18vw, 240px)",
                height: "clamp(140px, 18vw, 240px)",
                animation: "float 3s ease-in-out infinite",
                animationPlayState: paused ? "paused" : "running",
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: "rgb(125, 223, 232)" }}
              />
              <img
                src={getMascotForCategory(currentQuestion.category)}
                alt="TrivOlivia mascot"
                className="relative z-10 w-[85%] h-auto object-contain drop-shadow-xl transition-opacity duration-300"
                style={{ marginBottom: "-2%" }}
                draggable={false}
              />
            </div>
          </div>

          {/* Mobile mascot — bottom-right overlay */}
          <div
            className="md:hidden absolute bottom-0 right-0 pointer-events-none z-10 flex items-end justify-center"
            style={{
              width: "clamp(110px, 32vw, 160px)",
              height: "clamp(110px, 32vw, 160px)",
              animation: "float 3s ease-in-out infinite",
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "rgb(125, 223, 232)" }}
            />
            <img
              src={mascotImg}
              alt="TrivOlivia mascot"
              className="relative z-10 w-[85%] h-auto object-contain drop-shadow-xl"
              style={{ marginBottom: "-2%" }}
              draggable={false}
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
          countdown={countdown}
          totalQuestionTime={settings.timePerQuestion}
          answerCountdown={answerCountdown}
          totalAnswerTime={settings.timePerAnswer}
          paused={paused}
          onTogglePause={handleTogglePause}
        />
      )}

      {/* Settings panel */}
      <SettingsPanel
        open={panelOpen}
        onToggle={() => setPanelOpen((v) => !v)}
        onClose={() => setPanelOpen(false)}
        onApply={handleApply}
        gameInProgress={gameState === "playing" || gameState === "answered"}
        currentSettings={settings}
      />

      {/* Login modal */}
      {showLogin && <LoginScreen onClose={() => setShowLogin(false)} />}
    </div>
  );
}
