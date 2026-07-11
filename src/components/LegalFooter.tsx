import { trackClick } from "@/lib/analytics";

interface LegalFooterProps {
  onPrivacy: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function LegalFooter({ onPrivacy, className = "", style }: LegalFooterProps) {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${className}`} style={style}>
      <p className="text-[10px] sm:text-xs font-body font-semibold text-white whitespace-nowrap">
        Copyright © 2026 Triviolivia Inc. All rights reserved.
      </p>
      <span className="hidden sm:inline text-[10px] sm:text-xs font-body font-semibold text-white/50">·</span>
      <button
        onClick={() => { trackClick("click_privacy_policy"); onPrivacy(); }}
        className="howto-link text-[10px] sm:text-xs font-body font-semibold underline underline-offset-[3px] text-white hover:text-[hsl(185_70%_55%)] transition-colors"
        aria-label="Open Terms of Service and Privacy Policy"
      >
        Terms of Service & Privacy Policy
      </button>
    </div>
  );
}

