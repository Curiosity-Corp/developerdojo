# Image credits and provenance

Most raster and vector assets here were made for Developer Dojo. The credited exception below is
used under its author's stated terms. The kata artwork listed below was created with OpenAI image generation.

## How the art was made

The GPU Router (SenseNova U1, `hardmagic-image`) was not usable from the build host: the
in-cluster address does not resolve there (curl exit 6), and the public endpoint answered
`401 Unauthorized, Bearer token is required` because no router key is available to this
session. The original site art is stylised vector illustration, written as SVG by the scripts in
`tools/imagery/` and rendered to raster with headless Chrome, then compressed with ImageMagick
(AVIF q60, WebP q80-85, JPG q78 or 8-bit PNG fallback). To redo or tweak: run the scripts, then
re-run the conversions. When the GPU Router is reachable, painterly versions can replace the
raster files under the same names without touching any code.

| Asset | Files | Made by |
|---|---|---|
| 3D Model Anything video thumbnail | `wes-bos-3d-video-thumb.png` | Wes Bos; displayed with his project and linked to his video under the [project's asset terms](https://github.com/wesbos/3d-model-anything/blob/31b2dc9da3fb541e501f2f0936e55b32afb70ee8/ASSETS-LICENSE.md). Source: `docs/images/thumb-1.png`, unchanged. |
| Kata discovery illustration | `kata-spark.webp` | AI-generated conceptual illustration created for the site with OpenAI image generation. It illustrates possibilities; it is not a screenshot or evidence of a finished kata. |
| Dojo hero, bracket scroll (default `hero-dojo`) | `hero-dojo.{avif,webp,jpg}` 2400x900, `hero-dojo-mobile.*` 1000x900 | Original SVG scene (`tools/imagery/hero.py`): desk, laptop with the code glyph, tea with steam, books, plant, shoji window with pine and misty mountains, hanging scroll with brackets. |
| Dojo hero, torii scroll (Sensei page) | `hero-dojo-torii.*` 2400x900, `hero-dojo-torii-mobile.*` 1000x900 | Same scene, scroll shows a torii gate. |
| Ink mountains | `mountains-band.*` (for cream) and `mountains-band-dark.*` (for dark theme), 2400x220, transparent | SVG layered ridges with displaced edges and mist (`tools/imagery/art.py`). |
| Pagoda on misty cliff | `pagoda-cliff.*` 705x540, transparent | Original SVG (`art.py`). |
| Bamboo cluster | `bamboo.*` 520x900, transparent | Original SVG (`art.py`). |
| Gold ensō | `enso.svg`, `enso.*` 800x800, transparent | Original SVG with a rough-brush filter (`tools/imagery/small.py`). |
| Paper texture | `paper-tile*.{avif,webp,jpg}` 512x512 tileable, light and dark | SVG fractal noise with stitched tiles (`art.py`). |
| Rank icons | `rank-developer.svg` (sprout, olive), `rank-master-developer.svg` (mountain, gold), `rank-sensei.svg` (torii, rust) | Original SVG badges (`small.py`). |
| Wordmark | `logo-light.svg` (for cream), `logo-dark.svg` (for ink-green), `logo-mark.svg` | Gold bracket shapes drawn for this site; letters are outlined from Lato Black (SIL Open Font License) so no font is needed at runtime. The older ninja-and-katana logo in the ignite-curiosity repo does not match the approved plain-bracket style, so it was not reused. |
| Reveltek logo | `reveltek-logo.svg` (colour), `reveltek-logo-white.svg` (for dark backgrounds) | Official files, unmodified, from `public/assets/img/svg/reveltek.svg` and `revelwhite.svg` in WorldEnterpriseGroup/reveltek. These are the logo on the live Reveltek website; the red "R" mark in the design mockups is concept art and is not an official file. |

Note for wiring: `findImage()` picks AVIF first, so use a `<picture>` with the WebP and JPG/PNG
files when you need a fallback for older browsers.
