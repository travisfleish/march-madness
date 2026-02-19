import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotionSafe } from "../motion/MotionPrimitives";
import RollingNumber from "../motion/RollingNumber";

type HeroSectionProps = {
  kicker: string;
  subhead: string;
  titleLines: string[];
  stats: {
    value: string;
    label: string;
    description: string;
    size?: "sm" | "md" | "lg";
  }[];
  sideBarStat: {
    value: string;
    label: string;
    description: string;
  };
};

const DESKTOP_TILE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "col-span-8 min-h-[5.9rem] rounded-2xl p-3 md:col-span-1 md:min-h-[8.5rem] md:p-5 lg:col-span-3 lg:row-span-1 lg:min-h-0 lg:p-7",
  md: "col-span-8 min-h-[6.7rem] rounded-2xl p-3 md:col-span-1 md:min-h-[10.75rem] md:p-5 lg:col-span-4 lg:row-span-2 lg:min-h-0 lg:p-7",
  lg: "col-span-8 min-h-[5.7rem] rounded-2xl p-3 md:min-h-[7.75rem] md:p-5 lg:col-span-8 lg:row-span-1 lg:min-h-0 lg:p-7"
};

function parseNumericStat(value: string) {
  const parsed = Number.parseInt(value.replace(/[^\d-]/g, ""), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function HeroSection({ kicker, subhead, titleLines, stats, sideBarStat }: HeroSectionProps) {
  const reducedMotion = useReducedMotionSafe();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [rollVersions, setRollVersions] = useState<Record<string, number>>({});
  const numericSideValue = parseNumericStat(sideBarStat.value);
  const sideBarRollId = `${sideBarStat.value}-${sideBarStat.label}-sidebar`;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsMobileViewport(mediaQuery.matches);
    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  const triggerRoll = (tileId: string) => {
    setRollVersions((previous) => ({
      ...previous,
      [tileId]: (previous[tileId] ?? 0) + 1
    }));
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] md:block" aria-hidden>
        <img
          src="/genius-assets/green-lines.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-right opacity-75 lg:opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[1300px] px-6 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20">
        <div className="relative grid items-center gap-10 lg:grid-cols-[45%_55%] lg:items-stretch lg:gap-0">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-8 left-[45%] hidden w-px -translate-x-1/2 bg-[#0A1330]/12 lg:block"
          />
          <motion.div
            className="flex min-h-[24rem] flex-col items-center justify-center pr-2 md:pr-6 lg:min-h-[33rem] lg:pr-14"
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: isLoaded || reducedMotion ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
          >
            <div className="mx-auto w-fit text-left">
              <img
                src="/genius-assets/genius_g_logo.svg"
                alt="Genius Sports logo"
                className="mb-4 h-auto w-[3.875rem] md:mb-5 md:w-[4.5rem] lg:w-[5.125rem]"
              />
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-slate-700 md:text-sm">
                {kicker}
              </p>
              <div className="mt-3 h-px w-20 bg-slate-900/25 md:mt-4" />
              <h1 className="-ml-[0.02em] mt-4 font-heading font-semibold tracking-[-0.01em] text-black leading-[0.9] text-[clamp(3rem,9vw,6.1rem)] md:mt-5">
                {titleLines.map((line, index) => (
                  <span
                    key={line}
                    className={`block ${line === "2026" || index === titleLines.length - 1 ? "mt-2 text-[0.78em] font-medium tracking-[0.02em] text-slate-800" : ""}`}
                  >
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-4 max-w-[26ch] text-balance text-[1.1rem] font-semibold leading-tight text-[#0A1330] md:mt-5 md:text-[1.35rem] lg:text-[1.6rem]">
                {subhead}
              </p>
            </div>
          </motion.div>
          <motion.div
            className="relative w-full lg:h-full lg:pl-10"
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: isLoaded || reducedMotion ? 1 : 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.32,
              ease: "easeOut",
              delay: reducedMotion ? 0 : 0.32
            }}
          >
            <div className="relative h-full overflow-hidden rounded-[1.6rem] bg-[#0011e1]">
              <div className="relative z-10 grid h-full gap-2 p-2 md:gap-3 md:p-3 md:grid-cols-2 md:items-stretch lg:grid-cols-[minmax(0,1fr)_11.5rem] lg:p-4">
              <div className="grid auto-rows-auto grid-cols-8 gap-2 md:gap-3 lg:h-full lg:grid-rows-3">
              {stats.map((stat, index) => {
                const tileSize = stat.size ?? "md";
                const numericStatValue = parseNumericStat(stat.value);
                const statRollId = `${stat.value}-${stat.label}-${index}`;
                const isTwentyMillionTile = stat.value === "20" && stat.label === "Million";
                const isHundredMillionTile = stat.value === "100" && stat.label === "Million";
                const isSixtyEightTeamsTile = stat.value === "68" && stat.label === "Teams";
                const spanClass =
                  isHundredMillionTile
                    ? "col-span-8 min-h-[6.7rem] rounded-2xl p-3 md:col-span-1 md:min-h-[10.75rem] md:p-6 lg:col-span-5 lg:row-span-2 lg:min-h-0 lg:p-8"
                    : tileSize === "lg"
                      ? DESKTOP_TILE_CLASSES.lg
                      : tileSize === "sm"
                        ? DESKTOP_TILE_CLASSES.sm
                        : index === 1
                          ? "col-span-8 min-h-[6.5rem] rounded-2xl p-3 md:col-span-1 md:min-h-[9.75rem] md:p-5 lg:col-span-3 lg:row-span-2 lg:min-h-0 lg:p-6"
                          : DESKTOP_TILE_CLASSES.md;

                return (
                  <article
                    key={`${stat.value}-${stat.label}`}
                    className={`text-white lg:h-full ${spanClass} ${
                      isHundredMillionTile
                        ? "flex flex-col justify-center bg-[#0014ff] ring-1 ring-white/34"
                        : isSixtyEightTeamsTile
                          ? "flex flex-col justify-center bg-[#0014ff] ring-1 ring-white/30"
                          : isTwentyMillionTile
                            ? "flex flex-col justify-center bg-[#0014ff] ring-1 ring-white/28"
                            : "bg-[#0014ff] ring-1 ring-white/28"
                    }`}
                    onMouseEnter={() => triggerRoll(statRollId)}
                  >
                    <p
                      className={`font-bold leading-[0.88] ${
                        isHundredMillionTile
                          ? "text-[1.95rem] md:text-[3rem] lg:text-[4.15rem]"
                          : isSixtyEightTeamsTile
                            ? "text-[1.8rem] md:text-[2.7rem] lg:text-[3.4rem]"
                            : "text-[1.75rem] md:text-[2.6rem] lg:text-[3.1rem]"
                      }`}
                    >
                      {numericStatValue !== null && !isMobileViewport ? (
                        <RollingNumber value={numericStatValue} rerollKey={rollVersions[statRollId] ?? 0} />
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p className="mt-1 text-[0.92rem] font-medium leading-none text-white/95 md:text-[1.08rem] lg:text-[1.32rem]">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 max-w-[28ch] text-[0.64rem] leading-snug text-blue-50/92 md:mt-3 md:text-xs lg:text-sm">
                      {stat.description}
                    </p>
                  </article>
                );
              })}
              </div>
              <aside
                className="flex flex-col overflow-hidden rounded-2xl bg-[#0014ff] text-left text-white ring-1 ring-white/30 md:min-h-[20rem] lg:h-full lg:min-h-0"
                onMouseEnter={() => triggerRoll(sideBarRollId)}
              >
                <div className="shrink-0 border-b border-white/30 p-3 md:p-6 lg:flex lg:basis-[40%] lg:flex-col lg:justify-center lg:p-6">
                  <p className="text-[1.9rem] font-bold leading-[0.88] md:text-[2.9rem] lg:text-[3.5rem]">
                    {numericSideValue !== null && !isMobileViewport ? (
                      <RollingNumber
                        value={numericSideValue}
                        rerollKey={rollVersions[sideBarRollId] ?? 0}
                      />
                    ) : (
                      sideBarStat.value
                    )}
                  </p>
                  <p className="mt-1 text-[0.95rem] font-medium leading-none text-white/95 md:text-[1.15rem] lg:text-[1.35rem]">
                    {sideBarStat.label}
                  </p>
                  <p className="mt-1.5 text-[0.64rem] leading-snug text-blue-50/92 md:mt-3 md:text-xs lg:text-sm">
                    {sideBarStat.description}
                  </p>
                </div>
                <div className="relative hidden w-full overflow-hidden aspect-[3/4] md:block md:aspect-[2/3] lg:aspect-auto lg:flex-1">
                  <img
                    src="/fans-vertical.png"
                    alt="Cheering basketball fans"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </aside>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
