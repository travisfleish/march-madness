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
  const numericSideValue = parseNumericStat(sideBarStat.value);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
                    className={`bg-[#1D26FF] text-white lg:h-full ${spanClass}`}
                  >
                    <p className="text-[3rem] font-bold leading-[0.9] lg:text-[3.25rem]">
                      {numericStatValue !== null ? (
                        <RollingNumber value={numericStatValue} />
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
                  </article>
                );
              })}
              </div>
              <aside className="flex flex-col bg-[#1D26FF] p-5 text-center text-white md:min-h-[20rem] lg:h-full lg:min-h-0 lg:p-4">
                <p className="text-[3.1rem] font-bold leading-[0.9] lg:text-[3.3rem]">
                  {numericSideValue !== null ? (
                    <RollingNumber value={numericSideValue} />
                  ) : (
                    sideBarStat.value
                  )}
                </p>
                <p className="mt-1 text-[2.2rem] font-normal leading-none">{sideBarStat.label}</p>
                <p className="mt-3 text-base leading-tight text-blue-50 lg:text-[1.1rem]">
                  {sideBarStat.description}
                </p>
              </aside>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
