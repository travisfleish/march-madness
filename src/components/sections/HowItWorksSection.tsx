import type { StepCard } from "../../content/marchMadnessMoments";

type HowItWorksSectionProps = {
  header: string;
  paragraph: string;
  steps: StepCard[];
};

function HowItWorksSection({ header, paragraph, steps }: HowItWorksSectionProps) {
  return (
    <section className="section-shell">
      <h2 className="section-title">{header}</h2>
      <p className="section-copy">{paragraph}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <article key={step.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-3 text-sm text-slate-600">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksSection;
