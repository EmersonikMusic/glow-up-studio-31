import { Link } from "react-router-dom";
import { trackClick } from "@/lib/analytics";

export default function TermsFooter() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
      <p className="text-[10px] sm:text-xs font-body font-semibold text-white whitespace-nowrap">
        Copyright © 2026 Triviolivia Inc. All rights reserved.
      </p>
      <span className="hidden sm:inline text-[10px] sm:text-xs font-body font-semibold text-white/50">·</span>
      <Link
        to="/"
        onClick={() => trackClick("click_terms_home")}
        className="howto-link text-[10px] sm:text-xs font-body font-semibold underline underline-offset-[3px] text-white hover:text-[hsl(185_70%_55%)] transition-colors"
        aria-label="Back to start screen"
      >
        Home
      </Link>
      <span className="hidden sm:inline text-[10px] sm:text-xs font-body font-semibold text-white/50">·</span>
      <span
        className="text-[10px] sm:text-xs font-body font-semibold text-white/80"
        aria-current="page"
      >
        Terms of Service & Privacy Policy
      </span>
    </div>
  );
}
