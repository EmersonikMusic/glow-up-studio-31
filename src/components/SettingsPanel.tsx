import { ChevronDown, ArrowLeft } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import PrimaryCTA from "./PrimaryCTA";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import iconCategoriesActive from "@/assets/icon-categories-active.svg";
import iconCategoriesInactive from "@/assets/icon-categories-inactive.svg";
import iconDifficultyActive from "@/assets/icon-difficulty-active.svg";
import iconDifficultyInactive from "@/assets/icon-difficulty-inactive.svg";
import iconEraActive from "@/assets/icon-era-active.svg";
import iconEraInactive from "@/assets/icon-era-inactive.svg";
import iconSettingsActive from "@/assets/icon-settings-active.svg";
import iconSettingsInactive from "@/assets/icon-settings-inactive.svg";
import {
  ALL_CATEGORIES,
  ALL_DIFFICULTIES,
  ALL_ERAS,
  type GameSettings,
} from "@/data/gameOptions";

// Re-exported for backward compatibility with any existing imports.
export type { GameSettings };

interface SettingsPanelProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onAbout?: () => void;
  onApply?: (settings: GameSettings) => void;
  gameInProgress?: boolean;
  currentSettings?: GameSettings;
}

const categories = [...ALL_CATEGORIES];
const difficulties = [...ALL_DIFFICULTIES];
const eras = [...ALL_ERAS];

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
        className="text-xs font-subheading font-bold tracking-widest uppercase flex-1 text-left transition-colors duration-300"
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
      className="flex items-center gap-3 cursor-pointer transition-colors hover:bg-[rgba(0,0,0,0.2)] border-b border-[hsl(var(--game-card-border))]"
      style={{ padding: "12px 20px", minHeight: "44px" }}
      onClick={onClick}
    >
      <Switch checked={active} onCheckedChange={onClick} className={SWITCH_ON} onClick={(e) => e.stopPropagation()} />
      <span
        className={`text-xs font-body font-bold tracking-widest transition-colors ${preserveCase ? "normal-case" : "uppercase"}`}
        style={{ color: active ? "hsl(0 0% 100%)" : "hsl(var(--muted-foreground))" }}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * Collapsible filter section (Categories / Difficulties / Eras).
 * Renders a header + animated content area with a "Select/Deselect All" toggle
 * followed by one ToggleRow per option.
 */
