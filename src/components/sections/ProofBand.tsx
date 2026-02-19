import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal, useReducedMotionSafe } from "../motion/MotionPrimitives";

type ProofBandProps = {
  body: string;
  chart: {
    title: string;
    subtitle: string;
    bars: {
      value: number;
      label: string;
      color: string;
    }[];
    footnote: string;
  };
};

function ProofBand({ body, chart }: ProofBandProps) {
  const reducedMotion = useReducedMotionSafe();
  const chartFrameRef = useRef<HTMLDivElement | null>(null);
  const isChartInView = useInView(chartFrameRef, { once: true, amount: 0.35 });
  const maxBarValue = Math.max(...chart.bars.map((bar) => bar.value), 1);
  const chartMaxHeight = 160;
  const highlightPhrases = new Set(["Emotional engagement", "2x higher"]);
  const bodyParts = body.split(/(Emotional engagement|2x higher)/g);

  return (
    <Reveal
      as="section"
      id="proof"
      className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-gs-surface px-6 py-8 shadow-soft md:px-8 md:py-10"
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[30%] md:block" aria-hidden>
        <img
          src="/genius-assets/blue-lines.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-right opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-gs-surface" />
      </div>

      <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,29rem)] lg:gap-10">
        <div className="flex items-center">
          <p className="max-w-[800px] text-xl font-medium leading-tight text-slate-900 md:text-3xl md:leading-tight">
            {bodyParts.map((part, index) =>
              highlightPhrases.has(part) ? (
                <strong key={`highlight-${index}`} className="font-bold">
                  {part}
                </strong>
              ) : (
                <span key={`text-${index}`}>{part}</span>
              )
            )}
          </p>
        </div>

        <article
          className="w-full max-w-[29rem] justify-self-start overflow-hidden rounded-2xl border border-white/10 bg-[#06080F] p-5 shadow-[0_12px_30px_rgba(2,6,23,0.4)] md:p-6 lg:justify-self-end"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.06) 75%, rgba(255,255,255,0.02) 100%)"
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold leading-tight text-white">{chart.title}</h3>
            <p className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
              2x higher
            </p>
          </div>
          <p className="mt-1 text-sm leading-tight text-slate-300">{chart.subtitle}</p>

          <div className="mt-5" ref={chartFrameRef}>
            <div className="relative" style={{ height: `${chartMaxHeight}px` }}>
              <motion.div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-slate-500/70"
                initial={{ opacity: reducedMotion ? 1 : 0 }}
                animate={{ opacity: isChartInView || reducedMotion ? 1 : 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}
              />
              <div className="flex h-full items-end gap-5">
              {chart.bars.map((bar, index) => (
                <div key={bar.label} className="flex flex-1 items-end">
                  <motion.div
                    className="flex w-full items-center justify-center rounded-t-sm"
                    initial={{ height: reducedMotion ? `${(bar.value / maxBarValue) * chartMaxHeight}px` : 0 }}
                    animate={{
                      height:
                        isChartInView || reducedMotion
                          ? `${(bar.value / maxBarValue) * chartMaxHeight}px`
                          : 0
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.55,
                      ease: "easeOut",
                      delay: reducedMotion ? 0 : 0.12 + index * 0.08
                    }}
                    style={{
                      backgroundColor: bar.color
                    }}
                  >
                    <motion.span
                      className="text-4xl font-semibold leading-none text-white"
                      initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 5 }}
                      animate={{
                        opacity: isChartInView || reducedMotion ? 1 : 0,
                        y: reducedMotion ? 0 : isChartInView ? 0 : 5
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.2,
                        ease: "easeOut",
                        delay: reducedMotion ? 0 : 0.56 + index * 0.08
                      }}
                    >
                      {bar.value}%
                    </motion.span>
                  </motion.div>
                </div>
              ))}
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-5">
              {chart.bars.map((bar) => (
                <p
                  key={`${bar.label}-label`}
                  className="text-center text-sm font-medium leading-tight text-slate-100"
                >
                  {bar.label}
                </p>
              ))}
            </div>
          </div>

          <p className="mt-4 text-center text-xs font-medium text-slate-300">{chart.footnote}</p>
        </article>
      </div>
    </Reveal>
  );
}

export default ProofBand;
