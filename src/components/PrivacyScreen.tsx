import { ChevronsLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useCallback } from "react";
import PrimaryCTA from "./PrimaryCTA";
import LegalContent from "./LegalContent";
import { trackClick } from "@/lib/analytics";

interface PrivacyScreenProps {
  onClose: () => void;
}

export default function PrivacyScreen({ onClose }: PrivacyScreenProps) {
  const isMobile = useIsMobile();
  const [exiting, setExiting] = useState(false);

  const handleClose = useCallback(() => {
    if (exiting) return;
    trackClick("privacy_close");
    setExiting(true);
    setTimeout(() => onClose(), isMobile ? 350 : 300);
  }, [onClose, isMobile, exiting]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "hsl(var(--game-bg))",
        willChange: "transform, opacity",
        pointerEvents: exiting ? "none" : "auto",
        transition: isMobile ? "transform 0.35s cubic-bezier(0.4, 0, 1, 1)" : "opacity 0.3s ease",
        transform: isMobile ? (exiting ? "translateX(-100%)" : "translateX(0)") : "translateX(0)",
        opacity: !isMobile && exiting ? 0 : 1,
      }}
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
        className={`relative z-10 overflow-hidden animate-slide-in-up backdrop-blur-xl flex flex-col ${
          isMobile ? "absolute inset-0 rounded-none" : "rounded-3xl mx-4"
        }`}
        style={{
          ...(!isMobile && { width: "70vw", minWidth: "300px" }),
          background: "rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: isMobile ? "none" : "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow: isMobile
            ? "12px 0 48px rgba(0, 0, 0, 0.5)"
            : "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="nav-btn absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-95"
          aria-label="Close"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <ChevronsLeft className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.5} />
        </button>

        <LegalContent />


        {/* Footer CTA */}
        <div className="px-6 md:px-8 pb-8 pt-4 shrink-0 flex justify-center" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <PrimaryCTA onClick={handleClose} aria-label="Back to Game">
            Back to Game
          </PrimaryCTA>
        </div>
      </div>
    </div>
  );
}
