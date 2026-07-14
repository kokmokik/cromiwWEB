# Graph Report - C:\Users\Sauzhur\Documents\CROMIW PROJECT\cromiwOS frontend  (2026-07-14)

## Corpus Check
- 10 files · ~234,450 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 36 nodes · 27 edges · 14 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]

## God Nodes (most connected - your core abstractions)
1. `sample()` - 4 edges
2. `cromiwOS Frontend Project` - 4 edges
3. `Next.js Framework` - 3 edges
4. `onMove()` - 2 edges
5. `tick()` - 2 edges
6. `lerp()` - 2 edges
7. `ease()` - 2 edges
8. `clamp()` - 2 edges
9. `Vercel Deployment Platform` - 2 edges
10. `Geist Font Family` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Framework` --conceptually_related_to--> `Next.js Wordmark Logo SVG`  [INFERRED]
  README.md → public/next.svg
- `Vercel Deployment Platform` --conceptually_related_to--> `Vercel Triangle Logo SVG`  [INFERRED]
  README.md → public/vercel.svg
- `Next.js Agent Rules` --conceptually_related_to--> `Next.js Framework`  [INFERRED]
  AGENTS.md → README.md

## Hyperedges (group relationships)
- **cromiwOS Frontend Next.js Stack** — readme_cromiw_frontend, readme_nextjs_framework, readme_vercel_platform, readme_geist_font, readme_next_font [EXTRACTED 0.95]
- **Public SVG UI Assets** — svg_file_icon, svg_globe_icon, svg_next_logo, svg_vercel_logo, svg_window_icon [INFERRED 0.85]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.29
Nodes (2): onMove(), tick()

### Community 1 - "Community 1"
Cohesion: 0.29
Nodes (8): Next.js Agent Rules, cromiwOS Frontend Project, Geist Font Family, next/font Font Optimization, Next.js Framework, Vercel Deployment Platform, Next.js Wordmark Logo SVG, Vercel Triangle Logo SVG

### Community 2 - "Community 2"
Cohesion: 0.43
Nodes (4): clamp(), ease(), lerp(), sample()

### Community 3 - "Community 3"
Cohesion: 1.0
Nodes (0): 

### Community 4 - "Community 4"
Cohesion: 1.0
Nodes (0): 

### Community 5 - "Community 5"
Cohesion: 1.0
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (1): Graphify Knowledge Graph Config

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (1): File/Document SVG Icon

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (1): Globe/World SVG Icon

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (1): Browser Window SVG Icon

## Knowledge Gaps
- **7 isolated node(s):** `Next.js Agent Rules`, `Graphify Knowledge Graph Config`, `Next.js Wordmark Logo SVG`, `Vercel Triangle Logo SVG`, `File/Document SVG Icon` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 3`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (2 nodes): `ToothScene.tsx`, `ToothScene()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (1 nodes): `LogoScene.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `Graphify Knowledge Graph Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `File/Document SVG Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `Globe/World SVG Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `Browser Window SVG Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `Next.js Framework` (e.g. with `Next.js Agent Rules` and `Next.js Wordmark Logo SVG`) actually correct?**
  _`Next.js Framework` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Next.js Agent Rules`, `Graphify Knowledge Graph Config`, `Next.js Wordmark Logo SVG` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._