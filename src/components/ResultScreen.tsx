import { RotateCcw } from "lucide-react";
import mascotImg from "@/assets/Mascot.svg";

interface ResultScreenProps {
  onRestart: () => void;
}

export default function ResultScreen({ onRestart }: ResultScreenProps) {
  return (
    <div
      className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 py-8 animate-slide-in-up"
      style={{ background: "hsl(var(--game-bg))" }}
    >
      {/* Glassmorphism card */}
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden backdrop-blur-xl"
        style={{
          background: "rgba(0, 0, 0, 0.45)",
          border: "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 16px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        }}
      >

        <div className="px-8 py-10 flex flex-col items-center gap-8">
          {/* Character + glow - larger for balance */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-40 h-40 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(42 100% 55% / 0.35) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            <img
              src={mascotImg}
              alt="Olivia"
              className="relative z-10 w-32 h-32 object-contain drop-shadow-2xl animate-float"
            />
          </div>

          {/* Main heading */}
          <div className="text-center space-y-3">
            <div
              className="text-4xl sm:text-5xl font-black animate-bounce-in"
              style={{ color: "hsl(42 100% 55%)", fontFamily: "'Russo One', sans-serif" }}
            >
              Trivia Complete!
            </div>
            <p className="text-muted-foreground text-base max-w-xs mx-auto leading-relaxed">
              Great job exploring the world of trivia! Ready for another round?
            </p>
          </div>

          {/* Decorative divider */}
          <div className="w-16 h-0.5 rounded-full" style={{ background: "rgba(255, 255, 255, 0.15)" }} />


          {/* CTA */}
          <button
            onClick={onRestart}
            className="group relative w-full flex items-center justify-center gap-2 py-4 rounded-full font-black text-sm tracking-[0.18em] uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            style={{
              fontFamily: "'Russo One', 'Nunito', sans-serif",
              background: "linear-gradient(180deg, #fee62d 0%, #f3903f 50%, #e93e3a 100%)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "0 4px 12px rgba(233, 62, 58, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              color: "hsl(35 80% 25%)",
            }}
          >
            {/* Shine overlay */}
            <span 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 transition-transform duration-500 group-hover:-rotate-[360deg]" />
              Play Again
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
