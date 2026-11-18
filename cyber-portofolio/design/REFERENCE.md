# Référence visuelle utilisée

Version corrigée à partir de **Photo 1.jpg**, fournie par l’utilisateur le 18 novembre 2026.

Le décor reprend le bureau immersif, le portable, la tasse MA, le carnet au premier plan, les plantes, l’étagère éclairée en orange, la fenêtre nocturne et le baobab. L’interface est recréée en HTML/CSS : logo, navigation, badge, nom blanc/cyan, boutons lumineux. Le terminal est un véritable composant React projeté dans les quatre coins de l’écran du portable. Le globe est une scène Three.js avec l’Afrique dessinée en points orange, une grille bleue et des orbites animées. Un mouvement très léger du décor suit le pointeur sur ordinateur.

La pièce utilise une image de fond ; ses meubles ne sont pas des modèles 3D manipulables. Le globe, le terminal et les interactions sont indépendants de cette image. Cette composition conserve la richesse de la référence tout en restant légère sur les appareils modestes. Le mode léger garde le même décor et remplace le globe WebGL par un globe SVG animé. Une commande séparée permet de suspendre toutes les animations. Une vapeur discrète monte de la tasse et la lumière de l’étagère varie doucement lorsque les animations sont actives.

## Asset final

- Fichier utilisé par le site : `public/bureau-nocturne.webp` (1672 × 941, environ 124 Ko).
- Création : outil intégré ImageGen, mode édition à partir de la référence.
- Conversion WebP pour réduire le poids, sans modification de la composition.
- Aucun texte de navigation, titre ou bouton n’est incrusté dans le décor.

## Prompt exact de génération

```text
Edit the supplied reference as a production website BACKGROUND PLATE, exactly same wide 1280:721 composition and perspective. Preserve the room and camera framing precisely: elegant photorealistic night-time cybersecurity desk, navy blue wall, walnut desktop across bottom, large open laptop at lower center-right, MA monogram mug and amber coaster at center-left of laptop, notebook and pen foreground left, leather chair foreground right, books and trailing green plants on overhead shelf with amber strip light, window far right with moon and African baobab silhouette at twilight, stacked books on right. Keep the cyan edge lighting and warm amber light exactly. REMOVE ALL website UI from the image: entire top navigation/logo bar/name/buttons/text; remove ALL large text, badge, descriptions, headings, and buttons in left half. Replace left half UI with the same clean dark navy wall and subtle atmospheric lighting, leaving it empty and legible for actual HTML text. Keep mug MA logo. On the laptop KEEP the exact screen frame, keyboard and perspective but replace ALL terminal screen contents with a completely empty near-black blue display (#020b13), no text, no dragon, no marks; actual live terminal will be overlaid. REMOVE the entire floating globe sphere and its cyan orbital rings above the physical globe pedestal on right, leave clean matching dark room behind and KEEP the globe pedestal and warm light on its stand and desk. An actual interactive sphere will be placed there in code. Keep physical book spine names Réseaux / Sécurité SI / Pentest if legible. Absolutely no website text or UI anywhere. Preserve positions, proportions, realistic materials and reference visual richness. Output 16:9 landscape.
```
