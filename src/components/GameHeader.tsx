import { LogIn, LogOut, User, Info, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useState } from "react";
import toLogoSm from "@/assets/TO_logo_sm_clr.svg";
import settingsIcon from "@/assets/icon-settings.svg";
import { useAuth } from "@/contexts/AuthContext";

interface GameHeaderProps {
  onSettingsToggle?: () => void;
  onAbout?: () => void;
  onLogin?: () => void;
  onHome?: () => void;
  settingsOpen?: boolean;
}

export default function GameHeader({
  onSettingsToggle,
  onAbout,
  onLogin,
  onHome,
  settingsOpen = false,
}: GameHeaderProps) {
  const { user, logout } = useAuth();

  const fsSupported =
    typeof document !== "undefined" &&
    !!(
      document.documentElement.requestFullscreen ||
      (document.documentElement as any).webkitRequestFullscreen
    );
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!fsSupported) return;
    const sync = () => {
      const fsEl =
        document.fullscreenElement || (document as any).webkitFullscreenElement;
      setIsFullscreen(!!fsEl);
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    sync();
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, [fsSupported]);

  const toggleFullscreen = () => {
    const el = document.documentElement as any;
    const doc = document as any;
    const fsEl = document.fullscreenElement || doc.webkitFullscreenElement;
    if (!fsEl) {
      el.requestFullscreen?.() || el.webkitRequestFullscreen?.();
    } else {
      doc.exitFullscreen?.() || doc.webkitExitFullscreen?.();
    }
  };

  return (
    <header
      className="relative z-20 px-4 sm:px-6 md:px-8 backdrop-blur-md"
      style={{
        paddingTop: "clamp(0.75rem, 2vw, 1.25rem)",
        paddingBottom: "clamp(0.75rem, 2vw, 1.25rem)",
        background: "rgba(0, 0, 0, 0.25)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Left slot: Logo (hidden on mobile only when logged in) */}
        <div className="flex items-center flex-shrink-0 select-none min-w-0 gap-2">
          <button
            type="button"
            onClick={onHome}
            disabled={!onHome}
            aria-label="Return to start screen"
            className={`${user ? "hidden sm:block" : "block"} rounded transition-transform duration-200 active:scale-95 disabled:cursor-default disabled:active:scale-100 md:hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--game-gold))]`}
          >
            <img
              src={toLogoSm}
              alt="Trivolivia — return to start"
              className="h-8 w-auto"
              draggable={false}
            />
          </button>
        </div>

        {/* Right: Username → Login/Logout → About → Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Username pill — only when logged in, sits left of Logout */}
          {user && (
            <span
              className="flex items-center gap-1.5 h-9 px-4 text-xs font-body font-bold tracking-wider uppercase whitespace-nowrap rounded-full"
              style={{
                color: "hsl(185 70% 55%)",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(185 70% 55%)" }} />
              <span>{user.username.slice(0, 20)}</span>
            </span>
          )}
          {/* Login or Logout */}
          {user ? (
            <button
              onClick={logout}
              className="nav-btn flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 rounded-full transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} />
              <span
                className="hidden sm:inline ml-1.5 text-xs font-body font-bold uppercase tracking-wider"
                style={{ color: "hsl(var(--game-gold))" }}
              >
                Logout
              </span>
            </button>
          ) : (
            onLogin && (
              <button
                onClick={onLogin}
                className="nav-btn flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 rounded-full transition-all duration-200 active:scale-95"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
                aria-label="Login"
              >
                <LogIn className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} />
                <span
                  className="hidden sm:inline ml-1.5 text-xs font-body font-bold uppercase tracking-wider"
                  style={{ color: "hsl(var(--game-gold))" }}
                >
                  Login
                </span>
              </button>
            )
          )}

          {/* About */}
          {onAbout && (
            <button
              onClick={onAbout}
              className="nav-btn flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 rounded-full transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
              aria-label="About"
            >
              <Info className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} />
              <span
                className="hidden sm:inline ml-1.5 text-xs font-body font-bold uppercase tracking-wider"
                style={{ color: "hsl(var(--game-gold))" }}
              >
                About
              </span>
            </button>
          )}

          {/* Settings gear — always icon-only */}
          {onSettingsToggle && (
            <button
              onClick={onSettingsToggle}
              className="nav-btn flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
              aria-label={settingsOpen ? "Close settings" : "Open settings"}
            >
              <img
                src={settingsIcon}
                alt="Settings"
                className="w-5 h-5 transition-transform duration-500 md:hover:rotate-45"
                style={{
                  transform: settingsOpen ? "rotate(60deg)" : "rotate(0deg)",
                }}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
