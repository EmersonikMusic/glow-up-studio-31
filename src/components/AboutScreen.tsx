import { ScrollArea } from "@/components/ui/scroll-area";

interface AboutScreenProps {
  onClose: () => void;
}

export default function AboutScreen({ onClose }: AboutScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "hsl(var(--game-bg))" }}
    >
      {/* Ambient blobs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(280 60% 50% / 0.14) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(210 70% 50% / 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-lg mx-4 rounded-3xl overflow-hidden animate-slide-in-up"
        style={{
          background: "hsl(var(--game-card))",
          border: "1px solid hsl(var(--game-card-border))",
          boxShadow: "0 24px 80px hsl(240 45% 10% / 0.7)",
        }}
      >
        {/* Close button — X in gold circle */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:brightness-110 active:scale-95"
          style={{
            background: "linear-gradient(135deg, hsl(42 100% 58%), hsl(35 90% 45%))",
            boxShadow: "0 4px 12px hsl(42 100% 55% / 0.4)",
          }}
          aria-label="Close"
        >
          {/* SVG X icon matching btn-startgame style */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2L14 14M14 2L2 14"
              stroke="hsl(240 45% 16%)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Header */}
        <div
          className="px-8 pt-10 pb-6"
          style={{ borderBottom: "1px solid hsl(var(--game-card-border))" }}
        >
          <p
            className="text-sm font-black tracking-[0.2em] uppercase mb-2"
            style={{ color: "hsl(185 70% 55%)" }}
          >
            Welcome to your
          </p>
          <h1
            className="text-4xl font-black uppercase leading-none tracking-tight"
            style={{
              fontFamily: "'Fredoka One', 'Nunito', sans-serif",
              background:
                "linear-gradient(160deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 45%, hsl(28 90% 40%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.05,
            }}
          >
            Endless Trivia<br />World!
          </h1>
        </div>

        {/* Scrollable body */}
        <ScrollArea className="max-h-[55vh]">
          <div className="px-8 py-7 flex flex-col gap-6">
            {/* Who are we */}
            <div>
              <h2
                className="text-xs font-black tracking-[0.18em] uppercase mb-3"
                style={{ color: "hsl(185 70% 55%)" }}
              >
                Who are we?
              </h2>
              <p
              className="text-sm leading-relaxed text-white"
            >
              Here at{" "}
                <span className="font-black">
                  Triviolivia
                </span>
                , we are a team of trivia fans who love learning, writing, and playing trivia.
                We believe that learning should be entertaining and stimulating. Our platform
                is designed for trivia experts, young learners, and everyone in between.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: "hsl(var(--game-card-border))" }} />

            {/* How do I play */}
            <div>
              <h2
                className="text-xs font-black tracking-[0.18em] uppercase mb-3"
                style={{ color: "hsl(185 70% 55%)" }}
              >
                How do I play?
              </h2>
              <p
                className="text-sm leading-relaxed !text-white"
              >
                Press{" "}
                <span className="font-black">
                  START GAME
                </span>{" "}
                to play a game with today's unlocked categories, or{" "}
                <a
                  href="#"
                  className="font-black underline underline-offset-2 transition-opacity duration-150 hover:opacity-80"
                  style={{ color: "hsl(185 70% 55%)" }}
                >
                  create an account
                </a>{" "}
                to unlock them all for free!
              </p>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: "hsl(var(--game-card-border))" }} />

            {/* Contact / links section */}
            <div>
              <h2
                className="text-xs font-black tracking-[0.18em] uppercase mb-3"
                style={{ color: "hsl(185 70% 55%)" }}
              >
                Get in touch
              </h2>
              <p className="text-sm leading-relaxed !text-white">
                Questions or feedback? Reach us at{" "}
                <a
                  href="mailto:hello@triviolivia.com"
                  className="font-black underline underline-offset-2 transition-opacity duration-150 hover:opacity-80"
                  style={{ color: "hsl(185 70% 55%)" }}
                >
                  hello@triviolivia.com
                </a>
                .
              </p>
            </div>

            {/* Dot row */}
            <div className="flex items-center justify-center gap-2 pt-1 pb-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: i === 1 ? 10 : 6,
                    height: i === 1 ? 10 : 6,
                    background: i === 1 ? "hsl(185 70% 55%)" : "hsl(var(--game-card-border))",
                  }}
                />
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Footer CTA */}
        <div
          className="px-8 pb-8 pt-4"
          style={{ borderTop: "1px solid hsl(var(--game-card-border))" }}
        >
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, hsl(42 100% 58%), hsl(35 90% 45%))",
              color: "hsl(240 45% 16%)",
              boxShadow: "0 6px 24px hsl(42 100% 55% / 0.35)",
            }}
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
}
