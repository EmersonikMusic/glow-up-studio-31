import { useEffect, useState } from "react";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trackClick } from "@/lib/analytics";
import AuthModal from "./AuthModal";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleSignOut = async () => {
    trackClick("click_sign_out");
    await supabase.auth.signOut();
  };

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

  const name = profile?.display_name ?? user.email ?? "Account";
  const avatar = profile?.avatar_url;
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
  const teal = "hsl(185 70% 55%)";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="nav-btn flex items-center justify-center w-10 h-10 sm:w-auto sm:h-9 sm:px-4 rounded-full transition-all duration-200 active:scale-95 gap-1.5"
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
              className="w-5 h-5 rounded-full object-cover"
              draggable={false}
              referrerPolicy="no-referrer"
            />
          ) : initials ? (
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-body font-bold"
              style={{
                background: `${teal} / 0.2`,
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
