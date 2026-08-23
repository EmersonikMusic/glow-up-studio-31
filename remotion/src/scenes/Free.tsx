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

export const Free: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const layout = getLayout(width, height);

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 100 },
  });
  const hY = interpolate(headlineSpring, [0, 1], [50, 0]);
  const hOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subDelay = 14;
  const subSpring = spring({ frame: frame - subDelay, fps, config: { damping: 15 } });
  const subY = interpolate(subSpring, [0, 1], [30, 0]);
  const subOpacity = interpolate(frame, [subDelay, subDelay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mascotDelay = 22;
  const mascotSpring = spring({
    frame: frame - mascotDelay,
    fps,
    config: { damping: 10, stiffness: 120 },
  });
  const mascotScale = interpolate(mascotSpring, [0, 1], [0.3, 1]);
  const mascotOpacity = interpolate(frame, [mascotDelay, mascotDelay + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mascotBob = Math.sin(frame / 14) * 10;

  const fadeOut = interpolate(frame, [96, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ta = layout.textArea;
  const mascotSize = layout.variant === "vertical" ? 220 : 180;

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
            transform: `translateY(${hY}px)`,
            opacity: hOpacity,
            color: COLORS.white,
          }}
        >
          <GradientText>Free</GradientText> to play.
        </div>
        <div
          style={{
            fontFamily: rubik,
            fontWeight: 700,
            fontSize: layout.headlineSize * 0.62,
            marginTop: 14,
            color: COLORS.white,
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
          }}
        >
          No signup.
        </div>
      </div>

      {/* mascot */}
      <div
        style={{
          position: "absolute",
          left:
            layout.variant === "wide"
              ? ta.left + ta.width * 0.62
              : width - mascotSize - 90,
          top:
            layout.variant === "vertical"
              ? height * 0.2
              : layout.textArea.top + layout.headlineSize * 1.6,
          width: mascotSize,
          height: mascotSize,
          opacity: mascotOpacity,
          transform: `scale(${mascotScale}) translateY(${mascotBob}px)`,
        }}
      >
        <Img
          src={staticFile("images/mascot.svg")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </AbsoluteFill>
  );
};
