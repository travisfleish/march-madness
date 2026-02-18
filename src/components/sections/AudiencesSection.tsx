type AudiencesSectionProps = {
  header: string;
  subtitle?: string;
  leftHeader?: string;
  leftList: string[];
  rightHeader: string;
  rightList: string[];
};

function AudiencesSection({
  header,
  subtitle,
  leftHeader,
  leftList,
  rightHeader,
  rightList
}: AudiencesSectionProps) {
  return (
    <section className="section-shell">
      <h2 className="section-title">{header}</h2>
      {subtitle ? <p className="mt-4 max-w-3xl text-lg text-slate-600">{subtitle}</p> : null}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          {leftHeader ? (
            <h3 className="mb-4 text-lg font-semibold text-slate-900">{leftHeader}</h3>
          ) : null}
          <ul className="space-y-3">
            {leftList.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <span className="mt-2 h-2 w-2 rounded-full bg-accent-500" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-lg font-semibold text-slate-900">{rightHeader}</h3>
          <ul className="mt-4 space-y-3">
            {rightList.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <span className="mt-2 h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default AudiencesSection;
