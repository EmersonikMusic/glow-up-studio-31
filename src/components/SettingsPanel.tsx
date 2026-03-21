import { X, LayoutGrid, BarChart2, Hourglass, SlidersHorizontal, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
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

const difficulties = ["Casual", "Easy", "Average", "Hard", "Genius"];
const eras = ["Pre-1500", "1500-1800", "1800-1900", "1900-1950", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

const SWITCH_ON = "data-[state=checked]:bg-[hsl(185_70%_50%)] data-[state=unchecked]:bg-[hsl(240_35%_22%)]";

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(["Average", "Hard"]);
  const [selectedEras, setSelectedEras] = useState<string[]>(["1990s", "2000s", "2010s", "2020s"]);
  const [numQuestions, setNumQuestions] = useState(40);
  const [timePerQuestion, setTimePerQuestion] = useState(10);
  const [timePerAnswer, setTimePerAnswer] = useState(5);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [difficultiesExpanded, setDifficultiesExpanded] = useState(false);
  const [erasExpanded, setErasExpanded] = useState(false);

  // Categories
  const allCatsSelected = categories.every((c) => selectedCategories.includes(c));
  const toggleAllCategories = () => {
    if (allCatsSelected) {
      setSelectedCategories([]);
      categories.forEach((c) => console.log(`${c}: FALSE`));
    } else {
      setSelectedCategories([...categories]);
      categories.forEach((c) => console.log(`${c}: TRUE`));
    }
  };
  const toggleCategory = (cat: string) => {
    const isActive = selectedCategories.includes(cat);
    setSelectedCategories(isActive ? selectedCategories.filter((v) => v !== cat) : [...selectedCategories, cat]);
    console.log(`${cat}: ${isActive ? "FALSE" : "TRUE"}`);
  };

  // Difficulties
  const allDiffsSelected = difficulties.every((d) => selectedDifficulties.includes(d));
  const toggleAllDifficulties = () => {
    if (allDiffsSelected) {
      setSelectedDifficulties([]);
      difficulties.forEach((d) => console.log(`${d}: FALSE`));
    } else {
      setSelectedDifficulties([...difficulties]);
      difficulties.forEach((d) => console.log(`${d}: TRUE`));
    }
  };
  const toggleDifficulty = (diff: string) => {
    const isActive = selectedDifficulties.includes(diff);
    setSelectedDifficulties(isActive ? selectedDifficulties.filter((v) => v !== diff) : [...selectedDifficulties, diff]);
    console.log(`${diff}: ${isActive ? "FALSE" : "TRUE"}`);
  };

  // Eras
  const allErasSelected = eras.every((e) => selectedEras.includes(e));
  const toggleAllEras = () => {
    if (allErasSelected) {
      setSelectedEras([]);
      eras.forEach((e) => console.log(`${e}: FALSE`));
    } else {
      setSelectedEras([...eras]);
      eras.forEach((e) => console.log(`${e}: TRUE`));
    }
  };
  const toggleEra = (era: string) => {
    const isActive = selectedEras.includes(era);
    setSelectedEras(isActive ? selectedEras.filter((v) => v !== era) : [...selectedEras, era]);
    console.log(`${era}: ${isActive ? "FALSE" : "TRUE"}`);
  };

  const visibleCategories = categoriesExpanded ? categories : categories.slice(0, 4);
  const visibleDifficulties = difficultiesExpanded ? difficulties : difficulties.slice(0, 4);
  const visibleEras = erasExpanded ? eras : eras.slice(0, 4);

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

          {/* Categories */}
          <section
            className="mx-4 mb-4 rounded-2xl flex flex-col"
            style={{
              background: "hsl(240 42% 15%)",
              border: "1px solid hsl(var(--game-card-border))",
            }}
          >
            {/* Section header */}
            <div className="flex items-center gap-2 px-4 pt-4 pb-3 shrink-0">
              <LayoutGrid className="w-4 h-4 text-[hsl(185_70%_55%)]" />
              <span className="text-xs font-black tracking-widest text-[hsl(185_70%_55%)] uppercase">
                Categories
              </span>
            </div>

            {/* ALL CATEGORIES parent toggle */}
            <div
              className="flex items-center gap-3 px-4 py-3 cursor-pointer shrink-0 transition-colors hover:bg-[hsl(240_42%_18%)]"
              style={{ borderBottom: "1px solid hsl(var(--game-card-border))" }}
              onClick={toggleAllCategories}
            >
              <Switch
                checked={allCatsSelected}
                onCheckedChange={toggleAllCategories}
                className={SWITCH_ON}
                onClick={(e) => e.stopPropagation()}
              />
              <span
                className="text-xs font-black tracking-widest uppercase transition-colors"
                style={{ color: allCatsSelected ? "hsl(185 70% 70%)" : "hsl(var(--muted-foreground))" }}
              >
                All Categories
              </span>
            </div>

            {/* Individual categories */}
            <div className="flex flex-col">
              {visibleCategories.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <div
                    key={cat}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-[hsl(240_42%_18%)]"
                    style={{ borderBottom: "1px solid hsl(var(--game-card-border))" }}
                    onClick={() => toggleCategory(cat)}
                  >
                    <Switch
                      checked={active}
                      onCheckedChange={() => toggleCategory(cat)}
                      className={SWITCH_ON}
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

            {/* 3-dot / collapse button */}
            <button
              onClick={() => setCategoriesExpanded((v) => !v)}
              className="flex items-center justify-center py-3 w-full transition-colors hover:bg-[hsl(240_42%_18%)] rounded-b-2xl"
              aria-label={categoriesExpanded ? "Collapse categories" : "Expand categories"}
            >
              {categoriesExpanded ? (
                <span className="text-[10px] font-black tracking-widest text-[hsl(185_70%_55%)] uppercase">Show less ↑</span>
              ) : (
                <MoreHorizontal className="w-5 h-5 text-[hsl(185_70%_55%)]" />
              )}
            </button>
          </section>

          {/* Difficulty */}
          <section
            className="mx-4 mb-4 rounded-2xl flex flex-col"
            style={{ background: "hsl(240 42% 15%)", border: "1px solid hsl(var(--game-card-border))" }}
          >
            <div className="flex items-center gap-2 px-4 pt-4 pb-3 shrink-0">
              <BarChart2 className="w-4 h-4 text-[hsl(185_70%_55%)]" />
              <span className="text-xs font-black tracking-widest text-[hsl(185_70%_55%)] uppercase">Difficulty</span>
            </div>

            {/* ALL DIFFICULTIES parent toggle */}
            <div
              className="flex items-center gap-3 px-4 py-3 cursor-pointer shrink-0 transition-colors hover:bg-[hsl(240_42%_18%)]"
              style={{ borderBottom: "1px solid hsl(var(--game-card-border))" }}
              onClick={toggleAllDifficulties}
            >
              <Switch
                checked={allDiffsSelected}
                onCheckedChange={toggleAllDifficulties}
                className={SWITCH_ON}
                onClick={(e) => e.stopPropagation()}
              />
              <span
                className="text-xs font-black tracking-widest uppercase transition-colors"
                style={{ color: allDiffsSelected ? "hsl(185 70% 70%)" : "hsl(var(--muted-foreground))" }}
              >
                All Difficulties
              </span>
            </div>

            <div className="flex flex-col">
              {visibleDifficulties.map((diff) => {
                const active = selectedDifficulties.includes(diff);
                return (
                  <div
                    key={diff}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-[hsl(240_42%_18%)]"
                    style={{ borderBottom: "1px solid hsl(var(--game-card-border))" }}
                    onClick={() => toggleDifficulty(diff)}
                  >
                    <Switch
                      checked={active}
                      onCheckedChange={() => toggleDifficulty(diff)}
                      className={SWITCH_ON}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span
                      className="text-xs font-black tracking-widest uppercase transition-colors"
                      style={{ color: active ? "hsl(185 70% 70%)" : "hsl(var(--muted-foreground))" }}
                    >
                      {diff}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setDifficultiesExpanded((v) => !v)}
              className="flex items-center justify-center py-3 w-full transition-colors hover:bg-[hsl(240_42%_18%)] rounded-b-2xl"
              aria-label={difficultiesExpanded ? "Collapse difficulties" : "Expand difficulties"}
            >
              {difficultiesExpanded ? (
                <span className="text-[10px] font-black tracking-widest text-[hsl(185_70%_55%)] uppercase">Show less ↑</span>
              ) : (
                <MoreHorizontal className="w-5 h-5 text-[hsl(185_70%_55%)]" />
              )}
            </button>
          </section>

          {/* Eras */}
          <section
            className="mx-4 mb-5 rounded-2xl flex flex-col"
            style={{ background: "hsl(240 42% 15%)", border: "1px solid hsl(var(--game-card-border))" }}
          >
            <div className="flex items-center gap-2 px-4 pt-4 pb-3 shrink-0">
              <Hourglass className="w-4 h-4 text-[hsl(185_70%_55%)]" />
              <span className="text-xs font-black tracking-widest text-[hsl(185_70%_55%)] uppercase">Eras</span>
            </div>

            {/* ALL ERAS parent toggle */}
            <div
              className="flex items-center gap-3 px-4 py-3 cursor-pointer shrink-0 transition-colors hover:bg-[hsl(240_42%_18%)]"
              style={{ borderBottom: "1px solid hsl(var(--game-card-border))" }}
              onClick={toggleAllEras}
            >
              <Switch
                checked={allErasSelected}
                onCheckedChange={toggleAllEras}
                className={SWITCH_ON}
                onClick={(e) => e.stopPropagation()}
              />
              <span
                className="text-xs font-black tracking-widest uppercase transition-colors"
                style={{ color: allErasSelected ? "hsl(185 70% 70%)" : "hsl(var(--muted-foreground))" }}
              >
                All Eras
              </span>
            </div>

            <div className="flex flex-col">
              {visibleEras.map((era) => {
                const active = selectedEras.includes(era);
                return (
                  <div
                    key={era}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-[hsl(240_42%_18%)]"
                    style={{ borderBottom: "1px solid hsl(var(--game-card-border))" }}
                    onClick={() => toggleEra(era)}
                  >
                    <Switch
                      checked={active}
                      onCheckedChange={() => toggleEra(era)}
                      className={SWITCH_ON}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span
                      className="text-xs font-black tracking-widest uppercase transition-colors"
                      style={{ color: active ? "hsl(185 70% 70%)" : "hsl(var(--muted-foreground))" }}
                    >
                      {era}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setErasExpanded((v) => !v)}
              className="flex items-center justify-center py-3 w-full transition-colors hover:bg-[hsl(240_42%_18%)] rounded-b-2xl"
              aria-label={erasExpanded ? "Collapse eras" : "Expand eras"}
            >
              {erasExpanded ? (
                <span className="text-[10px] font-black tracking-widest text-[hsl(185_70%_55%)] uppercase">Show less ↑</span>
              ) : (
                <MoreHorizontal className="w-5 h-5 text-[hsl(185_70%_55%)]" />
              )}
            </button>
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
