import { useEffect, useMemo, useState } from "react";
import initIframeResizer from "../utils/iframe-resizer.js";

const PARENT_ORIGIN = "https://www.geniussports.com"; // Must match the parent window origin exactly for secure postMessage checks.

function IframeTestPage() {
  const [debug, setDebug] = useState<boolean>(
    typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("debug") === "1"
  );
  const [showExtraContent, setShowExtraContent] = useState<boolean>(false);

  useEffect(() => {
    const destroy = initIframeResizer({
      parentOrigin: PARENT_ORIGIN,
      debug
    });
    return () => destroy();
  }, [debug]);

  const textBlocks = useMemo(
    () =>
      Array.from({ length: showExtraContent ? 10 : 4 }, (_, index) => ({
        id: index + 1,
        text: `This is sample content block ${index + 1}. Resize the parent container or toggle content to verify postMessage resize events are being sent from the iframe.`
      })),
    [showExtraContent]
  );

  return (
    <main
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "24px"
      }}
    >
      <section
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
          margin: "0 auto",
          maxWidth: "920px",
          padding: "24px"
        }}
      >
        <h1 style={{ marginTop: 0 }}>Iframe Resizer Test Page</h1>
        <p style={{ color: "#334155", lineHeight: 1.6 }}>
          This route initializes the iframe height sender automatically. Use the controls below and watch
          your WordPress parent page console for resize messages.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => setDebug((current) => !current)}
            style={{
              background: debug ? "#0f766e" : "#1d4ed8",
              border: 0,
              borderRadius: "8px",
              color: "#fff",
              cursor: "pointer",
              padding: "10px 14px"
            }}
            type="button"
          >
            Debug logs: {debug ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => setShowExtraContent((current) => !current)}
            style={{
              background: "#7c3aed",
              border: 0,
              borderRadius: "8px",
              color: "#fff",
              cursor: "pointer",
              padding: "10px 14px"
            }}
            type="button"
          >
            {showExtraContent ? "Show less content" : "Show more content"}
          </button>
        </div>

        {textBlocks.map(({ id, text }) => (
          <article
            key={id}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              marginBottom: "12px",
              padding: "14px 16px"
            }}
          >
            <h2 style={{ fontSize: "1.1rem", margin: "0 0 8px" }}>Section {id}</h2>
            <p style={{ color: "#475569", lineHeight: 1.65, margin: 0 }}>{text}</p>
          </article>
        ))}

        <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
          <img
            alt="Large sample visual one"
            src="/fanhub-correct.png"
            style={{ borderRadius: "10px", display: "block", width: "100%" }}
          />
          <img
            alt="Large sample visual two"
            src="/fanhub-correct.png"
            style={{ borderRadius: "10px", display: "block", width: "100%" }}
          />
          <img
            alt="Large sample visual three"
            src="/fanhub-correct.png"
            style={{ borderRadius: "10px", display: "block", width: "100%" }}
          />
        </div>
      </section>
    </main>
  );
}

export default IframeTestPage;
