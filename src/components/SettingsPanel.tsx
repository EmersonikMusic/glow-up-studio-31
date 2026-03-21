import { X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import iconCategoriesActive from "@/assets/icon-categories-active.svg";
import iconCategoriesInactive from "@/assets/icon-categories-inactive.svg";
import iconDifficultyActive from "@/assets/icon-difficulty-active.svg";
import iconDifficultyInactive from "@/assets/icon-difficulty-inactive.svg";
import iconEraActive from "@/assets/icon-era-active.svg";
import iconEraInactive from "@/assets/icon-era-inactive.svg";
import iconSettingsActive from "@/assets/icon-settings-active.svg";
import iconSettingsInactive from "@/assets/icon-settings-inactive.svg";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  "Art","Economics","Food","Games","Geography","History","Human Body","Language","Law","Literature",
  "Math","Miscellaneous","Movies","Music","Nature","Philosophy","Politics","Pop Culture","Science",
  "Sports","Technology","Television","Theater","Theology","Video Games",
];
const difficulties = ["Casual", "Easy", "Average", "Hard", "Genius"];
const eras = ["Pre-1500","1500-1800","1800-1900","1900-1950","1950s","1960s","1970s","1980s","1990s","2000s","2010s","2020s"];

const SWITCH_ON = "data-[state=checked]:bg-[hsl(185_70%_50%)] data-[state=unchecked]:bg-[hsl(240_35%_22%)]";
const EXTRA_ROW_H = 42;
const SECTION_MAX = 2000;

function FadeIcon({ active, inactive, open }: { active: string; inactive: string; open: boolean }) {
  return (
    <div style={{ position: "relative", width: 24, height: 24, flexShrink: 0 }}>
      <img src={inactive} alt="" style={{ width: 24, height: 24, position: "absolute", inset: 0, opacity: open ? 0 : 1, transition: "opacity 0.3s ease" }} />
      <img src={active}   alt="" style={{ width: 24, height: 24, position: "absolute", inset: 0, opacity: open ? 1 : 0, transition: "opacity 0.3s ease" }} />
    </div>
  );
}

function SectionHeader({ icon, label, open, onToggle }: {
  icon: React.ReactNode; label: string; open: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 w-full shrink-0 transition-colors hover:bg-[hsl(240_42%_18%)] rounded-2xl"
      style={{ padding: "30px" }}
    >
      {icon}
      <span
        className="text-xs font-black tracking-widest uppercase flex-1 text-left transition-colors duration-300"
        style={{ color: open ? "hsl(185 70% 55%)" : "#fff" }}
      >{label}</span>
      <ChevronDown
        className="w-4 h-4 text-[hsl(185_70%_55%)] transition-transform duration-300"
        style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
      />
    </button>
  );
}

function ToggleRow({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <div
      className="flex items-center gap-3 py-2.5 cursor-pointer transition-colors hover:bg-[hsl(240_42%_18%)]"
      style={{ borderBottom: "1px solid hsl(var(--game-card-border))", paddingLeft: "30px", paddingRight: "30px" }}
      onClick={onClick}
    >
      <Switch checked={active} onCheckedChange={onClick} className={SWITCH_ON} onClick={(e) => e.stopPropagation()} />
      <span
        className="text-xs font-black tracking-widest uppercase transition-colors"
        style={{ color: active ? "hsl(185 70% 70%)" : "hsl(var(--muted-foreground))" }}
      >
        {label}
      </span>
    </div>
  );
}

