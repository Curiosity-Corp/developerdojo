import html from './pocket-garden.html?raw';

// Pocket Garden, the working example prototype. One source serves two ways:
// - /examples/pocket-garden.html (src/pages/examples/pocket-garden.html.ts) for "open full screen" links;
// - pocketGardenFrameDoc, the srcdoc for every embedded "Try the example" frame.
//
// Embedded frames use srcdoc, not src (Curiosity-Corp/developerdojo#128). Cloudflare Web Analytics
// injects its RUM beacon into every HTML response the edge serves. Inside a sandbox="allow-scripts"
// frame the document's origin is opaque ('null'), so the beacon's POST to /cdn-cgi/rum fails CORS
// and logs console errors on every page that embeds the example. A srcdoc document is never fetched,
// so nothing is injected. The CSP below (the same policy KataPreview uses) keeps the frame offline:
// inline script and style only, no requests.
export const pocketGardenHtml: string = html;

const framePolicy =
  '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; img-src data:; font-src data:; connect-src \'none\'; frame-src \'none\'; form-action \'none\'; base-uri \'none\'">';

if (!html.includes('<head>')) {
  throw new Error('src/data/pocket-garden.html must contain a <head> element: the frame policy is inserted into it.');
}

export const pocketGardenFrameDoc: string = html.replace('<head>', `<head>\n  ${framePolicy}`);
