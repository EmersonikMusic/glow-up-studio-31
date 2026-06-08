import { ButtonHTMLAttributes, forwardRef, MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { trackClick } from "@/lib/analytics";

export interface SecondaryCTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  trackId?: string;
}

const SecondaryCTA = forwardRef<HTMLButtonElement, SecondaryCTAProps>(
  ({ className, children, style, onClick, trackId, ...props }, ref) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      const id =
        trackId ||
        (props["aria-label"] as string | undefined) ||
        (typeof children === "string" ? children : "secondary_cta");
      trackClick(`cta_secondary__${id}`);
      onClick?.(e);
    };
    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "nav-btn min-h-14 py-2 px-10 rounded-full whitespace-nowrap",
          "bg-transparent text-white text-xl font-heading font-extrabold tracking-[0.18em] uppercase",
          "transition-all duration-200",
          "inline-flex items-center justify-center gap-2",
          "disabled:opacity-60 disabled:cursor-not-allowed active:scale-95",
          className
        )}
        style={{
          border: "2px solid rgba(255, 255, 255, 0.25)",
          textShadow: "0 2px 3px rgba(0, 0, 0, 0.45)",
          ...style,
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SecondaryCTA.displayName = "SecondaryCTA";

export default SecondaryCTA;
