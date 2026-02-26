import type { StepCard } from "../../content/marchMadnessMoments";
import { motion } from "framer-motion";
import { Reveal, Stagger, useReducedMotionSafe } from "../motion/MotionPrimitives";

type HowItWorksSectionProps = {
  header: string;
  paragraph: string;
  steps: StepCard[];
};

function HowItWorksSection({ header, paragraph, steps }: HowItWorksSectionProps) {
  const reducedMotion = useReducedMotionSafe();
  const stepAnchorIds = ["moments", "audiences", "creative"] as const;

  return (
    <Reveal
      id="how-it-works"
      as="section"
      once={false}
      className="scroll-mt-24 p-6 md:p-10"
    >
      <h2 className="section-title text-[1.5rem] leading-tight md:hidden">
        <span className="block whitespace-nowrap">Your March Madness</span>
        <span className="block whitespace-nowrap">Moments Campaign:</span>
        <span className="block whitespace-nowrap">How it Works</span>
      </h2>
      <h2 className="section-title hidden md:block">{header}</h2>
      <p className="section-copy">{paragraph}</p>

      <Stagger className="mt-8 hidden gap-4 md:grid md:grid-cols-3" staggerChildren={0.24} once={false}>
        {steps.map((step, index) => (
          <motion.a
            key={step.title}
            href={`#${stepAnchorIds[index] ?? "moments"}`}
            onClick={(event) => {
              const targetId = stepAnchorIds[index] ?? "moments";
              const target = document.getElementById(targetId);
              if (!target) return;
              event.preventDefault();
              target.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
              });
            }}
            className="relative grid min-h-[12.5rem] content-center rounded-2xl bg-[var(--color-lightGrey)] p-6 transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1 }
            }}
            transition={{
              duration: reducedMotion ? 0.22 : 0.42,
              ease: "easeOut"
            }}
          >
            {step.badge ? (
              <span className="absolute left-4 top-0 z-10 -translate-y-1/2 rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                {step.badge}
              </span>
            ) : null}
            <div>
              <h3 className="m-0 font-heading text-base font-book leading-[1.45] tracking-[-0.01125em] text-[#0D1226]">
                {step.title}
              </h3>
              <p className="mb-0 mt-2 font-sans text-base font-normal leading-[1.45] tracking-[-0.01125em] text-[rgba(13,18,38,0.8)]">
                {step.body}
              </p>
            </div>
          </motion.a>
        ))}
      </Stagger>
    </Reveal>
  );
}

export default HowItWorksSection;
