import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import LegalContent from "@/components/LegalContent";
import PrimaryCTA from "@/components/PrimaryCTA";
import GameHeader from "@/components/GameHeader";

export default function Terms() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Terms of Service & Privacy Policy — Triviolivia</title>
        <meta
          name="description"
          content="Triviolivia's Terms of Service and Privacy Policy governing use of the Triviolivia trivia app and website."
        />
        <link rel="canonical" href="https://triviolivia.com/terms" />
        <meta property="og:title" content="Terms of Service & Privacy Policy — Triviolivia" />
        <meta property="og:url" content="https://triviolivia.com/terms" />
        <meta property="og:type" content="article" />
      </Helmet>

      <main
        className="min-h-screen flex flex-col relative overflow-hidden"
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

        <GameHeader showNav={false} onHome={() => navigate("/")} />

        <div className="flex-1 flex items-center justify-center relative overflow-hidden p-0 sm:p-6">
          <div
            className={`relative z-10 overflow-hidden backdrop-blur-xl flex flex-col ${
              isMobile ? "w-full h-full rounded-none" : "rounded-3xl"
            }`}
            style={{
              ...(!isMobile && {
                width: "70vw",
                minWidth: "300px",
                maxHeight: "calc(100vh - 6rem)",
              }),
              background: "rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: isMobile ? "none" : "1.5px solid rgba(255, 255, 255, 0.18)",
              boxShadow: isMobile
                ? "12px 0 48px rgba(0, 0, 0, 0.5)"
                : "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
            }}
          >
            <LegalContent />

            <div
              className="px-6 md:px-8 pb-8 pt-4 shrink-0 flex justify-center"
              style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
            >
              <Link to="/">
                <PrimaryCTA aria-label="Back to Home">Back to Home</PrimaryCTA>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
