import type { MarchMadnessMomentsContent } from "../../content/marchMadnessMoments";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "../motion/MotionPrimitives";
import { MarchMadnessBracket } from "./VCU";

type Step3CreativeVizProps = {
  data: MarchMadnessMomentsContent["creativeAndChannel"]["creativeViz"];
};

type MessageCardProps = {
  cardTitle: string;
  imageSrc?: string;
  lead: string;
  body: string;
  enableTyping: boolean;
  instantText: boolean;
  accentTop?: boolean;
};

function useTypedCopy(lead: string, body: string, enableTyping: boolean, instantText: boolean) {
  const fullText = `${lead} ${body}`;
  const hasStartedTypingRef = useRef(instantText);
  const [visibleChars, setVisibleChars] = useState(instantText ? fullText.length : 0);

  useEffect(() => {
    if (instantText) {
      setVisibleChars(fullText.length);
      return;
    }

    if (!enableTyping) {
      if (!hasStartedTypingRef.current) {
        setVisibleChars(0);
      }
      return;
    }

    hasStartedTypingRef.current = true;
    setVisibleChars(0);
    const intervalId = window.setInterval(() => {
      setVisibleChars((current) => {
        if (current >= fullText.length) {
          window.clearInterval(intervalId);
          return fullText.length;
        }

        return current + 1;
      });
    }, 30);

    return () => window.clearInterval(intervalId);
  }, [enableTyping, fullText, instantText]);

  const leadChars = Math.min(visibleChars, lead.length);
  const bodyChars = Math.max(visibleChars - lead.length - 1, 0);

  return {
    visibleLead: lead.slice(0, leadChars),
    visibleBody: body.slice(0, bodyChars)
  };
}

function MessageCard({
  cardTitle,
  imageSrc,
  lead,
  body,
  enableTyping,
  instantText,
  accentTop = false
}: MessageCardProps) {
  if (imageSrc) {
    return (
      <div className="flex h-full items-start justify-center pt-1">
        <img
          src={imageSrc}
          alt={cardTitle}
          className="block h-auto w-full max-w-[7.5rem] sm:max-w-[9.5rem] md:max-w-[16.5rem]"
          loading="lazy"
          draggable={false}
        />
      </div>
    );
  }

  const { visibleLead, visibleBody } = useTypedCopy(lead, body, enableTyping, instantText);

  return (
    <div className="flex h-full flex-col">
      <article
        className={`flex flex-1 flex-col rounded-2xl border bg-gradient-to-b from-white to-slate-50 p-5 shadow-[0_6px_20px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.10)] ${
          accentTop ? "border-emerald-200 border-t-[3px]" : "border-slate-300"
        }`}
      >
        <h3 className="text-center text-lg font-semibold tracking-wide text-slate-900">{cardTitle}</h3>
        <p className="mt-4 min-h-[1.25rem] text-base font-semibold text-slate-900">{visibleLead}</p>
        <p className="mt-2 min-h-[5.25rem] text-base leading-relaxed text-slate-700">{visibleBody}</p>
      </article>
    </div>
  );
}

function AudienceLabel({ label, align = "left" }: { label: string; align?: "left" | "center" }) {
  const [prefix, ...rest] = label.split(":");
  const value = rest.join(":").trim();
  const eyebrow = prefix.trim().toUpperCase();
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col ${alignClass}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{eyebrow}</p>
      <p className="mt-1 rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-slate-800 md:text-base">{value}</p>
    </div>
  );
}

