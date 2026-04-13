import { ArrowLeft } from "lucide-react";

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

      {/* Card — liquid glass */}
      <div
        className="relative z-10 rounded-3xl overflow-hidden animate-slide-in-up mx-4 backdrop-blur-xl"
        style={{
          width: "70vw",
          minWidth: "300px",
          background: "rgba(0, 0, 0, 0.45)",
          border: "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        }}
      >
        {/* Close button — matches gear icon style */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:brightness-125 active:scale-95"
          aria-label="Close"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} />
        </button>

        {/* Header */}
        <div className="px-8 pt-10 pb-6" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <p className="text-sm font-black tracking-[0.2em] uppercase mb-2" style={{ color: "hsl(185 70% 55%)" }}>
            Welcome to your
          </p>
          <h1
            className="text-4xl font-black uppercase leading-none tracking-tight"
            style={{
              fontFamily: "'Fredoka One', 'Nunito', sans-serif",
              background: "linear-gradient(160deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 45%, hsl(28 90% 40%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.05,
            }}
          >
            Endless Trivia
            <br />
            World!
          </h1>
        </div>

        {/* Scrollable body */}
        <div className="about-scroll-area max-h-[55vh] overflow-y-scroll">
          <div className="px-8 py-7 flex flex-col gap-6 game-text-white">
            {/* Who are we */}
            <div>
              <h2 className="text-xs font-black tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                Who are we?
              </h2>
              <p className="text-sm leading-relaxed">
                We are a team of trivia fans who love learning, writing, and playing trivia. Here at{" "}
                <span className="font-black">Triviolivia</span>, we believe that learning should be entertaining and
                stimulating. Our platform is designed for trivia experts, young learners, and everyone in between.
              </p>
            </div>

            <div className="h-px" style={{ background: "rgba(255, 255, 255, 0.1)" }} />

            {/* How do I play */}
            <div>
              <h2 className="text-xs font-black tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                How do I play?
              </h2>
              <p className="text-sm leading-relaxed">
                Press <span className="font-black">START GAME</span> to play a game with today's unlocked categories, or{" "}
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

            <div className="h-px" style={{ background: "rgba(255, 255, 255, 0.1)" }} />

            {/* What sets us apart */}
            <div>
              <h2 className="text-xs font-black tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                What sets us apart?
              </h2>
              <p className="text-sm leading-relaxed mb-4">
                <span className="font-black">Triviolivia</span> is not just another trivia game. Triviolivia is a free
                and fully customizable source of endless trivia questions and answers across{" "}
                <span className="font-black">25 categories</span>,{" "}
                <span className="font-black">5 difficulty levels</span>, and{" "}
                <span className="font-black">12 time periods</span>. 1500 ways to play. Let us handle the questions. How
                you use them is up to you.
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  "Need some fresh questions for your dated trivia board game?",
                  "Want to make better use of your kid's screen time?",
                  "Did you forget to prepare for hosting bar trivia night?",
                  "Learning English?",
                  "Are you a trivia wizard but not into politics, theater, or math?",
                  "Music, movie, and video game expert but only after the year 2000?",
                  "Love sports trivia?",
                  "Hate sports trivia?",
                  "Want to see if you know more about technology than your cousin knows about history?",
                  "Want a balanced trivia showdown between your five year old brainiac and her boomer grandpa?",
                  "Training for a Jeopardy run?",
                  "Tired of AI hallucination questions?",
                  "Want to just eventually know everything?",
                ].map((item, i) => (
                  <li key={i} className="text-sm leading-relaxed flex items-start gap-2">
                    <span
                      className="shrink-0 mt-[5px] w-2 h-2 rounded-full"
                      style={{ background: "hsl(185 70% 55%)" }}
                    />
                    <span>
                      {item}{" "}
                      <span className="font-black" style={{ color: "hsl(185 70% 55%)" }}>
                        We got you.
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px" style={{ background: "rgba(255, 255, 255, 0.1)" }} />

            {/* How do I contribute */}
            <div>
              <h2 className="text-xs font-black tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                How do I contribute?
              </h2>
              <p className="text-sm leading-relaxed">
                Our meticulously crafted and curated questions are designed to entertain, educate, challenge, and spark
                curiosity. We are always adding to our database and we're always looking for new questions.{" "}
                <span className="font-black">Show us what you got!</span> If your submitted questions survive our
                rigorous quality control process, they will be added to our database and you will be credited as the
                author of the question, or you can remain anonymous.
              </p>
            </div>

            <div className="h-px" style={{ background: "rgba(255, 255, 255, 0.1)" }} />

            {/* What next */}
            <div>
              <h2 className="text-xs font-black tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                What next?
              </h2>
              <p className="text-sm leading-relaxed font-black">Go play. Good luck. Have fun. Nerd up!</p>
            </div>

            {/* Sign-off */}
            <div className="pt-1 pb-2">
              <p className="text-sm leading-relaxed" style={{ color: "hsl(185 70% 55%)" }}>
                With love,
                <br />
                <span className="font-black not-italic">The Triviolivia Team</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA — gold gradient */}
        <div className="px-8 pb-8 pt-4" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
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
