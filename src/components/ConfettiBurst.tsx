import { useEffect, useState } from "react";

/**
 * CSS-only confetti burst. ~12 particles, 1.2s lifecycle, then unmounts.
 */

const COLORS = [
  "hsl(42 100% 55%)", // gold
  "hsl(42 100% 70%)", // light gold
  "hsl(185 70% 55%)", // teal
  "hsl(280 60% 65%)", // purple
  "hsl(0 0% 100%)",   // white
];

interface Particle {
  id: number;
  color: string;
  cx: number;
  cy: number;
  cr: number;
  size: number;
  left: number;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    cx: (Math.random() - 0.5) * 220, // -110px → 110px
    cy: 180 + Math.random() * 100,    // 180px → 280px down
    cr: (Math.random() - 0.5) * 720,  // tumble
    size: 6 + Math.random() * 6,
    left: 50 + (Math.random() - 0.5) * 30, // %
    delay: Math.random() * 80,
  }));
}

export default function ConfettiBurst({ count = 12 }: { count?: number }) {
  const [particles] = useState(() => generateParticles(count));
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setMounted(false), 1400);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible z-30" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-piece absolute rounded-sm"
          style={
            {
              top: 0,
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.5,
              background: p.color,
              animationDelay: `${p.delay}ms`,
              "--cx": `${p.cx}px`,
              "--cy": `${p.cy}px`,
              "--cr": `${p.cr}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
