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
import { rubik, quicksand } from "../fonts";

const CHIPS = [
  { label: "GEOGRAPHY", color: COLORS.teal },
  { label: "CASUAL", color: COLORS.gold },
  { label: "1990s", color: "#c386ff" },
];

export const Custom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const layout = getLayout(width, height);

  const headSpring = spring({ frame, fps, config: { damping: 13, stiffness: 100 } });
  const headY = interpolate(headSpring, [0, 1], [45, 0]);
  const headOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  const fadeOut = interpolate(frame, [96, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ta = layout.textArea;

  // chips anchor near the phone, stacked horizontally or vertically
  const vertical = layout.variant === "vertical" || layout.variant === "square";
  const chipAreaLeft = vertical
    ? ta.left
    : ta.left + ta.width * 0.04;
  const chipAreaTop = vertical
    ? height * (layout.variant === "square" ? 0.78 : 0.86)
    : ta.top + layout.headlineSize * 1.9;

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
            fontSize: layout.headlineSize,
            lineHeight: 1.02,
            transform: `translateY(${headY}px)`,
            opacity: headOpacity,
            color: COLORS.white,
          }}
        >
          <GradientText>Make</GradientText> it yours.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: chipAreaLeft,
          top: chipAreaTop,
          display: "flex",
          flexDirection: vertical ? "row" : "column",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        {CHIPS.map((chip, i) => {
          const delay = 22 + i * 7;
          const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 130 } });
          const x = interpolate(s, [0, 1], [-40, 0]);
          const op = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={chip.label}
              style={{
                fontFamily: rubik,
                fontWeight: 700,
                fontSize: layout.bodySize * 0.92,
                letterSpacing: 2,
                color: COLORS.white,
                background: "rgba(255,255,255,0.06)",
                border: `2px solid ${chip.color}`,
                borderRadius: 999,
                padding: "12px 26px",
                transform: `translateX(${x}px)`,
                opacity: op,
                backdropFilter: "blur(4px)",
              }}
            >
              {chip.label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
