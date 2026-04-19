import { ChevronDown, Settings } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import iconCategoriesActive from "@/assets/icon-categories-active.svg";
import iconCategoriesInactive from "@/assets/icon-categories-inactive.svg";
import iconDifficultyActive from "@/assets/icon-difficulty-active.svg";
import iconDifficultyInactive from "@/assets/icon-difficulty-inactive.svg";
import iconEraActive from "@/assets/icon-era-active.svg";
import iconEraInactive from "@/assets/icon-era-inactive.svg";
import iconSettingsActive from "@/assets/icon-settings-active.svg";
import iconSettingsInactive from "@/assets/icon-settings-inactive.svg";

export interface GameSettings {
  numQuestions: number;
  timePerQuestion: number;
  timePerAnswer: number;
  selectedCategories: string[];
  selectedDifficulties: string[];
  selectedEras: string[];
}

interface SettingsPanelProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onAbout?: () => void;
  onApply?: (settings: GameSettings) => void;
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
const eras = [
  "Pre-1500",
  "1500-1800",
  "1800-1900",
  "1900-1950",
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
];

const SWITCH_ON = "data-[state=checked]:bg-[hsl(185_70%_50%)] data-[state=unchecked]:bg-[hsl(240_35%_22%)]";
const EXTRA_ROW_H = 46;
const SECTION_MAX = 2000;

function FadeIcon({ active, inactive, open }: { active: string; inactive: string; open: boolean }) {
  return (
    <div style={{ position: "relative", width: 24, height: 24, flexShrink: 0 }}>
      <img
        src={inactive}
        alt=""
        style={{
          width: 24,
          height: 24,
          position: "absolute",
          inset: 0,
          opacity: open ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      />
      <img
        src={active}
        alt=""
        style={{
          width: 24,
          height: 24,
          position: "absolute",
          inset: 0,
          opacity: open ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}

function SectionHeader({
  icon,
  label,
  open,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 w-full shrink-0 transition-colors hover:bg-[rgba(0,0,0,0.2)] rounded-2xl"
      style={{ padding: "14px 20px" }}
    >
      {icon}
      <span
        className="text-xs font-black tracking-widest uppercase flex-1 text-left transition-colors duration-300"
        style={{ color: open ? "hsl(185 70% 55%)" : "#fff" }}
      >
        {label}
      </span>
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
      className="flex items-center gap-3 cursor-pointer transition-colors hover:bg-[rgba(0,0,0,0.2)]"
      style={{ borderBottom: "1px solid hsl(var(--game-card-border))", padding: "12px 20px", minHeight: "44px" }}
      onClick={onClick}
    >
      <Switch checked={active} onCheckedChange={onClick} className={SWITCH_ON} onClick={(e) => e.stopPropagation()} />
      <span
        className="text-xs font-black tracking-widest uppercase transition-colors"
        style={{ color: active ? "hsl(0 0% 100%)" : "hsl(var(--muted-foreground))" }}
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
      className="flex items-center justify-center w-full transition-colors hover:bg-[rgba(0,0,0,0.2)] rounded-b-2xl active:scale-95"
      style={{ borderTop: "1px solid hsl(var(--game-card-border))", padding: "12px 20px", minHeight: "44px" }}
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
              className="rounded-full flex-shrink-0"
              style={{ width: "6px", height: "6px", background: "hsl(185 70% 55%)" }}
            />
          ))}
        </div>
      )}
    </button>
  );
}

