import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { getLayout, COLORS } from "../theme";
import { GradientText } from "../components/GradientText";
import { rubik, quicksand } from "../fonts";

const FEATURES = [
  { icon: "grid", text: "TACKLE 25 CATEGORIES" },
  { icon: "bars", text: "CONQUER 5 DIFFICULTY LEVELS" },
  { icon: "tree", text: "EXPLORE 12 HISTORICAL ERAS" },
];

const FeatureIcon: React.FC<{ kind: string; color: string; size: number }> = ({
  kind,
  color,
  size,
}) => {
  const p = { fill: "none", stroke: color, strokeWidth: 6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "grid")
    return (
      <svg viewBox="0 0 48 48" style={{ width: size, height: size }}>
        <rect x="8" y="8" width="13" height="13" rx="2" {...p} />
        <rect x="27" y="8" width="13" height="13" rx="2" {...p} />
        <rect x="8" y="27" width="13" height="13" rx="2" {...p} />
        <rect x="27" y="27" width="13" height="13" rx="2" {...p} />
      </svg>
    );
  if (kind === "bars")
    return (
      <svg viewBox="0 0 48 48" style={{ width: size, height: size }}>
        <rect x="8" y="26" width="8" height="16" rx="2" {...p} />
        <rect x="20" y="16" width="8" height="26" rx="2" {...p} />
        <rect x="32" y="8" width="8" height="34" rx="2" {...p} />
      </svg>
    );
  return (
    <svg viewBox="0 0 48 48" style={{ width: size, height: size }}>
      <circle cx="14" cy="14" r="6" {...p} />
      <circle cx="34" cy="12" r="5" {...p} />
      <circle cx="40" cy="30" r="5" {...p} />
      <circle cx="24" cy="34" r="6" {...p} />
      <path d="M14 20 V34 M24 20 V28 M34 17 V27" {...p} />
    </svg>
  );
};

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const layout = getLayout(width, height);

  const bgSpring = spring({ frame, fps, config: { damping: 200 } });
  const bgOpacity = interpolate(bgSpring, [0, 1], [0, 1]);

  const headDelay = 8;
  const headSpring = spring({ frame: frame - headDelay, fps, config: { damping: 12, stiffness: 90 } });
  const headY = interpolate(headSpring, [0, 1], [60, 0]);
  const headOpacity = interpolate(frame, [headDelay, headDelay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subDelay = 16;
  const subSpring = spring({ frame: frame - subDelay, fps, config: { damping: 14 } });
  const subY = interpolate(subSpring, [0, 1], [30, 0]);
  const subOpacity = interpolate(frame, [subDelay, subDelay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaDelay = 34;
  const ctaSpring = spring({ frame: frame - ctaDelay, fps, config: { damping: 11, stiffness: 130 } });
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.6, 1]);
  const ctaOpacity = interpolate(frame, [ctaDelay, ctaDelay + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaPulse = 1 + Math.sin(frame / 12) * 0.02;

  const vertical = layout.variant === "vertical";

  const headSize =
    layout.variant === "wide" ? 150 : layout.variant === "square" ? 120 : 110;

  return (
    <AbsoluteFill
      style={{
        opacity: bgOpacity,
        background: `radial-gradient(120% 100% at 50% 0%, ${COLORS.bg0} 0%, ${COLORS.bg1} 50%, ${COLORS.bg2} 100%)`,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: vertical ? "70px 60px" : "60px 120px",
      }}
    >
      {/* headline */}
      <div
        style={{
          textAlign: "center",
          transform: `translateY(${headY}px)`,
          opacity: headOpacity,
          lineHeight: 0.95,
        }}
      >
        <div
          style={{
            fontFamily: rubik,
            fontWeight: 900,
            fontSize: headSize * 0.62,
            color: COLORS.white,
            letterSpacing: 2,
          }}
        >
          READY TO
        </div>
        <div
          style={{
            fontFamily: rubik,
            fontWeight: 900,
            fontSize: headSize,
            letterSpacing: 2,
          }}
        >
          <GradientText>PLAY?</GradientText>
        </div>
      </div>

      {/* subhead */}
      <div
        style={{
          fontFamily: rubik,
          fontWeight: 700,
          fontSize: layout.bodySize * 1.05,
          color: COLORS.white,
          letterSpacing: 3,
          marginTop: 18,
          transform: `translateY(${subY}px)`,
          opacity: subOpacity,
          textAlign: "center",
        }}
      >
        TRIVIA. BUILT YOUR WAY.
      </div>

      {/* feature list */}
      <div
        style={{
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          gap: vertical ? 22 : 48,
          marginTop: 38,
          alignItems: vertical ? "center" : "flex-start",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {FEATURES.map((f, i) => {
          const d = 22 + i * 6;
          const s = spring({ frame: frame - d, fps, config: { damping: 13 } });
          const y = interpolate(s, [0, 1], [26, 0]);
          const op = interpolate(frame, [d, d + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={f.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                transform: `translateY(${y}px)`,
                opacity: op,
              }}
            >
              <FeatureIcon kind={f.icon} color={COLORS.teal} size={42} />
              <span
                style={{
                  fontFamily: rubik,
                  fontWeight: 700,
                  fontSize: layout.bodySize * 0.8,
                  color: COLORS.white,
                  letterSpacing: 1.5,
                }}
              >
                {f.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA + url */}
      <div
        style={{
          marginTop: 44,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          transform: `scale(${ctaScale * ctaPulse})`,
          opacity: ctaOpacity,
        }}
      >
        <div
          style={{
            fontFamily: rubik,
            fontWeight: 900,
            fontSize: layout.bodySize * 1.1,
            letterSpacing: 2,
            color: "#1a1020",
            background: "linear-gradient(90deg,#fdc70c,#ff4500)",
            padding: "20px 56px",
            borderRadius: 999,
            boxShadow: "0 12px 40px rgba(255,150,40,0.4)",
          }}
        >
          PLAY NOW
        </div>
        <div
          style={{
            fontFamily: quicksand,
            fontWeight: 700,
            fontSize: layout.bodySize * 0.72,
            color: COLORS.teal,
            letterSpacing: 2,
          }}
        >
          triviolivia.com
        </div>
      </div>

      {/* logo lockup bottom */}
      <div
        style={{
          position: "absolute",
          left: vertical ? 0 : 90,
          right: 0,
          bottom: vertical ? height * 0.06 : 60,
          display: "flex",
          justifyContent: vertical ? "center" : "flex-start",
        }}
      >
        <Img
          src={staticFile("images/logo.svg")}
          style={{
            width: layout.variant === "wide" ? 360 : 300,
            height: (layout.variant === "wide" ? 360 : 300) * (922 / 2684),
            objectFit: "contain",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
