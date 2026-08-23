import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { getLayout, COLORS } from "../theme";
import { GradientText } from "../components/GradientText";
import { rubik } from "../fonts";

export const Play: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const layout = getLayout(width, height);

  const headSpring = spring({ frame, fps, config: { damping: 12, stiffness: 90 } });
  const headY = interpolate(headSpring, [0, 1], [50, 0]);
  const headOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // countdown ring accent
  const ringSpring = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const ringScale = interpolate(ringSpring, [0, 1], [0.5, 1]);
  const ringOpacity = interpolate(frame, [10, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sweep = interpolate(frame, [12, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [82, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ta = layout.textArea;
  const ringSize = layout.variant === "vertical" ? 150 : 120;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <div
        style={{
          position: "absolute",
          left: ta.left,
          top: ta.top,
          width: ta.width,
        }}
      >
        <div
          style={{
            fontFamily: rubik,
            fontWeight: 900,
            fontSize: layout.headlineSize * 0.86,
            lineHeight: 1.05,
            transform: `translateY(${headY}px)`,
            opacity: headOpacity,
            color: COLORS.white,
          }}
        >
          Call out your answer before the <GradientText>timer runs out!</GradientText>
        </div>
      </div>

      {/* countdown ring */}
      <div
        style={{
          position: "absolute",
          right: layout.variant === "wide" ? 90 : width / 2 - ringSize / 2,
          top: layout.variant === "vertical" ? height * 0.22 : height * 0.16,
          width: ringSize,
          height: ringSize,
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
        }}
      >
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="7"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={COLORS.gold}
            strokeWidth="7"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            strokeDasharray={2 * Math.PI * 44}
            strokeDashoffset={2 * Math.PI * 44 * (1 - sweep)}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
