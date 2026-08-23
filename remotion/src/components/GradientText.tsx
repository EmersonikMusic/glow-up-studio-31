import React from "react";
import { LOGO_GRADIENT } from "../theme";

// Red->yellow gradient text (matches the Triviolivia logo).
export const GradientText: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  return (
    <span
      style={{
        backgroundImage: LOGO_GRADIENT,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        ...style,
      }}
    >
      {children}
    </span>
  );
};
