import { useEffect, useState } from "react";
import { LogIn, User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { trackClick } from "@/lib/analytics";
import { fireSignUpConversionForUser } from "@/lib/conversion";
import { getUnseen, badgeNamesToIds, SEEN_EVENT } from "@/lib/badgeSeen";
import AuthModal from "./AuthModal";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  username: string | null;
  unlocked_badges: string[] | null;
}

interface AuthButtonProps {
  onOpenProfile?: () => void;
}

export default function AuthButton({ onOpenProfile }: AuthButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [seenBump, setSeenBump] = useState(0);

  useEffect(() => {
    const onSeen = () => setSeenBump((n) => n + 1);
    window.addEventListener(SEEN_EVENT, onSeen);
    return () => window.removeEventListener(SEEN_EVENT, onSeen);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    supabase
      .from("profiles")
      .select("display_name, avatar_url, email, username, unlocked_badges")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setProfile(
          data ?? {
            display_name:
              (user.user_metadata?.name as string | undefined) ??
              (user.user_metadata?.full_name as string | undefined) ??
              user.email ??
              null,
            avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
            email: user.email ?? null,
            username: null,
            unlocked_badges: null,
          },
        );
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return (
      <>
        <button
          onClick={() => {
            trackClick("click_open_auth_modal");
            setModalOpen(true);
          }}
          className="nav-btn flex items-center justify-center w-10 h-10 sm:w-auto sm:h-9 sm:px-4 rounded-full transition-all duration-200 active:scale-95"
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
        <AuthModal open={modalOpen} onOpenChange={setModalOpen} />
      </>
    );
  }

  const name = profile?.username ?? profile?.display_name ?? user.email ?? "Account";
  const avatar = profile?.avatar_url;
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
  const teal = "hsl(185 70% 55%)";

  const unlockedIds = badgeNamesToIds(profile?.unlocked_badges);
  void seenBump;
  const hasUnseen = getUnseen(unlockedIds).length > 0;

  return (
    <button
      onClick={() => {
        trackClick("profile_open");
        onOpenProfile?.();
      }}
      className="relative nav-btn flex items-center justify-center w-10 h-10 sm:w-auto sm:h-9 sm:px-4 rounded-full transition-all duration-200 active:scale-95 gap-1.5"
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
      aria-label={hasUnseen ? "Open profile — new badge unlocked" : "Open profile"}
    >
      {avatar ? (
        <img
          src={avatar}
          alt=""
          className="w-5 h-5 rounded-full object-cover"
          draggable={false}
          referrerPolicy="no-referrer"
        />
      ) : initials ? (
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-body font-bold"
          style={{
            backgroundColor: "hsl(185 70% 55% / 0.2)",
            color: teal,
          }}
        >
          {initials}
        </span>
      ) : (
        <UserIcon className="w-4 h-4" style={{ color: teal }} />
      )}
      <span
        className="hidden sm:inline text-xs font-body font-bold uppercase tracking-wider max-w-[8rem] truncate"
        style={{ color: teal }}
      >
        {name}
      </span>
      {hasUnseen && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
          style={{
            background: teal,
            border: "2px solid hsl(240 45% 10%)",
            boxShadow: "0 0 6px hsl(185 70% 55% / 0.9)",
          }}
        />
      )}
    </button>
  );
}
