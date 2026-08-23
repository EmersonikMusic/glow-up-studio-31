import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { rubik, quicksand } from "./fonts";
import { FACES } from "./faces";

// Category background gradients — mirrors src/data/categoryColors.ts
export const CATEGORY_COLORS: Record<string, string> = {
  Art: "linear-gradient(345deg, rgba(165,50,27,1) 0%, rgba(221,126,107,1) 100%)",
  Economy: "linear-gradient(345deg, rgba(17,68,16,1) 0%, rgba(89,140,88,1) 100%)",
  "Food & Drink": "linear-gradient(345deg, rgba(127,43,11,1) 0%, rgba(242,133,0,1) 100%)",
  Games: "linear-gradient(345deg, rgba(103,38,24,1) 0%, rgba(204,85,0,1) 100%)",
  Geography: "linear-gradient(345deg, rgba(61,38,19,1) 0%, rgba(154,123,79,1) 100%)",
  History: "linear-gradient(345deg, rgba(241,194,50,1) 0%, rgba(241,154,50,1) 100%)",
  "Human Body": "linear-gradient(345deg, rgba(106,77,20,1) 0%, rgba(180,130,32,1) 100%)",
  Language: "linear-gradient(345deg, rgba(28,60,133,1) 0%, rgba(102,147,245,1) 100%)",
  Law: "linear-gradient(345deg, rgba(189,76,51,1) 0%, rgba(111,62,51,1) 100%)",
  Literature: "linear-gradient(345deg, rgba(202,128,39,1) 0%, rgba(217,157,41,1) 100%)",
  Math: "linear-gradient(345deg, rgba(63,61,54,1) 0%, rgba(101,99,92,1) 100%)",
  Miscellaneous: "linear-gradient(345deg, rgba(13,109,122,1) 0%, rgba(18,168,152,1) 100%)",
  Movies: "linear-gradient(345deg, rgba(184,34,34,1) 0%, rgba(102,0,0,1) 100%)",
  Music: "linear-gradient(345deg, rgba(9,110,62,1) 0%, rgba(29,185,84,1) 100%)",
  Nature: "linear-gradient(345deg, rgba(8,83,27,1) 0%, rgba(4,57,39,1) 100%)",
  "Performing Arts": "linear-gradient(345deg, rgba(183,75,0,1) 0%, rgba(183,0,0,1) 100%)",
  Philosophy: "linear-gradient(345deg, rgba(89,61,128,1) 0%, rgba(151,95,172,1) 100%)",
  Politics: "linear-gradient(345deg, rgba(84,30,140,1) 0%, rgba(53,28,117,1) 100%)",
  "Pop Culture": "linear-gradient(345deg, rgba(233,85,148,1) 0%, rgba(255,143,171,1) 100%)",
  Science: "linear-gradient(345deg, rgba(6,85,83,1) 0%, rgba(11,103,56,1) 100%)",
  Sports: "linear-gradient(345deg, rgba(44,66,121,1) 0%, rgba(19,30,58,1) 100%)",
  Technology: "linear-gradient(345deg, rgba(22,134,161,1) 0%, rgba(31,89,103,1) 100%)",
  Television: "linear-gradient(345deg, rgba(45,44,41,1) 0%, rgba(87,81,78,1) 100%)",
  Theology: "linear-gradient(345deg, rgba(64,14,66,1) 0%, rgba(60,19,33,1) 100%)",
  "Video Games": "linear-gradient(345deg, rgba(153,0,255,1) 0%, rgba(60,13,128,1) 100%)",
};

export const CATEGORIES = Object.keys(CATEGORY_COLORS).sort((a, b) =>
  a.localeCompare(b)
);

function fileName(category: string): string {
  return category
    .toLowerCase()
    .replace(/\s*&\s*/g, "-and-")
    .replace(/\s+/g, "-");
}

export const CARD_FRAMES = 9; // 0.3s each
export const END_FRAMES = 75; // 2.5s
export const MASCOT_DURATION = CATEGORIES.length * CARD_FRAMES + END_FRAMES; // 300 = 10s

const REEL_FRAMES = CATEGORIES.length * CARD_FRAMES; // 225
const XFADE = 3; // micro crossfade between cards
const END_XFADE = 8; // dissolve from last mascot into the end card

// Face lock: every mascot is scaled so her face is the same size, and shifted
// so the face centre sits at the exact same point on every card.
const FACE_WIDTH = 330; // on-screen width of the reference face box
const FACE_CENTER_Y = 640;

