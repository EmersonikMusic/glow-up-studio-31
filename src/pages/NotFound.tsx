import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import PrimaryCTA from "@/components/PrimaryCTA";
import mascot from "@/assets/Mascot.svg";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page Not Found — Triviolivia</title>
        <meta
          name="description"
          content="This page doesn't exist on Triviolivia. Head back to the homepage to start a new trivia game."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={location.pathname} />
        <meta property="og:title" content="Page Not Found — Triviolivia" />
        <meta
          property="og:description"
          content="This page doesn't exist on Triviolivia. Head back to the homepage to start a new trivia game."
        />
        <meta property="og:url" content={location.pathname} />
      </Helmet>
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{
          background: "hsl(var(--game-bg))",
          minHeight: "var(--app-vh, 100vh)",
        }}
      >
        {/* Ambient blobs */}
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(280 60% 50% / 0.14) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(210 70% 50% / 0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg">
          {/* Mascot */}
          <div
            className="relative flex items-end justify-center"
            style={{
              width: "clamp(180px, 32vw, 260px)",
              height: "clamp(180px, 32vw, 260px)",
              animation: "float 3s ease-in-out infinite",
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
              aria-hidden="true"
            />
            <img
              src={mascot}
              alt="Triviolivia mascot"
              className="relative z-10 h-full w-full drop-shadow-xl"
              draggable={false}
            />
          </div>

          <p
            className="text-sm font-subheading font-bold tracking-[0.2em] uppercase"
            style={{ color: "hsl(185 70% 55%)" }}
          >
            Well, this is awkward…
          </p>

          <h1
            className="font-heading font-extrabold leading-none tracking-tight"
            style={{
              fontSize: "clamp(5rem, 18vw, 9rem)",
              background:
                "linear-gradient(160deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 45%, hsl(28 90% 40%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
            }}
          >
            404
          </h1>

          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            This page wandered off
            <br />
            the trivia trail.
          </h2>

          <div className="pt-2">
            <PrimaryCTA onClick={() => navigate("/")} aria-label="Back to Game">
              Back to Game
            </PrimaryCTA>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
