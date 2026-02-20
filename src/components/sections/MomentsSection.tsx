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
const proprietaryMomentLabels = new Set<string>();
const momentDetailsByLabel: Record<string, { trigger: string; description: string }> = {
  "GAMEDAY LEAD UP": {
    trigger: "Tip-off time",
    description:
      "Capture peak anticipation as fans settle in to watch. This package activates 24 hours ahead of tip-off, reaching audiences the moment excitement builds. Ideal for brands looking to own the start of the experience and associate it with pre-game rituals, research, and anticipation."
  },
  "LATE GAME RALLY": {
    trigger: "Trailing team closing the gap late in the game",
    description:
      "Activates when a trailing team starts mounting a serious late push, delivering high-attention moments filled with tension, hope, and rising excitement."
  },
  "DOWN TO THE WIRE": {
    trigger: "Between 45% and 55% win probability within last 10 minutes",
    description:
      "Own the most intense moments of the game. This package activates during tight contests where the outcome is uncertain, capturing peak fan attention as every possession matters."
  },
  "BUZZER BEATER WIN": {
    trigger: "Points scored to win in final 10 seconds",
    description:
      "Own the most iconic moment in sports. Activates instantly when a last-second shot wins the game, aligning brands with unforgettable, viral, highlight-worthy moments."
  },
  ADVANCEMENT: {
    trigger: "Team wins and advances",
    description:
      "Celebrate victory and progress. Activates when teams secure the next step in their tournament journey, reaching energized fans in moments of pride and excitement."
  },
  ELIMINATION: {
    trigger: "Team loses and is eliminated",
    description:
      "Reach fans during emotional turning points as seasons come to an end. This package captures moments of reflection, loyalty, and heightened engagement following elimination games."
  },
  UPSET: {
    trigger: "Lower seed beats higher seed",
    description:
      "Align with the thrill of the unexpected. Activates when underdogs take down favorites, generating national attention, conversation, and strong emotional reactions."
  },
  "CINDERELLA STORY": {
    trigger: "10 seed or higher advances",
    description:
      "Follow the magic of underdog runs. Activates as unexpected teams continue advancing, capturing widespread fan support, optimism, and tournament storytelling."
  },
  "SWEET 16": {
    trigger: "Reach fans of Sweet 16 teams",
    description:
      "Target high-intent fans as the tournament narrows. Activates around the Sweet 16 stage when excitement intensifies and national attention grows."
  },
  "ELITE 8": {
    trigger: "Reach fans of Elite 8 teams",
    description:
      "Engage deeply invested audiences as teams push toward the Final Four. Delivers premium reach during one of the most competitive stages of the tournament."
  },
  "FINAL FOUR": {
    trigger: "Reach fans of Final Four teams",
    description:
      "Own the spotlight moments. Activates during the week of the Final Four when attention peaks and the stakes are highest, delivering massive engagement and national scale."
  },
  CHAMPIONSHIP: {
    trigger: "Reach fans of teams in Championship game",
    description:
      "Align with the biggest stage. Activates around the championship matchup, capturing peak viewership, emotion, and fan attention across the entire tournament."
  },
  CHAMPION: {
    trigger: "Reach fans of the winning team",
    description:
      "Celebrate the ultimate victory. Activates immediately after a team is crowned champion, connecting brands with fans experiencing peak pride, joy, and celebration."
  },
  "HERO GAME: GREAT INDIVIDUAL PERFORMANCES": {
    trigger: "Double-double, triple-double, 20+ points, 10+ rebounds, 5+ threes, 3+ steals",
    description:
      "Align with standout player performances. Activates when athletes deliver exceptional stat lines, capturing moments of greatness, highlight-worthy plays, and fan admiration. Perfect for brands that want to associate with excellence and star power."
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

function isProprietaryMoment(label: string) {
  return proprietaryMomentLabels.has(label);
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
  const [mobileMoreSelection, setMobileMoreSelection] = useState("");
  const panelBackgroundImage =
    "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1200";
  const activeMoment = selectedMomentIndex === null ? null : labels[selectedMomentIndex];
  const primaryMobileLabels = labels.slice(0, 4);
  const additionalMobileLabels = labels.slice(4);
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

  const openMomentModal = (index: number) => {
    setSelectedMomentIndex(index);
    setIsModalOpen(true);
  };
  const closeMomentModal = () => {
    setIsModalOpen(false);
    setSelectedMomentIndex(null);
  };

  return (
    <Reveal id="moments" as="section" once={false} className="scroll-mt-24 bg-white">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-[#f3f4f6] shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f3f4f6] via-[#f3f4f6] to-transparent" />
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
              <div className="md:hidden">
                <Stagger className="grid grid-cols-1 gap-2.5" staggerChildren={0.04} once={false}>
                  {primaryMobileLabels.map((label, index) => {
                    const isActive = selectedMomentIndex === index;
                    const showProprietaryMark = isProprietaryMoment(label);

                    return (
                      <motion.button
                        key={label}
                        type="button"
                        onClick={() => openMomentModal(index)}
                        className={`relative rounded-full border px-4 py-2.5 text-left text-sm font-semibold transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                          isActive
                            ? "border-[#11b864] bg-[#18c971] text-slate-900 shadow-md"
                            : "border-slate-200/80 bg-slate-100/95 text-slate-900 shadow-sm hover:-translate-y-px hover:border-[#11b864] hover:bg-[#18c971] hover:shadow-md"
                        } ${showProprietaryMark ? "pr-10" : ""}`}
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
                        {showProprietaryMark ? (
                          <>
                            <img
                              src="/genius-assets/genius_g_logo.svg"
                              alt=""
                              aria-hidden="true"
                              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-90"
                            />
                            <span className="sr-only">Genius proprietary moment signal</span>
                          </>
                        ) : null}
                      </motion.button>
                    );
                  })}
                </Stagger>
                {additionalMobileLabels.length > 0 ? (
                  <div className="mt-3">
                    <label htmlFor="moments-more" className="sr-only">
                      More moments
                    </label>
                    <select
                      id="moments-more"
                      value={mobileMoreSelection}
                      onChange={(event) => {
                        const value = event.target.value;
                        setMobileMoreSelection(value);
                        if (value === "") return;
                        openMomentModal(Number(value));
                      }}
                      className="w-full rounded-full border border-slate-200/80 bg-slate-100/95 px-4 py-2.5 text-left text-sm font-semibold text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    >
                      <option value="">More moments</option>
                      {additionalMobileLabels.map((label, index) => (
                        <option key={label} value={index + 4}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>

              <Stagger
                className="hidden grid-cols-1 gap-2.5 md:grid md:grid-cols-2"
                staggerChildren={0.04}
                once={false}
              >
                {labels.map((label, index) => {
                  const isActive = selectedMomentIndex === index;
                  const showProprietaryMark = isProprietaryMoment(label);

                  return (
                    <motion.button
                      key={label}
                      type="button"
                      onClick={() => openMomentModal(index)}
                      className={`relative rounded-full border px-4 py-2.5 text-left text-sm font-semibold transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 md:text-[0.95rem] ${
                        isActive
                          ? "border-[#11b864] bg-[#18c971] text-slate-900 shadow-md"
                          : "border-slate-200/80 bg-slate-100/95 text-slate-900 shadow-sm hover:-translate-y-px hover:border-[#11b864] hover:bg-[#18c971] hover:shadow-md"
                      } ${showProprietaryMark ? "pr-10" : ""}`}
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
                      {showProprietaryMark ? (
                        <>
                          <img
                            src="/genius-assets/genius_g_logo.svg"
                            alt=""
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-90"
                          />
                          <span className="sr-only">Genius proprietary moment signal</span>
                        </>
                      ) : null}
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
        onClose={closeMomentModal}
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
                className="rounded-full border border-[#2458df] bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:border-[#2458df]/50 disabled:bg-[#2563eb]/50 disabled:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
              >
                Next
              </button>
            </div>
            <button
              type="button"
              onClick={closeMomentModal}
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
            <div className="rounded-2xl border border-slate-200 bg-slate-100/85 p-4 shadow-sm md:p-5">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Trigger</p>
              <p className="mt-2 text-[1.12rem] leading-relaxed text-slate-800 md:text-[1.15rem]">
                {activeDetails?.trigger}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-100/85 p-4 shadow-sm md:p-5">
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
