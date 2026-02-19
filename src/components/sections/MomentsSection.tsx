import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, Stagger, useReducedMotionSafe } from "../motion/MotionPrimitives";
import GeniusStripeRail from "../ui/GeniusStripeRail";
import Modal from "../ui/Modal";

type MomentsSectionProps = {
  header: string;
  introParagraph1: string;
  introParagraph2: string;
  labels: string[];
};

const highlightedPhrases = ["Genius Moments", "Fan Graph"] as const;
const momentDetailsByLabel: Record<string, { trigger: string; description: string }> = {
  "BUZZER BEATER WIN": {
    trigger: "Points scored to win in final 10 seconds",
    description:
      "Own the most iconic moment in sports. Activates instantly when a last-second shot wins the game, aligning brands with unforgettable, viral, highlight-worthy moments."
  }
};

function renderHighlightedIntro(text: string) {
  const segments = text.split(new RegExp(`(${highlightedPhrases.join("|")})`, "g"));

  return segments.map((segment, index) =>
    highlightedPhrases.includes(segment as (typeof highlightedPhrases)[number]) ? (
      <strong key={`${segment}-${index}`} className="font-semibold text-slate-900">
        {segment}
      </strong>
    ) : (
      <span key={`${segment}-${index}`}>{segment}</span>
    )
  );
}

function MomentsSection({
  header,
  introParagraph1,
  introParagraph2,
  labels
}: MomentsSectionProps) {
  const reducedMotion = useReducedMotionSafe();
  const [selectedMomentIndex, setSelectedMomentIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const panelBackgroundImage =
    "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1200";
  const activeMoment = selectedMomentIndex === null ? null : labels[selectedMomentIndex];
  const activeDetails = activeMoment
    ? (momentDetailsByLabel[activeMoment] ?? {
        trigger: "Moment trigger details for this selection.",
        description:
          "Moment description placeholder explaining how this in-game event connects your message to fan emotion."
      })
    : null;

  const handlePrevious = useCallback(() => {
    setSelectedMomentIndex((current) => {
      if (current === null) return null;
      return Math.max(0, current - 1);
    });
  }, []);

  const handleNext = useCallback(() => {
    setSelectedMomentIndex((current) => {
      if (current === null) return null;
      return Math.min(labels.length - 1, current + 1);
    });
  }, [labels.length]);

  useEffect(() => {
    if (!isModalOpen || selectedMomentIndex === null) return;

    const onArrowNavigate = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };

    document.addEventListener("keydown", onArrowNavigate);
    return () => document.removeEventListener("keydown", onArrowNavigate);
  }, [handleNext, handlePrevious, isModalOpen, selectedMomentIndex]);

  return (
    <Reveal id="moments" as="section" className="section-shell scroll-mt-24 bg-transparent p-0 shadow-none">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gs-surface shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-gs-surface to-sky-100/45" />
          <GeniusStripeRail
            theme="blue"
            className="absolute inset-y-0 right-0 hidden w-[38%] md:block"
            dimmed
          />
        </div>

        <div className="relative z-10 p-8 md:p-10">
          <h2 className="section-title">{header}</h2>
          <div className="mt-4 max-w-3xl space-y-3 text-sm text-slate-700 md:text-base">
            {introParagraph1 !== header ? <p>{introParagraph1}</p> : null}
            <p>{renderHighlightedIntro(introParagraph2)}</p>
          </div>
        </div>

        <div className="relative z-10 px-8 pb-8 md:px-10 md:pb-10">
          <div className="relative overflow-hidden rounded-xl border border-slate-900/25">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${panelBackgroundImage}")` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-slate-950/20" aria-hidden="true" />
            <div
              className="absolute inset-0 bg-gradient-to-br from-slate-900/8 via-slate-700/12 to-slate-900/20"
              aria-hidden="true"
            />

            <div className="relative p-4 md:p-5">
              <Stagger className="grid grid-cols-1 gap-2.5 md:grid-cols-2" staggerChildren={0.04}>
                {labels.map((label, index) => {
                  const isActive = selectedMomentIndex === index;

                  return (
                    <motion.button
                      key={label}
                      type="button"
                      onClick={() => {
                        setSelectedMomentIndex(index);
                        setIsModalOpen(true);
                      }}
                      className={`rounded-full border px-4 py-2.5 text-left text-sm font-semibold transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 md:text-[0.95rem] ${
                        isActive
                          ? "border-[#11b864] bg-[#18c971] text-slate-900 shadow-md"
                          : "border-slate-200/80 bg-slate-100/95 text-slate-900 shadow-sm hover:-translate-y-px hover:border-[#11b864] hover:bg-[#18c971] hover:shadow-md"
                      }`}
                      variants={{
                        hidden: { opacity: 0, y: reducedMotion ? 0 : 6 },
                        show: { opacity: 1, y: 0 }
                      }}
                      transition={{
                        duration: reducedMotion ? 0.18 : 0.26,
                        ease: "easeOut"
                      }}
                      whileHover={reducedMotion ? undefined : { y: -1 }}
                    >
                      {label}
                    </motion.button>
                  );
                })}
              </Stagger>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={Boolean(activeMoment) && isModalOpen}
        title={activeMoment ?? ""}
        onClose={() => setIsModalOpen(false)}
        footer={
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={selectedMomentIndex === null || selectedMomentIndex === 0}
                className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  selectedMomentIndex === null || selectedMomentIndex === labels.length - 1
                }
                className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
              >
                Next
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-full border border-slate-300 bg-slate-100 px-6 py-2.5 text-base font-semibold text-slate-800 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
            >
              Close
            </button>
          </div>
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeMoment ?? "moment-empty"}
            className="space-y-4 text-slate-700"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
            transition={{
              duration: reducedMotion ? 0.12 : 0.2,
              ease: "easeOut"
            }}
          >
            <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm md:p-5">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Trigger</p>
              <p className="mt-2 text-[1.12rem] leading-relaxed text-slate-800 md:text-[1.15rem]">
                {activeDetails?.trigger}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm md:p-5">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Description</p>
              <p className="mt-2 text-[1.12rem] leading-relaxed text-slate-800 md:text-[1.15rem]">
                {activeDetails?.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </Modal>
    </Reveal>
  );
}

export default MomentsSection;
