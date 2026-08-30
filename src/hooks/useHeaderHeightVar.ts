import { useLayoutEffect, type RefObject } from "react";

/**
 * Publishes the measured height of the app header as the CSS variable
 * `--app-header-h` on <html>, so fixed panels can pin their top edge
 * flush under the nav bar. Kept up to date on resize / orientation change.
 */
export function useHeaderHeightVar(ref: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      if (h > 0) {
        document.documentElement.style.setProperty("--app-header-h", `${h}px`);
      }
    };

    apply();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(apply) : null;
    ro?.observe(el);
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, [ref]);
}
