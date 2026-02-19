import Step3CreativeViz from "../visualizations/Step3CreativeViz";
import type { MarchMadnessMomentsContent } from "../../content/marchMadnessMoments";
import { Reveal } from "../motion/MotionPrimitives";

type CreativeChannelSectionProps = {
  header: string;
  paragraph: string;
  creativeViz: MarchMadnessMomentsContent["creativeAndChannel"]["creativeViz"];
};

function CreativeChannelSection({ header, paragraph, creativeViz }: CreativeChannelSectionProps) {
  return (
    <Reveal
      id="creative"
      as="section"
      className="section-shell scroll-mt-24 border border-slate-200/80"
    >
      <h2 className="section-title">{header}</h2>
      <p className="section-copy">{paragraph}</p>
      <Step3CreativeViz data={creativeViz} />
    </Reveal>
  );
}

export default CreativeChannelSection;
