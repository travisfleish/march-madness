import type { MarchMadnessMomentsContent } from "../../content/marchMadnessMoments";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Stagger, useReducedMotionSafe } from "../motion/MotionPrimitives";

type Step3CreativeVizProps = {
  data: MarchMadnessMomentsContent["creativeAndChannel"]["creativeViz"];
};

type MessageCardProps = {
  audienceLabel: string;
  cardTitle: string;
  lead: string;
  body: string;
};

function MessageCard({ audienceLabel, cardTitle, lead, body }: MessageCardProps) {
  return (
    <div className="flex h-full flex-col">
      <p className="mx-auto max-w-[22rem] text-center text-xs font-medium text-slate-600 md:max-w-none md:text-left">
        {audienceLabel}
      </p>
      <article className="mt-3 flex flex-1 flex-col rounded-xl border border-slate-300 bg-gs-surface p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <h3 className="text-center text-sm font-semibold tracking-wide text-slate-900">{cardTitle}</h3>
        <p className="mt-4 text-sm font-semibold text-slate-900">{lead}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{body}</p>
      </article>
    </div>
  );
}

function Step3CreativeViz({ data }: Step3CreativeVizProps) {
  const reducedMotion = useReducedMotionSafe();
  const vizRef = useRef<HTMLDivElement | null>(null);
  const isVizInView = useInView(vizRef, { once: true, amount: 0.25 });
  const drawDelay = reducedMotion ? 0 : 0.52;

  return (
    <motion.div
      ref={vizRef}
      className="mt-8 flex justify-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0.2 : 0.45, ease: "easeOut" }}
    >
      <div className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-gs-surface px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold text-slate-800 md:text-sm">{data.triggerTitle}</p>
          <p className="mt-3 text-xs font-semibold text-slate-800 md:text-sm">{data.exampleLabel}</p>
          <p className="mt-2 text-sm text-slate-700 md:text-base">{data.exampleEvent}</p>
        </div>

        <div className="mt-6 md:hidden">
          <div className="mx-auto h-12 w-6" aria-hidden="true">
            <svg viewBox="0 0 24 48" className="h-full w-full">
              <motion.path
                d="M12 2 L12 46"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{
                  pathLength: reducedMotion ? 1 : 0,
                  opacity: reducedMotion ? 1 : 0
                }}
                animate={{
                  pathLength: isVizInView || reducedMotion ? 1 : 0,
                  opacity: isVizInView || reducedMotion ? 1 : 0
                }}
                transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
              />
            </svg>
          </div>
          <Stagger className="space-y-6" staggerChildren={0.12} delayChildren={drawDelay}>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: reducedMotion ? 0 : 8 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: reducedMotion ? 0.1 : 0.26, ease: "easeOut" }}
            >
              <MessageCard
                audienceLabel={data.leftAudienceLabel}
                cardTitle={data.leftCardTitle}
                lead={data.leftLead}
                body={data.leftBody}
              />
            </motion.div>
            <div className="mx-auto h-12 w-6" aria-hidden="true">
              <svg viewBox="0 0 24 48" className="h-full w-full">
                <motion.path
                  d="M12 2 L12 46"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{
                    pathLength: reducedMotion ? 1 : 0,
                    opacity: reducedMotion ? 1 : 0
                  }}
                  animate={{
                    pathLength: isVizInView || reducedMotion ? 1 : 0,
                    opacity: isVizInView || reducedMotion ? 1 : 0
                  }}
                  transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut", delay: 0.1 }}
                />
              </svg>
            </div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: reducedMotion ? 0 : 8 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: reducedMotion ? 0.1 : 0.26, ease: "easeOut" }}
            >
              <MessageCard
                audienceLabel={data.rightAudienceLabel}
                cardTitle={data.rightCardTitle}
                lead={data.rightLead}
                body={data.rightBody}
              />
            </motion.div>
          </Stagger>
        </div>

        <div className="mt-6 hidden md:block">
          <div className="relative mx-auto h-10 max-w-4xl" aria-hidden="true">
            <svg viewBox="0 0 100 40" className="h-full w-full">
              <motion.path
                d="M50 1 V20 H25 V39 M50 20 H75 V39"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{
                  pathLength: reducedMotion ? 1 : 0,
                  opacity: reducedMotion ? 1 : 0
                }}
                animate={{
                  pathLength: isVizInView || reducedMotion ? 1 : 0,
                  opacity: isVizInView || reducedMotion ? 1 : 0
                }}
                transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
              />
            </svg>
          </div>
          <Stagger className="grid gap-6 lg:grid-cols-2" staggerChildren={0.12} delayChildren={drawDelay}>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: reducedMotion ? 0 : 8 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: reducedMotion ? 0.1 : 0.26, ease: "easeOut" }}
            >
              <MessageCard
                audienceLabel={data.leftAudienceLabel}
                cardTitle={data.leftCardTitle}
                lead={data.leftLead}
                body={data.leftBody}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: reducedMotion ? 0 : 8 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: reducedMotion ? 0.1 : 0.26, ease: "easeOut" }}
            >
              <MessageCard
                audienceLabel={data.rightAudienceLabel}
                cardTitle={data.rightCardTitle}
                lead={data.rightLead}
                body={data.rightBody}
              />
            </motion.div>
          </Stagger>
        </div>
      </div>
    </motion.div>
  );
}

export default Step3CreativeViz;
