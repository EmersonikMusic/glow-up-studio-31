import { ChevronsLeft, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useCallback, useRef, useEffect } from "react";
import PrimaryCTA from "./PrimaryCTA";
import { trackClick } from "@/lib/analytics";

interface AboutScreenProps {
  onClose: () => void;
}

type SectionKey = "who" | "apart" | "faq" | "philosophy";

function Tag({ variant, children }: { variant: "bad" | "good"; children: React.ReactNode }) {
  return (
    <span
      className="font-black"
      style={{ color: variant === "bad" ? "hsl(0 70% 65%)" : "hsl(185 70% 55%)" }}
    >
      {children}
    </span>
  );
}

export default function AboutScreen({ onClose }: AboutScreenProps) {
  const isMobile = useIsMobile();
  const [exiting, setExiting] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionKey>("who");
  const whoRef = useRef<HTMLDivElement>(null);
  const apartRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Record<SectionKey, HTMLButtonElement | null>>({
    who: null,
    apart: null,
    faq: null,
    philosophy: null,
  });

  const sections: { key: SectionKey; label: string; ref: React.RefObject<HTMLDivElement>; event: string }[] = [
    { key: "who", label: "Who are we?", ref: whoRef, event: "about_jump_who" },
    { key: "apart", label: "What sets us apart?", ref: apartRef, event: "about_jump_apart" },
    { key: "faq", label: "FAQ", ref: faqRef, event: "about_jump_faq" },
    { key: "philosophy", label: "Question Crafting", ref: philosophyRef, event: "about_jump_philosophy" },
  ];

  // Keep active chip visible in the mobile scroll strip
  useEffect(() => {
    if (!isMobile) return;
    const el = chipRefs.current[activeSection];
    if (el) el.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activeSection, isMobile]);


  // Measure sticky nav height
  useEffect(() => {
    if (!navRef.current) return;
    const el = navRef.current;
    const update = () => setNavHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll-spy for active section
  useEffect(() => {
    const scroller = scrollAreaRef.current;
    if (!scroller || navHeight === 0) return;
    const sections: { key: SectionKey; ref: React.RefObject<HTMLDivElement> }[] = [
      { key: "who", ref: whoRef },
      { key: "apart", ref: apartRef },
      { key: "faq", ref: faqRef },
      { key: "philosophy", ref: philosophyRef },
    ];
    const onScroll = () => {
      const triggerY = navHeight + 16;
      let current: SectionKey = "who";
      for (const s of sections) {
        const el = s.ref.current;
        if (!el) continue;
        const top = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
        if (top - triggerY <= 0) current = s.key;
      }
      setActiveSection(current);
    };
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [navHeight]);

  const scrollTo = useCallback(
    (ref: React.RefObject<HTMLDivElement>, label: string) => {
      trackClick(label);
      const scroller = scrollAreaRef.current;
      const target = ref.current;
      if (!scroller || !target) return;
      const top =
        target.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop -
        8;
      scroller.scrollTo({ top, behavior: "smooth" });
    },
    []
  );

  const handleClose = useCallback(() => {
    if (exiting) return;
    trackClick("about_close");
    setExiting(true);
    setTimeout(() => onClose(), isMobile ? 350 : 300);
  }, [onClose, isMobile, exiting]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "hsl(var(--game-bg))",
        willChange: "transform, opacity",
        pointerEvents: exiting ? "none" : "auto",
        transition: isMobile ? "transform 0.35s cubic-bezier(0.4, 0, 1, 1)" : "opacity 0.3s ease",
        transform: isMobile ? (exiting ? "translateX(-100%)" : "translateX(0)") : "translateX(0)",
        opacity: !isMobile && exiting ? 0 : 1,
      }}
    >
      {/* Ambient blobs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(280 60% 50% / 0.14) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(210 70% 50% / 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Card — full-screen on mobile, centered card on desktop */}
      <div
        className={`relative z-10 overflow-hidden animate-slide-in-up backdrop-blur-xl flex flex-col ${
          isMobile
            ? "absolute inset-0 rounded-none"
            : "rounded-3xl mx-4"
        }`}
        style={{
          ...(!isMobile && { width: "70vw", minWidth: "300px" }),
          background: "rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: isMobile ? "none" : "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow: isMobile
            ? "12px 0 48px rgba(0, 0, 0, 0.5)"
            : "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="nav-btn absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-95"
          aria-label="Close"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <ChevronsLeft className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div className="px-6 md:px-8 pt-10 pb-6 shrink-0" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <p className="text-sm font-subheading font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "hsl(185 70% 55%)" }}>
            Welcome to your
          </p>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold uppercase leading-none tracking-tight whitespace-nowrap"
            style={{
              background: "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.05,
            }}
          >
            Endless Trivia World!
          </h1>
        </div>

        {/* Anchor nav — part of the header, sits above the scroll area */}
        <div
          ref={navRef}
          className="shrink-0 px-6 md:px-8 py-3 relative"
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {isMobile ? (
            <div className="about-nav-scroll flex gap-2 overflow-x-auto -mx-6 px-6">
              {sections.map((btn) => {
                const isActive = activeSection === btn.key;
                return (
                  <button
                    key={btn.key}
                    ref={(el) => {
                      chipRefs.current[btn.key] = el;
                    }}
                    onClick={() => scrollTo(btn.ref, btn.event)}
                    aria-current={isActive ? "location" : undefined}
                    className="shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-subheading font-bold tracking-[0.18em] uppercase transition-all duration-200 active:scale-95"
                    style={{
                      background: isActive ? "hsl(185 70% 55% / 0.18)" : "rgba(255, 255, 255, 0.06)",
                      border: isActive
                        ? "1px solid hsl(185 70% 55%)"
                        : "1px solid hsl(185 70% 55% / 0.5)",
                      color: isActive ? "hsl(185 70% 55%)" : "hsl(var(--game-gold))",
                      boxShadow: isActive ? "0 0 0 2px hsl(185 70% 55% / 0.15)" : undefined,
                    }}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sections.map((btn) => {
                const isActive = activeSection === btn.key;
                return (
                  <button
                    key={btn.key}
                    onClick={() => scrollTo(btn.ref, btn.event)}
                    aria-current={isActive ? "location" : undefined}
                    className="px-4 py-2 rounded-full text-[11px] font-subheading font-bold tracking-[0.18em] uppercase transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    style={{
                      background: isActive ? "hsl(185 70% 55% / 0.18)" : "rgba(255, 255, 255, 0.06)",
                      border: isActive
                        ? "1px solid hsl(185 70% 55%)"
                        : "1px solid hsl(185 70% 55% / 0.5)",
                      color: isActive ? "hsl(185 70% 55%)" : "hsl(var(--game-gold))",
                      boxShadow: isActive ? "0 0 0 2px hsl(185 70% 55% / 0.15)" : undefined,
                    }}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>



        {/* Scrollable body */}
        <div ref={scrollAreaRef} className="about-scroll-area flex-1 overflow-y-auto overscroll-contain">



          <div className="px-6 md:px-8 py-7 flex flex-col gap-10 game-text-white">
            {/* Who are we */}
            <div ref={whoRef} className="">
              <h2 className="text-sm font-subheading font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                Who are we?
              </h2>
              <p className="text-sm leading-relaxed font-body font-semibold">
                We are a team of trivia fans who love learning, writing, and playing trivia. Here at{" "}
                <span className="font-black">Triviolivia</span>, we believe that learning should be entertaining and
                stimulating. Our platform is designed for trivia experts, young learners, and everyone in between.
              </p>
            </div>

            {/* What sets us apart */}
            <div ref={apartRef} className="">
              <h2 className="text-sm font-subheading font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                What sets us apart?
              </h2>
              <p className="text-sm leading-relaxed font-body font-semibold mb-4">
                <span className="font-black">Triviolivia</span> is not just another trivia game. Triviolivia is a free
                and fully customizable source of endless trivia questions and answers across{" "}
                <span className="font-black">25 categories</span>,{" "}
                <span className="font-black">5 difficulty levels</span>, and{" "}
                <span className="font-black">12 time periods</span>. 1500 ways to play. Let us handle the questions. How
                you use them is up to you.
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-3 text-sm leading-relaxed font-body font-semibold marker:font-black marker:text-[hsl(var(--game-gold))]">
                {[
                  "Need some fresh questions for your dated trivia board game?",
                  "Want to make better use of your kid's screen time?",
                  "Did you forget to prepare for hosting bar trivia night?",
                  "Learning English?",
                  "Are you a trivia wizard but not into politics, theater, or math?",
                  "Music, movie, and video game expert but only after the year 2000?",
                  "Love sports trivia?",
                  "Hate sports trivia?",
                  "Want to see if you know more about technology than your cousin knows about history?",
                  "Want a balanced trivia showdown between your five year old brainiac and her boomer grandpa?",
                  "Training for a Jeopardy run?",
                  "Tired of AI hallucination questions?",
                  "Want to just eventually know everything?",
                ].map((item, i) => (
                  <li key={i}>
                    {item}{" "}
                    <span className="font-black" style={{ color: "hsl(185 70% 55%)" }}>
                      {i === 12 ? "Start by knowing that we got you." : "We got you."}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Frequently Asked Questions */}
            <div ref={faqRef} className="">
              <h2 className="text-sm font-subheading font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                Frequently Asked Questions
              </h2>
              <div className="flex flex-col">
                {[
                  {
                    q: "Is this AI?",
                    a: "No! All of our questions are written, edited, and maintained by humans! We strive to keep them as evergreen as possible, as well as factual, current, and error-free. However, being the humans that we are, there are bound to be mistakes or \u2018expired\u2019 questions that are no longer true, or need an \u2018is\u2019 changed to a \u2018was\u2019 or something. Please let us know if you see a question that needs repair! Also, all the character designs were created by our lead designer in Adobe Illustrator.",
                  },
                  {
                    q: "Is this gambling?",
                    a: "Absolutely not! There is no money to be won or lost here. We are actively avoiding being anything even remotely resembling gambling.",
                  },
                  {
                    q: "Where are you guys from?",
                    a: "We are from Toronto, Canada! Come visit!",
                  },
                  {
                    q: "How did this project begin?",
                    a: "It all started in 2020 during COVID lockdown as a project to keep busy.",
                  },
                  {
                    q: "Where do the questions come from?",
                    a: "When each game is started, the questions are fetched from a database. Six years and counting of just writing stuff down every time we encounter something notable and interesting, and triviafying it.",
                  },
                  {
                    q: "How do I contribute?",
                    a: "Our meticulously crafted and curated questions are designed to entertain, educate, challenge, and spark curiosity. We are always adding to our database and we're always looking for new questions. Show us what you got! If your submitted questions survive our rigorous quality control process, they will be added to our database and you will be credited as the author of the question, or you can remain anonymous.",
                  },
                ].map((item, i) => (
                  <details
                    key={i}
                    className="group border-b py-3 [&_summary::-webkit-details-marker]:hidden"
                    style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <summary
                      className="flex items-center justify-between gap-3 cursor-pointer list-none text-sm font-heading font-black"
                      style={{ color: "hsl(var(--game-gold))" }}
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className="w-4 h-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                        style={{ color: "hsl(var(--game-gold))" }}
                        strokeWidth={2.5}
                      />
                    </summary>
                    <dd className="text-sm leading-relaxed font-body font-semibold pl-3 pt-2">{item.a}</dd>
                  </details>
                ))}
              </div>
            </div>

            {/* Question Crafting */}
            <div ref={philosophyRef} className="">
              <h2 className="text-sm font-subheading font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                Question Crafting
              </h2>
              <p className="text-sm leading-relaxed font-body font-semibold mb-4">
                Our question writing philosophy is simple: every question should be clear, fair, and fun for every kind of trivia player.
              </p>
              <ol className="list-decimal pl-5 flex flex-col gap-3 text-sm leading-relaxed font-body font-semibold marker:font-black marker:text-[hsl(var(--game-gold))]">
                <li>
                  Questions must have clear cut, logical answers.
                  <ol className="list-disc marker:text-[hsl(185_70%_55%)] pl-5 mt-1 flex flex-col gap-1">
                    <li>Nothing with many possible answers. A few is okay but all must be provided.</li>
                    <li>Nothing vague, opinionated, or reasonably debatable.</li>
                    <li>No loaded questions, guerilla advertising, or political campaigning. We are strictly a trivia game.</li>
                  </ol>
                </li>
                <li>
                  No multiple choice or true or false or something with very few, universally knowable, answers such as &lsquo;In which season&hellip;?&rsquo; Eight possible answers such as &lsquo;Which planet&hellip;?&rsquo; should be considered the minimum.
                </li>
                <li>
                  Questions must be able to be read aloud to someone who cannot see the question text themselves, as well as read silently to one&rsquo;s self. That means no pictures/symbols/sound/etc. Just text and numbers. Questions must be reasonably easy to pronounce by an English speaker.
                  <ol className="list-disc marker:text-[hsl(185_70%_55%)] pl-5 mt-1 flex flex-col gap-1">
                    <li>
                      <Tag variant="bad">Bad</Tag>
                      <ol className="list-disc marker:text-[hsl(185_70%_55%)] pl-5 mt-1 flex flex-col gap-1">
                        <li>What is this character called? ~ (Can&rsquo;t be read out loud to someone)</li>
                        <li>How do you spell &lsquo;fortuitous&rsquo;? (Can&rsquo;t be read to yourself)</li>
                        <li>What does 6! equal? (Potentially confusing)</li>
                      </ol>
                    </li>
                    <li>
                      <Tag variant="good">Better</Tag>
                      <ol className="list-disc marker:text-[hsl(185_70%_55%)] pl-5 mt-1 flex flex-col gap-1">
                        <li>What is the name of the character found on most QWERTY keyboards that looks like a squiggly line?</li>
                        <li>Which four-syllable F word means the same thing as serendipitous?</li>
                        <li>What does 6 factorial equal?</li>
                      </ol>
                    </li>
                  </ol>
                </li>
                <li>Nothing inappropriate for children.</li>
                <li>Don&rsquo;t ask for dates or years unless the event is MASSIVE. Instead, give dates or years in the questions as a learning experience. Specify years for movies and other media to avoid confusion.</li>
                <li>
                  Avoid things that are reasonably possible to change over time.
                  <ol className="list-disc marker:text-[hsl(185_70%_55%)] pl-5 mt-1 flex flex-col gap-1">
                    <li><Tag variant="bad">Bad:</Tag> Who is the NBA&rsquo;s only billionaire player?</li>
                    <li><Tag variant="good">Better:</Tag> In 2020, who made history by becoming the NBA&rsquo;s first billionaire player?</li>
                  </ol>
                </li>
                <li>Global subject matter.</li>
                <li>
                  A question that also teaches is a good goal.
                  <ol className="list-disc marker:text-[hsl(185_70%_55%)] pl-5 mt-1 flex flex-col gap-1">
                    <li><Tag variant="bad">Bad:</Tag> Who wrote A Brief History of Time?</li>
                    <li><Tag variant="good">Better:</Tag> Which astrophysicist and science educator wrote the 1988 book A Brief History of Time?</li>
                  </ol>
                </li>
                <li>No spoilers. Not even from things as old and ubiquitous as Star Wars or Lord of the Rings.</li>
                <li>
                  When assigning eras:
                  <ol className="list-disc marker:text-[hsl(185_70%_55%)] pl-5 mt-1 flex flex-col gap-1">
                    <li>If the question is regarding an event, historical figure, or politician, it will be assigned that era.</li>
                    <li>If it is regarding a scientific concept that was discovered, it will be from when it was discovered, onward.</li>
                    <li>If it is a word or idiom, it will be from when it entered public parlance, onward.</li>
                    <li>Art, Literature, Music, Movies, Performing Arts, Television, and Video Games on their release/premiere date.</li>
                  </ol>
                </li>
              </ol>
            </div>

            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }} aria-hidden="true" />

            {/* Sign-off */}
            <div className="pt-1 pb-2">
              <p className="text-sm leading-relaxed font-body font-semibold font-black mb-3">
                Go play. Good luck. Have fun. Nerd up!
              </p>
              <p className="text-sm leading-relaxed font-body font-semibold" style={{ color: "hsl(185 70% 55%)" }}>
                With love,
                <br />
                <span className="font-black not-italic">The Triviolivia Team</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 md:px-8 pb-8 pt-4 shrink-0 flex justify-center" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <PrimaryCTA onClick={handleClose} aria-label="Back to Game">
            Back to Game
          </PrimaryCTA>
        </div>
      </div>
    </div>
  );
}
