import { useEffect, useMemo, useState } from "react";
import { useReducedMotionSafe } from "../motion/MotionPrimitives";

const navItems = [
  { id: "fan-cloud", label: "Fan Graph" },
  { id: "proof", label: "The Data" },
  { id: "how-it-works", label: "How it Works" },
  { id: "moments", label: "Genius Moments" },
  { id: "audiences", label: "Custom Audiences" },
  { id: "creative", label: "Dynamic Creative" }
] as const;

function SectionNav() {
  const reducedMotion = useReducedMotionSafe();
  const [activeId, setActiveId] = useState<(typeof navItems)[number]["id"]>(navItems[0].id);

  const sectionIds = useMemo(() => navItems.map((item) => item.id), []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const visibleRatios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sectionId = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) {
            visibleRatios.set(sectionId, entry.intersectionRatio);
          } else {
            visibleRatios.delete(sectionId);
          }
        }

        let nextId: (typeof navItems)[number]["id"] | null = null;
        let maxRatio = 0;
        visibleRatios.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            nextId = id as (typeof navItems)[number]["id"];
          }
        });

        if (maxRatio > 0 && nextId) {
          setActiveId(nextId);
        }
      },
      {
        threshold: [0, 0.35, 0.6, 1],
        rootMargin: "-12% 0px -45% 0px"
      }
    );

    for (const section of sections) observer.observe(section);

    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <nav className="sticky top-0 z-40 hidden md:block">
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl border-y border-slate-200/90 px-4 py-4 md:px-1">
          <div className="flex items-center justify-between gap-5">
          <p className="shrink-0 text-base font-normal tracking-[0.01em] text-slate-700">March Madness</p>
          <ul className="flex w-max min-w-0 items-center gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = item.id === activeId;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    const target = document.getElementById(item.id);
                    if (!target) return;
                    target.scrollIntoView({
                      behavior: reducedMotion ? "auto" : "smooth",
                      block: "start"
                    });
                  }}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-base font-normal transition md:px-3 ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      isActive ? "bg-emerald-500" : "bg-transparent"
                    }`}
                    aria-hidden="true"
                  />
                  {item.label}
                </button>
              </li>
            );
          })}
          </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SectionNav;
