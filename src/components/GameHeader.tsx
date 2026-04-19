import { LogIn, LogOut, User, Info } from "lucide-react";
import toLogoSm from "@/assets/TO_logo_sm_clr.svg";
import settingsIcon from "@/assets/icon-settings.svg";
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
      <div className="flex items-center justify-between gap-2">
        {/* Left slot: Logo OR Username (when logged in) */}
        <div className="flex items-center flex-shrink-0 select-none min-w-0">
          {user ? (
            <span
              className="flex items-center gap-1.5 text-[12px] sm:text-[11px] font-black tracking-wider uppercase truncate max-w-[180px] sm:max-w-[240px] rounded-full px-3 py-1.5"
              style={{
                color: "hsl(42 100% 60%)",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <User className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{user.username}</span>
            </span>
          ) : (
            <img
              src={toLogoSm}
              alt="Trivolivia"
              className="h-8 w-auto block"
              draggable={false}
            />
          )}
        </div>

        {/* Right: Actions — Logout (if logged in) → About → Login (if logged out) → Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Logout — round icon, immediately after username */}
          {user && (
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
          )}

          {/* About — round icon (consistent with other header buttons) */}
          {onAbout && (
            <button
              onClick={onAbout}
              className="nav-btn flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
              aria-label="About"
            >
              <Info className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} />
            </button>
          )}

          {/* Login — round icon (only when logged out) */}
          {!user && (
            <button
              onClick={onLogin}
              className="nav-btn flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
              aria-label="Login"
            >
              <LogIn className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} />
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
