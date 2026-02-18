import { useState } from "react";
import Modal from "../ui/Modal";

type CTASectionProps = {
  primaryButtonText: string;
  modalTitle: string;
  modalBody: string;
  email: string;
  closeButtonText: string;
};

function CTASection({
  primaryButtonText,
  modalTitle,
  modalBody,
  email,
  closeButtonText
}: CTASectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="section-shell text-center">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="rounded-full bg-slate-900 px-8 py-3 text-base font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
      >
        {primaryButtonText}
      </button>

      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        onClose={() => setIsModalOpen(false)}
        footer={
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
          >
            {closeButtonText}
          </button>
        }
      >
        <p>{modalBody}</p>
        <p className="mt-4">
          Contact:{" "}
          <a
            className="font-semibold text-slate-900 underline decoration-accent-500 decoration-2 underline-offset-2"
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </p>
      </Modal>
    </section>
  );
}

export default CTASection;
