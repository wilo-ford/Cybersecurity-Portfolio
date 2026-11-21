# Référence finale V2 — 21 novembre 2026

`reference-maquette.jpg` est l’image validée fournie par Mohamed : arches monumentales bleu nuit, crépuscule rose et bleu, éclairage chaud, sol réfléchissant, cristal et cartes vitrées. Elle sert uniquement de référence de conception ; elle n’est pas chargée par le site.

## Décor de production

- `public/architecture-crepuscule.webp` : 1672 × 941, 107 082 octets.
- Outil : Image Generation intégré, mode édition de la référence fournie.
- Sortie originale : `exec-ea01fc37-932c-46b7-abc7-5828d5021aa1.png` ; conversion WebP qualité 88, sans retouche de composition.
- Tous les textes, liens, cartes, pictogrammes et éléments du cristal sont des composants React, CSS, SVG et Three.js indépendants du décor.
- L’architecture utilise un fond photographique avec parallaxe limitée. Ses arches ne sont pas des modèles 3D. Le sol conserve les reflets architecturaux de cette image, complétés par une lueur locale sous le socle.
- Police locale : Cormorant Garamond italique, Google Fonts, licence SIL Open Font License dans `public/fonts/OFL.txt`. Sous-ensemble latin officiel WOFF2, 39 260 octets, récupéré depuis fonts.gstatic.com (Cormorant Garamond v21). Aucun appel à un CDN de polices à l’exécution.

## Prompt exact de l’asset utilisé

```text
Create a CLEAN BACKGROUND ASSET by carefully editing this supplied approved website mockup. Keep the EXACT architectural environment composition, all stone arches in the SAME positions and sizes, warm narrow column lights, blue dusk and pink horizon with distant mountains, glossy dark blue tiled reflective floor, and blurred dark palms framing both edges. Preserve the original overall 16:9 composition: main left column at x4%, central column at x44%, right column at x80%, floor starts at y44%. Keep the left central wall region x10–41%, y5–43% completely dark navy and empty so live HTML text will later go there. REMOVE EVERY website interface element: ALL text, names, MA logos, ALL navigation, ALL buttons, ALL social media icons, ALL cards, ALL lower about and skills panels and skill icons. ALSO REMOVE the central crystal, its orbital rings, its particles and pedestal completely; these will be replaced by real interactive Three.js objects. Seamlessly reconstruct the scene behind removed objects. Where the lower panels were, reconstruct the reflective dark floor. Keep the empty center-right crystal region dark blue with subtle atmospheric blue lighting, NOT a bright sunset. Maintain the reference's exact restrained midnight luxury palette, warm thin highlights and fine stone detail. This must be an architectural background ONLY, ZERO letters, ZERO logo, ZERO UI, ZERO crystal, ZERO pedestal, no people. We will overlay real responsive React text, cards and interactive 3D, so never bake any of that into this image.
```

## Adaptations délibérées

Le cristal est une géométrie interactive en temps réel, avec un rendu simplifié par rapport à l’illustration. Les pictogrammes sont des tracés vectoriels cohérents, sans logos d’outils non documentés. Git remplace Burp Suite dans les dix tuiles : le dépôt documente Git, tandis que l’utilisation personnelle de Burp Suite n’est pas confirmée. LinkedIn n’apparaît pas, faute d’URL réelle. Sur mobile, la composition est réorganisée verticalement et le cristal CSS conserve son ouverture interactive.