function ExpandButton({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center w-full transition-colors hover:bg-[hsl(240_42%_18%)] rounded-b-2xl active:scale-95"
      style={{ borderTop: "1px solid hsl(var(--game-card-border))", padding: "14px 30px", minHeight: "48px" }}
      aria-label={expanded ? "Show less" : "Show more"}
    >
      {expanded ? (
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: "hsl(185 70% 55%)" }}>
          Show less ↑
        </span>
      ) : (
        <div className="flex items-center gap-[5px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full"
              style={{ width: "6px", height: "6px", background: "hsl(185 70% 55%)" }}
            />
          ))}
        </div>
      )}
    </button>
  );
}

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(["Average", "Hard"]);
  const [selectedEras, setSelectedEras] = useState<string[]>(["1990s", "2000s", "2010s", "2020s"]);
  const [numQuestions, setNumQuestions] = useState(40);
  const [timePerQuestion, setTimePerQuestion] = useState(10);
  const [timePerAnswer, setTimePerAnswer] = useState(5);

  // Section collapsed state — Categories open by default
  const [catOpen, setCatOpen] = useState(true);
  const [diffOpen, setDiffOpen] = useState(false);
  const [eraOpen, setEraOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);

  // Item-level expand (show more rows within section)
  const [catExpanded, setCatExpanded] = useState(false);
  const [diffExpanded, setDiffExpanded] = useState(false);
  const [eraExpanded, setEraExpanded] = useState(false);

  // --- Categories ---
  const allCatsSelected = categories.every((c) => selectedCategories.includes(c));
  const toggleAllCategories = () => {
    if (allCatsSelected) { setSelectedCategories([]); categories.forEach((c) => console.log(`${c}: FALSE`)); }
    else { setSelectedCategories([...categories]); categories.forEach((c) => console.log(`${c}: TRUE`)); }
  };
  const toggleCategory = (cat: string) => {
    const on = selectedCategories.includes(cat);
    setSelectedCategories(on ? selectedCategories.filter((v) => v !== cat) : [...selectedCategories, cat]);
    console.log(`${cat}: ${on ? "FALSE" : "TRUE"}`);
  };
  const catsVisible = categories.slice(0, 5);
  const catsExtra = categories.slice(5);

  // --- Difficulties ---
  const allDiffsSelected = difficulties.every((d) => selectedDifficulties.includes(d));
  const toggleAllDiffs = () => {
    if (allDiffsSelected) { setSelectedDifficulties([]); difficulties.forEach((d) => console.log(`${d}: FALSE`)); }
    else { setSelectedDifficulties([...difficulties]); difficulties.forEach((d) => console.log(`${d}: TRUE`)); }
  };
  const toggleDiff = (diff: string) => {
    const on = selectedDifficulties.includes(diff);
    setSelectedDifficulties(on ? selectedDifficulties.filter((v) => v !== diff) : [...selectedDifficulties, diff]);
    console.log(`${diff}: ${on ? "FALSE" : "TRUE"}`);
  };

  // --- Eras ---
  const allErasSelected = eras.every((e) => selectedEras.includes(e));
  const toggleAllEras = () => {
    if (allErasSelected) { setSelectedEras([]); eras.forEach((e) => console.log(`${e}: FALSE`)); }
    else { setSelectedEras([...eras]); eras.forEach((e) => console.log(`${e}: TRUE`)); }
  };
  const toggleEra = (era: string) => {
    const on = selectedEras.includes(era);
    setSelectedEras(on ? selectedEras.filter((v) => v !== era) : [...selectedEras, era]);
    console.log(`${era}: ${on ? "FALSE" : "TRUE"}`);
  };
  const diffsVisible = difficulties.slice(0, 5);
  const diffsExtra = difficulties.slice(5);
  const erasVisible = eras.slice(0, 5);
  const erasExtra = eras.slice(5);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 transition-opacity duration-300"
        style={{ background: "hsl(240 45% 10% / 0.4)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />

      {/* Sliding panel */}
      <div
        className="fixed inset-y-0 right-0 z-40 flex"
        style={{ width: "min(360px, 90vw)", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Close tab */}
        <button
          onClick={onClose}
          className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-l-2xl transition-all duration-200 hover:brightness-110 active:scale-95"
          style={{ background: "hsl(var(--game-card))", border: "1px solid hsl(var(--game-card-border))", borderRight: "none", boxShadow: "-4px 0 16px hsl(240 45% 10% / 0.4)" }}
          aria-label="Close settings"
        >
          <X className="w-5 h-5 text-game-gold" />
        </button>

        {/* Panel body */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ background: "hsl(var(--game-card))", borderLeft: "1px solid hsl(var(--game-card-border))", boxShadow: "-8px 0 48px hsl(240 45% 10% / 0.7)", display: "flex", flexDirection: "column" }}
        >
          {/* Nav links */}
          <div className="flex items-center justify-end gap-6 px-6 pt-5 pb-3">
            <button className="text-xs font-black tracking-widest text-muted-foreground hover:text-foreground transition-colors">LOGIN</button>
            <button className="text-xs font-black tracking-widest text-muted-foreground hover:text-foreground transition-colors">ABOUT US</button>
          </div>
          <div className="px-6 mb-2"><div className="h-px" style={{ background: "hsl(var(--game-card-border))" }} /></div>

          {/* Title */}
          <div className="px-6 py-4">
            <h2
              className="text-4xl font-black leading-none tracking-tight uppercase"
              style={{ fontFamily: "'Fredoka One', 'Nunito', sans-serif", background: "linear-gradient(160deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 45%, hsl(28 90% 40%) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.05 }}
            >
              CUSTOMIZE<br />YOUR GAME<br />EXPERIENCE
            </h2>
          </div>
          <div className="px-6 mb-4"><div className="h-px" style={{ background: "hsl(var(--game-card-border))" }} /></div>

          {/* ── CATEGORIES ── */}
          <section className="mx-4 mb-3 rounded-2xl flex flex-col" style={{ background: "hsl(240 42% 15%)", border: "1px solid hsl(var(--game-card-border))" }}>
            <SectionHeader icon={<img src={catOpen ? iconCategoriesActive : iconCategoriesInactive} alt="" style={{ width: 24, height: 24 }} />} label="Categories" open={catOpen} onToggle={() => setCatOpen((v) => !v)} />
            <div className="flex flex-col overflow-hidden" style={{ maxHeight: catOpen ? `${SECTION_MAX}px` : "0px", transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <ToggleRow label="All Categories" active={allCatsSelected} onClick={toggleAllCategories} />
              {catsVisible.map((cat) => (
                <ToggleRow key={cat} label={cat} active={selectedCategories.includes(cat)} onClick={() => toggleCategory(cat)} />
              ))}
              <div className="flex flex-col overflow-hidden" style={{ maxHeight: catExpanded ? `${catsExtra.length * EXTRA_ROW_H}px` : "0px", transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                {catsExtra.map((cat) => (
                  <ToggleRow key={cat} label={cat} active={selectedCategories.includes(cat)} onClick={() => toggleCategory(cat)} />
                ))}
              </div>
              <ExpandButton expanded={catExpanded} onToggle={() => setCatExpanded((v) => !v)} />
            </div>
          </section>

          {/* ── DIFFICULTY ── */}
          <section className="mx-4 mb-3 rounded-2xl flex flex-col" style={{ background: "hsl(240 42% 15%)", border: "1px solid hsl(var(--game-card-border))" }}>
            <SectionHeader icon={<img src={diffOpen ? iconDifficultyActive : iconDifficultyInactive} alt="" style={{ width: 24, height: 24 }} />} label="Difficulty" open={diffOpen} onToggle={() => setDiffOpen((v) => !v)} />
            <div className="flex flex-col overflow-hidden" style={{ maxHeight: diffOpen ? `${SECTION_MAX}px` : "0px", transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <ToggleRow label="All Difficulties" active={allDiffsSelected} onClick={toggleAllDiffs} />
              {difficulties.map((diff) => (
                <ToggleRow key={diff} label={diff} active={selectedDifficulties.includes(diff)} onClick={() => toggleDiff(diff)} />
              ))}
            </div>
          </section>

          {/* ── ERAS ── */}
          <section className="mx-4 mb-3 rounded-2xl flex flex-col" style={{ background: "hsl(240 42% 15%)", border: "1px solid hsl(var(--game-card-border))" }}>
            <SectionHeader icon={<img src={eraOpen ? iconEraActive : iconEraInactive} alt="" style={{ width: 24, height: 24 }} />} label="Eras" open={eraOpen} onToggle={() => setEraOpen((v) => !v)} />
            <div className="flex flex-col overflow-hidden" style={{ maxHeight: eraOpen ? `${SECTION_MAX}px` : "0px", transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <ToggleRow label="All Eras" active={allErasSelected} onClick={toggleAllEras} />
              {erasVisible.map((era) => (
                <ToggleRow key={era} label={era} active={selectedEras.includes(era)} onClick={() => toggleEra(era)} />
              ))}
              <div className="flex flex-col overflow-hidden" style={{ maxHeight: eraExpanded ? `${erasExtra.length * EXTRA_ROW_H}px` : "0px", transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                {erasExtra.map((era) => (
                  <ToggleRow key={era} label={era} active={selectedEras.includes(era)} onClick={() => toggleEra(era)} />
                ))}
              </div>
              <ExpandButton expanded={eraExpanded} onToggle={() => setEraExpanded((v) => !v)} />
            </div>
          </section>

          {/* ── GAME SETTINGS ── */}
          <section className="mx-4 mb-6 rounded-2xl flex flex-col" style={{ background: "hsl(240 42% 15%)", border: "1px solid hsl(var(--game-card-border))" }}>
            <SectionHeader icon={<img src={gameOpen ? iconSettingsActive : iconSettingsInactive} alt="" style={{ width: 24, height: 24 }} />} label="Game Settings" open={gameOpen} onToggle={() => setGameOpen((v) => !v)} />
            <div className="overflow-hidden" style={{ maxHeight: gameOpen ? `${SECTION_MAX}px` : "0px", transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <div className="p-4 flex flex-col gap-4">
                <div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-lg font-black" style={{ color: "#fff" }}>{numQuestions}</span>
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: "hsl(185 70% 55%)" }}>Questions</span>
                  </div>
                  <input type="range" min={10} max={50} step={5} value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} className="w-full h-1 rounded-full appearance-none cursor-pointer" style={{ accentColor: "hsl(185 70% 55%)" }} />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-lg font-black" style={{ color: "#fff" }}>{timePerQuestion}s</span>
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: "hsl(185 70% 55%)" }}>/ Questions</span>
                  </div>
                  <input type="range" min={5} max={30} step={5} value={timePerQuestion} onChange={(e) => setTimePerQuestion(Number(e.target.value))} className="w-full h-1 rounded-full appearance-none cursor-pointer" style={{ accentColor: "hsl(185 70% 55%)" }} />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-lg font-black" style={{ color: "#fff" }}>{timePerAnswer}s</span>
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: "hsl(185 70% 55%)" }}>/ Answer</span>
                  </div>
                  <input type="range" min={5} max={30} step={1} value={timePerAnswer} onChange={(e) => setTimePerAnswer(Number(e.target.value))} className="w-full h-1 rounded-full appearance-none cursor-pointer" style={{ accentColor: "hsl(185 70% 55%)" }} />
                </div>
              </div>
            </div>
          </section>

          {/* Apply button */}
          <div className="px-4 pb-8">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, hsl(42 100% 58%), hsl(35 90% 45%))", color: "hsl(240 45% 16%)", boxShadow: "0 6px 24px hsl(42 100% 55% / 0.35)" }}
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
