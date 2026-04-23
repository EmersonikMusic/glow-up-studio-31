import * as React from "react";

const MOBILE_BREAKPOINT = 768;

function computeIsMobile(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const onChange = () => setIsMobile(computeIsMobile());
    onChange();
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return !!isMobile;
}
