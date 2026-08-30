import { Loader2 } from "lucide-react";
import PrimaryCTA from "./PrimaryCTA";
import SecondaryCTA from "./SecondaryCTA";
import { trackClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface CTASlot {
  /** Button label shown when not loading. */
  label: string;
  onClick: () => void;
  trackId: string;
  ariaLabel: string;
}

interface CTAStackProps {
  /** Primary CTA — shows a spinner + "Loading…" while `loading` is true. */
  primary: CTASlot;
  /** Secondary CTAs rendered below the primary, each separated by mt-3. */
  secondary: CTASlot[];
  /** "How to Play" link handler. The component fires the click_how_to_play event. */
  onHowToPlay: () => void;
  /** When true, the primary CTA shows a spinner and both CTAs are disabled. */
  loading?: boolean;
  /** Reduces horizontal button padding on mobile so longer labels fit. */
  compactMobilePadding?: boolean;
  /** Fade-in animation delay in ms for the CTA buttons (default 180). */
  animationDelay?: number;
}

/**
 * Shared CTA stack used by StartScreen and PlayLandingScreen.
 *
 * Owns the container, inter-button gaps, and the "How to Play" link so the two
 * screens cannot drift apart. Both CTAs share one width via the w-fit wrapper.
 */
export default function CTAStack({
  primary,
  secondary,
  onHowToPlay,
  loading = false,
  compactMobilePadding = false,
  animationDelay = 180,
}: CTAStackProps) {
  const buttonPadding = compactMobilePadding ? "px-5 sm:px-10" : undefined;

  return (
    <>
      {/* CTA stack — shared width so all buttons match */}
      <div className="mt-8 flex flex-col items-stretch w-fit mx-auto max-w-full">
        <PrimaryCTA
          onClick={primary.onClick}
          disabled={loading}
          trackId={primary.trackId}
          className={cn("w-full animate-fade-in", buttonPadding)}
          style={{ animationDelay: `${animationDelay}ms` }}
          aria-label={loading ? "Loading questions" : primary.ariaLabel}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>Loading…</span>
            </>
          ) : (
            primary.label
          )}
        </PrimaryCTA>

        {secondary.map((slot) => (
          <SecondaryCTA
            key={slot.trackId}
            onClick={slot.onClick}
            disabled={loading}
            trackId={slot.trackId}
            className={cn("mt-3 w-full animate-fade-in", buttonPadding)}
            style={{ animationDelay: `${animationDelay}ms` }}
            aria-label={slot.ariaLabel}
          >
            {slot.label}
          </SecondaryCTA>
        ))}
      </div>

      {/* How to Play link */}
      <button
        onClick={() => {
          trackClick("click_how_to_play");
          onHowToPlay();
        }}
        className="howto-link mt-[22px] text-xs font-body font-semibold underline underline-offset-[5px] text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))] transition-colors animate-fade-in"
        style={{ animationDelay: `${animationDelay + 60}ms` }}
      >
        How to Play
      </button>
    </>
  );
}
