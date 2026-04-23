import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SecondaryCTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Outlined/ghost variant matching PrimaryCTA's shape & font, with reduced
 * visual weight (transparent background, white border, white text).
 */
const SecondaryCTA = forwardRef<HTMLButtonElement, SecondaryCTAProps>(
  ({ className, children, style, ...props }, ref) => {
    return (
      <button
        ref={ref}
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
