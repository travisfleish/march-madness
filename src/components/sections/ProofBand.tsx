type ProofBandProps = {
  body: string;
  chart: {
    title: string;
    subtitle: string;
    bars: {
      value: number;
      label: string;
      color: string;
    }[];
    footnote: string;
  };
};

function ProofBand({ body, chart }: ProofBandProps) {
  const maxBarValue = Math.max(...chart.bars.map((bar) => bar.value), 1);
  const chartMaxHeight = 160;
  const highlightPhrases = new Set(["Emotional engagement", "2x higher"]);
  const bodyParts = body.split(/(Emotional engagement|2x higher)/g);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-soft md:px-8 md:py-10">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,29rem)] lg:gap-10">
        <div className="flex items-center">
          <p className="max-w-[800px] text-xl font-medium leading-tight text-slate-900 md:text-3xl md:leading-tight">
            {bodyParts.map((part, index) =>
              highlightPhrases.has(part) ? (
                <strong key={`highlight-${index}`} className="font-bold">
                  {part}
                </strong>
              ) : (
                <span key={`text-${index}`}>{part}</span>
              )
            )}
          </p>
        </div>

        <article
          className="w-full max-w-[29rem] justify-self-start overflow-hidden rounded-2xl border border-white/10 bg-[#06080F] p-5 shadow-[0_12px_30px_rgba(2,6,23,0.4)] md:p-6 lg:justify-self-end"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.06) 75%, rgba(255,255,255,0.02) 100%)"
          }}
        >
          <h3 className="text-xl font-semibold leading-tight text-white">{chart.title}</h3>
          <p className="mt-1 text-sm leading-tight text-slate-300">{chart.subtitle}</p>

          <div className="mt-5">
            <div className="flex items-end gap-5 border-b border-slate-500/70 pb-0" style={{ height: `${chartMaxHeight}px` }}>
              {chart.bars.map((bar) => (
                <div key={bar.label} className="flex flex-1 items-end">
                  <div
                    className="flex w-full items-center justify-center rounded-t-sm"
                    style={{
                      height: `${(bar.value / maxBarValue) * chartMaxHeight}px`,
                      backgroundColor: bar.color
                    }}
                  >
                    <span className="text-4xl font-semibold leading-none text-white">
                      {bar.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-5">
              {chart.bars.map((bar) => (
                <p
                  key={`${bar.label}-label`}
                  className="text-center text-sm font-medium leading-tight text-slate-100"
                >
                  {bar.label}
                </p>
              ))}
            </div>
          </div>

          <p className="mt-4 text-center text-xs font-medium text-slate-300">{chart.footnote}</p>
        </article>
      </div>
    </section>
  );
}

export default ProofBand;
