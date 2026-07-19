import { ChevronsLeft, ChevronDown, Instagram, Youtube, Facebook, Linkedin } from "lucide-react";
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

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.87a8.16 8.16 0 0 0 4.77 1.52V6.94a4.85 4.85 0 0 1-1.84-.25z" />
  </svg>
);

const ThreadsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12.19 22h-.01c-3.16-.02-5.59-1.06-7.22-3.09C3.51 17.14 2.75 14.66 2.72 12v-.02c.03-2.66.79-5.14 2.24-6.91C6.59 3.05 9.02 2.02 12.18 2h.01c2.42.02 4.44.62 5.98 1.79 1.45 1.11 2.47 2.68 3.02 4.68l-2.03.56c-.94-3.4-3.35-5.14-7-5.17-2.4.02-4.22.77-5.4 2.24C5.68 7.4 5.1 9.35 5.08 11.99c.02 2.64.6 4.6 1.68 5.9 1.18 1.47 3 2.22 5.4 2.24 2.16-.01 3.59-.51 4.78-1.66 1.35-1.29 1.33-2.87 1.14-3.86-.11-.6-.34-1.13-.65-1.56-.6.72-1.51 1.28-2.72 1.66-1.55.48-3.34.55-4.86.19-1.61-.38-2.79-1.28-3.31-2.55-.5-1.21-.35-2.63.4-3.79.79-1.21 2.11-2.02 3.7-2.28 1.55-.24 3.24-.13 4.71.31.03-.5-.11-1-.42-1.42-.51-.7-1.4-1.08-2.66-1.11-1.02.01-2.42.29-3.32 1.62l-1.71-1.15c1.2-1.77 3.16-2.62 5.05-2.6 1.94.03 3.5.7 4.5 1.96.94 1.18 1.35 2.72 1.19 4.42.05.03.11.06.16.09 1.13.65 1.96 1.63 2.4 2.83.61 1.67.53 4.4-1.68 6.53-1.61 1.55-3.55 2.24-6.28 2.26zm.03-13.11c-.32 0-.65.02-.97.07-1.9.32-2.87 1.28-2.83 2.4.05 1.36 1.5 2 2.86 2.32 1.5.35 3.42.09 4.42-1.28.42-.57.68-1.35.68-2.28-.99-.5-2.51-1.23-4.16-1.23z" />
  </svg>
);

const BlueskyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 600 530" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.54 164.28-205.46C512.26 8.009 590 -19.766 590 68.906c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.106 11.421-142.55-7.45-163.25-81.433C20.156 217.7 10 86.618 10 68.906 10-19.766 87.744 8.009 135.72 44.03z" />
  </svg>
);

const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const SOCIAL_LINKS: { key: string; label: string; href: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; event: string }[] = [
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/triviolivia/", Icon: Instagram, event: "about_social_instagram" },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@triviolivia", Icon: Youtube, event: "about_social_youtube" },
  { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@triviolivia", Icon: TikTokIcon, event: "about_social_tiktok" },
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/triviolivia", Icon: Facebook, event: "about_social_facebook" },
  { key: "threads", label: "Threads", href: "https://www.threads.com/@triviolivia", Icon: ThreadsIcon, event: "about_social_threads" },
  { key: "bluesky", label: "Bluesky", href: "https://bsky.app/profile/triviolivia.bsky.social", Icon: BlueskyIcon, event: "about_social_bluesky" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/triviolivia/", Icon: Linkedin, event: "about_social_linkedin" },
  { key: "reddit", label: "Reddit", href: "https://www.reddit.com/r/triviolivia/", Icon: RedditIcon, event: "about_social_reddit" },
];

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

  // Keep active chip visible in the mobile scroll strip (scroll strip only, not ancestors)
  useEffect(() => {
    if (!isMobile) return;
    const el = chipRefs.current[activeSection];
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const target = el.offsetLeft - (parent.clientWidth - el.offsetWidth) / 2;
    const max = parent.scrollWidth - parent.clientWidth;
    parent.scrollTo({ left: Math.max(0, Math.min(target, max)), behavior: "smooth" });
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
        className={`relative z-10 overflow-hidden animate-slide-in-up backdrop-blur-xl flex flex-col min-w-0 ${
          isMobile
            ? "absolute inset-0 rounded-none w-full"
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
        <div className="px-6 md:px-8 pt-10 pb-6 shrink-0 min-w-0" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <p className="text-sm font-subheading font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "hsl(185 70% 55%)" }}>
            Welcome to your
          </p>
          <h1
            className="font-heading font-extrabold uppercase leading-none tracking-tight whitespace-nowrap sm:text-3xl md:text-4xl"
            style={{
              background: "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.05,
              ...(isMobile && { fontSize: "clamp(14px, 6.2vw, 24px)" }),
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

            {/* Follow Us */}
            <div>
              <h2 className="text-sm font-subheading font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "hsl(185 70% 55%)" }}>
                Follow Us
              </h2>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_LINKS.map(({ key, label, href, Icon, event }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow Triviolivia on ${label}`}
                    title={label}
                    onClick={() => trackClick(event)}
                    className="social-link inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "hsl(var(--game-gold))",
                    }}
                  >
                    <Icon width={20} height={20} />
                  </a>
                ))}
              </div>
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
