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
      <h2 className="section-title text-[1.65rem] leading-tight md:hidden">
        <span className="block">Your March Madness</span>
        <span className="block">Moments Campaign:</span>
        <span className="block">How it Works</span>
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
            className="relative block rounded-xl border border-slate-200 bg-gs-surface p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#0014ff]/30 hover:shadow-[0_0_0_1px_rgba(0,20,255,0.18),0_10px_22px_rgba(15,23,42,0.08),0_0_28px_rgba(0,20,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
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
            <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-3 text-sm text-slate-600">{step.body}</p>
          </motion.a>
        ))}
      </Stagger>
    </Reveal>
  );
}

export default HowItWorksSection;
