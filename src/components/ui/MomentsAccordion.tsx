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
  const [openIdsByColumn, setOpenIdsByColumn] = useState<Record<number, string | null>>({
    0: null,
    1: null
  });
  const midpoint = Math.ceil(labels.length / 2);
  const labelColumns = [labels.slice(0, midpoint), labels.slice(midpoint)];

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-3 md:p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
        {labelColumns.map((columnLabels, columnIndex) => (
          <div
            key={`column-${columnIndex}`}
            className="w-full overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50 divide-y divide-slate-200/70"
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
                <div key={label}>
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
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-inset ${
                      isOpen ? "bg-white/80" : "hover:bg-white/60"
                    }`}
                  >
                    <PlusMinusIcon isOpen={isOpen} />
                    <span className="text-lg font-medium text-slate-900">{label}</span>
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
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 px-4 pb-4 pl-[3.75rem] pt-2">
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
        ))}
      </div>
    </div>
  );
}

export default MomentsAccordion;
