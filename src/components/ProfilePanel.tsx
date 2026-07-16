import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { ChevronsLeft, Pencil, Check, X, LogOut, UserCircle2, Trash2 } from "lucide-react";
import AchievementsSection from "./AchievementsSection";
import { BADGES } from "@/data/badgeData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { trackClick } from "@/lib/analytics";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

interface ProfileRow {
  username: string | null;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  total_games_played: number;
  unlocked_badges: string[] | null;
  last_played_at: string | null;
  first_game_completed_at: string | null;
  created_at: string | null;
}

const GOLD_GRADIENT =
  "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)";

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function formatMonthYear(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
    });
  } catch {
    return null;
  }
}


export default function ProfilePanel({ open, onClose, user }: ProfilePanelProps) {
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftUsername, setDraftUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Panel always mounts; CSS keeps it hidden (opacity:0 + visibility:hidden)
  // until data-open="true". No mount/animate gate needed.


  useEffect(() => {
    if (!open || !user) return;
    let cancelled = false;
    supabase
      .from("profiles")
      .select("username, display_name, email, avatar_url, total_games_played, unlocked_badges, last_played_at, first_game_completed_at, created_at")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        setProfile(data as ProfileRow);
      });
    return () => {
      cancelled = true;
    };
  }, [open, user]);

  const avatar =
    profile?.avatar_url ??
    (user?.user_metadata?.avatar_url as string | undefined) ??
    null;
  const username =
    profile?.username ??
    profile?.display_name ??
    profile?.email ??
    user?.email ??
    "";
  const email = profile?.email ?? user?.email ?? "";
  const gamesCompleted = profile?.total_games_played ?? 0;
  const memberSince = formatMonthYear(profile?.created_at ?? user?.created_at ?? null);

  // Map earned badge names (stored in DB) to badge IDs for the achievements grid.
  const unlockedBadgeIds = useMemo(() => {
    const names = new Set(profile?.unlocked_badges ?? []);
    return BADGES.filter((b) => names.has(b.badgeName)).map((b) => b.id);
  }, [profile?.unlocked_badges]);

  const startEdit = () => {
    setDraftUsername(username);
    setEditing(true);
  };

  const saveUsername = async () => {
    if (!user) return;
    const next = draftUsername.trim();
    if (!next || next === username) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ username: next })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(
        error.code === "23505" ? "That username is already taken." : "Couldn't save username.",
      );
      return;
    }
    trackClick("profile_username_save");
    setProfile((p) => (p ? { ...p, username: next } : p));
    setEditing(false);
  };

  const handleSignOut = async () => {
    trackClick("profile_sign_out");
    await supabase.auth.signOut();
    onClose();
  };

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmText !== "DELETE") return;
    setDeleting(true);
    trackClick("profile_delete_account");
    const { error } = await supabase.functions.invoke("delete-account");
    if (error) {
      setDeleting(false);
      toast.error("Couldn't delete account. Please try again.");
      return;
    }
    await supabase.auth.signOut();
    setDeleting(false);
    setDeleteOpen(false);
    setDeleteConfirmText("");
    toast.success("Your account has been deleted.");
    onClose();
  };

  // Mobile drag-to-dismiss
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const dragOffset = useRef(0);
  const onDragStart = useCallback((y: number) => {
    dragStartY.current = y;
    dragOffset.current = 0;
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  }, []);
  const onDragMove = useCallback((y: number) => {
    if (dragStartY.current === null) return;
    const delta = Math.max(0, y - dragStartY.current);
    dragOffset.current = delta;
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${delta}px)`;
  }, []);
  const onDragEnd = useCallback(() => {
    if (sheetRef.current) sheetRef.current.style.transition = "";
    if (dragOffset.current > 120) onClose();
    else if (sheetRef.current) sheetRef.current.style.transform = "";
    dragStartY.current = null;
    dragOffset.current = 0;
  }, [onClose]);

  const panelContent = (
    <>
      {!isMobile && (
        <div className="px-5 pt-4 md:px-6 md:pt-5">
          <button
            onClick={() => { trackClick("profile_back"); onClose(); }}
            aria-label="Back"
            className="nav-btn flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <ChevronsLeft className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <div className="px-5 pt-2 pb-2 md:px-6 md:pt-2 md:pb-3">
        <h2
          className="text-4xl font-heading font-extrabold uppercase leading-none tracking-tight"
          style={{
            background: GOLD_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.05,
            textAlign: "center",
          }}
        >
          YOUR PROFILE
        </h2>
      </div>
      <div className="px-5 md:px-6 mb-3">
        <div className="h-px" style={{ background: "rgba(255, 255, 255, 0.1)" }} />
      </div>

      {/* Profile header card */}
      <section
        className="mx-5 mb-3 rounded-2xl flex flex-col items-center gap-3 p-5"
        style={{ background: "rgba(0, 0, 0, 0.15)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          {avatar ? (
            <img src={avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" draggable={false} />
          ) : (
            <UserCircle2 className="w-16 h-16" style={{ color: "hsl(185 70% 55%)" }} strokeWidth={1.5} />
          )}
        </div>

        {/* Username */}
        {editing ? (
          <div className="flex items-center gap-2 w-full max-w-xs">
            <input
              value={draftUsername}
              onChange={(e) => setDraftUsername(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") saveUsername();
                if (e.key === "Escape") setEditing(false);
              }}
              autoFocus
              className="flex-1 bg-black/30 border border-white/20 rounded-lg px-3 py-1.5 text-sm font-body font-bold text-white outline-none focus:border-[hsl(185_70%_55%)]"
              maxLength={40}
            />
            <button
              onClick={saveUsername}
              disabled={saving}
              aria-label="Save username"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[hsl(185_70%_50%)]/20 border border-[hsl(185_70%_55%)]/40 active:scale-95 transition-transform"
            >
              <Check className="w-4 h-4" style={{ color: "hsl(185 70% 65%)" }} />
            </button>
            <button
              onClick={() => setEditing(false)}
              aria-label="Cancel"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 border border-white/15 active:scale-95 transition-transform"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 max-w-full">
            <span className="text-lg font-subheading font-bold text-white truncate max-w-[14rem]">
              {username || "—"}
            </span>
            <button
              onClick={startEdit}
              aria-label="Edit username"
              className="w-7 h-7 rounded-full flex items-center justify-center bg-white/8 border border-white/15 active:scale-95 transition-transform hover:bg-white/15"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <Pencil className="w-3.5 h-3.5" style={{ color: "hsl(var(--game-gold))" }} />
            </button>
          </div>
        )}

        <div className="text-xs font-body text-white/60 truncate max-w-full">{email}</div>
        {memberSince && (
          <div className="text-[10px] font-body uppercase tracking-widest text-white/40">
            Member since {memberSince}
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-body font-bold uppercase tracking-widest transition-all active:scale-95"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "hsl(var(--game-gold))",
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </section>

      {/* Score Card */}
      <section
        className="mx-5 mb-3 rounded-2xl p-5"
        style={{ background: "rgba(0, 0, 0, 0.15)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <div className="text-xs font-subheading font-bold tracking-widest uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
          Score Card
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] font-body font-bold uppercase tracking-widest text-white/60 mb-1">
              Games Completed
            </div>
            <div className="text-3xl font-heading font-extrabold text-white leading-none">
              {gamesCompleted}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-body font-bold uppercase tracking-widest text-white/60 mb-1">
              Last Played
            </div>
            <div className="text-base font-subheading font-bold text-white">
              {formatDate(profile?.last_played_at ?? null)}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section
        className="mx-5 mb-6 rounded-2xl p-5"
        style={{ background: "rgba(0, 0, 0, 0.15)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <div className="text-xs font-subheading font-bold tracking-widest uppercase mb-4" style={{ color: "hsl(185 70% 55%)" }}>
          Achievements & Awards
        </div>
        <AchievementsSection unlockedIds={unlockedBadgeIds} />
      </section>

      {/* Danger zone */}
      <section
        className="mx-5 mb-6 rounded-2xl p-5"
        style={{
          background: "rgba(233, 62, 58, 0.06)",
          border: "1px solid rgba(233, 62, 58, 0.25)",
        }}
      >
        <div className="text-xs font-subheading font-bold tracking-widest uppercase mb-2" style={{ color: "rgb(255, 120, 116)" }}>
          Danger Zone
        </div>
        <p className="text-xs font-body text-white/60 mb-3 leading-relaxed">
          Permanently delete your account, profile, and progress. This can't be undone.
        </p>
        <button
          onClick={() => {
            setDeleteConfirmText("");
            setDeleteOpen(true);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-body font-bold uppercase tracking-widest transition-all active:scale-95"
          style={{
            background: "rgba(233, 62, 58, 0.12)",
            border: "1px solid rgba(233, 62, 58, 0.5)",
            color: "rgb(255, 140, 136)",
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Account
        </button>
      </section>

      <AlertDialog open={deleteOpen} onOpenChange={(o) => { if (!deleting) setDeleteOpen(o); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes your profile, progress, and achievements. This can't be undone.
              Type <span className="font-bold text-foreground">DELETE</span> to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            autoFocus
            className="w-full h-11 px-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50"
          />
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE" || deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting…" : "Delete account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  if (isMobile) {
    return (
      <>
        <div
          data-testid="profile-panel-backdrop"
          className="fixed inset-0 z-30 transition-opacity duration-300"
          style={{ background: "hsl(240 45% 10% / 0.6)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
          onClick={onClose}
        />
        <div
          ref={sheetRef}
          data-testid="profile-panel-sheet"
          className="settings-sheet-mobile fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-3xl"
          data-open={open ? "true" : "false"}
          style={{
            maxHeight: "92dvh",
            background: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(24px)",
            border: "1.5px solid rgba(255, 255, 255, 0.18)",
            borderBottom: "none",
            boxShadow: "0 -8px 48px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            className="flex items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
            onTouchMove={(e) => onDragMove(e.touches[0].clientY)}
            onTouchEnd={onDragEnd}
            onMouseDown={(e) => {
              onDragStart(e.clientY);
              const onMove = (ev: MouseEvent) => onDragMove(ev.clientY);
              const onUp = () => {
                onDragEnd();
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
              };
              window.addEventListener("mousemove", onMove);
              window.addEventListener("mouseup", onUp);
            }}
          >
            <div className="w-10 h-1 rounded-full" style={{ background: "hsl(var(--muted-foreground) / 0.4)" }} />
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">{panelContent}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        data-testid="profile-panel-backdrop"
        className="fixed inset-0 z-30 transition-opacity duration-300"
        style={{ background: "hsl(240 45% 10% / 0.4)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />
      <div
        data-testid="profile-panel-desktop"
        className="settings-sheet-desktop fixed inset-y-0 right-0 z-40 flex w-[420px] md:w-[55%] lg:w-[40%] xl:w-[32%] max-w-[480px]"
        data-open={open ? "true" : "false"}
      >
        <div
          className="flex-1 flex flex-col min-h-0"
          style={{
            background: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(24px)",
            borderLeft: "1.5px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "-8px 0 48px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="flex-1 overflow-y-auto min-h-0">{panelContent}</div>
        </div>
      </div>
    </>
  );
}
