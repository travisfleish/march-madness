// src/utils/iframe-resizer.js
// Lightweight iframe -> parent resizer.
// Usage: const stop = initIframeResizer({ parentOrigin: "https://geniussports.com", debug: true });
// stop() // cleanup observers/event listeners

const PARENT_ORIGIN = "https://geniussports.com"; // TODO: replace with your exact WordPress origin.

export default function initIframeResizer({ parentOrigin = PARENT_ORIGIN, debug = false } = {}) {
  if (!parentOrigin) {
    throw new Error("initIframeResizer requires parentOrigin (exact origin string).");
  }

  // TEMP_DEBUG_REMOVE: temporary logs for integration testing.
  const log = (...args) => {
    if (debug) console.log("[iframe-resizer]", ...args);
  };

  function measureHeight() {
    try {
      const body = document.body;
      const html = document.documentElement;

      if (!body || !html) return 0;

      const candidates = [
        html.scrollHeight,
        body.scrollHeight,
        html.offsetHeight,
        body.offsetHeight,
        html.clientHeight,
        body.clientHeight,
        Math.ceil(body.getBoundingClientRect().height)
      ].filter((value) => Number.isFinite(value) && value > 0);

      const measured = Math.max(...candidates, 0);
      return Math.round(measured);
    } catch (err) {
      log("measureHeight error", err);
      return document.documentElement?.scrollHeight || 0;
    }
  }

  let destroyed = false;
  let lastHeight = -1;
  let rafScheduled = false;
  let debounceTimer = null;

  function postResize(height) {
    try {
      window.parent.postMessage({ type: "resize", height }, parentOrigin);
      log("posted height", height); // TEMP_DEBUG_REMOVE
    } catch (err) {
      log("postMessage error", err);
    }
  }

  function sendHeight(force = false) {
    if (destroyed) return 0;

    const height = measureHeight();
    if (!force && height === lastHeight) return height;

    lastHeight = height;
    postResize(height);
    return height;
  }

  // Throttle sends to one per animation frame.
  function sendHeightRaf() {
    if (destroyed || rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      sendHeight();
    });
  }

  // Debounce noisy event bursts.
  function sendHeightDebounced(delay = 120) {
    if (destroyed) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      sendHeightRaf();
    }, delay);
  }

  function onMessage(event) {
    try {
      if (event.origin !== parentOrigin) return;
      if (!event.data || event.data.type !== "request-height") return;

      // Parent explicitly asked for current height.
      sendHeight(true);
      log("received request-height"); // TEMP_DEBUG_REMOVE
    } catch (err) {
      log("onMessage error", err);
    }
  }

  const ro = window.ResizeObserver ? new ResizeObserver(() => sendHeightDebounced(80)) : null;
  if (ro && document.body) ro.observe(document.body);

  const imgListeners = [];
  const images = Array.from(document.images || []);
  images.forEach((image) => {
    if (image.complete) return;
    const onImageLoad = () => sendHeightDebounced(40);
    image.addEventListener("load", onImageLoad, { once: true });
    imgListeners.push({ image, onImageLoad });
  });

  const eventOptions = { passive: true };
  window.addEventListener("resize", sendHeightDebounced, eventOptions);
  window.addEventListener("orientationchange", sendHeightDebounced, eventOptions);
  window.addEventListener("load", sendHeightDebounced, eventOptions);
  window.addEventListener("message", onMessage, false);
  document.addEventListener("DOMContentLoaded", sendHeightDebounced, eventOptions);
  document.addEventListener("transitionend", sendHeightDebounced, eventOptions);
  document.addEventListener("animationend", sendHeightDebounced, eventOptions);

  const t1 = setTimeout(() => sendHeight(true), 200);
  const t2 = setTimeout(() => sendHeight(true), 800);
  const t3 = setTimeout(() => sendHeight(true), 1600);

  sendHeight(true);

  return function destroy() {
    if (destroyed) return;
    destroyed = true;

    try {
      if (ro) ro.disconnect();
      imgListeners.forEach(({ image, onImageLoad }) => image.removeEventListener("load", onImageLoad));

      window.removeEventListener("resize", sendHeightDebounced, eventOptions);
      window.removeEventListener("orientationchange", sendHeightDebounced, eventOptions);
      window.removeEventListener("load", sendHeightDebounced, eventOptions);
      window.removeEventListener("message", onMessage, false);
      document.removeEventListener("DOMContentLoaded", sendHeightDebounced, eventOptions);
      document.removeEventListener("transitionend", sendHeightDebounced, eventOptions);
      document.removeEventListener("animationend", sendHeightDebounced, eventOptions);

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(debounceTimer);
      log("destroyed iframe resizer"); // TEMP_DEBUG_REMOVE
    } catch (err) {
      log("destroy error", err);
    }
  };
}
