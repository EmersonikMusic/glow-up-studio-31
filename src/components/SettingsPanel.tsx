import { ChevronDown, ChevronLeft } from "lucide-react";
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
  gameInProgress?: boolean;
  currentSettings?: GameSettings;
}

const categories = [
  "Art",
  "Economy",
  "Food & Drink",
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
  "Performing Arts",
  "Philosophy",
  "Politics",
  "Pop Culture",
  "Science",
  "Sports",
  "Technology",
  "Television",
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

type SectionKey = "categories" | "difficulty" | "eras" | "game" | null;

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

function ToggleRow({
  label,
  active,
  onClick,
  preserveCase = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  preserveCase?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer transition-colors hover:bg-[rgba(0,0,0,0.2)]"
      style={{ borderBottom: "1px solid hsl(var(--game-card-border))", padding: "12px 20px", minHeight: "44px" }}
      onClick={onClick}
    >
      <Switch checked={active} onCheckedChange={onClick} className={SWITCH_ON} onClick={(e) => e.stopPropagation()} />
      <span
        className={`text-xs font-black tracking-widest transition-colors ${preserveCase ? "normal-case" : "uppercase"}`}
        style={{ color: active ? "hsl(0 0% 100%)" : "hsl(var(--muted-foreground))" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function SettingsPanel({ open, onToggle, onClose, onAbout, onApply, gameInProgress = false, currentSettings }: SettingsPanelProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...categories]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([...difficulties]);
  const [selectedEras, setSelectedEras] = useState<string[]>([...eras]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(5);
  const [timePerAnswer, setTimePerAnswer] = useState(5);

  // Single open section — accordion behavior. Game Settings open by default.
  const [openSection, setOpenSection] = useState<SectionKey>("game");
  const toggleSection = (key: Exclude<SectionKey, null>) =>
    setOpenSection((cur) => (cur === key ? null : key));
  const catOpen = openSection === "categories";
  const diffOpen = openSection === "difficulty";
  const eraOpen = openSection === "eras";
  const gameOpen = openSection === "game";

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

  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const sa = [...a].sort();
    const sb = [...b].sort();
    return sa.every((v, i) => v === sb[i]);
  };

  const hasChanges = currentSettings
    ? numQuestions !== currentSettings.numQuestions ||
      timePerQuestion !== currentSettings.timePerQuestion ||
      timePerAnswer !== currentSettings.timePerAnswer ||
      !arraysEqual(selectedCategories, currentSettings.selectedCategories) ||
      !arraysEqual(selectedDifficulties, currentSettings.selectedDifficulties) ||
      !arraysEqual(selectedEras, currentSettings.selectedEras)
    : false;

  const applyLabel = gameInProgress && hasChanges ? "Apply New Game Settings" : "Apply Settings";

  const panelContent = (
    <>
      {/* Back button */}
      <div className="px-5 pt-4 md:px-6 md:pt-5">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1 text-xs font-black tracking-widest uppercase text-white/70 hover:text-[hsl(185_70%_55%)] transition-colors rounded-md px-2 py-1 -ml-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Title */}
      <div className="px-5 pt-2 pb-3 md:px-6 md:pt-3 md:pb-5">
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
      <div className="px-5 md:px-6 mb-3 md:mb-5">
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
          onToggle={() => toggleSection("categories")}
        />
        <div
          className="grid"
          style={{
            gridTemplateRows: catOpen ? "1fr" : "0fr",
            transition: "grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="min-h-0 overflow-hidden flex flex-col [&>*:last-child]:border-b-0">
            <ToggleRow
              label={allCatsSelected ? "Deselect All" : "Select All"}
              active={allCatsSelected}
              onClick={toggleAllCategories}
            />
            {categories.map((cat) => (
              <ToggleRow
                key={cat}
                label={cat}
                active={selectedCategories.includes(cat)}
                onClick={() => toggleCategory(cat)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFICULTIES ── */}
      <section
        className="mx-5 mb-3 rounded-2xl flex flex-col"
        style={{ background: "rgba(0, 0, 0, 0.15)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <SectionHeader
          icon={<FadeIcon active={iconDifficultyActive} inactive={iconDifficultyInactive} open={diffOpen} />}
          label="Difficulties"
          open={diffOpen}
          onToggle={() => toggleSection("difficulty")}
        />
        <div
          className="grid"
          style={{
            gridTemplateRows: diffOpen ? "1fr" : "0fr",
            transition: "grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="min-h-0 overflow-hidden flex flex-col [&>*:last-child]:border-b-0">
            <ToggleRow
              label={allDiffsSelected ? "Deselect All" : "Select All"}
              active={allDiffsSelected}
              onClick={toggleAllDiffs}
            />
            {difficulties.map((diff) => (
              <ToggleRow
                key={diff}
                label={diff}
                active={selectedDifficulties.includes(diff)}
                onClick={() => toggleDiff(diff)}
              />
            ))}
          </div>
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
          onToggle={() => toggleSection("eras")}
        />
        <div
          className="grid"
          style={{
            gridTemplateRows: eraOpen ? "1fr" : "0fr",
            transition: "grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="min-h-0 overflow-hidden flex flex-col [&>*:last-child]:border-b-0">
            <ToggleRow
              label={allErasSelected ? "Deselect All" : "Select All"}
              active={allErasSelected}
              onClick={toggleAllEras}
            />
            {eras.map((era) => (
              <ToggleRow
                key={era}
                label={era}
                active={selectedEras.includes(era)}
                onClick={() => toggleEra(era)}
                preserveCase={/^\d{4}s$/.test(era)}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        className="mx-5 mb-3 rounded-2xl flex flex-col"
        style={{ background: "rgba(0, 0, 0, 0.15)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <SectionHeader
          icon={<FadeIcon active={iconSettingsActive} inactive={iconSettingsInactive} open={gameOpen} />}
          label="Game Settings"
          open={gameOpen}
          onToggle={() => toggleSection("game")}
        />
        <div
          className="grid"
          style={{
            gridTemplateRows: gameOpen ? "1fr" : "0fr",
            transition: "grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="min-h-0 overflow-hidden">
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
        </div>
      </section>

      {/* Apply button */}
      <div className="px-5 pt-4 pb-10 md:pb-8">
        <button
          onClick={handleApply}
          className="btn-gameshow w-full py-4 text-sm tracking-[0.18em] uppercase"
        >
          Apply Settings
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