export default function SettingsPanel({ open, onToggle, onClose, onAbout, onApply }: SettingsPanelProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...categories]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([...difficulties]);
  const [selectedEras, setSelectedEras] = useState<string[]>([...eras]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(5);
  const [timePerAnswer, setTimePerAnswer] = useState(5);

  // Section collapsed state — Game Settings open by default
  const [catOpen, setCatOpen] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);
  const [eraOpen, setEraOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(true);

  // Item-level expand (show more rows within section)
  const [catExpanded, setCatExpanded] = useState(false);
  const [diffExpanded, setDiffExpanded] = useState(false);
  const [eraExpanded, setEraExpanded] = useState(false);

  // --- Categories ---
  const allCatsSelected = categories.every((c) => selectedCategories.includes(c));
  const toggleAllCategories = () => {
    if (allCatsSelected) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...categories]);
    }
  };
  const toggleCategory = (cat: string) => {
    const on = selectedCategories.includes(cat);
    setSelectedCategories(on ? selectedCategories.filter((v) => v !== cat) : [...selectedCategories, cat]);
  };
  const catsVisible = categories.slice(0, 5);
  const catsExtra = categories.slice(5);

  // --- Difficulties ---
  const allDiffsSelected = difficulties.every((d) => selectedDifficulties.includes(d));
  const toggleAllDiffs = () => {
    if (allDiffsSelected) {
      setSelectedDifficulties([]);
    } else {
      setSelectedDifficulties([...difficulties]);
    }
  };
  const toggleDiff = (diff: string) => {
    const on = selectedDifficulties.includes(diff);
    setSelectedDifficulties(on ? selectedDifficulties.filter((v) => v !== diff) : [...selectedDifficulties, diff]);
  };

  // --- Eras ---
  const allErasSelected = eras.every((e) => selectedEras.includes(e));
  const toggleAllEras = () => {
    if (allErasSelected) {
      setSelectedEras([]);
    } else {
      setSelectedEras([...eras]);
    }
  };
  const toggleEra = (era: string) => {
    const on = selectedEras.includes(era);
    setSelectedEras(on ? selectedEras.filter((v) => v !== era) : [...selectedEras, era]);
  };
  const diffsVisible = difficulties.slice(0, 5);
  const diffsExtra = difficulties.slice(5);
  const erasVisible = eras.slice(0, 5);
  const erasExtra = eras.slice(5);

  const handleApply = () => {
    onApply?.({ numQuestions, timePerQuestion, timePerAnswer, selectedCategories, selectedDifficulties, selectedEras });
    onClose();
  };

  const isMobile = useIsMobile();

  // --- Drag-to-dismiss for mobile bottom sheet ---
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const dragOffset = useRef(0);

  const onDragStart = useCallback((clientY: number) => {
    dragStartY.current = clientY;
    dragOffset.current = 0;
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  }, []);

  const onDragMove = useCallback((clientY: number) => {
    if (dragStartY.current === null) return;
    const delta = Math.max(0, clientY - dragStartY.current);
    dragOffset.current = delta;
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${delta}px)`;
  }, []);

  const onDragEnd = useCallback(() => {
    if (sheetRef.current) sheetRef.current.style.transition = "";
    if (dragOffset.current > 120) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }
    dragStartY.current = null;
    dragOffset.current = 0;
  }, [onClose]);

  const panelContent = (
    <>
      {/* Title */}
      <div className="px-5 pt-4 pb-3 md:px-6 md:pt-6 md:pb-5">
        <h2
          className="text-xl md:text-3xl font-black leading-none tracking-tight uppercase"
          style={{
            fontFamily: "'Russo One', 'Nunito', sans-serif",
            background: "linear-gradient(160deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 45%, hsl(28 90% 40%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          CUSTOMIZE YOUR EXPERIENCE
        </h2>
      </div>
      <div className="px-5 md:px-6 mb-3 md:mb-4">
        <div className="h-px" style={{ background: "rgba(255, 255, 255, 0.1)" }} />
      </div>

      {/* ── CATEGORIES ── */}
      <section
        className="mx-5 mb-3 rounded-2xl flex flex-col"
        style={{ background: "rgba(0, 0, 0, 0.15)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <SectionHeader
          icon={<FadeIcon active={iconCategoriesActive} inactive={iconCategoriesInactive} open={catOpen} />}
          label="Categories"
          open={catOpen}
          onToggle={() => setCatOpen((v) => !v)}
        />
        <div
          className="grid overflow-hidden"
          style={{
            gridTemplateRows: catOpen ? "1fr" : "0fr",
            transition: "grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="min-h-0 overflow-hidden flex flex-col">
          <ToggleRow label="All Categories" active={allCatsSelected} onClick={toggleAllCategories} />
          {catsVisible.map((cat) => (
            <ToggleRow
              key={cat}
              label={cat}
              active={selectedCategories.includes(cat)}
              onClick={() => toggleCategory(cat)}
            />
          ))}
          <div
            className="flex flex-col overflow-hidden"
            style={{
              maxHeight: catExpanded ? `${catsExtra.length * EXTRA_ROW_H}px` : "0px",
              transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {catsExtra.map((cat) => (
              <ToggleRow
                key={cat}
                label={cat}
                active={selectedCategories.includes(cat)}
                onClick={() => toggleCategory(cat)}
              />
            ))}
          </div>
          <ExpandButton expanded={catExpanded} onToggle={() => setCatExpanded((v) => !v)} />
        </div>
      </section>

      {/* ── DIFFICULTY ── */}
      <section
        className="mx-5 mb-3 rounded-2xl flex flex-col"
        style={{ background: "rgba(0, 0, 0, 0.15)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <SectionHeader
          icon={<FadeIcon active={iconDifficultyActive} inactive={iconDifficultyInactive} open={diffOpen} />}
          label="Difficulty"
          open={diffOpen}
          onToggle={() => setDiffOpen((v) => !v)}
        />
        <div
          className="flex flex-col overflow-hidden"
          style={{
            maxHeight: diffOpen ? `${SECTION_MAX}px` : "0px",
            transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <ToggleRow label="All Difficulties" active={allDiffsSelected} onClick={toggleAllDiffs} />
          {difficulties.map((diff) => (
            <ToggleRow
              key={diff}
              label={diff}
              active={selectedDifficulties.includes(diff)}
              onClick={() => toggleDiff(diff)}
            />
          ))}
        </div>
      </section>

      {/* ── ERAS ── */}
      <section
        className="mx-5 mb-3 rounded-2xl flex flex-col"
        style={{ background: "rgba(0, 0, 0, 0.15)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <SectionHeader
          icon={<FadeIcon active={iconEraActive} inactive={iconEraInactive} open={eraOpen} />}
          label="Eras"
          open={eraOpen}
          onToggle={() => setEraOpen((v) => !v)}
        />
        <div
          className="flex flex-col overflow-hidden"
          style={{
            maxHeight: eraOpen ? `${SECTION_MAX}px` : "0px",
            transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <ToggleRow label="All Eras" active={allErasSelected} onClick={toggleAllEras} />
          {erasVisible.map((era) => (
            <ToggleRow key={era} label={era} active={selectedEras.includes(era)} onClick={() => toggleEra(era)} />
          ))}
          <div
            className="flex flex-col overflow-hidden"
            style={{
              maxHeight: eraExpanded ? `${erasExtra.length * EXTRA_ROW_H}px` : "0px",
              transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {erasExtra.map((era) => (
              <ToggleRow key={era} label={era} active={selectedEras.includes(era)} onClick={() => toggleEra(era)} />
            ))}
          </div>
          <ExpandButton expanded={eraExpanded} onToggle={() => setEraExpanded((v) => !v)} />
        </div>
      </section>

      {/* ── GAME SETTINGS ── */}
      <section
        className="mx-5 mb-3 rounded-2xl flex flex-col"
        style={{ background: "rgba(0, 0, 0, 0.15)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <SectionHeader
          icon={<FadeIcon active={iconSettingsActive} inactive={iconSettingsInactive} open={gameOpen} />}
          label="Game Settings"
          open={gameOpen}
          onToggle={() => setGameOpen((v) => !v)}
        />
        <div
          className="overflow-hidden"
          style={{
            maxHeight: gameOpen ? `${SECTION_MAX}px` : "0px",
            transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="px-5 py-5 flex flex-col gap-6">
            {/* Questions */}
            <div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-lg font-black" style={{ color: "#fff" }}>
                  {numQuestions}
                </span>
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: "hsl(185 70% 55%)" }}>
                  Questions
                </span>
              </div>
              <div className="step-slider-wrap">
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={10}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="step-slider w-full"
                />
                <div className="step-slider-dots">
                  {[10, 20, 30, 40, 50].map((v) => (
                    <div
                      key={v}
                      className="rounded-full flex-shrink-0"
                      style={{ width: 5, height: 5, background: "#fff", opacity: numQuestions >= v ? 1 : 0.35 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Seconds/Question */}
            <div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-lg font-black" style={{ color: "#fff" }}>
                  {timePerQuestion}s
                </span>
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: "hsl(185 70% 55%)" }}>
                  / Question
                </span>
              </div>
              <div className="step-slider-wrap">
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={timePerQuestion}
                  onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="step-slider w-full"
                />
                <div className="step-slider-dots">
                  {[5, 10, 15, 20, 25, 30].map((v) => (
                    <div
                      key={v}
                      className="rounded-full flex-shrink-0"
                      style={{ width: 5, height: 5, background: "#fff", opacity: timePerQuestion >= v ? 1 : 0.35 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Seconds/Answer */}
            <div>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-lg font-black" style={{ color: "#fff" }}>
                  {timePerAnswer}s
                </span>
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: "hsl(185 70% 55%)" }}>
                  / Answer
                </span>
              </div>
              <div className="step-slider-wrap">
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={timePerAnswer}
                  onChange={(e) => setTimePerAnswer(Number(e.target.value))}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="step-slider w-full"
                />
                <div className="step-slider-dots">
                  {[5, 10, 15, 20, 25, 30].map((v) => (
                    <div
                      key={v}
                      className="rounded-full flex-shrink-0"
                      style={{ width: 5, height: 5, background: "#fff", opacity: timePerAnswer >= v ? 1 : 0.35 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apply button */}
      <div className="px-5 pt-4 pb-10 md:pb-8">
        <button
          onClick={handleApply}
          className="group relative w-full py-4 rounded-full font-black text-sm tracking-[0.18em] uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          style={{
            fontFamily: "'Russo One', 'Nunito', sans-serif",
            background: "linear-gradient(180deg, #fee62d 0%, #f3903f 50%, #e93e3a 100%)",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            boxShadow: "0 4px 12px rgba(233, 62, 58, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
            color: "hsl(35 80% 25%)",
          }}
        >
          {/* Shine overlay */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
            }}
          />
          <span className="relative z-10">Apply Settings</span>
        </button>
      </div>
    </>
  );

  // ── MOBILE: Bottom sheet ──
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-30 transition-opacity duration-300"
          style={{ background: "hsl(240 45% 10% / 0.6)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
          onClick={onClose}
        />

        {/* Bottom sheet */}
        <div
          ref={sheetRef}
          className="fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-3xl"
          style={{
            maxHeight: "92vh",
            background: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(24px)",
            border: "1.5px solid rgba(255, 255, 255, 0.18)",
            borderBottom: "none",
            boxShadow: "0 -8px 48px rgba(0, 0, 0, 0.5)",
            transform: open ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Drag handle */}
          <div
            className="flex items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
            onTouchMove={(e) => onDragMove(e.touches[0].clientY)}
            onTouchEnd={onDragEnd}
            onMouseDown={(e) => {
              onDragStart(e.clientY);
              const onMove = (ev: MouseEvent) => onDragMove(ev.clientY);
              const onUp = () => {
                onDragEnd();
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
              };
              window.addEventListener("mousemove", onMove);
              window.addEventListener("mouseup", onUp);
            }}
          >
            <div className="w-10 h-1 rounded-full" style={{ background: "hsl(var(--muted-foreground) / 0.4)" }} />
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain pb-safe">{panelContent}</div>
        </div>
      </>
    );
  }

  // ── DESKTOP: Side panel (unchanged) ──
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
        className="fixed inset-y-0 right-0 z-40 flex w-[30%]"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="flex-1 overflow-y-auto"
          style={{
            background: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(24px)",
            borderLeft: "1.5px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "-8px 0 48px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {panelContent}
        </div>
      </div>
    </>
  );
}
