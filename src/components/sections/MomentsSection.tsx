import { Reveal } from "../motion/MotionPrimitives";
import GeniusStripeRail from "../ui/GeniusStripeRail";
import MomentsAccordion from "../ui/MomentsAccordion";

type MomentsSectionProps = {
  header: string;
  introParagraph1: string;
  introParagraph2: string;
  labels: string[];
};

const highlightedPhrases = ["Genius Moments", "Fan Graph"] as const;
const proprietaryMomentLabels = new Set<string>();
const momentDetailsByLabel: Record<string, { trigger: string; description: string }> = {
  "GAMEDAY LEAD UP": {
    trigger: "Tip-off time",
    description:
      "Capture peak anticipation as fans settle in to watch. This package activates 24 hours ahead of tip-off, reaching audiences the moment excitement builds. Ideal for brands looking to own the start of the experience and associate it with pre-game rituals, research, and anticipation."
  },
  "LATE GAME RALLY": {
    trigger: "Trailing team closing the gap late in the game",
    description:
      "Activates when a trailing team starts mounting a serious late push, delivering high-attention moments filled with tension, hope, and rising excitement."
  },
  "DOWN TO THE WIRE": {
    trigger: "Between 45% and 55% win probability within last 10 minutes",
    description:
      "Own the most intense moments of the game. This package activates during tight contests where the outcome is uncertain, capturing peak fan attention as every possession matters."
  },
  "BUZZER BEATER WIN": {
    trigger: "Points scored to win in final 10 seconds",
    description:
      "Own the most iconic moment in sports. Activates instantly when a last-second shot wins the game, aligning brands with unforgettable, viral, highlight-worthy moments."
  },
  ADVANCEMENT: {
    trigger: "Team wins and advances",
    description:
      "Celebrate victory and progress. Activates when teams secure the next step in their tournament journey, reaching energized fans in moments of pride and excitement."
  },
  ELIMINATION: {
    trigger: "Team loses and is eliminated",
    description:
      "Reach fans during emotional turning points as seasons come to an end. This package captures moments of reflection, loyalty, and heightened engagement following elimination games."
  },
  UPSET: {
    trigger: "Lower seed beats higher seed",
    description:
      "Align with the thrill of the unexpected. Activates when underdogs take down favorites, generating national attention, conversation, and strong emotional reactions."
  },
  "CINDERELLA STORY": {
    trigger: "10 seed or lower advances",
    description:
      "Follow the magic of underdog runs. Activates as unexpected teams continue advancing, capturing widespread fan support, optimism, and tournament storytelling."
  },
  "SWEET 16": {
    trigger: "Reach fans of Sweet 16 teams",
    description:
      "Target high-intent fans as the tournament narrows. Activates around the Sweet 16 stage when excitement intensifies and national attention grows."
  },
  "ELITE 8": {
    trigger: "Reach fans of Elite 8 teams",
    description:
      "Engage deeply invested audiences as teams push toward the Final Four. Delivers premium reach during one of the most competitive stages of the tournament."
  },
  "FINAL FOUR": {
    trigger: "Reach fans of Final Four teams",
    description:
      "Own the spotlight moments. Activates during the week of the Final Four when attention peaks and the stakes are highest, delivering massive engagement and national scale."
  },
  CHAMPIONSHIP: {
    trigger: "Reach fans of teams in Championship game",
    description:
      "Align with the biggest stage. Activates around the championship matchup, capturing peak viewership, emotion, and fan attention across the entire tournament."
  },
  CHAMPION: {
    trigger: "Reach fans of the winning team",
    description:
      "Celebrate the ultimate victory. Activates immediately after a team is crowned champion, connecting brands with fans experiencing peak pride, joy, and celebration."
  },
  "HERO GAME": {
    trigger: "Double-double, triple-double, 20+ points, 10+ rebounds, 5+ threes, 3+ steals",
    description:
      "Align with standout player performances. Activates when athletes deliver exceptional stat lines, capturing moments of greatness, highlight-worthy plays, and fan admiration. Perfect for brands that want to associate with excellence and star power."
  }
};

function renderHighlightedIntro(text: string) {
  const segments = text.split(new RegExp(`(${highlightedPhrases.join("|")})`, "g"));

  return segments.map((segment, index) =>
    highlightedPhrases.includes(segment as (typeof highlightedPhrases)[number]) ? (
      <strong key={`${segment}-${index}`} className="font-medium text-slate-900">
        {segment}
      </strong>
    ) : (
      <span key={`${segment}-${index}`}>{segment}</span>
    )
  );
}

function isProprietaryMoment(label: string) {
  return proprietaryMomentLabels.has(label);
}

function MomentsSection({
  header,
  introParagraph1,
  introParagraph2,
  labels
}: MomentsSectionProps) {
  const filteredLabels = labels.filter((label) => !isProprietaryMoment(label));

  return (
    <Reveal id="moments" as="section" once={false} className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-2xl bg-gs-surface">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f3f4f6] via-[#f3f4f6] to-transparent" />
          <GeniusStripeRail
            theme="blue"
            className="absolute inset-y-0 right-0 hidden w-[38%] md:block"
            dimmed
          />
        </div>

        <div className="relative z-10 px-8 pb-8 pt-4 md:px-10 md:pb-10 md:pt-6">
          <h2 className="section-title">{header}</h2>
          <div className="mt-4 max-w-3xl space-y-3">
            {introParagraph1 !== header ? (
              <p className="m-0 font-sans text-base leading-[1.45] tracking-[-0.01125em] text-[var(--gs-text-muted)]">
                {introParagraph1}
              </p>
            ) : null}
            <p className="m-0 font-sans text-base leading-[1.45] tracking-[-0.01125em] text-[var(--gs-text-muted)]">
              {renderHighlightedIntro(introParagraph2)}
            </p>
          </div>
        </div>

        <div className="relative z-10 px-8 pb-8 md:px-10 md:pb-10">
          <MomentsAccordion labels={filteredLabels} detailsByLabel={momentDetailsByLabel} />
        </div>
      </div>
    </Reveal>
  );
}

export default MomentsSection;
