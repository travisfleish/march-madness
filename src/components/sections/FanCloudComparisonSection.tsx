import {
  type KeyboardEventHandler,
  type PointerEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useReducedMotionSafe } from "../motion/MotionPrimitives";
import RollingNumber from "../motion/RollingNumber";

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

function splitMetricValue(raw: string) {
  const match = raw.match(/^([^\d-]*)(-?\d+)(.*)$/);
  if (!match) {
    return { prefix: "", number: null as number | null, suffix: raw };
  }

  const [, prefix, numericPart, suffix] = match;
  const parsedNumber = Number.parseInt(numericPart, 10);

  return {
    prefix,
    number: Number.isNaN(parsedNumber) ? null : parsedNumber,
    suffix
  };
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
  const metricsRowRef = useRef<HTMLDivElement | null>(null);
  const hasMetricsEnteredRef = useRef(false);
  const [imageBoxWidthPx, setImageBoxWidthPx] = useState<number>(1200);
  const [metricsRollKey, setMetricsRollKey] = useState(0);
  const isFrameInView = useInView(frameRef, { once: true, amount: 0.35 });
  const isMetricsInView = useInView(metricsRowRef, { once: false, amount: 0.35 });
  const parsedMetrics = useMemo(
    () =>
      metrics.map((metric) => ({
        ...metric,
        parts: splitMetricValue(metric.value)
      })),
    [metrics]
  );

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

  useEffect(() => {
    if (isMetricsInView && !hasMetricsEnteredRef.current) {
      setMetricsRollKey((current) => current + 1);
      hasMetricsEnteredRef.current = true;
      return;
    }

    if (!isMetricsInView) {
      hasMetricsEnteredRef.current = false;
    }
  }, [isMetricsInView]);

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    setHasInteracted(true);
    setShowHelperHint(false);
    activePointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    updateFromClientX(event.clientX);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isDragging || activePointerIdRef.current !== event.pointerId) return;
    updateFromClientX(event.clientX);
  };

  const endPointerDrag: PointerEventHandler<HTMLDivElement> = (event) => {
    if (activePointerIdRef.current !== event.pointerId) return;
    activePointerIdRef.current = null;
    setIsDragging(false);
    queueSliderUpdate(snapPercent(pendingPercentRef.current));
  };

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
    "absolute left-3 top-3 z-20 max-w-[48%] rounded-full px-4 py-2 text-center text-xs font-semibold leading-tight md:left-5 md:top-5 md:max-w-[42%] md:text-base transition-all duration-200",
    isOtherViewDominant
      ? "bg-[#2a34ff] text-white ring-2 ring-[#d6e86f] shadow-[0_0_22px_rgba(214,232,111,0.65)] scale-[1.03]"
      : "bg-[#1D26FF]/15 text-white/35 ring-1 ring-white/10 saturate-50"
  ].join(" ");
  const rightLabelClasses = [
    "absolute right-3 top-3 z-20 max-w-[48%] rounded-full px-4 py-2 text-center text-xs font-semibold leading-tight md:right-5 md:top-5 md:max-w-[42%] md:text-base transition-all duration-200",
    isGeniusViewDominant
      ? "bg-[#2a34ff] text-white ring-2 ring-[#d6e86f] shadow-[0_0_22px_rgba(214,232,111,0.65)] scale-[1.03]"
      : "bg-[#1D26FF]/15 text-white/35 ring-1 ring-white/10 saturate-50"
  ].join(" ");

  return (
    <section
      id="fan-cloud"
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen scroll-mt-24 overflow-hidden bg-[#0A1330]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 py-10 md:px-8 md:py-14 lg:px-10 lg:py-16">
        <h2 className="mx-auto max-w-4xl text-center font-heading text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
          {headlineWithHalo ? (
            <>
              {headlineWithHalo[0]}
              <span className="text-white [text-shadow:0_0_4px_rgba(214,232,111,0.7),0_0_11px_rgba(214,232,111,0.48),0_0_18px_rgba(42,52,255,0.4)]">
                {geniusSportsPhrase}
              </span>
              {headlineWithHalo[1]}
            </>
          ) : (
            headline
          )}
        </h2>

        <div className="mt-8 md:mt-10">
          <div
            ref={frameRef}
            className={`relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-2xl border border-[#2b57ff] bg-black/70 shadow-[0_0_0_1px_rgba(29,38,255,0.35)] lg:w-[1200px] ${
              isDragging ? "cursor-grabbing" : "cursor-col-resize"
            }`}
            style={{ minHeight: "260px", touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endPointerDrag}
            onPointerCancel={endPointerDrag}
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
                className="absolute inset-0 h-full w-full object-contain"
                draggable={false}
              />

              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderPercent}%` }}
              >
                <img
                  src={rightImageSrc}
                  alt={rightLabel}
                  className="absolute left-0 top-0 h-full max-w-none object-contain"
                  style={{ width: `${imageBoxWidthPx}px` }}
                  draggable={false}
                />
              </div>

              <div
                className="pointer-events-none absolute inset-y-0 z-30 w-px bg-white/90"
                style={{ left: `calc(${sliderPercent}% - 0.5px)` }}
              />

              <motion.div
                className={`absolute left-0 top-1/2 z-40 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#1D26FF] text-white outline-none ${
                  isDragging || isHandleFocused
                    ? "shadow-[0_0_0_4px_rgba(255,255,255,0.2)]"
                    : "shadow-[0_4px_16px_rgba(10,19,48,0.45)]"
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
                className="mt-4 text-center text-sm font-medium text-blue-100 md:text-base"
              >
                Drag to compare
              </motion.p>
            ) : null}
          </AnimatePresence>
          {!showHelperHint && helperText ? (
            <p className="mt-4 text-center text-sm font-medium text-blue-100/80 md:text-base">
              {helperText}
            </p>
          ) : null}

          <div className="mx-auto mt-6 w-full max-w-[1120px] md:mt-8">
            <p className="text-center text-sm font-medium text-[#d6e86f] md:text-lg">
              {metricsEyebrow}
            </p>
            <div className="mt-3 overflow-x-auto pb-1">
              <div
                ref={metricsRowRef}
                className="mx-auto flex w-max min-w-full rounded-2xl bg-[#161f3e] ring-1 ring-inset ring-white/12 md:w-full md:rounded-full"
              >
                {parsedMetrics.map((metric, index) => (
                  <article
                    key={`${metric.value}-${metric.label}`}
                    className={`flex min-w-[9.5rem] flex-col justify-center px-5 py-3 text-center md:min-w-0 md:flex-1 md:px-6 md:py-4 ${
                      index > 0 ? "border-l border-white/15" : ""
                    }`}
                  >
                    <p className="text-2xl font-bold leading-none text-white md:text-4xl">
                      {metric.parts.number !== null ? (
                        <>
                          {metric.parts.prefix}
                          <RollingNumber
                            value={metric.parts.number}
                            duration={0.5}
                            rerollDuration={0.5}
                            rerollKey={metricsRollKey}
                          />
                          {metric.parts.suffix}
                        </>
                      ) : (
                        metric.value
                      )}
                    </p>
                    <p className="mt-1 whitespace-nowrap text-xs font-medium leading-tight text-slate-300 md:text-lg">
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
