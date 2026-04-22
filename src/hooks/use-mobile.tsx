import * as React from "react";

const MOBILE_BREAKPOINT = 768;
// Phone-shape detection in landscape: short viewport AND not-too-wide.
// Tablets in landscape have height >= 768, so this cleanly excludes them.
const LANDSCAPE_MAX_HEIGHT = 500;
const LANDSCAPE_MAX_WIDTH = 950;

function computeIsMobile(): boolean {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < MOBILE_BREAKPOINT) return true;
  // Phone landscape: short + not wider than a phone in landscape
  if (h <= LANDSCAPE_MAX_HEIGHT && w <= LANDSCAPE_MAX_WIDTH && w > h) return true;
  return false;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const onChange = () => setIsMobile(computeIsMobile());
    onChange();
    window.addEventListener("resize", onChange);
    window.addEventListener("orientationchange", onChange);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
    };
  }, []);

  return !!isMobile;
}
