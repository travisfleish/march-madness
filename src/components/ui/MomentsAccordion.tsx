import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "../motion/MotionPrimitives";

type MomentDetails = {
  trigger: string;
  description: string;
};

type MomentsAccordionProps = {
  labels: string[];
  detailsByLabel: Record<string, MomentDetails>;
};

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : ""))
    .join(" ");
}

function PlusMinusIcon({ isOpen }: { isOpen: boolean }) {
  const iconFillClass = isOpen ? "text-[var(--color-lightGrey)]" : "text-[#18C971]";
  const iconStroke = isOpen ? "#0d1226" : "#ffffff";

  return (
    <span className="block h-6 w-6" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <rect width="24" height="24" rx="12" fill="currentColor" className={iconFillClass} />
        <path d="M7.5 12h9" stroke={iconStroke} strokeWidth="1.8" strokeLinecap="round" />
        {!isOpen ? <path d="M12 7.5v9" stroke={iconStroke} strokeWidth="1.8" strokeLinecap="round" /> : null}
      </svg>
    </span>
  );
}

function MomentsAccordion({ labels, detailsByLabel }: MomentsAccordionProps) {
  const reducedMotion = useReducedMotionSafe();
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const mobileItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const mobileExtraWrapperRef = useRef<HTMLDivElement | null>(null);
  const cinderellaIndex = labels.findIndex((label) => label.toUpperCase() === "CINDERELLA STORY");
  const mobileSplitIndex = cinderellaIndex === -1 ? labels.length : cinderellaIndex;
  const mobileButtonLabels = labels.slice(0, mobileSplitIndex);
  const mobileExtraLabels = labels.slice(mobileSplitIndex);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [openIdsByColumn, setOpenIdsByColumn] = useState<Record<number, string | null>>({
    0: null,
    1: null
  });
  const midpoint = Math.ceil(labels.length / 2);
  const labelColumns = [labels.slice(0, midpoint), labels.slice(midpoint)];

  useEffect(() => {
    if (typeof window === "undefined" || !mobileOpenId) {
      return;
    }

    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobileViewport) {
      return;
    }

    const openItemNode = mobileItemRefs.current[mobileOpenId];
    if (!openItemNode) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          setMobileOpenId((current) => (current === mobileOpenId ? null : current));
        }
      },
      { threshold: 0 }
    );

    observer.observe(openItemNode);
    return () => observer.disconnect();
  }, [mobileOpenId]);

  useEffect(() => {
    if (typeof window === "undefined" || !isMobileExpanded) {
      return;
    }

    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobileViewport) {
      return;
    }

    const extraWrapperNode = mobileExtraWrapperRef.current;
    if (!extraWrapperNode) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          setIsMobileExpanded(false);
          setMobileOpenId((current) =>
            current && mobileExtraLabels.includes(current) ? null : current
          );
        }
      },
      { threshold: 0 }
    );

    observer.observe(extraWrapperNode);
    return () => observer.disconnect();
  }, [isMobileExpanded, mobileExtraLabels]);

  return (
    <>
      <div className="flex flex-col gap-4 md:hidden">
        <div className="grid grid-cols-1 gap-2">
          {mobileButtonLabels.map((label, index) => {
            const isOpen = mobileOpenId === label;
            const panelId = `mobile-moment-panel-${index}`;
            const details = detailsByLabel[label] ?? {
              trigger: "Moment trigger details for this selection.",
              description:
                "Moment description placeholder explaining how this in-game event connects your message to fan emotion."
            };

            return (
              <div
                key={label}
                ref={(node) => {
                  mobileItemRefs.current[label] = node;
                }}
                className="overflow-hidden rounded-lg bg-white"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setMobileOpenId((current) => (current === label ? null : label))}
                  className="flex w-full flex-col px-5 py-4 text-left text-sm font-medium text-slate-900"
                >
                  <span className="flex items-center gap-3">
                    <PlusMinusIcon isOpen={isOpen} />
                    <h3 className="m-0 font-heading text-left text-base font-book leading-6 text-slate-900">
                      {toTitleCase(label)}
                    </h3>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      key={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: reducedMotion ? 0.12 : 0.22,
                        ease: "easeOut"
                      }}
                      className="overflow-hidden border-t border-[var(--color-lightGrey)] bg-white"
                    >
                      <div className="space-y-2 px-5 pb-4 pt-3 text-left">
                        <p className="text-sm text-slate-900">
                          <span className="font-medium text-slate-700">Trigger: </span>
                          {details.trigger}
                        </p>
                        <p className="text-sm text-slate-900">
                          <span className="font-medium text-slate-700">Description: </span>
                          {details.description}
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
          {mobileExtraLabels.length > 0 ? (
            <button
              type="button"
              aria-expanded={isMobileExpanded}
              onClick={() => setIsMobileExpanded((current) => !current)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-base font-medium text-slate-700 shadow-[0_6px_16px_rgba(15,23,42,0.08)]"
            >
              <span className="flex items-center justify-between">
                <span>{isMobileExpanded ? "Show less" : "And more"}</span>
                <span aria-hidden="true" className="text-slate-500">
                  ...
                </span>
              </span>
            </button>
          ) : null}

          <AnimatePresence initial={false}>
            {isMobileExpanded ? (
              <motion.div
                ref={mobileExtraWrapperRef}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: reducedMotion ? 0.12 : 0.22,
                  ease: "easeOut"
                }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {mobileExtraLabels.map((label, index) => {
                    const isOpen = mobileOpenId === label;
                    const panelId = `mobile-moment-panel-extra-${index}`;
                    const details = detailsByLabel[label] ?? {
                      trigger: "Moment trigger details for this selection.",
                      description:
                        "Moment description placeholder explaining how this in-game event connects your message to fan emotion."
                    };

                    return (
                      <div
                        key={label}
                        ref={(node) => {
                          mobileItemRefs.current[label] = node;
                        }}
                        className="overflow-hidden rounded-lg bg-white"
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setMobileOpenId((current) => (current === label ? null : label))}
                          className="flex w-full flex-col px-5 py-4 text-left text-sm font-medium text-slate-900"
                        >
                          <span className="flex items-center gap-3">
                            <PlusMinusIcon isOpen={isOpen} />
                            <h3 className="m-0 font-heading text-left text-base font-book leading-6 text-slate-900">
                              {toTitleCase(label)}
                            </h3>
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen ? (
                            <motion.div
                              id={panelId}
                              key={panelId}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: reducedMotion ? 0.12 : 0.22,
                                ease: "easeOut"
                              }}
                              className="overflow-hidden border-t border-[var(--color-lightGrey)] bg-white"
                            >
                              <div className="space-y-2 px-5 pb-4 pt-3 text-left">
                                <p className="text-sm text-slate-900">
                                  <span className="font-medium text-slate-700">Trigger: </span>
                                  {details.trigger}
                                </p>
                                <p className="text-sm text-slate-900">
                                  <span className="font-medium text-slate-700">Description: </span>
                                  {details.description}
                                </p>
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden flex-col gap-4 md:flex md:flex-row md:items-start md:gap-8">
        {labelColumns.map((columnLabels, columnIndex) => (
          <div key={`column-${columnIndex}`} className="mt-0 flex w-full flex-col divide-y divide-[var(--color-lightGrey)] overflow-hidden rounded-lg bg-white">
            {columnLabels.map((label, index) => {
              const isOpen = openIdsByColumn[columnIndex] === label;
              const panelId = `moment-panel-${columnIndex}-${index}`;
              const details = detailsByLabel[label] ?? {
                trigger: "Moment trigger details for this selection.",
                description:
                  "Moment description placeholder explaining how this in-game event connects your message to fan emotion."
              };

              return (
                <div
                  key={label}
                  className="overflow-hidden bg-white"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenIdsByColumn((current) => ({
                        ...current,
                        [columnIndex]: current[columnIndex] === label ? null : label
                      }))
                    }
                    className="flex w-full flex-col bg-white px-5 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80"
                  >
                    <span className="flex items-center gap-3">
                      <PlusMinusIcon isOpen={isOpen} />
                      <h3 className="m-0 font-heading text-left text-base font-book leading-6 text-slate-900">
                        {toTitleCase(label)}
                      </h3>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={panelId}
                        key={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: reducedMotion ? 0.12 : 0.22,
                          ease: "easeOut"
                        }}
                        className="overflow-hidden bg-white"
                      >
                        <div className="mx-auto max-w-3xl space-y-2 px-6 pb-4 pt-3 text-left">
                          <p className="text-base text-slate-900">
                            <span className="font-medium text-slate-700">Trigger: </span>
                            {details.trigger}
                          </p>
                          <p className="text-base text-slate-900">
                            <span className="font-medium text-slate-700">Description: </span>
                            {details.description}
                          </p>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default MomentsAccordion;
