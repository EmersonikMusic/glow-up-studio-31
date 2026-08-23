import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SCENES } from "./theme";
import { PersistentBackground } from "./components/PersistentBackground";
import { Phone } from "./components/Phone";
import { Hook } from "./scenes/Hook";
import { Free } from "./scenes/Free";
import { Custom } from "./scenes/Custom";
import { Play } from "./scenes/Play";
import { EndCard } from "./scenes/EndCard";

// Persistent background + persistent 3D phone span the whole timeline.
// Scene overlays are sequenced on top of them; the phone handles its own
// entrance/flip/exit via getPhoneState().
export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <PersistentBackground />
      <Phone />
      <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.to - SCENES.hook.from}>
        <Hook />
      </Sequence>
      <Sequence from={SCENES.free.from} durationInFrames={SCENES.free.to - SCENES.free.from}>
        <Free />
      </Sequence>
      <Sequence from={SCENES.custom.from} durationInFrames={SCENES.custom.to - SCENES.custom.from}>
        <Custom />
      </Sequence>
      <Sequence from={SCENES.play.from} durationInFrames={SCENES.play.to - SCENES.play.from}>
        <Play />
      </Sequence>
      <Sequence from={SCENES.end.from} durationInFrames={SCENES.end.to - SCENES.end.from}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
