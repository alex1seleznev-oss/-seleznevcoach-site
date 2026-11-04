# Premium sports refresh, 2026-11-04

Direction: personal running coach, premium sports editorial. Light silver and graphite, established red accent, locally hosted Onest. Design variance 7, motion 6, density 3. No new runtime dependencies.

## Generated assets

Native ChatGPT image generation/editing was used. The tool does not expose a model selector; no exact model version is asserted. Existing source portraits were supplied as edit targets with explicit face/identity preservation constraints. The changes requested were clothing and environment. These are editorial derivatives, not documentary evidence of an actual training venue. Real training, racing and education archive images remain elsewhere on the page.

- public/images/generated/premium-stadium-hero.webp, 1672 × 941, 138894 bytes. Source portrait: public/media/athlete-editorial.webp.
- public/images/generated/premium-athlete-portrait.webp, 1122 × 1402, 151970 bytes. Source portrait: public/media/athlete.webp.

## Implementation

- Full-bleed campaign hero, typography, photographic coach section, open two-column service layout, calmer tabs, journal and contact sections.
- GSAP introduces the name and opens photographs as they enter view. Reduced-motion preference disables the enhancements. No scroll hijacking.
- Replaces the previous duplicated three-step panorama enhancement; the original method tabs and real running story remain.
- All URLs, navigation anchors, prices, legal copy, consent controls and server API authorization remain intact.
- PB remains 15:24; website Telegram links continue to point to seleznevcoach_bot.
- Server HTML and captured client strings receive the same portrait substitutions and cache version.
- Preparation is now idempotent: prebuild only removes generated legacy assets when their captured source exists.

## Prompts

### hero

Use case: identity-preserve, premium sports editorial campaign. Input image is the EDIT TARGET: Alexander, the same real man. Create a horizontal 16:9 luxury running-coach website hero photograph. Keep the person's EXACT original face, identity, facial features, age, hair, expression, skin texture and natural skin tone unchanged. Do not beautify, recreate, reinterpret or reshape his face. Retain his relaxed upright frontal pose and body proportions. Change only clothing and environment: remove race bib and change outfit into a beautifully made unbranded charcoal-black technical sleeveless running top. Frame him waist-up on the RIGHT THIRD, with his head fully inside the frame and substantial negative space on the LEFT HALF for live website text. Setting: architecturally refined modern athletics stadium, pale silver concrete terraces, a single deep red track plane in foreground, no other people. Bright soft directional daylight like a premium large-format sports campaign, subtle realistic hard-to-soft shadows, finely detailed tactile textiles and concrete, immaculate photographic color grading, very restrained silver/graphite/deep red palette. Calm confidence, high-performance sport, sophisticated and expensive art direction. Not a stock gym advertisement. Keep left area light silver-gray, quiet and visually uncluttered. The same person must be clearly recognizable. No writing, no typography, no logos, no visible brands, no watermark, no excessive haze, no glowing effects, no dramatic dark poster lighting.

### portrait

Use case: identity-preserve. Input image is the EDIT TARGET, a real athlete. Create a premium editorial sports portrait for the personal running coach Alexander Seleznev, portrait 4:5. Keep the man EXACTLY as photographed: same face, same distinctive nose, eyes, brows, lips, skin tone, hair under cap, age, expression, head angle, body and pose; do not reconstruct, beautify, smooth, replace or reinterpret his face. Change ONLY the environment and the shirt pattern. Retain his black running vest, make it plain unbranded charcoal technical fabric; retain his red running shorts, backwards cap and black sports watch. Remove the background people, the large graffiti banner and other distractions. Replace background with a refined athletics stadium: pale silver concrete architectural curves, a deep brick red running track, soft softly blurred background. Daylight, high-end editorial location photography, realistic optical depth, crisp natural skin and fabric texture, restrained neutral silver and deep red color grading. A candid moment of an authentic athlete after a training effort, not a polished fashion model. The exact original face, expression and pose are mandatory invariants. No logos, no text, no watermarks. Frame from upper thighs to above head, relaxed arms visible. Leave breathing room around the head, do not crop it.
