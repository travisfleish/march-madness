import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TeamSlot {
  seed: number;
  name: string;
  logo: string;
}

const CARD_WIDTH = 236;
const CARD_HEIGHT = 92; // Total card height
const ROW_HEIGHT = 46; // Each team row height (CARD_HEIGHT / 2)
const VERTICAL_GAP = 80; // Gap between first-round matchups
const CONNECTOR_GAP = 32; // Horizontal gap for connector lines
const STROKE_WIDTH = 2.6;
const CONNECTOR_BASE_STROKE = "#d4c089";
const CONNECTOR_ACCENT_STROKE = "#eab308";
const vcuLogo = "/team_logos/VCU_Rams_logo.svg.png";
const georgetownLogo = "/team_logos/Georgetown_Hoyas_logo.svg.png";
const purdueLogo = "/team_logos/Purdue-Boilermakers-Logo.png";
const saintPetersLogo = "/team_logos/Saint-Peters-Peacocks-logo.png";
const ANIMATION_TIMINGS_MS = {
  state1: 900,
  state2: 1800,
  state3: 2600,
  complete: 3400
} as const;

const HEADER_OFFSET = 48; // tweak 46–52 if font rendering differs

type MarchMadnessBracketProps = {
  onAnimationComplete?: () => void;
  startAnimation?: boolean;
};

