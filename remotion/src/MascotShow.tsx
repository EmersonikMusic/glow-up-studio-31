import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { rubik, quicksand } from "./fonts";

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

export const CARD_FRAMES = 15; // 0.5s each
export const END_FRAMES = 75; // 2.5s
export const MASCOT_DURATION = CATEGORIES.length * CARD_FRAMES + END_FRAMES; // 450

export const MascotShow: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const index = Math.floor(frame / CARD_FRAMES);
  const isEnd = index >= CATEGORIES.length;

  if (isEnd) {
    return (
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 100% at 50% 20%, #2b1c5a 0%, #161035 55%, #0c0822 100%)",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 80px",
          gap: 56,
        }}
      >
        <Img
          src={staticFile("images/logo.svg")}
          style={{
            width: width * 0.86,
            height: width * 0.86 * (922 / 2684),
            objectFit: "contain",
          }}
        />
        <div
          style={{
            fontFamily: rubik,
            fontWeight: 900,
            fontSize: 62,
            color: "#ffffff",
            textAlign: "center",
            letterSpacing: 1,
            lineHeight: 1.25,
          }}
        >
          Play now at
          <br />
          <span style={{ fontFamily: quicksand, fontWeight: 700, color: "#ffc922" }}>
            www.TRIVIOLIVIA.com
          </span>
        </div>
      </AbsoluteFill>
    );
  }

  const category = CATEGORIES[index];

  return (
    <AbsoluteFill
      style={{
        background: CATEGORY_COLORS[category],
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 0 190px 0",
      }}
    >
      <Img
        src={staticFile(`mascots/${fileName(category)}.svg`)}
        style={{
          width: width * 0.82,
          height: height * 0.6,
          objectFit: "contain",
          objectPosition: "bottom center",
        }}
      />
      <div
        style={{
          marginTop: 48,
          fontFamily: rubik,
          fontWeight: 900,
          fontSize: 84,
          letterSpacing: 2,
          color: "#ffffff",
          textAlign: "center",
          textShadow: "0 6px 26px rgba(0,0,0,0.35)",
          textTransform: "uppercase",
        }}
      >
        {category}
      </div>
    </AbsoluteFill>
  );
};
