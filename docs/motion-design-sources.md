# Motion refresh, 4 November 2026

Personal coaching site, light editorial sports direction. Variance 6 / motion 4 / density 3.

## Sources and installed assets

- Official GSAP skills: https://github.com/greensock/gsap-skills, inspected commit aed9cfd3277740755f6bfc1155c7aa645403b760. Existing GSAP ScrollTrigger skill applied. No remote installation scripts executed.
- Design skill: https://github.com/Leonxlnx/taste-skill, already installed in the working environment. Applied its redesign-preservation, local-font and reduced-motion guidance.
- GSAP runtime + ScrollTrigger: https://github.com/greensock/GSAP, inspected commit 5e6c35ff8eedea12d4f229129def635277d8b0f2, version 3.15.1. Vendored unchanged under public/vendor/gsap. Original license headers retained. GSAP standard license: https://gsap.com/standard-license .
- Onest variable font with Cyrillic: https://github.com/google/fonts/tree/main/ofl/onest, inspected commit 66285aa2951a3634d74aa447951a8ca7362d3c7d. Original TTF served locally; SIL OFL license retained at public/fonts/Onest-OFL.txt. No external font requests.

## Product changes

- Owner-confirmed 5000 m PB: 15:24. Updated HTML snapshots, React payloads and captured browser modules, RU and EN.
- Light surfaces, Onest typography, rebalanced hero with the original owner photograph.
- Progressive motion: intro hierarchy, card/photograph entry, reading position. No scroll hijacking or required animation for navigation. Reduced-motion preference handled by GSAP matchMedia and CSS.
- Original face and identity assets are untouched. Existing routes, analytics consent and forms preserved.

## Image generation limitation

GPT Image 2.5 was found in the Higgsfield catalog. The background generation request was rejected with “Requires basic plan or higher.” No image job was created. No substitute model was silently used; original owner photographs remain in use.

## Deployment

Target: existing Vercel project seleznevcoach-site, domain seleznevcoach.ru. This refresh is not a Sites/Timeweb migration.