/** One mascot card — background, face-locked mascot, scrim, category label. */
const Card: React.FC<{ index: number; frame: number; opacity: number }> = ({
  index,
  frame,
  opacity,
}) => {
  const { width } = useVideoConfig();
  const category = CATEGORIES[index];
  const key = fileName(category);
  const face = FACES[key];
  const k = FACE_WIDTH / (300 * face.s);

  // local frame within this card (can run past CARD_FRAMES while fading out)
  const local = frame - index * CARD_FRAMES;

  // gentle life: slow float + a whisper of scale so nothing is frozen
  const float = Math.sin((frame / 30) * Math.PI * 0.9) * 6;
  const breathe = 1 + Math.sin(frame / 42) * 0.008;
  // background drift
  const bgShift = Math.sin(frame / 55) * 3;

  // label rises + fades on each cut
  const labelIn = interpolate(local, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(labelIn, [0, 1], [14, 0]);

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: CATEGORY_COLORS[category],
          transform: `scale(1.06) translateY(${bgShift}px)`,
        }}
      />
      <Img
        src={staticFile(`mascots-png/${key}.png`)}
        style={{
          position: "absolute",
          width: face.w * k,
          height: face.h * k,
          left: width / 2 - face.cx * k,
          top: FACE_CENTER_Y - face.cy * k,
          transform: `translateY(${float}px) scale(${breathe})`,
          transformOrigin: `${face.cx * k}px ${face.cy * k}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 420,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 130,
          fontFamily: rubik,
          fontWeight: 900,
          fontSize: 84,
          letterSpacing: 2,
          color: "#ffffff",
          textAlign: "center",
          textShadow: "0 6px 26px rgba(0,0,0,0.45)",
          textTransform: "uppercase",
          opacity: labelIn,
          transform: `translateY(${labelY}px)`,
        }}
      >
        {category}
      </div>
    </AbsoluteFill>
  );
};

/** Final logo + tagline + URL card. */
const EndCard: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const { fps, width } = useVideoConfig();
  const f = localFrame;

  const logoSpring = spring({
    frame: f,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const logoY = interpolate(logoSpring, [0, 1], [46, 0]);
  const logoBreathe = 1 + Math.sin(f / 34) * 0.012;
  const logoOpacity = interpolate(f, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tagDelay = 8;
  const tagSpring = spring({
    frame: f - tagDelay,
    fps,
    config: { damping: 18, stiffness: 90 },
  });
  const tagY = interpolate(tagSpring, [0, 1], [22, 0]);
  const tagOpacity = interpolate(f, [tagDelay, tagDelay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const urlDelay = 18;
  const urlSpring = spring({
    frame: f - urlDelay,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const urlY = interpolate(urlSpring, [0, 1], [26, 0]);
  const urlOpacity = interpolate(f, [urlDelay, urlDelay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const urlPulse = 1 + Math.sin(Math.max(0, f - urlDelay) / 11) * 0.018;

  // slow background brighten + drift over the hold
  const glow = interpolate(f, [0, END_FRAMES], [0.9, 1.25], {
    extrapolateRight: "clamp",
  });
  const glowY = interpolate(f, [0, END_FRAMES], [16, 24], {
    extrapolateRight: "clamp",
  });

  const logoW = width * 0.86;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(${120 * glow}% 100% at 50% ${glowY}%, #2f1f63 0%, #171139 55%, #0b0720 100%)`,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 70px",
      }}
    >
      <Img
        src={staticFile("images/logo.svg")}
        style={{
          width: logoW,
          height: logoW * (922 / 2684),
          objectFit: "contain",
          opacity: logoOpacity,
          transform: `translateY(${logoY}px) scale(${logoBreathe})`,
        }}
      />

      {/* Curved tagline — mirrors the app's start screen lockup */}
      <svg
        viewBox="-20 24 640 36"
        style={{
          width: width * 0.8,
          height: (width * 0.8 * 36) / 640,
          marginTop: 30,
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          overflow: "visible",
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <path id="tagline-arc" d="M 30 46 Q 300 14 570 46" fill="none" />
          <filter id="tagline-shadow" x="-20%" y="-80%" width="140%" height="260%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>
        <text
          fill="#3fd7de"
          style={{
            fontFamily: rubik,
            fontWeight: 800,
            fontSize: "24px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
          filter="url(#tagline-shadow)"
        >
          <textPath href="#tagline-arc" startOffset="50%" textAnchor="middle">
            Earth&apos;s Deepest Trivia Source
          </textPath>
        </text>
      </svg>

      <div
        style={{
          marginTop: 64,
          textAlign: "center",
          opacity: urlOpacity,
          transform: `translateY(${urlY}px) scale(${urlPulse})`,
          lineHeight: 1.3,
        }}
      >
        <div
          style={{
            fontFamily: rubik,
            fontWeight: 900,
            fontSize: 58,
            color: "#ffffff",
            letterSpacing: 1,
          }}
        >
          Play now at
        </div>
        <div
          style={{
            fontFamily: quicksand,
            fontWeight: 700,
            fontSize: 66,
            color: "#ffc922",
            letterSpacing: 1,
          }}
        >
          www.TRIVIOLIVIA.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MascotShow: React.FC = () => {
  const frame = useCurrentFrame();

  const rawIndex = Math.floor(frame / CARD_FRAMES);
  const index = Math.min(rawIndex, CATEGORIES.length - 1);
  const local = frame - index * CARD_FRAMES;

  // micro crossfade from the previous card
  const inOpacity =
    rawIndex >= CATEGORIES.length
      ? 1
      : interpolate(local, [0, XFADE], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const endLocal = frame - (REEL_FRAMES - END_XFADE);
  const endOpacity =
    endLocal <= 0
      ? 0
      : interpolate(endLocal, [0, END_XFADE], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0720" }}>
      {index > 0 && inOpacity < 1 ? (
        <Card index={index - 1} frame={frame} opacity={1} />
      ) : null}
      <Card index={index} frame={frame} opacity={inOpacity} />
      {endOpacity > 0 ? (
        <AbsoluteFill style={{ opacity: endOpacity }}>
          <EndCard localFrame={Math.max(0, frame - REEL_FRAMES)} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
