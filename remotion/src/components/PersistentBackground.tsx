import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

// Drifting ambient blobs + subtle grid that span the whole video.
export const PersistentBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const b1 = Math.sin(frame / 90) * 60;
  const b2 = Math.cos(frame / 110) * 80;
  const b3 = Math.sin(frame / 70 + 1.5) * 50;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 30% 18%, ${COLORS.bg0} 0%, ${COLORS.bg1} 46%, ${COLORS.bg2} 100%)`,
      }}
    >
      {/* ambient color blobs */}
      <div
        style={{
          position: "absolute",
          width: width * 0.7,
          height: width * 0.7,
          left: width * 0.1 + b1,
          top: height * 0.05 + b2,
          borderRadius: "50%",
          background: COLORS.gold,
          opacity: 0.1,
          filter: "blur(120px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: width * 0.6,
          height: width * 0.6,
          right: width * 0.05 - b2,
          bottom: height * 0.05 - b3,
          borderRadius: "50%",
          background: COLORS.teal,
          opacity: 0.1,
          filter: "blur(120px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: width * 0.45,
          height: width * 0.45,
          left: width * 0.42 + b3,
          top: height * 0.4 + b1,
          borderRadius: "50%",
          background: "#7a3df0",
          opacity: 0.12,
          filter: "blur(110px)",
        }}
      />
      {/* faint vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
