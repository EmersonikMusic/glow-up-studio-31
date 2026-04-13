import { Settings, LogIn, LogOut, User, Info } from "lucide-react";
import toLogoSm from "@/assets/TO_logo_sm_clr.svg";
import { useAuth } from "@/contexts/AuthContext";

interface GameHeaderProps {
  onSettingsToggle?: () => void;
  onAbout?: () => void;
  onLogin?: () => void;
  settingsOpen?: boolean;
}

export default function GameHeader({
  onSettingsToggle,
  onAbout,
  onLogin,
  settingsOpen = false,
}: GameHeaderProps) {
  const { user, logout } = useAuth();

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
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0 select-none">
          <img
            src={toLogoSm}
            alt="Trivolivia"
            className="h-8 w-auto"
            draggable={false}
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* About — icon on mobile, text on desktop */}
          {onAbout && (
            <button
              onClick={onAbout}
              className="nav-btn flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-full transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "hsl(185 70% 55%)",
              }}
              aria-label="About"
            >
              <Info className="w-4 h-4 sm:hidden" style={{ color: "hsl(var(--game-gold))" }} />
              <span
                className="hidden sm:block text-[11px] font-black tracking-widest uppercase"
                style={{ color: "hsl(185 70% 55%)" }}
              >
                About
              </span>
            </button>
          )}

          {/* Auth: username or login button */}
          {user ? (
            <div className="flex items-center gap-1.5">
              {/* Username — show on all sizes when logged in */}
              <span
                className="flex items-center gap-1 text-[10px] sm:text-[11px] font-black tracking-wider uppercase truncate max-w-[80px] sm:max-w-none"
                style={{ color: "hsl(42 100% 60%)" }}
              >
                <User className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{user.username}</span>
              </span>
              <button
                onClick={logout}
                className="nav-btn flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-95"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="nav-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "hsl(185 70% 55%)",
              }}
            >
              <LogIn className="w-3.5 h-3.5" style={{ color: "hsl(var(--game-gold))" }} />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}

          {/* Settings gear */}
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
              <Settings
                className="w-4 h-4 transition-transform duration-500"
                strokeWidth={2.5}
                style={{
                  color: "hsl(var(--game-gold))",
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
