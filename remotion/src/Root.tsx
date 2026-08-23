import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { MascotShow, MASCOT_DURATION } from "./MascotShow";
import { DURATION, FPS } from "./theme";


const SIZES = [
  { id: "pmax-16x9", width: 1920, height: 1080 },
  { id: "pmax-1x1", width: 1080, height: 1080 },
  { id: "pmax-9x16", width: 1080, height: 1920 },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="mascots-9x16"
        component={MascotShow}
        durationInFrames={MASCOT_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />
      {SIZES.map((s) => (
        <Composition
          key={s.id}
          id={s.id}
          component={MainVideo}
          durationInFrames={DURATION}
          fps={FPS}
          width={s.width}
          height={s.height}
        />
      ))}
    </>

  );
};
