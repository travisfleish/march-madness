import { useEffect, useMemo, useState } from "react";
import { useReducedMotionSafe } from "../motion/MotionPrimitives";

const navItems = [
  { id: "fan-cloud", label: "Fan Cloud" },
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
    <nav className="sticky top-0 z-40 -mx-2 hidden px-2 pt-5 pb-2 md:block md:top-2 md:pt-6 md:pb-3 lg:top-3">
      <div className="overflow-x-auto rounded-full bg-gs-surface p-1 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
        <ul className="flex w-max min-w-full items-center gap-1">
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
                  className={`rounded-full px-3 py-2 text-sm font-medium transition md:px-4 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default SectionNav;
