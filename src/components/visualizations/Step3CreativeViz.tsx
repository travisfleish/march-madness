import type { MarchMadnessMomentsContent } from "../../content/marchMadnessMoments";

type Step3CreativeVizProps = {
  data: MarchMadnessMomentsContent["creativeAndChannel"]["creativeViz"];
};

type MessageCardProps = {
  audienceLabel: string;
  cardTitle: string;
  lead: string;
  body: string;
};

function MessageCard({ audienceLabel, cardTitle, lead, body }: MessageCardProps) {
  return (
    <div className="flex h-full flex-col">
      <p className="mx-auto max-w-[22rem] text-center text-xs font-medium text-slate-600 md:max-w-none md:text-left">
        {audienceLabel}
      </p>
      <article className="mt-3 flex flex-1 flex-col rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
        <h3 className="text-center text-sm font-semibold tracking-wide text-slate-900">{cardTitle}</h3>
        <p className="mt-4 text-sm font-semibold text-slate-900">{lead}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{body}</p>
      </article>
    </div>
  );
}

function Step3CreativeViz({ data }: Step3CreativeVizProps) {
  return (
    <div className="mt-8 flex justify-center">
      <div className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold text-slate-800 md:text-sm">{data.triggerTitle}</p>
          <p className="mt-3 text-xs font-semibold text-slate-800 md:text-sm">{data.exampleLabel}</p>
          <p className="mt-2 text-sm text-slate-700 md:text-base">{data.exampleEvent}</p>
        </div>

        <div className="mt-6 md:hidden">
          <div className="mx-auto h-6 w-px bg-slate-300" aria-hidden="true" />
          <div className="space-y-6">
            <MessageCard
              audienceLabel={data.leftAudienceLabel}
              cardTitle={data.leftCardTitle}
              lead={data.leftLead}
              body={data.leftBody}
            />
            <div className="mx-auto h-6 w-px bg-slate-300" aria-hidden="true" />
            <MessageCard
              audienceLabel={data.rightAudienceLabel}
              cardTitle={data.rightCardTitle}
              lead={data.rightLead}
              body={data.rightBody}
            />
          </div>
        </div>

        <div className="mt-6 hidden md:block">
          <div className="relative mx-auto h-10 max-w-4xl" aria-hidden="true">
            <div className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-slate-300" />
            <div className="absolute left-1/4 right-1/4 top-5 h-px bg-slate-300" />
            <div className="absolute left-1/4 top-5 h-5 w-px bg-slate-300" />
            <div className="absolute right-1/4 top-5 h-5 w-px bg-slate-300" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <MessageCard
              audienceLabel={data.leftAudienceLabel}
              cardTitle={data.leftCardTitle}
              lead={data.leftLead}
              body={data.leftBody}
            />
            <MessageCard
              audienceLabel={data.rightAudienceLabel}
              cardTitle={data.rightCardTitle}
              lead={data.rightLead}
              body={data.rightBody}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step3CreativeViz;
