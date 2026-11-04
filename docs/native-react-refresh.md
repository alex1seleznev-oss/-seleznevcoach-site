# Native React homepage and motion

The live Russian homepage now renders as a Next.js page instead of rehydrating an HTML capture. The captured route handler moves from optional catch-all to non-optional catch-all; public URLs do not change. All secondary pages retain the captured rendering for this change.

The source component tree was recovered from the existing project checkout, then updated to match the current live facts, bot destination and generated assets. No independent Sites project is published.

- One GSAP React owner for each animated layer, scoped cleanup and reduced-motion fallbacks.
- Name introduction, separate image entrance and scroll depth, photograph parallax, staggered service cards and three scroll-driven photographic scenes.
- Native dialog navigation closes before hash navigation. Shared site.js explicitly handles same-document anchors and prevents captured router interception on secondary pages.
- Preserves the main section IDs and all secondary URLs; PB is sourced from config/athlete-facts.json (15:24).
- Previously requested 4,990 RUB tennis/football and child conditioning formats are present in recovered service content. No online payment flow or legal status claim is added.
- Existing server API authentication and analytics consent are retained.
- A noindex ?preview=mobile view renders the same homepage in a 390px iframe for responsive visual verification; it is not linked in site navigation.

Free LLM API was not found in the three accessible repositories, in the site dependency manifest or in local source matches. No unrelated component was deleted.

## Verification

Production build and TypeScript passed. Vercel clean install uses a registry-only lockfile (no local links). Live mobile rendering at 375px content width was checked: menu open/close, method/services/home navigation, stage selection, selected-service preservation and bot deep link. No missing same-document anchor targets or horizontal overflow were found. A scroll from 8018 to 8679 changed the third photographic scene from translateY(102%) to translateY(0), confirming actual scroll-driven transitions. The mobile CTA bottom is 820px inside an 844px viewport. Child/sport service detail pages were opened successfully with correct headings and bot destinations.
