import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Question } from "@/data/questions";
import { categoryColors } from "@/data/categoryColors";
import { fetchAndStartGame } from "@/lib/triviaApi";
import { DEFAULT_SETTINGS, type GameSettings } from "@/data/gameOptions";
import { useCountdown, useNullableCountdown } from "@/hooks/useCountdown";
import { useSound } from "@/hooks/useSound";
import { toggleMuted } from "@/lib/sound";
import GameHeader from "./GameHeader";
import QuestionCard from "./QuestionCard";
import GameFooter from "./GameFooter";
import ResultScreen from "./ResultScreen";
import StartScreen from "./StartScreen";
import AboutScreen from "./AboutScreen";
import HowToPlayScreen from "./HowToPlayScreen";
import SettingsPanel from "./SettingsPanel";
import LoginScreen from "./LoginScreen";
import MascotSvg, { type MascotState } from "./MascotSvg";
import PauseOverlay from "./PauseOverlay";
import MascotDebugOverlay from "./MascotDebugOverlay";
import { matchesMedia } from "@/lib/browserCompat";

/** Extracts the gradient's first rgba(...) for use as the card-flash glow color. */
function gradientFlashColor(gradient?: string): string | undefined {
  if (!gradient) return undefined;
  const m = gradient.match(/rgba?\([^)]+\)/);
  if (!m) return undefined;
  return m[0].replace(/,\s*[\d.]+\)/, ", 0.55)");
}

