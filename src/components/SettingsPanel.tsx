import { X, LayoutGrid, BarChart2, Hourglass, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  "All Categories",
  "Art",
  "Economics",
  "Food",
  "Games",
  "Geography",
  "History",
  "Human Body",
  "Language",
  "Law",
  "Literature",
  "Math",
  "Miscellaneous",
  "Movies",
  "Music",
  "Nature",
  "Philosophy",
  "Politics",
  "Pop Culture",
  "Science",
  "Sports",
  "Technology",
  "Television",
  "Theater",
  "Theology",
  "Video Games",
];

const difficulties = ["Easy", "Medium", "Hard", "Genius"];
const eras = ["Ancient", "Medieval", "Modern", "Contemporary"];

const difficultyColor: Record<string, string> = {
  Easy: "hsl(160 65% 50%)",
  Medium: "hsl(42 100% 55%)",
  Hard: "hsl(28 90% 52%)",
  Genius: "hsl(340 70% 60%)",
};

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All Categories"]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(["Medium", "Hard"]);
  const [selectedEras, setSelectedEras] = useState<string[]>(["Modern", "Contemporary"]);
  const [numQuestions, setNumQuestions] = useState(40);
  const [timePerQuestion, setTimePerQuestion] = useState(10);
  const [timePerAnswer, setTimePerAnswer] = useState(5);

  const toggleCategory = (cat: string) => {
    if (cat === "All Categories") {
      setSelectedCategories(
        selectedCategories.includes("All Categories") ? [] : ["All Categories"]
      );
      return;
    }
    const withoutAll = selectedCategories.filter((v) => v !== "All Categories");
    setSelectedCategories(
      withoutAll.includes(cat) ? withoutAll.filter((v) => v !== cat) : [...withoutAll, cat]
    );
  };

  const toggle = (
    val: string,
    set: React.Dispatch<React.SetStateAction<string[]>>,
    arr: string[]
  ) => {
    set(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: "hsl(240 45% 10% / 0.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Sliding panel */}
      <div
        className="fixed top-0 right-0 h-full z-40 flex"
        style={{
          width: "min(360px, 90vw)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Close tab on left edge */}
        <button
          onClick={onClose}
          className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-l-2xl transition-all duration-200 hover:brightness-110 active:scale-95"
          style={{
            background: "hsl(var(--game-card))",
            border: "1px solid hsl(var(--game-card-border))",
            borderRight: "none",
            boxShadow: "-4px 0 16px hsl(240 45% 10% / 0.4)",
          }}
          aria-label="Close settings"
        >
          <X className="w-5 h-5 text-game-gold" />
        </button>

        {/* Panel body */}
        <div
          className="flex-1 flex flex-col overflow-y-auto"
          style={{
            background: "hsl(var(--game-card))",
            borderLeft: "1px solid hsl(var(--game-card-border))",
            boxShadow: "-8px 0 48px hsl(240 45% 10% / 0.7)",
          }}
        >
          {/* Top nav links */}
          <div className="flex items-center justify-end gap-6 px-6 pt-5 pb-3">
            <button className="text-xs font-black tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              LOGIN
            </button>
            <button className="text-xs font-black tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              ABOUT US
            </button>
          </div>

          <div className="px-6 mb-2">
            <div className="h-px" style={{ background: "hsl(var(--game-card-border))" }} />
          </div>

          {/* Title */}
          <div className="px-6 py-4">
            <h2
              className="text-4xl font-black leading-none tracking-tight uppercase"
              style={{
                fontFamily: "'Fredoka One', 'Nunito', sans-serif",
                background: "linear-gradient(160deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 45%, hsl(28 90% 40%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.05,
              }}
            >
              CUSTOMIZE<br />YOUR GAME<br />EXPERIENCE
            </h2>
          </div>

          <div className="px-6 mb-4">
            <div className="h-px" style={{ background: "hsl(var(--game-card-border))" }} />
          </div>

          {/* Categories — scrollable, 50vh tall */}
          <section
            className="mx-4 mb-4 rounded-2xl flex flex-col"
            style={{
              background: "hsl(240 42% 15%)",
              border: "1px solid hsl(var(--game-card-border))",
              height: "50vh",
              minHeight: 0,
            }}
          >
            <div className="flex items-center gap-2 px-4 pt-4 pb-3 shrink-0">
              <LayoutGrid className="w-4 h-4 text-[hsl(185_70%_55%)]" />
              <span className="text-xs font-black tracking-widest text-[hsl(185_70%_55%)] uppercase">
                Categories
              </span>
            </div>

            <div
              className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-3"
              style={{ scrollbarWidth: "thin", scrollbarColor: "hsl(185 70% 35%) transparent" }}
            >
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between py-2.5 cursor-pointer"
                    style={{ borderBottom: "1px solid hsl(var(--game-card-border))" }}
                    onClick={() => toggleCategory(cat)}
                  >
                    <Switch
                      checked={active}
                      onCheckedChange={() => toggleCategory(cat)}
                      className="data-[state=checked]:bg-[hsl(185_70%_50%)] data-[state=unchecked]:bg-[hsl(240_35%_22%)]"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span
                      className="text-xs font-black tracking-widest uppercase transition-colors"
                      style={{ color: active ? "hsl(185 70% 70%)" : "hsl(var(--muted-foreground))" }}
                    >
                      {cat}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Difficulty */}
          <section className="px-6 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-[hsl(185_70%_55%)]" />
              <span className="text-xs font-black tracking-widest text-[hsl(185_70%_55%)] uppercase">
                Difficulty
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((diff) => {
                const active = selectedDifficulties.includes(diff);
                return (
                  <button
                    key={diff}
                    onClick={() => toggle(diff, setSelectedDifficulties, selectedDifficulties)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      background: active ? `${difficultyColor[diff]}22` : "hsl(var(--game-progress))",
                      border: `1px solid ${active ? difficultyColor[diff] : "transparent"}`,
                      color: active ? difficultyColor[diff] : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Eras */}
          <section className="px-6 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Hourglass className="w-4 h-4 text-[hsl(185_70%_55%)]" />
              <span className="text-xs font-black tracking-widest text-[hsl(185_70%_55%)] uppercase">
                Eras
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {eras.map((era) => {
                const active = selectedEras.includes(era);
                return (
                  <button
                    key={era}
                    onClick={() => toggle(era, setSelectedEras, selectedEras)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      background: active ? "hsl(280 60% 50% / 0.25)" : "hsl(var(--game-progress))",
                      border: `1px solid ${active ? "hsl(280 60% 60%)" : "transparent"}`,
                      color: active ? "hsl(280 60% 75%)" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {era}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Game Settings */}
          <section
            className="mx-4 mb-6 rounded-2xl p-4"
            style={{
              background: "hsl(240 42% 15%)",
              border: "1px solid hsl(var(--game-card-border))",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-[hsl(185_70%_55%)]" />
              <span className="text-xs font-black tracking-widest text-[hsl(185_70%_55%)] uppercase">
                Game Settings
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-lg font-black text-foreground">{numQuestions}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Questions</span>
              </div>
              <input
                type="range" min={5} max={80} step={5} value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "hsl(185 70% 55%)" }}
              />
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-lg font-black text-foreground">{timePerQuestion}s</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">/ Question</span>
              </div>
              <input
                type="range" min={5} max={60} step={5} value={timePerQuestion}
                onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "hsl(185 70% 55%)" }}
              />
            </div>

            <div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-lg font-black text-foreground">{timePerAnswer}s</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">/ Answer</span>
              </div>
              <input
                type="range" min={2} max={30} step={1} value={timePerAnswer}
                onChange={(e) => setTimePerAnswer(Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "hsl(185 70% 55%)" }}
              />
            </div>
          </section>

          {/* Apply button */}
          <div className="px-4 pb-8">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, hsl(42 100% 58%), hsl(35 90% 45%))",
                color: "hsl(240 45% 16%)",
                boxShadow: "0 6px 24px hsl(42 100% 55% / 0.35)",
              }}
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
