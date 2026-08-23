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
import { rubik, quicksand } from "../fonts";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const layout = getLayout(width, height);

  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 90, mass: 1 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1]);
  const logoOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const tagDelay = 18;
  const tagSpring = spring({
    frame: frame - tagDelay,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const tagY = interpolate(tagSpring, [0, 1], [40, 0]);
  const tagOpacity = interpolate(frame, [tagDelay, tagDelay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [68, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoW = Math.min(width * 0.7, 1500);
  const logoH = logoW * (922 / 2684);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Img
          src={staticFile("images/logo.svg")}
          style={{ width: logoW, height: logoH, objectFit: "contain" }}
        />
        <div
          style={{
            fontFamily: quicksand,
            fontWeight: 700,
            fontSize: layout.bodySize * 0.95,
            letterSpacing: 6,
            color: COLORS.teal,
            marginTop: 18,
            transform: `translateY(${tagY}px)`,
            opacity: tagOpacity,
            textTransform: "uppercase",
          }}
        >
          Earth's Deepest Trivia Source
        </div>
      </div>
    </AbsoluteFill>
  );
};
