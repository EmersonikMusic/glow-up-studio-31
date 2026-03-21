import { useState, useCallback } from "react";
import { questions } from "@/data/questions";
import GameHeader from "./GameHeader";
import QuestionCard from "./QuestionCard";
import GameFooter from "./GameFooter";
import ResultScreen from "./ResultScreen";
import StartScreen from "./StartScreen";

type GameState = "start" | "playing" | "answered" | "finished";

export default function TriviaGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>("start");
  const [animKey, setAnimKey] = useState(0);

  const currentQuestion = questions[questionIndex];
  const isLast = questionIndex === questions.length - 1;

  const handleStart = useCallback(() => {
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setAnimKey((k) => k + 1);
    setGameState("playing");
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      if (gameState !== "playing") return;
      setSelected(id);
      if (id === currentQuestion.correctId) {
        setScore((prev) => prev + 1);
      }
      setGameState("answered");
    },
    [gameState, currentQuestion.correctId]
  );

  const handleNext = useCallback(() => {
    if (gameState !== "answered") return;
    if (isLast) {
      setGameState("finished");
    } else {
      setQuestionIndex((prev) => prev + 1);
      setSelected(null);
      setGameState("playing");
      setAnimKey((k) => k + 1);
    }
  }, [gameState, isLast]);

  const handleRestart = useCallback(() => {
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setGameState("start");
    setAnimKey((k) => k + 1);
  }, []);

  if (gameState === "start") {
    return <StartScreen onStart={handleStart} />;
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
            <QuestionCard question={currentQuestion} animKey={animKey} />
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

