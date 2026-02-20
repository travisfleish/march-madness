import { useState } from "react";
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
  return (
    <span
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500"
      aria-hidden="true"
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4 text-white">
        <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        {!isOpen ? (
          <path d="M8 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        ) : null}
      </svg>
    </span>
  );
}

function MomentsAccordion({ labels, detailsByLabel }: MomentsAccordionProps) {
  const reducedMotion = useReducedMotionSafe();
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const mobileButtonLabels = labels.slice(0, 4);
  const mobileExtraLabels = labels.slice(4);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [openIdsByColumn, setOpenIdsByColumn] = useState<Record<number, string | null>>({
    0: null,
    1: null
  });
  const midpoint = Math.ceil(labels.length / 2);
  const labelColumns = [labels.slice(0, midpoint), labels.slice(midpoint)];

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
              <div key={label} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setMobileOpenId((current) => (current === label ? null : label))}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-900"
                >
                  <PlusMinusIcon isOpen={isOpen} />
                  <span className="whitespace-nowrap">{toTitleCase(label)}</span>
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
                      className="overflow-hidden border-t border-slate-200 bg-white"
                    >
                      <div className="space-y-2 px-4 pb-4 pt-3 text-left">
                        <p className="text-sm text-slate-900">
                          <span className="font-semibold text-slate-700">Trigger: </span>
                          {details.trigger}
                        </p>
                        <p className="text-sm text-slate-900">
                          <span className="font-semibold text-slate-700">Description: </span>
                          {details.description}
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
          <button
            type="button"
            aria-expanded={isMobileExpanded}
            onClick={() => setIsMobileExpanded((current) => !current)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-base font-semibold text-slate-700 shadow-[0_6px_16px_rgba(15,23,42,0.08)]"
          >
            <span className="flex items-center justify-between">
              <span>{isMobileExpanded ? "Show less" : "And more"}</span>
              <span aria-hidden="true" className="text-slate-500">
                ...
              </span>
            </span>
          </button>

          <AnimatePresence initial={false}>
            {isMobileExpanded ? (
              <motion.div
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
                  {mobileExtraLabels.map((label) => {
                    const isOpen = mobileOpenId === label;
                    const panelId = `mobile-moment-panel-extra-${label}`;
                    const details = detailsByLabel[label] ?? {
                      trigger: "Moment trigger details for this selection.",
                      description:
                        "Moment description placeholder explaining how this in-game event connects your message to fan emotion."
                    };

                    return (
                      <div key={label} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setMobileOpenId((current) => (current === label ? null : label))}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-900"
                        >
                          <PlusMinusIcon isOpen={isOpen} />
                          <span className="whitespace-nowrap">{toTitleCase(label)}</span>
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
                              className="overflow-hidden border-t border-slate-200 bg-white"
                            >
                              <div className="space-y-2 px-4 pb-4 pt-3 text-left">
                                <p className="text-sm text-slate-900">
                                  <span className="font-semibold text-slate-700">Trigger: </span>
                                  {details.trigger}
                                </p>
                                <p className="text-sm text-slate-900">
                                  <span className="font-semibold text-slate-700">Description: </span>
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
          <div
            key={`column-${columnIndex}`}
            className="w-full"
          >
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
                  className={`bg-white border border-slate-200/60 overflow-hidden first:rounded-t-lg last:rounded-b-lg ${
                    index === 0 ? "" : "-mt-px"
                  }`}
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
                    className={`flex w-full items-center gap-3 bg-white px-2 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 ${
                      isOpen ? "bg-white" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <PlusMinusIcon isOpen={isOpen} />
                    <span className="text-lg font-medium text-slate-900">{toTitleCase(label)}</span>
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
                            <span className="font-semibold text-slate-700">Trigger: </span>
                            {details.trigger}
                          </p>
                          <p className="text-base text-slate-900">
                            <span className="font-semibold text-slate-700">Description: </span>
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