function FilterSection({
  label,
  iconActive,
  iconInactive,
  open,
  onToggle,
  options,
  selected,
  onChange,
  preserveCase,
}: {
  label: string;
  iconActive: string;
  iconInactive: string;
  open: boolean;
  onToggle: () => void;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  preserveCase?: (option: string) => boolean;
}) {
  const allSelected = options.every((o) => selected.includes(o));
  const toggleAll = () => onChange(allSelected ? [] : [...options]);
  const toggleOne = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt]);

  return (
    <section
      className="mx-5 mb-3 rounded-2xl flex flex-col"
      style={{ background: "rgba(0, 0, 0, 0.15)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
    >
      <SectionHeader
        icon={<FadeIcon active={iconActive} inactive={iconInactive} open={open} />}
        label={label}
        open={open}
        onToggle={onToggle}
      />
      <div
        className="grid"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="min-h-0 overflow-hidden flex flex-col [&>*:last-child]:border-b-0">
          <ToggleRow
            label={allSelected ? "Deselect All" : "Select All"}
            active={allSelected}
            onClick={toggleAll}
          />
          {options.map((opt) => (
            <ToggleRow
              key={opt}
              label={opt}
              active={selected.includes(opt)}
              onClick={() => toggleOne(opt)}
              preserveCase={preserveCase?.(opt)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Discrete-step range slider with dot indicators. Used for question count and
 * the two timing settings.
 */
function StepSlider({
  value,
  onChange,
  min,
  max,
  step,
  stops,
  valueLabel,
  suffixLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  stops: number[];
  valueLabel: string;
  suffixLabel: string;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-lg font-subheading font-bold" style={{ color: "#fff" }}>
          {valueLabel}
        </span>
        <span className="text-xs font-subheading font-bold uppercase tracking-widest" style={{ color: "hsl(185 70% 55%)" }}>
          {suffixLabel}
        </span>
      </div>
      <div className="step-slider-wrap">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onKeyDown={(e) => e.stopPropagation()}
          className="step-slider w-full"
        />
        <div className="step-slider-dots">
          {stops.map((v) => (
            <div
              key={v}
              className="rounded-full flex-shrink-0"
              style={{ width: 5, height: 5, background: "#fff", opacity: value >= v ? 1 : 0.35 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const arraysEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
};

export default function SettingsPanel({ open, onToggle, onClose, onAbout, onApply, gameInProgress = false, currentSettings }: SettingsPanelProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([...categories]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([...difficulties]);
  const [selectedEras, setSelectedEras] = useState<string[]>([...eras]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(5);
  const [timePerAnswer, setTimePerAnswer] = useState(5);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Single open section — accordion behavior. Game Settings open by default.
  const [openSection, setOpenSection] = useState<SectionKey>("game");
  const toggleSection = (key: Exclude<SectionKey, null>) =>
    setOpenSection((cur) => (cur === key ? null : key));
  const catOpen = openSection === "categories";
  const diffOpen = openSection === "difficulty";
  const eraOpen = openSection === "eras";
  const gameOpen = openSection === "game";

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

  const hasChanges = currentSettings
    ? numQuestions !== currentSettings.numQuestions ||
      timePerQuestion !== currentSettings.timePerQuestion ||
      timePerAnswer !== currentSettings.timePerAnswer ||
      !arraysEqual(selectedCategories, currentSettings.selectedCategories) ||
      !arraysEqual(selectedDifficulties, currentSettings.selectedDifficulties) ||
      !arraysEqual(selectedEras, currentSettings.selectedEras)
    : false;

  const applyLabel = "Apply Settings";

  const panelContent = (
    <>
      {/* Back button (desktop only) */}
      {!isMobile && (
        <div className="px-5 pt-4 md:px-6 md:pt-5">
          <button
            onClick={onClose}
            aria-label="Back"
            className="nav-btn flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} />
          </button>
        </div>
      )}

      {/* Title */}
      <div className="px-5 pt-2 pb-2 md:px-6 md:pt-2 md:pb-3">
        <h2
          className="text-xl md:text-3xl font-heading font-extrabold leading-none tracking-tight uppercase"
          style={{
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
      <div className="px-5 md:px-6 mb-2 md:mb-3">
        <div className="h-px" style={{ background: "rgba(255, 255, 255, 0.1)" }} />
      </div>

      <FilterSection
        label="Categories"
        iconActive={iconCategoriesActive}
        iconInactive={iconCategoriesInactive}
        open={catOpen}
        onToggle={() => toggleSection("categories")}
        options={categories}
        selected={selectedCategories}
        onChange={setSelectedCategories}
      />

      <FilterSection
        label="Difficulties"
        iconActive={iconDifficultyActive}
        iconInactive={iconDifficultyInactive}
        open={diffOpen}
        onToggle={() => toggleSection("difficulty")}
        options={difficulties}
        selected={selectedDifficulties}
        onChange={setSelectedDifficulties}
      />

      <FilterSection
        label="Eras"
        iconActive={iconEraActive}
        iconInactive={iconEraInactive}
        open={eraOpen}
        onToggle={() => toggleSection("eras")}
        options={eras}
        selected={selectedEras}
        onChange={setSelectedEras}
        preserveCase={(opt) => /^\d{4}s$/.test(opt)}
      />

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
            <div className="px-5 py-4 flex flex-col gap-5">
              <StepSlider
                value={numQuestions}
                onChange={setNumQuestions}
                min={10}
                max={50}
                step={10}
                stops={[10, 20, 30, 40, 50]}
                valueLabel={`${numQuestions}`}
                suffixLabel="Questions"
              />

              <StepSlider
                value={timePerQuestion}
                onChange={setTimePerQuestion}
                min={5}
                max={30}
                step={5}
                stops={[5, 10, 15, 20, 25, 30]}
                valueLabel={`${timePerQuestion}s`}
                suffixLabel="/ Question"
              />

              <StepSlider
                value={timePerAnswer}
                onChange={setTimePerAnswer}
                min={5}
                max={30}
                step={5}
                stops={[5, 10, 15, 20, 25, 30]}
                valueLabel={`${timePerAnswer}s`}
                suffixLabel="/ Answer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Apply button */}
      <div className="px-5 pt-3 pb-3 md:pb-3 flex justify-center">
        {gameInProgress && hasChanges ? (
          <>
            <PrimaryCTA onClick={() => setConfirmOpen(true)} aria-label={applyLabel}>
              {applyLabel}
            </PrimaryCTA>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-subheading font-bold">Restart with new settings?</AlertDialogTitle>
                  <AlertDialogDescription className="font-body font-semibold">
                    Your current game will end and a new game will start with the updated settings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <button
                    onClick={() => setConfirmOpen(false)}
                    className="nav-btn rounded-full px-10 min-h-14 py-2 font-body font-bold uppercase tracking-wider text-xl transition-all duration-200 active:scale-95"
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "hsl(var(--game-gold))",
                    }}
                  >
                    Cancel
                  </button>
                  <PrimaryCTA
                    onClick={() => {
                      setConfirmOpen(false);
                      handleApply();
                    }}
                  >
                    Restart Game
                  </PrimaryCTA>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <PrimaryCTA onClick={handleApply} aria-label={applyLabel}>
            {applyLabel}
          </PrimaryCTA>
        )}
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
        className="fixed inset-y-0 right-0 z-40 flex w-[420px] md:w-[55%] lg:w-[40%] xl:w-[32%] max-w-[480px]"
        style={{
          transform: open ? "translateX(0)" : "translateX(calc(100% + 64px))",
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
