import AudiencesSection from "../components/sections/AudiencesSection";
import CreativeChannelSection from "../components/sections/CreativeChannelSection";
import FanCloudComparisonSection from "../components/sections/FanCloudComparisonSection";
import HeroSection from "../components/sections/HeroSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import MomentsSection from "../components/sections/MomentsSection";
import SectionNav from "../components/nav/SectionNav";
import ProofBand from "../components/sections/ProofBand";
import { Reveal } from "../components/motion/MotionPrimitives";
import { marchMadnessMomentsContent as content } from "../content/marchMadnessMoments";
import { useCallback } from "react";

function MarchMadnessMomentsPage() {
  const handleBackToTop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <HeroSection {...content.hero} />
      <div className="bg-white px-4 pb-8 md:px-8 md:pb-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <SectionNav />
          <FanCloudComparisonSection {...content.fanCloudComparison} />
          <Reveal
            as="section"
            className="px-1 py-2 md:py-3"
          >
            <div className="max-w-[700px]">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {content.campaignIntro.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                {content.campaignIntro.subtitle}
              </p>
            </div>
          </Reveal>
          <ProofBand {...content.proof} />
          <HowItWorksSection {...content.howItWorks} />
          <MomentsSection
            header={content.moments.header}
            introParagraph1={content.moments.introParagraph1}
            introParagraph2={content.moments.introParagraph2}
            labels={content.moments.labels}
          />
          <AudiencesSection {...content.audiences} />
          <CreativeChannelSection {...content.creativeAndChannel} />
        </div>
        <section className="mt-6 md:hidden">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleBackToTop}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:bg-slate-50"
            >
              Back to top
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default MarchMadnessMomentsPage;