/** 3-dot sparkle burst (mascot category-change flair). Re-mounts via key. */
function SparkleBurst({ sparkleKey }: { sparkleKey: number }) {
  if (sparkleKey === 0) return null;
  const dots = [
    { x: -34, y: -28 },
    { x: 34, y: -34 },
    { x: 0, y: -42 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
      {dots.map((d, i) => (
        <span
          key={i}
          className="sparkle-dot absolute rounded-full"
          style={
            {
              top: "50%",
              left: "50%",
              width: 8,
              height: 8,
              background: "hsl(42 100% 70%)",
              boxShadow: "0 0 8px hsl(42 100% 70% / 0.8)",
              animationDelay: `${i * 60}ms`,
              "--sx": `${d.x}px`,
              "--sy": `${d.y}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Single golden particle drifting up — fired at 25/50/75% milestones. */
function MilestoneParticle({ milestoneKey }: { milestoneKey: number }) {
  if (milestoneKey === 0) return null;
  return (
    <span
      className="milestone-particle absolute rounded-full pointer-events-none z-20"
      aria-hidden="true"
      style={{
        bottom: "10%",
        left: "50%",
        width: 10,
        height: 10,
        background: "hsl(42 100% 60%)",
        boxShadow: "0 0 12px hsl(42 100% 60% / 0.9)",
        transform: "translateX(-50%)",
      }}
    />
  );
}

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
  const [panelOpen, setPanelOpen] = useState(() => !matchesMedia("(max-width: 767px)", false));
  const [showLogin, setShowLogin] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Polish state.
  const { play } = useSound();
  const [sparkleKey, setSparkleKey] = useState(0);
  const [milestoneKey, setMilestoneKey] = useState(0);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const lastCategoryRef = useRef<string | null>(null);
  const milestonesFiredRef = useRef<Set<number>>(new Set());

  // Refs are read inside intervals — using refs avoids re-creating intervals on
  // every state change while still observing the latest pause / game state.
  const pausedRef = useRef(false);
  const gameStateRef = useRef<GameState>("start");
  const questionIndexRef = useRef(0);
  const activeQuestionsLenRef = useRef(0);
  const timePerQuestionRef = useRef(DEFAULT_SETTINGS.timePerQuestion);

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
  useEffect(() => { questionIndexRef.current = questionIndex; }, [questionIndex]);
  useEffect(() => { activeQuestionsLenRef.current = activeQuestions.length; }, [activeQuestions.length]);
  useEffect(() => { timePerQuestionRef.current = settings.timePerQuestion; }, [settings.timePerQuestion]);

  // Keep --app-vh in sync with the visual viewport so iOS Safari address-bar
  // collapses don't briefly hide the footer or overlap the card.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const h = window.visualViewport?.height ?? window.innerHeight;
        document.documentElement.style.setProperty("--app-vh", `${h}px`);
      });
    };
    update();
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", update);
      vv.addEventListener("scroll", update);
    }
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      cancelAnimationFrame(frame);
      if (vv) {
        vv.removeEventListener("resize", update);
        vv.removeEventListener("scroll", update);
      }
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

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
  // Stable identity (no deps) — reads latest values from refs so keyboard
  // shortcuts always see the current question index without stale closures.
  const advanceOrFinish = useCallback(() => {
    clearAnswerTimer();
    const isLastNow = questionIndexRef.current === activeQuestionsLenRef.current - 1;
    if (isLastNow) {
      setGameState("finished");
      return;
    }
    setQuestionIndex((prev) => prev + 1);
    setGameState("playing");
    setAnimKey((k) => k + 1);
    startCountdown(timePerQuestionRef.current);
  }, [clearAnswerTimer, startCountdown]);

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

  // Desktop power-user shortcuts: → / N (next), S (settings), M (mute).
  // Gated to true desktop — touch devices and tablets are excluded.
  useEffect(() => {
    const isTouchOrSmall = matchesMedia("(pointer: coarse)") || window.innerWidth < 1024;
    if (isTouchOrSmall) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || t?.isContentEditable) return;
      // Toggle settings panel.
      if (e.code === "KeyS" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setPanelOpen((v) => !v);
        return;
      }
      // Toggle mute.
      if (e.code === "KeyM" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        toggleMuted();
        return;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Tick sound for last 3s of question phase.
  const lastTickRef = useRef<number>(-1);
  useEffect(() => {
    if (gameState !== "playing") {
      lastTickRef.current = -1;
      return;
    }
    if (countdown > 0 && countdown <= 3 && countdown !== lastTickRef.current) {
      lastTickRef.current = countdown;
      play("tick");
    }
  }, [countdown, gameState, play]);

  // Reveal sound + mascot bounce when entering "answered".
  useEffect(() => {
    if (gameState === "answered") {
      play("reveal");
      setMascotState("celebrate");
      const t = setTimeout(() => setMascotState("idle"), 500);
      return () => clearTimeout(t);
    }
  }, [gameState, play]);

  // Mascot droop when paused.
  useEffect(() => {
    if (paused && (gameState === "playing" || gameState === "answered")) {
      setMascotState("paused");
    } else if (gameState === "playing") {
      setMascotState("idle");
    }
  }, [paused, gameState]);

  // Sparkle burst + transition sound when category changes.
  useEffect(() => {
    const cur = currentQuestion?.category;
    if (!cur || gameState !== "playing") return;
    if (lastCategoryRef.current && lastCategoryRef.current !== cur) {
      setSparkleKey((k) => k + 1);
    }
    lastCategoryRef.current = cur;
  }, [currentQuestion?.category, gameState]);

  // Transition swoosh on every new question (after the first).
  const prevIndexRef = useRef(0);
  useEffect(() => {
    if (gameState === "playing" && questionIndex > 0 && questionIndex !== prevIndexRef.current) {
      play("transition");
    }
    prevIndexRef.current = questionIndex;
  }, [questionIndex, gameState, play]);

  // Progress milestones (25 / 50 / 75%) → golden particle burst.
  useEffect(() => {
    if (gameState !== "playing" || activeQuestions.length < 4) return;
    const pct = ((questionIndex + 1) / activeQuestions.length) * 100;
    [25, 50, 75].forEach((mark) => {
      if (pct >= mark && !milestonesFiredRef.current.has(mark)) {
        milestonesFiredRef.current.add(mark);
        setMilestoneKey((k) => k + 1);
      }
    });
  }, [questionIndex, gameState, activeQuestions.length]);

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
      toast.error("Couldn't load questions. Check your connection or try again with different settings.");
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
    setPanelOpen(!matchesMedia("(max-width: 767px)", false));
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
      className="min-h-screen overscroll-none grid grid-rows-[auto_1fr_auto] relative overflow-hidden"
      style={{
        background: bgGradient || "hsl(var(--game-bg))",
        transition: "background 0.6s ease",
        minHeight: "var(--app-vh, 100vh)",
        maxHeight: "var(--app-vh, 100vh)",
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
        <ResultScreen onRestart={handleRestart} onChangeSettings={() => { handleRestart(); setTimeout(() => setPanelOpen(true), 50); }} />
      ) : (
        <main className="relative flex items-stretch h-full min-h-0 py-3 sm:py-6 px-3 sm:px-6 md:px-8 w-full max-w-none mx-auto overflow-visible">
          {/* Game area */}
          <div className="relative flex-none flex flex-col justify-center h-full w-full md:w-[70%] pb-2 md:pb-0 mobile-landscape:pb-[96px] mobile-landscape:pr-[140px]">
            <QuestionCard
              question={currentQuestion}
              animKey={animKey}
              answered={gameState === "answered"}
              correctAnswer={
                gameState === "answered"
                  ? currentQuestion.answers.find((a) => a.id === currentQuestion.correctId)?.text
                  : undefined
              }
              flashColor={gradientFlashColor(bgGradient)}
            />

            {/* Pause overlay (sits over question card area) */}
            <div className="absolute inset-0 pointer-events-none z-30">
              <div className="relative w-full h-full">
                <PauseOverlay visible={paused && (gameState === "playing" || gameState === "answered")} />
              </div>
            </div>

            {/* Mobile mascot — anchored inside the card area, 12px from inner edges */}
            <div
              className="md:hidden absolute pointer-events-none z-20 flex items-end justify-center mobile-mascot-overlay"
              style={{
                width: "clamp(165px, 44vw, 9999px)",
                height: "clamp(165px, 44vw, 9999px)",
                bottom: "28px",
                left: "50%",
                transform: "translateX(-50%)",
                animation: "float 3s ease-in-out infinite",
                animationPlayState: paused ? "paused" : "running",
              }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  width: "70%",
                  height: "70%",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgb(125, 223, 232)",
                }}
              />
              {/* Sparkle burst on category change */}
              <SparkleBurst key={`sparkle-m-${sparkleKey}`} sparkleKey={sparkleKey} />
              {/* Milestone particle */}
              <MilestoneParticle key={`mile-m-${milestoneKey}`} milestoneKey={milestoneKey} />
              <MascotSvg
                category={currentQuestion.category}
                state={mascotState}
                className="relative z-10 h-full w-full drop-shadow-xl"
              />
            </div>
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
              className="relative flex items-center justify-center my-auto"
              style={{
                width: "clamp(180px, 24vw, 320px)",
                height: "clamp(180px, 24vw, 320px)",
                animation: "float 3s ease-in-out infinite",
                animationPlayState: paused ? "paused" : "running",
              }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  width: "70%",
                  height: "70%",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgb(125, 223, 232)",
                }}
              />
              {/* Sparkle burst on category change */}
              <SparkleBurst key={`sparkle-d-${sparkleKey}`} sparkleKey={sparkleKey} />
              {/* Milestone particle */}
              <MilestoneParticle key={`mile-d-${milestoneKey}`} milestoneKey={milestoneKey} />
              <MascotSvg
                category={currentQuestion.category}
                state={mascotState}
                className="relative z-10 h-full w-full drop-shadow-xl"
              />
            </div>
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

      {/* Mascot debug overlay (toggle: ?mascotDebug=1 or Shift+D) */}
      <MascotDebugOverlay />
    </div>
  );
}
