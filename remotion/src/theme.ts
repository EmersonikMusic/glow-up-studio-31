import { spring, interpolate, Easing } from "remotion";

// ---- Brand palette ----
export const COLORS = {
  bg0: "#2b1c5a",
  bg1: "#161035",
  bg2: "#0c0822",
  gold: "#ffc922",
  goldDeep: "#f3903f",
  teal: "#3dd0d6",
  white: "#ffffff",
  ink: "#e7e9ff",
};

// Red -> yellow logo gradient (matches TO_LOGO_FINAL-2.svg)
export const LOGO_GRADIENT =
  "linear-gradient(180deg, #e93e3a 0%, #f3903f 35%, #fdc70c 72%, #fff33b 100%)";

export const DURATION = 450; // 15s @ 30fps
export const FPS = 30;

// ---- Scene boundaries (frames) ----
export const SCENES = {
  hook: { from: 0, to: 75 },
  free: { from: 75, to: 180 },
  custom: { from: 180, to: 285 },
  play: { from: 285, to: 375 },
  end: { from: 375, to: 450 },
};

// ---- Phone screens ----
export type PhoneScreen = "start" | "settings" | "game";

export const PHONE_IMG: Record<PhoneScreen, string> = {
  start: "images/start.png",
  settings: "images/settings.png",
  game: "images/game.png",
};

export const PHONE_ASPECT = 453 / 930;

// ---- Layout per aspect ratio ----
export type Layout = {
  variant: "wide" | "square" | "vertical";
  phoneHeight: number;
  phoneLeft: number;
  phoneTop: number;
  textArea: { left: number; top: number; width: number };
  headlineSize: number;
  bodySize: number;
  logoHeight: number;
};

export function getLayout(width: number, height: number): Layout {
  const variant: Layout["variant"] =
    Math.abs(width - height) < 80
      ? "square"
      : height > width
      ? "vertical"
      : "wide";

  if (variant === "wide") {
    const phoneHeight = height * 0.82;
    const phoneWidth = phoneHeight * PHONE_ASPECT;
    return {
      variant,
      phoneHeight,
      phoneLeft: width - phoneWidth - 120,
      phoneTop: (height - phoneHeight) / 2,
      textArea: { left: 120, top: height * 0.26, width: width * 0.5 },
      headlineSize: 96,
      bodySize: 38,
      logoHeight: 230,
    };
  }
  if (variant === "square") {
    const phoneHeight = height * 0.5;
    const phoneWidth = phoneHeight * PHONE_ASPECT;
    return {
      variant,
      phoneHeight,
      phoneLeft: (width - phoneWidth) / 2,
      phoneTop: height * 0.46,
      textArea: { left: 80, top: 90, width: width - 160 },
      headlineSize: 84,
      bodySize: 34,
      logoHeight: 200,
    };
  }
  // vertical
  const phoneHeight = height * 0.6;
  const phoneWidth = phoneHeight * PHONE_ASPECT;
  return {
    variant,
    phoneHeight,
    phoneLeft: (width - phoneWidth) / 2,
    phoneTop: height * 0.38,
    textArea: { left: 70, top: 150, width: width - 140 },
    headlineSize: 92,
    bodySize: 40,
    logoHeight: 240,
  };
}

// ---- Phone motion state ----
export type PhoneState = {
  angle: number;
  front: PhoneScreen;
  back: PhoneScreen;
  opacity: number;
  scale: number;
  rotateZ: number;
  translateY: number;
  blur: number;
};

export function getPhoneState(frame: number, fps: number): PhoneState {
  let angle = 0;
  let front: PhoneScreen = "start";
  let back: PhoneScreen = "settings";
  let opacity = 1;
  let scale = 1;
  let rotateZ = 0;
  let translateY = 0;
  let blur = 0;

  if (frame < 75) {
    opacity = 0;
    scale = 0.7;
  } else if (frame < 120) {
    const p = spring({
      frame: frame - 75,
      fps,
      config: { damping: 13, stiffness: 110, mass: 1 },
    });
    angle = interpolate(p, [0, 1], [-78, 0]);
    rotateZ = interpolate(p, [0, 1], [-20, 0]);
    scale = interpolate(p, [0, 1], [0.74, 1]);
    blur = interpolate(p, [0, 1], [14, 0]);
    opacity = interpolate(frame - 75, [0, 10], [0, 1], {
      extrapolateRight: "clamp",
    });
    front = "start";
    back = "settings";
  } else if (frame < 168) {
    front = "start";
    back = "settings";
  } else if (frame < 192) {
    const p = interpolate(frame, [168, 192], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    });
    angle = interpolate(p, [0, 1], [0, 180]);
    front = "start";
    back = "settings";
  } else if (frame < 273) {
    front = "settings";
    back = "game";
  } else if (frame < 297) {
    const p = interpolate(frame, [273, 297], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    });
    angle = interpolate(p, [0, 1], [0, 180]);
    front = "settings";
    back = "game";
  } else if (frame < 360) {
    front = "game";
    back = "game";
  } else {
    const p = interpolate(frame, [360, 390], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    });
    scale = interpolate(p, [0, 1], [1, 0.62]);
    opacity = interpolate(p, [0, 1], [1, 0]);
    translateY = interpolate(p, [0, 1], [0, 160]);
    angle = interpolate(p, [0, 1], [0, 24]);
    front = "game";
    back = "game";
  }

  // idle drift so nothing is ever static
  const idle = Math.sin(frame / 19) * 2.4;
  rotateZ += idle;

  return { angle, front, back, opacity, scale, rotateZ, translateY, blur };
}
