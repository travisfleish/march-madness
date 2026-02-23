# Iframe Height Sender

## Set the parent origin

Set your exact WordPress origin in `src/utils/iframe-resizer.js`:

- `PARENT_ORIGIN` constant (default currently `https://geniussports.com`)
- and/or pass `parentOrigin` when calling `initIframeResizer(...)`

Use a full origin string, for example:

- `https://example.com`
- `https://staging.example.com`

Do not use `*` in production.

## Local testing steps

1. Start the app: `npm run dev`
2. Open `http://localhost:5173/iframe-test?debug=1`
3. Embed that URL in your parent (WordPress test page or local host page) with an `<iframe>`
4. Open browser devtools:
   - iframe page console: confirms `[iframe-resizer]` debug logs
   - parent page console: confirms `resize` messages are received
5. Click **Show more content** / **Show less content** on the test page and confirm iframe height updates.

## Parent-side WordPress listener (copy/paste)

```html
<script>
  (function () {
    const IFRAME_ORIGIN = "http://localhost:5173"; // TODO: set iframe app origin
    const iframe = document.querySelector("#march-madness-iframe"); // TODO: update selector

    function setIframeHeight(height) {
      if (!iframe || !Number.isFinite(height)) return;
      iframe.style.height = `${Math.max(height, 200)}px`;
    }

    window.addEventListener("message", function (event) {
      if (event.origin !== IFRAME_ORIGIN) return;
      if (!event.data || event.data.type !== "resize") return;
      setIframeHeight(Number(event.data.height));
    });

    // Ask iframe for its current height on load.
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: "request-height" }, IFRAME_ORIGIN);
    }
  })();
</script>
```
