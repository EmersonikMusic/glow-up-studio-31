import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trackClick } from "@/lib/analytics";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.73-6-6.1s2.7-6.1 6-6.1c1.88 0 3.14.8 3.86 1.5l2.63-2.53C16.8 3.4 14.63 2.4 12 2.4 6.86 2.4 2.7 6.56 2.7 11.7S6.86 21 12 21c6.9 0 9.3-4.85 9.3-7.35 0-.5-.06-.9-.14-1.35H12z"
      />
      <path
        fill="#34A853"
        d="M3.88 7.56l3.2 2.35C7.98 8 9.83 6.4 12 6.4c1.88 0 3.14.8 3.86 1.5l2.63-2.53C16.8 3.4 14.63 2.4 12 2.4 8.28 2.4 5.08 4.55 3.88 7.56z"
      />
      <path
        fill="#FBBC05"
        d="M12 21c2.6 0 4.78-.85 6.37-2.32l-3.04-2.35c-.83.57-1.94.97-3.33.97-2.56 0-4.73-1.7-5.5-4.05l-3.16 2.44C4.77 18.9 8.1 21 12 21z"
      />
      <path
        fill="#4285F4"
        d="M21.3 12.35c0-.5-.06-.9-.14-1.35H12v3.9h5.5c-.26 1.4-1.1 2.4-2.17 3.13l3.04 2.35c1.78-1.65 2.93-4.1 2.93-8.03z"
      />
    </svg>
  );
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

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
      .select("display_name, avatar_url, email")
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
          },
        );
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSignIn = async () => {
    trackClick("click_sign_in_google");
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error || result.redirected) {
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    trackClick("click_sign_out");
    await supabase.auth.signOut();
  };

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="nav-btn flex items-center justify-center w-10 h-10 sm:w-auto sm:h-9 sm:px-4 rounded-full transition-all duration-200 active:scale-95 disabled:opacity-60"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
        aria-label="Sign in with Google"
      >
        <GoogleIcon className="w-4 h-4" />
        <span
          className="hidden sm:inline ml-1.5 text-xs font-body font-bold uppercase tracking-wider"
          style={{ color: "hsl(var(--game-gold))" }}
        >
          Sign in
        </span>
      </button>
    );
  }

  const name = profile?.display_name ?? user.email ?? "Account";
  const avatar = profile?.avatar_url;
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="nav-btn flex items-center justify-center h-10 sm:h-9 px-1 sm:px-2 gap-2 rounded-full transition-all duration-200 active:scale-95"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
          aria-label="Account menu"
        >
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="w-7 h-7 rounded-full object-cover"
              draggable={false}
              referrerPolicy="no-referrer"
            />
          ) : (
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-body font-bold"
              style={{
                background: "hsl(var(--game-gold) / 0.2)",
                color: "hsl(var(--game-gold))",
              }}
            >
              {initials || "?"}
            </span>
          )}
          <span
            className="hidden sm:inline text-xs font-body font-bold uppercase tracking-wider max-w-[8rem] truncate"
            style={{ color: "hsl(var(--game-gold))" }}
          >
            {name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate">{name}</span>
          {profile?.email && (
            <span className="text-xs font-normal text-muted-foreground truncate">
              {profile.email}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
