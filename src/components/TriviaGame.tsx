import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Question } from "@/data/questions";
import { categoryColors } from "@/data/categoryColors";
import { fetchAndStartGame } from "@/lib/triviaApi";
import { DEFAULT_SETTINGS, type GameSettings } from "@/data/gameOptions";
import { useCountdown, useNullableCountdown } from "@/hooks/useCountdown";
import GameHeader from "./GameHeader";
import QuestionCard from "./QuestionCard";
import GameFooter from "./GameFooter";
import ResultScreen from "./ResultScreen";
import StartScreen from "./StartScreen";
import AboutScreen from "./AboutScreen";
import HowToPlayScreen from "./HowToPlayScreen";
import SettingsPanel from "./SettingsPanel";
import LoginScreen from "./LoginScreen";
import mascotImg from "@/assets/Mascot.svg";
import { getMascotForCategory } from "@/data/categoryMascots";

type GameState = "start" | "about" | "playing" | "answered" | "finished";

export default function TriviaGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState>("start");
  const [animKey, setAnimKey] = useState(0);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [paused, setPaused] = useState(false);
  const [panelOpen, setPanelOpen] = useState(() => !window.matchMedia("(max-width: 767px)").matches);
  const [showLogin, setShowLogin] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Refs are read inside intervals — using refs avoids re-creating intervals on
  // every state change while still observing the latest pause / game state.
  const pausedRef = useRef(false);
  const gameStateRef = useRef<GameState>("start");

  const {
    value: countdown,
    setValue: setCountdown,
    start: startCountdown,
    clear: clearTimer,
  } = useCountdown(DEFAULT_SETTINGS.timePerQuestion, pausedRef);

  const {
    value: answerCountdown,
    start: startAnswerCountdown,
    clear: clearAnswerTimer,
  } = useNullableCountdown(pausedRef);

  const currentQuestion = activeQuestions[questionIndex];
  const isLast = questionIndex === activeQuestions.length - 1;

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  // Auto-pause when settings panel opens during an active game.
  // Reads game/pause state from refs so the effect only re-runs on panelOpen.
  useEffect(() => {
    if (
      panelOpen &&
      (gameStateRef.current === "playing" || gameStateRef.current === "answered") &&
      !pausedRef.current
    ) {
      setPaused(true);
    }
  }, [panelOpen]);

  useEffect(() => {
    if (countdown === 0 && gameState === "playing") setGameState("answered");
  }, [countdown, gameState]);

  useEffect(() => {
    if (gameState === "answered") startAnswerCountdown(settings.timePerAnswer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // Advance to the next question or finish when answer reveal expires.
  const advanceOrFinish = useCallback(() => {
    clearAnswerTimer();
    if (isLast) {
      setGameState("finished");
      return;
    }
    setQuestionIndex((prev) => prev + 1);
    setGameState("playing");
    setAnimKey((k) => k + 1);
    startCountdown(settings.timePerQuestion);
  }, [clearAnswerTimer, isLast, startCountdown, settings.timePerQuestion]);

  useEffect(() => {
    if (answerCountdown === 0 && gameState === "answered") advanceOrFinish();
  }, [answerCountdown, gameState, advanceOrFinish]);

  const handleTogglePause = useCallback(() => {
    setPaused((prev) => !prev);
  }, []);

  // Spacebar toggles pause/play during active gameplay (desktop power-user shortcut).
  // Skips when focus is in a text input/contenteditable so future inputs don't break.
  useEffect(() => {
    if (gameState !== "playing" && gameState !== "answered") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || t?.isContentEditable) return;
      e.preventDefault();
      setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameState]);

  // Defer the question countdown until after the question card is painted.
  // Two rAF + small timeout keeps the bar animation perfectly aligned with
  // the slide-in transition on the card.
  const deferCountdown = useCallback((seconds: number) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => startCountdown(seconds), 350);
      });
    });
  }, [startCountdown]);

  // Shared fetch → init → start flow used by both initial Start and mid-game Apply.
  const runFetchAndStart = useCallback(async (newSettings: GameSettings) => {
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
      setGameState("playing");
      deferCountdown(newSettings.timePerQuestion);
    } catch (err) {
      console.error("fetchAndStartGame failed:", err);
      toast.error("Couldn't load questions. Check your connection or try again.");
    } finally {
      setLoading(false);
    }
  }, [deferCountdown]);

  const handleApply = useCallback(async (newSettings: GameSettings) => {
    setSettings(newSettings);
    const wasInGame =
      gameStateRef.current === "playing" || gameStateRef.current === "answered";
    if (!wasInGame) return;

    // Close drawer immediately so it slides out during the fetch.
    setPanelOpen(false);
    clearTimer();
    clearAnswerTimer();
    await runFetchAndStart(newSettings);
  }, [clearTimer, clearAnswerTimer, runFetchAndStart]);

  const handleStart = useCallback(async () => {
    if (loading) return;
    setPanelOpen(false);
    clearAnswerTimer();
    await runFetchAndStart(settings);
  }, [loading, settings, clearAnswerTimer, runFetchAndStart]);

  const handleNext = useCallback(() => {
    if (gameState !== "answered") return;
    advanceOrFinish();
  }, [gameState, advanceOrFinish]);

  const handleRestart = useCallback(() => {
    clearTimer();
    clearAnswerTimer();
    setPaused(false);
    setQuestionIndex(0);
    setScore(0);
    setActiveQuestions([]);
    setCountdown(settings.timePerQuestion);
    setGameState("start");
    setPanelOpen(!window.matchMedia("(max-width: 767px)").matches);
    setAnimKey((k) => k + 1);
  }, [clearTimer, clearAnswerTimer, setCountdown, settings.timePerQuestion]);

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
      className="min-h-[100svh] grid grid-rows-[auto_1fr_auto] relative overflow-hidden"
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
        onHome={handleRestart}
        settingsOpen={panelOpen}
      />

      {/* Row 2: Main content */}
      {gameState === "finished" ? (
        <ResultScreen onRestart={handleRestart} />
      ) : (
        <main className="relative flex items-stretch h-full min-h-0 py-3 sm:py-6 px-3 sm:px-6 md:px-8 w-full max-w-none mx-auto overflow-visible">
          {/* Game area */}
          <div className="flex-none flex flex-col justify-center h-full w-full md:w-[70%]">
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
            className="hidden md:flex flex-none flex-col items-center justify-center overflow-visible self-stretch md:-mr-6 lg:-mr-8"
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
            className="md:hidden absolute bottom-2 right-3 pointer-events-none z-10 flex items-end justify-center opacity-90"
            style={{
              width: "clamp(90px, 26vw, 130px)",
              height: "clamp(90px, 26vw, 130px)",
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
