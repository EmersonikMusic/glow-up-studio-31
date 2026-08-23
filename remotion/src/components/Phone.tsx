import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  getPhoneState,
  getLayout,
  PHONE_IMG,
  type PhoneScreen,
} from "../theme";

// A single persistent 3D phone. Two faces (front/back) make the
// scene-change flip read as a real card turn: front face shows the
// current screen, back face shows the next, container rotates 0->180.
export const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const layout = getLayout(width, height);
  const st = getPhoneState(frame, fps);

  const phoneWidth = layout.phoneHeight * (453 / 930);

  const face = (screen: PhoneScreen, transform: string) => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform,
        borderRadius: 36,
        overflow: "hidden",
        boxShadow:
          "0 40px 120px rgba(0,0,0,0.6), 0 0 0 8px rgba(255,255,255,0.06), 0 0 0 10px rgba(0,0,0,0.5)",
      }}
    >
      <Img
        src={staticFile(PHONE_IMG[screen])}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: layout.phoneLeft,
        top: layout.phoneTop + st.translateY,
        width: phoneWidth,
        height: layout.phoneHeight,
        opacity: st.opacity,
        transform: `scale(${st.scale})`,
        perspective: 1600,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateY(${st.angle}deg) rotateZ(${st.rotateZ}deg)`,
          filter: st.blur ? `blur(${st.blur}px)` : undefined,
        }}
      >
        {face(st.front, "rotateY(0deg)")}
        {face(st.back, "rotateY(180deg)")}
      </div>
    </div>
  );
};
