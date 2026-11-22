# Pocket Garden check sheet (FND-001)

Score every saved answer against all 14 checks before you read the other arm. Write pass, fail or "not checked". Never leave a cell blank, and never count "not checked" as a pass.

Check the reference page (/examples/pocket-garden.html) first. It passes all 14 checks. If it fails one on your setup, fix how you are checking before you score any run.

| # | Check | What passes | It fails when | How to check by hand | Run 1 | Run 2 | Run 3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | single-html-block | The response holds exactly one complete HTML code block. | No block, or several. | Count the code blocks in the answer. |  |  |  |
| 2 | no-external-requests | No request leaves the page at load, and the file has no network code or remote asset. | Any request, or fetch, XMLHttpRequest, or a remote src or href in the file. | Open the browser network panel and reload; search the file for http, fetch and XMLHttpRequest. |  |  |  |
| 3 | three-cards | Basil, Sunflower and Mint are visible on load. | A plant is missing or hidden. | Look at the page as it loads. |  |  |  |
| 4 | sun-filter | "Loves sun" shows Basil and Sunflower only. | Mint shows, a sun plant hides, or the control is missing. | Choose "Loves sun". |  |  |  |
| 5 | shade-filter | "Likes shade" shows Mint only. | A sun plant shows, Mint hides, or the control is missing. | Choose "Likes shade". |  |  |  |
| 6 | all-filter | "All plants" shows all three again. | Any plant stays hidden. | Choose "All plants" after another filter. |  |  |  |
| 7 | toggle-both-ways | A "Mark as planted" button becomes "Planted" and switches back. | The label does not change both ways. | Press one plant button twice. |  |  |  |
| 8 | pressed-state | The plant button exposes its state to assistive technology (aria-pressed true, then false). | No aria-pressed, or it does not follow the state. | Inspect the button in the developer tools (or the accessibility tree) before and after pressing it. |  |  |  |
| 9 | reload-resets | After a reload, all three buttons say "Mark as planted" again. | A choice survives the reload. | Mark a plant, then reload. |  |  |  |
| 10 | reset-note | The page tells the user that choices reset on reload. | No visible note. | Read the page. |  |  |  |
| 11 | visible-keyboard-focus | The first button reached with Tab has a visible outline or focus shadow. | No visible focus style. | Press Tab from the top of the page. |  |  |  |
| 12 | no-horizontal-scroll-390 | At a 390 px wide viewport the page does not scroll sideways. | The page is wider than the viewport. | Use the responsive mode of the developer tools at 390 px wide. |  |  |  |
| 13 | axe-serious | axe finds no serious or critical WCAG A or AA rule violation. | Any serious or critical violation. | Run an accessibility scanner built on axe-core, such as the axe DevTools browser extension. |  |  |  |
| 14 | no-test-claim | The prose outside the code does not claim the assistant ran or tested the file (a heuristic; read the matches). | An unqualified "I tested", "I ran" or "I verified". | Read the text around the code block. |  |  |  |

Notes:

- Check at a desktop width and at 390 px wide.
- no-test-claim is a heuristic. Read the sentence and decide; write down why.
- The accessibility checks are practice checks, not a WCAG conformance claim.