export function MarchMadnessBracket({
  onAnimationComplete,
  startAnimation = true
}: MarchMadnessBracketProps) {
  const [animationState, setAnimationState] = useState(0);

  // Auto-advance animation states
  useEffect(() => {
    if (!startAnimation) {
      return;
    }

    const timers = [
      window.setTimeout(() => setAnimationState(1), ANIMATION_TIMINGS_MS.state1),
      window.setTimeout(() => setAnimationState(2), ANIMATION_TIMINGS_MS.state2),
      window.setTimeout(() => setAnimationState(3), ANIMATION_TIMINGS_MS.state3),
      window.setTimeout(() => onAnimationComplete?.(), ANIMATION_TIMINGS_MS.complete)
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [onAnimationComplete, startAnimation]);

  // Calculate vertical positions
  const round1Card1Top = 0;
  const round1Card2Top = CARD_HEIGHT + VERTICAL_GAP;

  // Divider line positions (exactly at CARD_HEIGHT / 2 from card top)
  const round1Card1Divider = round1Card1Top + ROW_HEIGHT;
  const round1Card2Divider = round1Card2Top + ROW_HEIGHT;

  // Round 2 divider is centered between the two Round 1 dividers
  const round2Divider = (round1Card1Divider + round1Card2Divider) / 2;
  const round2CardTop = round2Divider - ROW_HEIGHT;

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent p-8">
      <div className="relative flex items-start gap-0">
        {/* Round 1 Column */}
        <div className="relative" style={{ width: `${CARD_WIDTH}px` }}>
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-slate-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">
              Round of 64
            </span>
          </div>

          <div className="relative" style={{ height: `${round1Card2Top + CARD_HEIGHT}px` }}>
            {/* 6 (Georgetown) vs 11 (VCU) matchup */}
            <div
              className="absolute left-0"
              style={{
                top: `${round1Card1Top}px`,
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
              }}
            >
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
                <TeamRow
                  team={{ seed: 6, name: "Georgetown", logo: georgetownLogo }}
                  isLoser={animationState >= 1}
                />
                <div className="h-px bg-gray-300 flex-shrink-0" />
                <TeamRow
                  team={{ seed: 11, name: "VCU", logo: vcuLogo }}
                  isWinner={animationState >= 1}
                  isVCU={true}
                  showPulse={animationState === 1}
                />
              </div>
            </div>

            {/* 3 (Purdue) vs 14 (Saint Peter's) matchup */}
            <div
              className="absolute left-0"
              style={{
                top: `${round1Card2Top}px`,
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
              }}
            >
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
                <TeamRow
                  team={{ seed: 3, name: "Purdue", logo: purdueLogo }}
                  isWinner={animationState >= 2}
                />
                <div className="h-px bg-gray-300 flex-shrink-0" />
                <TeamRow
                  team={{ seed: 14, name: "Saint Peter's", logo: saintPetersLogo }}
                  isLoser={animationState >= 2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Round 1 to Round 2 Connectors */}
        <svg
          width={CONNECTOR_GAP}
          height={round1Card2Top + CARD_HEIGHT}
          className="flex-shrink-0"
          style={{ marginTop: `${HEADER_OFFSET}px` }} // ✅ ONLY CHANGE
        >
          {/* Connector from Georgetown vs VCU divider to Round 2 */}
          <motion.path
            d={`M 0 ${round1Card1Divider} L ${CONNECTOR_GAP / 2} ${round1Card1Divider} L ${CONNECTOR_GAP / 2} ${round2Divider} L ${CONNECTOR_GAP} ${round2Divider}`}
            stroke={CONNECTOR_BASE_STROKE}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="miter"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: animationState >= 1 ? 1 : 0,
              stroke: animationState >= 2 ? CONNECTOR_ACCENT_STROKE : CONNECTOR_BASE_STROKE,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* Connector from Purdue vs Saint Peter's divider to Round 2 */}
          <motion.path
            d={`M 0 ${round1Card2Divider} L ${CONNECTOR_GAP / 2} ${round1Card2Divider} L ${CONNECTOR_GAP / 2} ${round2Divider} L ${CONNECTOR_GAP} ${round2Divider}`}
            stroke={CONNECTOR_BASE_STROKE}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeLinecap="square"
            strokeLinejoin="miter"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: animationState >= 2 ? 1 : 0,
              stroke: CONNECTOR_BASE_STROKE,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </svg>

        {/* Round 2 Column */}
        <div className="relative" style={{ width: `${CARD_WIDTH}px` }}>
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-slate-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">
              Round of 32
            </span>
          </div>

          <div className="relative" style={{ height: `${round1Card2Top + CARD_HEIGHT}px` }}>
            <AnimatePresence>
              {animationState >= 2 && (
                <motion.div
                  className="absolute left-0"
                  style={{
                    top: `${round2CardTop}px`,
                    width: `${CARD_WIDTH}px`,
                    height: `${CARD_HEIGHT}px`,
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
                    <TeamRow
                      team={{ seed: 11, name: "VCU", logo: vcuLogo }}
                      isWinner={animationState >= 3}
                      isVCU={true}
                      showPulse={animationState >= 3}
                    />
                    <div className="h-px bg-gray-300 flex-shrink-0" />
                    <TeamRow
                      team={{ seed: 3, name: "Purdue", logo: purdueLogo }}
                      isLoser={animationState >= 3}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Round 2 to Sweet 16 Connector - from Round 2 divider */}
        <svg
          width={CONNECTOR_GAP}
          height={round1Card2Top + CARD_HEIGHT}
          className="flex-shrink-0"
          style={{ marginTop: `${HEADER_OFFSET}px` }} // ✅ ONLY CHANGE
        >
          <motion.line
            x1="0"
            y1={round2Divider}
            x2={CONNECTOR_GAP}
            y2={round2Divider}
            stroke={CONNECTOR_BASE_STROKE}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="square"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: animationState >= 3 ? 1 : 0,
              stroke: animationState >= 3 ? CONNECTOR_ACCENT_STROKE : CONNECTOR_BASE_STROKE,
            }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </svg>

        {/* Sweet 16 Column */}
        <div className="relative" style={{ width: `${CARD_WIDTH}px` }}>
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
              Sweet 16
            </span>
          </div>

          <div className="relative" style={{ height: `${round1Card2Top + CARD_HEIGHT}px` }}>
            <AnimatePresence>
              {animationState >= 3 && (
                <motion.div
                  className="absolute left-0"
                  style={{
                    top: `${round2CardTop}px`,
                    width: `${CARD_WIDTH}px`,
                    height: `${CARD_HEIGHT}px`,
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: 0.32 }}
                    className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-700"
                  >
                    Cinderella Run
                  </motion.div>
                  <div className="bg-white border-2 border-green-500 rounded-lg overflow-hidden shadow-[0_10px_24px_rgba(16,185,129,0.22)] h-full">
                    <div className="flex items-center justify-center gap-3 px-4 h-full bg-green-50">
                      <div className="text-base text-gray-600 min-w-6 flex-shrink-0">11</div>

                      <motion.div
                        className="relative w-8 h-8 rounded-full bg-white border-2 border-yellow-400 flex items-center justify-center overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={vcuLogo}
                          alt="VCU"
                          className="w-full h-full object-contain p-0.5"
                        />
                      </motion.div>

                      <div className="text-base text-gray-800 flex-shrink-0">VCU</div>

                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                        className="ml-auto w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TeamRowProps {
  team: TeamSlot;
  isWinner?: boolean;
  isLoser?: boolean;
  isVCU?: boolean;
  showPulse?: boolean;
}

function TeamRow({ team, isWinner, isLoser, isVCU, showPulse }: TeamRowProps) {
  return (
    <motion.div
      className={`flex items-center justify-start gap-3 px-4 flex-1 ${
        isWinner ? "bg-green-50" : ""
      }`}
      style={{ minHeight: `${ROW_HEIGHT}px` }}
      animate={{
        opacity: isLoser ? 0.4 : 1,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="text-base text-gray-500 min-w-6 flex-shrink-0">
        {team.seed}
      </div>

      <motion.div
        className={`relative w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0 ${
          isVCU ? "border-2 border-yellow-400" : "border border-gray-300"
        }`}
        animate={{
          scale: showPulse ? [1, 1.15, 1] : 1,
          boxShadow: showPulse
            ? [
                "0 0 0 0 rgba(234, 179, 8, 0)",
                "0 0 0 8px rgba(234, 179, 8, 0.25)",
                "0 0 0 0 rgba(234, 179, 8, 0)",
              ]
            : "0 0 0 0 rgba(234, 179, 8, 0)",
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
          repeat: showPulse ? 2 : 0,
          repeatDelay: 0.2,
        }}
      >
        <img
          src={team.logo}
          alt={team.name}
          className="w-full h-full object-contain p-0.5"
        />
      </motion.div>

      <div className="text-sm text-gray-800 leading-tight flex-1">{team.name}</div>

      {isWinner && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
        >
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}
