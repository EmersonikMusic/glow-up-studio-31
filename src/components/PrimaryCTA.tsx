import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface PrimaryCTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const PrimaryCTA = forwardRef<HTMLButtonElement, PrimaryCTAProps>(
  ({ className, children, style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "nav-btn min-h-14 py-2 px-10 rounded-full border-2 border-[#57215b] whitespace-nowrap",
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
