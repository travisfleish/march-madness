import AudiencesSection from "../components/sections/AudiencesSection";
import CreativeChannelSection from "../components/sections/CreativeChannelSection";
import FanCloudComparisonSection from "../components/sections/FanCloudComparisonSection";
import HeroSection from "../components/sections/HeroSection";
import MomentsSection from "../components/sections/MomentsSection";
import ProofBand from "../components/sections/ProofBand";
import { marchMadnessMomentsContent as content } from "../content/marchMadnessMoments";

function MarchMadnessMomentsPage() {
  return (
    <main>
      <HeroSection {...content.hero} />
      <div className="px-4 pb-8 md:px-8 md:pb-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <FanCloudComparisonSection {...content.fanCloudComparison} />
        <section className="px-1 py-2 md:py-3">
          <div className="max-w-[700px]">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              {content.campaignIntro.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
              {content.campaignIntro.subtitle}
            </p>
          </div>
        </section>
        <ProofBand {...content.proof} />
        <MomentsSection
          header={content.moments.header}
          introParagraph1={content.moments.introParagraph1}
          introParagraph2={content.moments.introParagraph2}
          labels={content.moments.labels}
        />
        <AudiencesSection {...content.audiences} />
        <CreativeChannelSection {...content.creativeAndChannel} />
        </div>
      </div>
    </main>
  );
}

export default MarchMadnessMomentsPage;
