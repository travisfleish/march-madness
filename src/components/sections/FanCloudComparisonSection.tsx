import {
  type KeyboardEventHandler,
  type PointerEvent as ReactPointerEvent,
  type PointerEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useReducedMotionSafe } from "../motion/MotionPrimitives";

type FanCloudComparisonSectionProps = {
  headline: string;
  leftLabel: string;
  rightLabel: string;
  leftImageSrc: string;
  rightImageSrc: string;
  helperText?: string;
  metricsEyebrow: string;
  metrics: {
    value: string;
    label: string;
  }[];
};

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function snapPercent(value: number) {
  const snapTargets = [0, 50, 100];
  const nearest = snapTargets.reduce((closest, current) =>
    Math.abs(current - value) < Math.abs(closest - value) ? current : closest
  );

  return Math.abs(nearest - value) <= 8 ? nearest : value;
}

function FanCloudComparisonSection({
  headline,
  leftLabel,
  rightLabel,
  leftImageSrc,
  rightImageSrc,
  helperText,
  metricsEyebrow,
  metrics
}: FanCloudComparisonSectionProps) {
  const reducedMotion = useReducedMotionSafe();
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [sliderPercent, setSliderPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isHandleFocused, setIsHandleFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHelperHint, setShowHelperHint] = useState(true);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imageBoxRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const nudgeRafRef = useRef<number | null>(null);
  const pendingPercentRef = useRef<number>(50);
  const activePointerIdRef = useRef<number | null>(null);
  const [imageBoxWidthPx, setImageBoxWidthPx] = useState<number>(1200);
  const isFrameInView = useInView(frameRef, { once: true, amount: 0.35 });
  const displayedMetrics = (() => {
    if (!isMobileViewport) return metrics;

    // On mobile, show a condensed set of the key stats.
    return [metrics[0], metrics[3], metrics[4]].filter(
      (metric): metric is (typeof metrics)[number] => Boolean(metric)
    );
  })();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsMobileViewport(mediaQuery.matches);
    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  const queueSliderUpdate = useCallback((nextPercent: number) => {
    pendingPercentRef.current = clampPercent(nextPercent);
    if (rafRef.current !== null) return;

    rafRef.current = window.requestAnimationFrame(() => {
      setSliderPercent(pendingPercentRef.current);
      rafRef.current = null;
    });
  }, []);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const frame = frameRef.current;
      if (!frame) return;

      const rect = frame.getBoundingClientRect();
      if (rect.width <= 0) return;

      const relativeX = clientX - rect.left;
      const next = (relativeX / rect.width) * 100;
      queueSliderUpdate(next);
    },
    [queueSliderUpdate]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (nudgeRafRef.current !== null) {
        window.cancelAnimationFrame(nudgeRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const imageBox = imageBoxRef.current;
    if (!imageBox) return;

    const updateWidth = (width: number) => {
      const roundedWidth = Math.max(1, Math.round(width));
      setImageBoxWidthPx(roundedWidth);
    };

    updateWidth(imageBox.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      updateWidth(entry.contentRect.width);
    });

    observer.observe(imageBox);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showHelperHint) return;
    const timeout = window.setTimeout(() => setShowHelperHint(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [showHelperHint]);

  useEffect(() => {
    if (!isFrameInView || reducedMotion || hasInteracted) return;

    const sessionKey = "fan-cloud-slider-nudged";
    if (window.sessionStorage.getItem(sessionKey) === "true") return;
    window.sessionStorage.setItem(sessionKey, "true");

    let startTime = 0;
    const totalDuration = 1200;

    const animateNudge = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min(1, (timestamp - startTime) / totalDuration);
      const nudgeValue =
        progress <= 0.5
          ? 50 + 12 * (progress / 0.5)
          : 62 - 12 * ((progress - 0.5) / 0.5);

      queueSliderUpdate(nudgeValue);

      if (progress < 1) {
        nudgeRafRef.current = window.requestAnimationFrame(animateNudge);
      } else {
        nudgeRafRef.current = null;
      }
    };

    nudgeRafRef.current = window.requestAnimationFrame(animateNudge);

    return () => {
      if (nudgeRafRef.current !== null) {
        window.cancelAnimationFrame(nudgeRafRef.current);
      }
    };
  }, [isFrameInView, reducedMotion, hasInteracted, queueSliderUpdate]);

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    setHasInteracted(true);
    setShowHelperHint(false);
    activePointerIdRef.current = event.pointerId;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {}
    setIsDragging(true);
    updateFromClientX(event.clientX);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isDragging || activePointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    updateFromClientX(event.clientX);
  };

  const stopDragging = useCallback((event?: ReactPointerEvent<HTMLDivElement>) => {
    const activePointerId = activePointerIdRef.current;
    activePointerIdRef.current = null;
    setIsDragging(false);

    if (event && activePointerId !== null) {
      try {
        event.currentTarget.releasePointerCapture(activePointerId);
      } catch {}
    }
  }, []);

  const endPointerDrag: PointerEventHandler<HTMLDivElement> = (event) => {
    if (activePointerIdRef.current !== event.pointerId) return;
    stopDragging(event);
    queueSliderUpdate(snapPercent(pendingPercentRef.current));
  };

  useEffect(() => {
    const stop = () => {
      activePointerIdRef.current = null;
      setIsDragging(false);
    };
    window.addEventListener("pointerup", stop);
    window.addEventListener("blur", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("blur", stop);
    };
  }, []);

  const handleSliderKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setHasInteracted(true);
    setShowHelperHint(false);
    const step = event.shiftKey ? 10 : 5;
    const direction = event.key === "ArrowLeft" ? -1 : 1;
    queueSliderUpdate(sliderPercent + direction * step);
  };

  const isGeniusViewDominant = sliderPercent < 50;
  const isOtherViewDominant = sliderPercent > 50;
  const geniusSportsPhrase = "Genius Sports";
  const headlineWithHalo = headline.includes(geniusSportsPhrase)
    ? headline.split(geniusSportsPhrase)
    : null;
  const leftLabelClasses = [
    "absolute left-3 top-3 z-20 max-w-[48%] rounded-full px-4 py-2 text-center text-[clamp(0.68rem,1.1vw,1rem)] font-semibold leading-tight md:left-5 md:top-5 md:max-w-[48%] transition-all duration-200",
    isOtherViewDominant
      ? "bg-[#3240f5]/90 text-white ring-1 ring-[#d6e86f]/60 shadow-[0_10px_26px_rgba(50,64,245,0.28)] scale-[1.02]"
      : "bg-[#1D26FF]/12 text-white/55 ring-1 ring-white/15 saturate-75"
  ].join(" ");
  const rightLabelClasses = [
    "absolute right-3 top-3 z-20 max-w-[48%] rounded-full px-4 py-2 text-center text-[clamp(0.68rem,1.1vw,1rem)] font-semibold leading-tight md:right-5 md:top-5 md:max-w-[48%] transition-all duration-200",
    isGeniusViewDominant
      ? "bg-[#3240f5]/90 text-white ring-1 ring-[#d6e86f]/60 shadow-[0_10px_26px_rgba(50,64,245,0.28)] scale-[1.02]"
      : "bg-[#1D26FF]/12 text-white/55 ring-1 ring-white/15 saturate-75"
  ].join(" ");

  return (
    <section
      id="fan-cloud"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen scroll-mt-24 overflow-hidden bg-white"
    >
      <div className="mx-auto w-full max-w-[1320px] px-5 pt-6 pb-10 md:px-8 md:pt-8 md:pb-14 lg:px-10 lg:pt-10 lg:pb-16">
        <h2 className="mx-auto max-w-4xl text-center font-heading text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
          {headlineWithHalo ? (
            <>
              {headlineWithHalo[0]}
              <span className="text-[#1D26FF]">
                {geniusSportsPhrase}
              </span>
              {headlineWithHalo[1]}
            </>
          ) : (
            headline
          )}
        </h2>

        <div className="mt-8 md:mt-10">
          <div className="mx-auto grid w-full max-w-[1200px] gap-4 md:hidden">
            <article>
              <p className="mb-2 px-1 text-center text-sm font-semibold leading-snug text-slate-900">{leftLabel}</p>
              <div className="overflow-hidden rounded-2xl border border-[#3b5bd1]/50 bg-gradient-to-br from-[#151b36]/88 to-[#1b2950]/85 shadow-[0_14px_28px_rgba(15,23,42,0.2)] backdrop-blur-[2px]">
                <div className="relative aspect-[16/9] w-full">
                  <img
                    src={rightImageSrc}
                    alt={leftLabel}
                    className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
                    draggable={false}
                  />
                </div>
              </div>
            </article>

            <article>
              <p className="mb-2 px-1 text-center text-sm font-semibold leading-snug text-slate-900">{rightLabel}</p>
              <div className="overflow-hidden rounded-2xl border border-[#3b5bd1]/50 bg-gradient-to-br from-[#151b36]/88 to-[#1b2950]/85 shadow-[0_14px_28px_rgba(15,23,42,0.2)] backdrop-blur-[2px]">
              <div className="relative aspect-[16/9] w-full">
                <img
                  src={leftImageSrc}
                  alt={rightLabel}
                  className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
                  draggable={false}
                />
              </div>
              </div>
            </article>
          </div>

          <div
            ref={frameRef}
            className={`relative mx-auto hidden w-full max-w-[1320px] select-none touch-none overflow-hidden rounded-2xl border border-[#3b5bd1]/50 bg-gradient-to-br from-[#151b36]/90 to-[#1b2950]/88 shadow-[0_18px_36px_rgba(15,23,42,0.22)] backdrop-blur-[2px] md:block ${
              isDragging ? "cursor-grabbing" : "cursor-col-resize"
            }`}
            style={{ minHeight: "260px", touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endPointerDrag}
            onPointerCancel={endPointerDrag}
            onLostPointerCapture={stopDragging}
          >
            <div className={leftLabelClasses}>
              {leftLabel}
            </div>
            <div className={rightLabelClasses}>
              {rightLabel}
            </div>
            <div ref={imageBoxRef} className="relative aspect-[16/9] min-h-[260px] w-full">
              <img
                src={leftImageSrc}
                alt={leftLabel}
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
                draggable={false}
              />

              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderPercent}%` }}
              >
                <img
                  src={rightImageSrc}
                  alt={rightLabel}
                  className="pointer-events-none absolute left-0 top-0 h-full max-w-none select-none object-contain"
                  style={{ width: `${imageBoxWidthPx}px` }}
                  draggable={false}
                />
              </div>

              <div
                className="pointer-events-none absolute inset-y-0 z-30 w-px bg-white/80"
                style={{ left: `calc(${sliderPercent}% - 0.5px)` }}
              />

              <motion.div
                className={`absolute left-0 top-1/2 z-40 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#1D26FF] text-white outline-none ${
                  isDragging || isHandleFocused
                    ? "shadow-[0_0_0_4px_rgba(255,255,255,0.16)]"
                    : "shadow-[0_10px_20px_rgba(10,19,48,0.32)]"
                }`}
                style={{ left: `${sliderPercent}%` }}
                tabIndex={0}
                role="slider"
                aria-label="Fan cloud comparison"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(sliderPercent)}
                onKeyDown={handleSliderKeyDown}
                onFocus={() => setIsHandleFocused(true)}
                onBlur={() => setIsHandleFocused(false)}
              >
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xl font-semibold">
                  ↔
                </span>
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {showHelperHint ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0.1 : 0.22, ease: "easeOut" }}
                className="mt-4 hidden text-center text-sm font-medium text-slate-600 md:block md:text-base"
              >
                Drag to compare
              </motion.p>
            ) : null}
          </AnimatePresence>
          {!showHelperHint && helperText ? (
            <p className="mt-4 hidden text-center text-sm font-medium text-slate-500 md:block md:text-base">
              {helperText}
            </p>
          ) : null}

          <div className="mx-auto mt-6 w-full max-w-[1120px] md:mt-8">
            <p className="text-center text-sm font-medium text-[#d6e86f] md:text-lg">
              {metricsEyebrow}
            </p>
            <div className="mt-3 pb-1">
              <div
                className="mx-auto grid w-full rounded-2xl bg-[#1D26FF] ring-1 ring-inset ring-white/10 shadow-[0_16px_32px_rgba(15,23,42,0.2)] md:rounded-full"
                style={{ gridTemplateColumns: `repeat(${displayedMetrics.length}, minmax(0, 1fr))` }}
              >
                {displayedMetrics.map((metric, index) => (
                  <article
                    key={`${metric.value}-${metric.label}`}
                    className={`flex min-w-0 flex-col items-center justify-center px-3 py-3 text-center md:px-6 md:py-4 ${
                      index > 0 ? "border-l border-white/35" : ""
                    }`}
                  >
                    <p className="flex h-[1.3em] w-full items-center justify-center gap-2 whitespace-nowrap text-lg font-bold leading-none text-slate-100 md:text-[1.85rem]">
                      <span className="inline-flex h-[1em] items-center leading-none">{metric.value}</span>
                    </p>
                    <p className="mt-1 text-[0.66rem] font-medium leading-tight text-slate-200/80 md:text-lg">
                      {metric.label}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FanCloudComparisonSection;
