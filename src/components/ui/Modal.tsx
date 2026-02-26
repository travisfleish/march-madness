import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "../motion/MotionPrimitives";

type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function Modal({ isOpen, title, onClose, children, footer }: ModalProps) {
  const reducedMotion = useReducedMotionSafe();
  const containerRef = useRef<HTMLDivElement>(null);

  const headingId = useMemo(
    () => `modal-title-${title.toLowerCase().replace(/\s+/g, "-")}`,
    [title]
  );

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const container = containerRef.current;
    const focusables = container?.querySelectorAll<HTMLElement>(focusableSelector);
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];

    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const active = document.activeElement as HTMLElement | null;
      if (!first || !last) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          aria-hidden={!isOpen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : 0.22, ease: "easeOut" }}
        >
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            className="relative w-full max-w-[680px] overflow-hidden rounded-brand border border-[var(--color-lightGrey)] bg-white p-6 shadow-card outline-none md:p-8"
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.24, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#66d29f]/80" aria-hidden />
            <div className="flex items-start justify-between gap-4">
              <h3 id={headingId} className="text-3xl font-medium tracking-tight text-slate-900">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={title}
                    className="block"
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
                    transition={{ duration: reducedMotion ? 0.1 : 0.2, ease: "easeOut" }}
                  >
                    {title}
                  </motion.span>
                </AnimatePresence>
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="inline-flex h-11 w-11 items-center justify-center rounded-brand border border-[#66d29f] bg-white text-2xl leading-none text-slate-500 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="mt-5 text-slate-700">{children}</div>
            {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default Modal;
