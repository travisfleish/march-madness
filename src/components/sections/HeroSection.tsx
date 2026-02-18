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

function HeroSection({ kicker, titleLines, stats, sideBarStat }: HeroSectionProps) {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1520px] px-5 py-10 md:px-10 md:py-12 lg:px-14 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[57%_43%] lg:gap-10">
          <div className="flex min-h-[24rem] flex-col justify-center lg:min-h-[33rem]">
            <p className="text-base font-medium text-slate-900 md:text-3xl">{kicker}</p>
            <h1 className="mt-4 font-heading font-bold tracking-tight text-black leading-[0.95] text-[clamp(3.25rem,10vw,6.875rem)] md:mt-5">
              {titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>
          <div className="w-full lg:-ml-4 lg:aspect-square">
            <div className="grid h-full gap-px bg-white p-px md:grid-cols-2 md:items-stretch lg:grid-cols-[minmax(0,1fr)_7.5rem]">
              <div className="grid auto-rows-auto grid-cols-8 gap-px bg-white lg:h-full lg:grid-rows-3">
              {stats.map((stat, index) => {
                const tileSize = stat.size ?? "md";
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
                      {stat.value}
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
              <aside className="bg-[#1D26FF] p-5 text-white md:min-h-[20rem] lg:h-full lg:min-h-0 lg:p-4">
                <p className="text-[3.1rem] font-bold leading-[0.9] lg:text-[3.3rem]">
                  {sideBarStat.value}
                </p>
                <p className="mt-1 text-[2.2rem] font-normal leading-none">{sideBarStat.label}</p>
                <p className="mt-3 text-base leading-tight text-blue-50 lg:text-[1.1rem]">
                  {sideBarStat.description}
                </p>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
