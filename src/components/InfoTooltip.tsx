import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface InfoTooltipProps {
  content: string;
  children: React.ReactNode;
  /**
   * When the tooltip opens via long-press on touch, we set this ref to true
   * so the wrapped row can skip its click handler for the follow-up tap.
   */
  suppressClickRef?: React.MutableRefObject<boolean>;
}

type Placement = "right" | "left" | "top" | "bottom";

const HOVER_OPEN_DELAY = 250;
const HOVER_CLOSE_DELAY = 100;
const LONG_PRESS_MS = 500;
const TOUCH_MOVE_TOLERANCE = 8;
const TOUCH_AUTO_HIDE_MS = 4000;
const TOOLTIP_MAX_WIDTH = 280;
const TOOLTIP_MAX_WIDTH_MOBILE = 220;
const GAP = 10;
const MOBILE_PLACEMENT_VW = 480;

export default function InfoTooltip({ content, children, suppressClickRef }: InfoTooltipProps) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const autoHideTimer = useRef<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement>("right");
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [maxWidth, setMaxWidth] = useState<number>(TOOLTIP_MAX_WIDTH);

  const clearTimers = useCallback(() => {
    if (openTimer.current) { window.clearTimeout(openTimer.current); openTimer.current = null; }
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null; }
    if (longPressTimer.current) { window.clearTimeout(longPressTimer.current); longPressTimer.current = null; }
    if (autoHideTimer.current) { window.clearTimeout(autoHideTimer.current); autoHideTimer.current = null; }
  }, []);

  const computePosition = useCallback(() => {
    const trigger = wrapRef.current;
    const tip = tooltipRef.current;
    if (!trigger || !tip) return;
    const rect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isNarrow = vw < MOBILE_PLACEMENT_VW;
    const effectiveMaxW = isNarrow ? TOOLTIP_MAX_WIDTH_MOBILE : TOOLTIP_MAX_WIDTH;
    setMaxWidth(effectiveMaxW);

    const tipW = tip.offsetWidth || effectiveMaxW;
    const tipH = tip.offsetHeight || 60;

    // On narrow screens, place the tooltip above the trigger so it doesn't overlap the row label.
    let chosen: Placement = isNarrow ? "top" : "right";
    if (chosen === "top" && rect.top - GAP - tipH >= 8) {
      chosen = "top";
    } else if (chosen === "top" && rect.bottom + GAP + tipH <= vh - 8) {
      chosen = "bottom";
    } else if (rect.right + GAP + tipW <= vw - 8) {
      chosen = "right";
    } else if (rect.left - GAP - tipW >= 8) {
      chosen = "left";
    } else if (rect.top - GAP - tipH >= 8) {
      chosen = "top";
    } else {
      chosen = "bottom";
    }

    let top = 0, left = 0;
    if (chosen === "right") {
      left = rect.right + GAP;
      top = rect.top + rect.height / 2 - tipH / 2;
    } else if (chosen === "left") {
      left = rect.left - GAP - tipW;
      top = rect.top + rect.height / 2 - tipH / 2;
    } else if (chosen === "top") {
      left = rect.left + rect.width / 2 - tipW / 2;
      top = rect.top - GAP - tipH;
    } else {
      left = rect.left + rect.width / 2 - tipW / 2;
      top = rect.bottom + GAP;
    }
    // Clamp
    left = Math.max(8, Math.min(left, vw - tipW - 8));
    top = Math.max(8, Math.min(top, vh - tipH - 8));

    setPlacement(chosen);
    setCoords({ top, left });
  }, []);

  useEffect(() => {
    if (!open) return;
    // Position once tip is in the DOM, then again after fonts settle.
    computePosition();
    const raf = requestAnimationFrame(computePosition);
    const onScroll = () => setOpen(false);
    const onResize = () => computePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, computePosition]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // Pointer (hover) — only for fine pointers, not touch.
  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null; }
    if (openTimer.current) window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setOpen(true), HOVER_OPEN_DELAY);
  };
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (openTimer.current) { window.clearTimeout(openTimer.current); openTimer.current = null; }
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY);
  };

  // Touch (long-press)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchStart.current = { x: t.clientX, y: t.clientY };
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => {
      if (suppressClickRef) suppressClickRef.current = true;
      setOpen(true);
      if (autoHideTimer.current) window.clearTimeout(autoHideTimer.current);
      autoHideTimer.current = window.setTimeout(() => setOpen(false), TOUCH_AUTO_HIDE_MS);
    }, LONG_PRESS_MS);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) { window.clearTimeout(longPressTimer.current); longPressTimer.current = null; }
    touchStart.current = null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    const start = touchStart.current;
    if (!t || !start) return;
    if (Math.abs(t.clientX - start.x) > TOUCH_MOVE_TOLERANCE || Math.abs(t.clientY - start.y) > TOUCH_MOVE_TOLERANCE) {
      cancelLongPress();
    }
  };
  const onTouchEnd = () => {
    cancelLongPress();
    // Clear the suppress flag on the next tick so the click handler that fires
    // right after touchend sees it, but subsequent taps behave normally.
    if (suppressClickRef?.current) {
      window.setTimeout(() => { if (suppressClickRef) suppressClickRef.current = false; }, 0);
    }
  };

  // Dismiss on outside pointer down when open (touch: next tap anywhere).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const w = wrapRef.current;
      const t = tooltipRef.current;
      const target = e.target as Node;
      if (w?.contains(target) || t?.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener("pointerdown", onDown, true);
    return () => window.removeEventListener("pointerdown", onDown, true);
  }, [open]);

  return (
    <>
      <div
        ref={wrapRef}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={cancelLongPress}
        aria-describedby={open ? id : undefined}
        style={{ WebkitTouchCallout: "none", touchAction: "manipulation" }}
      >
        {children}
      </div>
      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={tooltipRef}
          id={id}
          role="tooltip"
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            maxWidth: maxWidth,
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(10, 12, 20, 0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid hsl(185 70% 55% / 0.35)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
            color: "hsl(0 0% 92%)",
            fontSize: 12,
            lineHeight: 1.45,
            zIndex: 9999,
            pointerEvents: "none",
            animation: "info-tooltip-in 120ms ease-out",
          }}
          className="font-body"
        >
          {content}
          <span
            aria-hidden
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              background: "rgba(10, 12, 20, 0.92)",
              borderTop: "1px solid hsl(185 70% 55% / 0.35)",
              borderLeft: "1px solid hsl(185 70% 55% / 0.35)",
              transform: "rotate(45deg)",
              ...(placement === "right"
                ? { left: -5, top: "50%", marginTop: -4, transform: "rotate(-45deg)" }
                : placement === "left"
                ? { right: -5, top: "50%", marginTop: -4, transform: "rotate(135deg)" }
                : placement === "top"
                ? { bottom: -5, left: "50%", marginLeft: -4, transform: "rotate(-135deg)" }
                : { top: -5, left: "50%", marginLeft: -4, transform: "rotate(45deg)" }),
            }}
          />
          <style>{`@keyframes info-tooltip-in { from { opacity: 0; transform: translateY(2px);} to { opacity: 1; transform: translateY(0);} }`}</style>
        </div>,
        document.body,
      )}
    </>
  );
}
