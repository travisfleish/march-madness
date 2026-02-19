import { motion } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotionSafe } from "./MotionPrimitives";

type RollingNumberProps = {
  value: number;
  duration?: number;
  className?: string;
  staggerMs?: number;
  padTo?: number;
  formatter?: (n: number) => string;
  rerollKey?: number;
};

const DIGITS = Array.from({ length: 10 }, (_, index) => index.toString());

function buildReelDigits(repeats: number) {
  return Array.from({ length: repeats }, () => DIGITS).flat();
}

function RollingNumber({
  value,
  duration = 1.4,
  className,
  staggerMs = 40,
  padTo,
  formatter,
  rerollKey = 0
}: RollingNumberProps) {
  const reducedMotion = useReducedMotionSafe();

  const displayValue = useMemo(() => {
    if (formatter) return formatter(value);
    return Math.trunc(value).toString().padStart(padTo ?? 0, "0");
  }, [formatter, padTo, value]);

  const reelDigits = useMemo(() => buildReelDigits(60), []);

  if (reducedMotion) {
    return <span className={`inline-flex tabular-nums ${className ?? ""}`}>{displayValue}</span>;
  }

  return (
    <span
      className={`inline-flex tabular-nums align-baseline ${className ?? ""}`}
      style={{ fontVariantNumeric: "tabular-nums" }}
      aria-label={displayValue}
    >
      {Array.from(displayValue).map((char, index) => {
        if (!/\d/.test(char)) {
          return (
            <span key={`char-${index}`} className="inline-block">
              {char}
            </span>
          );
        }

        const targetDigit = Number(char);
        const extraCycles = 24 + index * 3;
        const targetSteps = extraCycles * 10 + targetDigit;
        const animationDelay = (index * staggerMs) / 1000;

        return (
          <span key={`digit-${index}`} className="relative inline-flex h-[1em] w-[0.64em] overflow-hidden">
            <motion.span
              key={`roll-${index}-${rerollKey}`}
              className="flex flex-col"
              initial={{ y: "0em" }}
              animate={{ y: `${-targetSteps}em` }}
              transition={{
                duration,
                delay: animationDelay,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {reelDigits.map((digit, reelIndex) => (
                <span key={`${digit}-${reelIndex}`} className="flex h-[1em] items-center justify-center leading-[1em]">
                  {digit}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

export default RollingNumber;
