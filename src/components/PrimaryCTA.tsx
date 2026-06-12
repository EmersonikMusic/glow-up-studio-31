import { ButtonHTMLAttributes, forwardRef, MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { trackClick } from "@/lib/analytics";

export interface PrimaryCTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional explicit GA control id. Falls back to aria-label, then button text. */
  trackId?: string;
}

const PrimaryCTA = forwardRef<HTMLButtonElement, PrimaryCTAProps>(
  ({ className, children, style, onClick, trackId, ...props }, ref) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      const id =
        trackId ||
        (props["aria-label"] as string | undefined) ||
        (typeof children === "string" ? children : "primary_cta");
      const eventName = `cta_primary_${id}`;
      trackClick(eventName);
      onClick?.(e);
    };
    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "nav-btn min-h-14 py-2 px-10 rounded-full border-2 border-[#221948] whitespace-nowrap",
          "bg-[linear-gradient(0deg,#e93e3a_0%,#ed683c_11%,#f3903f_33%,#fdc70c_72%,#fff33b_100%)]",
          "text-white text-xl font-heading font-extrabold tracking-[0.18em] uppercase",
          "shadow-lg shadow-black/30 transition-all duration-200",
          "inline-flex items-center justify-center gap-2",
          "disabled:opacity-60 disabled:cursor-not-allowed active:scale-95",
          className
        )}
        style={{ textShadow: "0 2px 3px rgba(87,33,91,0.6)", ...style }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PrimaryCTA.displayName = "PrimaryCTA";

export default PrimaryCTA;
