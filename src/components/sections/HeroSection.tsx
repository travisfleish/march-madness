import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotionSafe } from "../motion/MotionPrimitives";
import RollingNumber from "../motion/RollingNumber";

type HeroSectionProps = {
  kicker: string;
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
  sm: "col-span-8 min-h-[9.5rem] p-4 md:col-span-1 lg:col-span-3 lg:row-span-1 lg:min-h-0 lg:p-5",
  md: "col-span-8 min-h-[12rem] p-5 md:col-span-1 lg:col-span-4 lg:row-span-2 lg:min-h-0 lg:p-6",
  lg: "col-span-8 min-h-[7.5rem] p-5 lg:col-span-8 lg:row-span-1 lg:min-h-0 lg:p-6"
};

function parseNumericStat(value: string) {
  const parsed = Number.parseInt(value.replace(/[^\d-]/g, ""), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function HeroSection({ kicker, titleLines, stats, sideBarStat }: HeroSectionProps) {
  const reducedMotion = useReducedMotionSafe();
  const [isLoaded, setIsLoaded] = useState(false);
  const [rollVersions, setRollVersions] = useState<Record<string, number>>({});
  const numericSideValue = parseNumericStat(sideBarStat.value);
  const sideBarRollId = `${sideBarStat.value}-${sideBarStat.label}-sidebar`;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const triggerRoll = (tileId: string) => {
    setRollVersions((previous) => ({
      ...previous,
      [tileId]: (previous[tileId] ?? 0) + 1
    }));
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="w-full p-0">
        <div className="grid items-center gap-8 lg:grid-cols-[57%_43%] lg:items-stretch lg:gap-0">
          <motion.div
            className="flex min-h-[24rem] flex-col items-center justify-center px-6 md:px-10 lg:min-h-[33rem] lg:px-0"
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: isLoaded || reducedMotion ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
          >
            <div className="mx-auto w-fit text-left">
              <p className="text-base font-medium text-slate-900 md:text-3xl">{kicker}</p>
              <h1 className="-ml-[0.02em] mt-4 font-heading font-bold tracking-tight text-black leading-[0.95] text-[clamp(3.25rem,10vw,6.875rem)] md:mt-5">
                {titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </div>
          </motion.div>
          <motion.div
            className="w-full lg:h-full"
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: isLoaded || reducedMotion ? 1 : 0 }}
            transition={{
              duration: reducedMotion ? 0 : 0.32,
              ease: "easeOut",
              delay: reducedMotion ? 0 : 0.32
            }}
          >
            <div className="grid h-full gap-px bg-white md:grid-cols-2 md:items-stretch lg:grid-cols-[minmax(0,1fr)_11rem]">
              <div className="grid auto-rows-auto grid-cols-8 gap-px bg-white lg:h-full lg:grid-rows-3">
              {stats.map((stat, index) => {
                const tileSize = stat.size ?? "md";
                const numericStatValue = parseNumericStat(stat.value);
                const statRollId = `${stat.value}-${stat.label}-${index}`;
                const isTwentyMillionTile = stat.value === "20" && stat.label === "Million";
                const isHundredMillionTile = stat.value === "100" && stat.label === "Million";
                const spanClass =
                  tileSize === "lg"
                    ? DESKTOP_TILE_CLASSES.lg
                    : tileSize === "sm"
                      ? DESKTOP_TILE_CLASSES.sm
                      : index === 1
                        ? "col-span-8 min-h-[12rem] p-5 md:col-span-1 lg:col-span-4 lg:row-span-2 lg:min-h-0 lg:p-6"
                        : DESKTOP_TILE_CLASSES.md;

                return (
                  <article
                    key={`${stat.value}-${stat.label}`}
                    className={`bg-[#1D26FF] text-white lg:h-full ${spanClass} ${isTwentyMillionTile ? "relative flex flex-col justify-end overflow-hidden" : ""} ${isHundredMillionTile ? "flex flex-col justify-center" : ""}`}
                    onMouseEnter={() => triggerRoll(statRollId)}
                  >
                    {isTwentyMillionTile ? (
                      <>
                        <span className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] hidden border-t border-white/60 lg:block" />
                        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-1/2 z-[2] hidden lg:block">
                          <motion.img
                            src="/basketball.png"
                            alt="NCAA basketball"
                            className="absolute left-1/2 top-1/2 w-[75%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
                            initial={{ opacity: reducedMotion ? 1 : 0 }}
                            animate={{ opacity: isLoaded || reducedMotion ? 1 : 0 }}
                            transition={{
                              duration: reducedMotion ? 0 : 0.3,
                              ease: "easeOut",
                              delay: reducedMotion ? 0 : 0.42
                            }}
                          />
                        </div>
                        <div className="relative z-[3] lg:mt-auto lg:flex lg:h-1/2 lg:translate-y-2 lg:flex-col lg:justify-center">
                          <p className="text-[3rem] font-bold leading-[0.9] lg:text-[3.25rem]">
                            {numericStatValue !== null ? (
                              <RollingNumber
                                value={numericStatValue}
                                rerollKey={rollVersions[statRollId] ?? 0}
                              />
                            ) : (
                              stat.value
                            )}
                          </p>
                          <p className="mt-1 text-[2.1rem] font-normal leading-none lg:text-[2.35rem]">
                            {stat.label}
                          </p>
                          <p className="mt-2 text-sm leading-tight text-blue-50 lg:mt-3">
                            {stat.description}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-[3rem] font-bold leading-[0.9] lg:text-[3.25rem]">
                          {numericStatValue !== null ? (
                            <RollingNumber
                              value={numericStatValue}
                              rerollKey={rollVersions[statRollId] ?? 0}
                            />
                          ) : (
                            stat.value
                          )}
                        </p>
                        <p className="mt-1 text-[2.1rem] font-normal leading-none lg:text-[2.35rem]">
                          {stat.label}
                        </p>
                        <p className="mt-2 text-sm leading-tight text-blue-50 lg:mt-3">
                          {stat.description}
                        </p>
                      </>
                    )}
                  </article>
                );
              })}
              </div>
              <aside
                className="flex flex-col bg-[#1D26FF] text-center text-white md:min-h-[20rem] lg:h-full lg:min-h-0"
                onMouseEnter={() => triggerRoll(sideBarRollId)}
              >
                <div className="shrink-0 border-b border-white/60 p-5 lg:flex lg:basis-[40%] lg:flex-col lg:justify-center lg:p-4">
                  <p className="text-[3.1rem] font-bold leading-[0.9] lg:text-[3.3rem]">
                    {numericSideValue !== null ? (
                      <RollingNumber
                        value={numericSideValue}
                        rerollKey={rollVersions[sideBarRollId] ?? 0}
                      />
                    ) : (
                      sideBarStat.value
                    )}
                  </p>
                  <p className="mt-1 text-[2.2rem] font-normal leading-none">{sideBarStat.label}</p>
                  <p className="mt-3 text-base leading-tight text-blue-50 lg:text-[1.1rem]">
                    {sideBarStat.description}
                  </p>
                </div>
                <div className="relative w-full overflow-hidden aspect-[3/4] md:aspect-[2/3] lg:aspect-auto lg:flex-1">
                  <img
                    src="/fans-vertical.png"
                    alt="Cheering basketball fans"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </aside>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
