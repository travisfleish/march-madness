import type { MarchMadnessMomentsContent } from "../../content/marchMadnessMoments";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Stagger, useReducedMotionSafe } from "../motion/MotionPrimitives";

type Step3CreativeVizProps = {
  data: MarchMadnessMomentsContent["creativeAndChannel"]["creativeViz"];
};

type MessageCardProps = {
  audienceLabel: string;
  cardTitle: string;
  lead: string;
  body: string;
  enableTyping: boolean;
};

function useTypedCopy(lead: string, body: string, enableTyping: boolean) {
  const fullText = `${lead} ${body}`;
  const [visibleChars, setVisibleChars] = useState(enableTyping ? 0 : fullText.length);

  useEffect(() => {
    if (!enableTyping) {
      setVisibleChars(fullText.length);
      return;
    }

    setVisibleChars(0);
    const intervalId = window.setInterval(() => {
      setVisibleChars((current) => {
        if (current >= fullText.length) {
          window.clearInterval(intervalId);
          return fullText.length;
        }

        return current + 1;
      });
    }, 32);

    return () => window.clearInterval(intervalId);
  }, [enableTyping, fullText]);

  const leadChars = Math.min(visibleChars, lead.length);
  const bodyChars = Math.max(visibleChars - lead.length - 1, 0);

  return {
    visibleLead: lead.slice(0, leadChars),
    visibleBody: body.slice(0, bodyChars)
  };
}

function MessageCard({ audienceLabel, cardTitle, lead, body, enableTyping }: MessageCardProps) {
  const { visibleLead, visibleBody } = useTypedCopy(lead, body, enableTyping);

  return (
    <div className="flex h-full flex-col">
      <p className="mx-auto max-w-[22rem] text-center text-sm font-medium text-slate-600 md:max-w-none md:text-left">
        {audienceLabel}
      </p>
      <article className="mt-3 flex flex-1 flex-col rounded-xl border border-slate-300 bg-gs-surface p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <h3 className="text-center text-base font-semibold tracking-wide text-slate-900">{cardTitle}</h3>
        <p className="mt-4 min-h-[1.25rem] text-sm font-semibold text-slate-900">{visibleLead}</p>
        <p className="mt-2 min-h-[5.25rem] text-sm leading-relaxed text-slate-700">{visibleBody}</p>
      </article>
    </div>
  );
}

function Step3CreativeViz({ data }: Step3CreativeVizProps) {
  const reducedMotion = useReducedMotionSafe();
  const vizRef = useRef<HTMLDivElement | null>(null);
  const desktopConnectorRef = useRef<HTMLDivElement | null>(null);
  const leftDesktopCardRef = useRef<HTMLDivElement | null>(null);
  const rightDesktopCardRef = useRef<HTMLDivElement | null>(null);
  const isVizInView = useInView(vizRef, { once: true, amount: 0.25 });
  const isTypingInView = useInView(vizRef, { once: false, amount: 0.25 });
  const drawDelay = reducedMotion ? 0 : 0.52;
  const enableTyping = isTypingInView && !reducedMotion;
  const [connectorMetrics, setConnectorMetrics] = useState({
    width: 1,
    leftCenter: 0,
    rightCenter: 1
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const connectorNode = desktopConnectorRef.current;
    const leftNode = leftDesktopCardRef.current;
    const rightNode = rightDesktopCardRef.current;

    if (!connectorNode || !leftNode || !rightNode) {
      return;
    }

    const updateConnectorMetrics = () => {
      const connectorRect = connectorNode.getBoundingClientRect();
      const leftRect = leftNode.getBoundingClientRect();
      const rightRect = rightNode.getBoundingClientRect();

      const width = Math.max(connectorRect.width, 1);
      const leftCenter = leftRect.left + leftRect.width / 2 - connectorRect.left;
      const rightCenter = rightRect.left + rightRect.width / 2 - connectorRect.left;

      setConnectorMetrics({
        width,
        leftCenter: Math.max(0, Math.min(leftCenter, width)),
        rightCenter: Math.max(0, Math.min(rightCenter, width))
      });
    };

    updateConnectorMetrics();

    const resizeObserver = new ResizeObserver(updateConnectorMetrics);
    resizeObserver.observe(connectorNode);
    resizeObserver.observe(leftNode);
    resizeObserver.observe(rightNode);
    window.addEventListener("resize", updateConnectorMetrics);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateConnectorMetrics);
    };
  }, []);

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
          <p className="text-sm font-semibold text-slate-800 md:text-base">{data.triggerTitle}</p>
          <p className="mt-3 text-sm font-semibold text-slate-800 md:text-base">{data.exampleLabel}</p>
          <p className="mt-2 text-base text-slate-700 md:text-lg">{data.exampleEvent}</p>
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
                enableTyping={enableTyping}
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
                enableTyping={enableTyping}
              />
            </motion.div>
          </Stagger>
        </div>

        <div className="mt-8 hidden md:block">
          <div
            ref={desktopConnectorRef}
            className="relative mx-auto h-16 w-full max-w-5xl"
            aria-hidden="true"
          >
            <svg viewBox={`0 0 ${connectorMetrics.width} 64`} className="h-full w-full">
              <motion.path
                d={(() => {
                  const trunkX = (connectorMetrics.leftCenter + connectorMetrics.rightCenter) / 2;
                  const spread = connectorMetrics.rightCenter - connectorMetrics.leftCenter;
                  const bendRadius = Math.max(4, Math.min(10, spread / 6));
                  const branchY = 20;
                  const endY = 63;

                  return [
                    `M ${trunkX} 1 V ${branchY}`,
                    `M ${trunkX} ${branchY} H ${connectorMetrics.leftCenter + bendRadius}`,
                    `Q ${connectorMetrics.leftCenter} ${branchY} ${connectorMetrics.leftCenter} ${branchY + bendRadius}`,
                    `V ${endY}`,
                    `M ${trunkX} ${branchY} H ${connectorMetrics.rightCenter - bendRadius}`,
                    `Q ${connectorMetrics.rightCenter} ${branchY} ${connectorMetrics.rightCenter} ${branchY + bendRadius}`,
                    `V ${endY}`
                  ].join(" ");
                })()}
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
          <Stagger
            className="mt-3 grid gap-6 md:grid-cols-2"
            staggerChildren={0.12}
            delayChildren={drawDelay}
          >
            <motion.div
              ref={leftDesktopCardRef}
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
                enableTyping={enableTyping}
              />
            </motion.div>
            <motion.div
              ref={rightDesktopCardRef}
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
                enableTyping={enableTyping}
              />
            </motion.div>
          </Stagger>
        </div>
      </div>
    </motion.div>
  );
}

export default Step3CreativeViz;