function Step3CreativeViz({ data }: Step3CreativeVizProps) {
  const reducedMotion = useReducedMotionSafe();
  const vizRef = useRef<HTMLDivElement | null>(null);
  const leftDesktopCardRef = useRef<HTMLDivElement | null>(null);
  const rightDesktopCardRef = useRef<HTMLDivElement | null>(null);
  const titleFadeDelayDesktop = reducedMotion ? 0 : 0.35;
  const titleFadeDelayMobile = reducedMotion ? 0 : 0.28;
  const leftCardFadeDelayDesktop = reducedMotion ? 0 : 0.55;
  const rightCardFadeDelayDesktop = reducedMotion ? 0 : leftCardFadeDelayDesktop + 0.12;
  const leftCardFadeDelayMobile = reducedMotion ? 0 : 0.42;
  const rightCardFadeDelayMobile = reducedMotion ? 0 : leftCardFadeDelayMobile + 0.12;
  const typingStartDelayMs = reducedMotion ? 0 : 650;
  const [isBracketComplete, setIsBracketComplete] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [hasStartedAnimation, setHasStartedAnimation] = useState(reducedMotion);
  const [areCardsReady, setAreCardsReady] = useState(reducedMotion);
  const handleBracketComplete = useCallback(() => {
    if (typeof window === "undefined" || reducedMotion) {
      setIsBracketComplete(true);
      return;
    }

    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
    const breathMs = isMobileViewport ? 220 : 320;
    window.setTimeout(() => setIsBracketComplete(true), breathMs);
  }, [reducedMotion]);
  const revealCreativeFlow = isMobileViewport
    ? true
    : reducedMotion
      ? true
      : isBracketComplete;
  const enableTyping = areCardsReady && !reducedMotion && !isMobileViewport;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsMobileViewport(mediaQuery.matches);
    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    if (!hasStartedAnimation) {
      setHasStartedAnimation(true);
    }
  }, [hasStartedAnimation]);

  useEffect(() => {
    if (reducedMotion) {
      setAreCardsReady(true);
      return;
    }

    if (!revealCreativeFlow) {
      setAreCardsReady(false);
      return;
    }

    const readyTimer = window.setTimeout(() => {
      setAreCardsReady(true);
    }, rightCardFadeDelayDesktop * 1000 + typingStartDelayMs);

    return () => window.clearTimeout(readyTimer);
  }, [reducedMotion, revealCreativeFlow, rightCardFadeDelayDesktop, typingStartDelayMs]);

  return (
    <motion.div
      ref={vizRef}
      className="mt-8 flex justify-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0.2 : 0.45, ease: "easeOut" }}
    >
      <div className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:px-8 md:py-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg font-bold text-slate-900 md:text-2xl">{data.triggerTitle}</p>
          <p className="mt-3 text-lg text-slate-700 md:text-xl">{data.exampleEvent}</p>
        </div>
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_12px_24px_rgba(15,23,42,0.08)]">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(58% 74% at 50% 40%, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.05) 42%, rgba(16,185,129,0.015) 68%, rgba(16,185,129,0) 100%)",
              filter: "blur(18px)"
            }}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[52%]" aria-hidden="true">
            <img
              src="/genius-assets/green-lines.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-right opacity-[0.75]"
              style={{
                filter: "saturate(0.82) blur(1.6px)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 24%, rgba(0,0,0,0.46) 62%, rgba(0,0,0,0.74) 100%)",
                maskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 24%, rgba(0,0,0,0.46) 62%, rgba(0,0,0,0.74) 100%)"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-50/12 to-slate-50/88" />
          </div>
          <div className="pointer-events-none absolute inset-2 rounded-xl border border-white/55" aria-hidden="true" />
          <div className="relative z-10 hidden h-[400px] min-w-[860px] md:block md:min-w-0">
            <MarchMadnessBracket
              onAnimationComplete={handleBracketComplete}
              startAnimation={!isMobileViewport && hasStartedAnimation}
            />
          </div>
        </div>

        {!revealCreativeFlow && (
          <div className="mt-0 md:hidden -mt-px h-[34rem]" aria-hidden="true" />
        )}
        {revealCreativeFlow && <div className="mt-0 md:hidden -mt-px">
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="min-w-0">
              <motion.p
                className="mx-auto max-w-[11rem]"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0.1 : 0.25,
                  ease: "easeOut",
                  delay: titleFadeDelayMobile
                }}
              >
                <AudienceLabel label={data.leftAudienceLabel} align="center" />
              </motion.p>
              <motion.div
                className="mt-3"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0.1 : 0.3,
                  ease: "easeOut",
                  delay: leftCardFadeDelayMobile
                }}
              >
              <MessageCard
                cardTitle={data.leftCardTitle}
                imageSrc={data.leftCardImageSrc}
                lead={data.leftLead}
                body={data.leftBody}
                enableTyping={enableTyping}
                instantText={true}
                accentTop={true}
              />
              </motion.div>
            </div>
            <div className="min-w-0">
              <motion.p
                className="mx-auto max-w-[11rem]"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0.1 : 0.25,
                  ease: "easeOut",
                  delay: titleFadeDelayMobile + 0.12
                }}
              >
                <AudienceLabel label={data.rightAudienceLabel} align="center" />
              </motion.p>
              <motion.div
                className="mt-3"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0.1 : 0.3,
                  ease: "easeOut",
                  delay: rightCardFadeDelayMobile
                }}
              >
              <MessageCard
                cardTitle={data.rightCardTitle}
                imageSrc={data.rightCardImageSrc}
                lead={data.rightLead}
                body={data.rightBody}
                enableTyping={enableTyping}
                instantText={true}
              />
              </motion.div>
            </div>
          </div>
        </div>}

        {!revealCreativeFlow && (
          <div className="mt-0 hidden md:block -mt-px h-[21rem]" aria-hidden="true" />
        )}
        {revealCreativeFlow && <div className="mt-0 hidden md:block -mt-px">
          <div className="mt-2 grid gap-6 md:grid-cols-2">
            <motion.div
              ref={leftDesktopCardRef}
              className="flex h-full flex-col"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0.1 : 0.25,
                ease: "easeOut",
                delay: titleFadeDelayDesktop
              }}
            >
              <AudienceLabel label={data.leftAudienceLabel} align="center" />
              <motion.div
                className="mt-3"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0.1 : 0.3,
                  ease: "easeOut",
                  delay: leftCardFadeDelayDesktop
                }}
              >
              <MessageCard
                cardTitle={data.leftCardTitle}
                imageSrc={data.leftCardImageSrc}
                lead={data.leftLead}
                body={data.leftBody}
                enableTyping={enableTyping}
                instantText={reducedMotion}
                accentTop={true}
              />
              </motion.div>
            </motion.div>
            <motion.div
              ref={rightDesktopCardRef}
              className="flex h-full flex-col"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0.1 : 0.25,
                ease: "easeOut",
                delay: titleFadeDelayDesktop + 0.12
              }}
            >
              <AudienceLabel label={data.rightAudienceLabel} align="center" />
              <motion.div
                className="mt-3"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0.1 : 0.3,
                  ease: "easeOut",
                  delay: rightCardFadeDelayDesktop
                }}
              >
              <MessageCard
                cardTitle={data.rightCardTitle}
                imageSrc={data.rightCardImageSrc}
                lead={data.rightLead}
                body={data.rightBody}
                enableTyping={enableTyping}
                instantText={reducedMotion}
              />
              </motion.div>
            </motion.div>
          </div>
        </div>}
      </div>
    </motion.div>
  );
}

export default Step3CreativeViz;
