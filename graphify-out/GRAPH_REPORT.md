# Graph Report - C:\Users\Sauzhur\Documents\CROMIW PROJECT\cromiwOS frontend  (2026-04-19)

## Corpus Check
- Corpus is ~1,075 words - fits in a single context window. You may not need a graph.

## Summary
- 20 nodes · 10 edges · 13 communities detected
- Extraction: 70% EXTRACTED · 30% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Entry & Fonts|App Entry & Fonts]]
- [[_COMMUNITY_Next.js Core|Next.js Core]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Vercel Platform|Vercel Platform]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_TypeScript Env|TypeScript Env]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_Graphify Setup|Graphify Setup]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_Globe Icon Asset|Globe Icon Asset]]
- [[_COMMUNITY_Window Icon Asset|Window Icon Asset]]

## God Nodes (most connected - your core abstractions)
1. `cromiwOS Frontend Project` - 5 edges
2. `Next.js Framework` - 3 edges
3. `Vercel Deployment Platform` - 2 edges
4. `Geist Font Family` - 2 edges
5. `next/font Font Optimization` - 2 edges
6. `Next.js Agent Rules` - 1 edges
7. `app/page.tsx Entry Point` - 1 edges
8. `Next.js Wordmark Logo SVG` - 1 edges
9. `Vercel Triangle Logo SVG` - 1 edges
10. `Graphify Knowledge Graph Config` - 0 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Wordmark Logo SVG` --conceptually_related_to--> `Next.js Framework`  [INFERRED]
  public/next.svg → README.md
- `Vercel Triangle Logo SVG` --conceptually_related_to--> `Vercel Deployment Platform`  [INFERRED]
  public/vercel.svg → README.md
- `Next.js Agent Rules` --conceptually_related_to--> `Next.js Framework`  [INFERRED]
  AGENTS.md → README.md

## Hyperedges (group relationships)
- **cromiwOS Frontend Next.js Stack** — readme_cromiw_frontend, readme_nextjs_framework, readme_vercel_platform, readme_geist_font, readme_next_font [EXTRACTED 0.95]
- **Public SVG UI Assets** — svg_file_icon, svg_globe_icon, svg_next_logo, svg_vercel_logo, svg_window_icon [INFERRED 0.85]

## Communities

### Community 0 - "App Entry & Fonts"
Cohesion: 0.67
Nodes (4): app/page.tsx Entry Point, cromiwOS Frontend Project, Geist Font Family, next/font Font Optimization

### Community 1 - "Next.js Core"
Cohesion: 0.67
Nodes (3): Next.js Agent Rules, Next.js Framework, Next.js Wordmark Logo SVG

### Community 2 - "Root Layout"
Cohesion: 1.0
Nodes (0): 

### Community 3 - "Vercel Platform"
Cohesion: 1.0
Nodes (2): Vercel Deployment Platform, Vercel Triangle Logo SVG

### Community 4 - "ESLint Config"
Cohesion: 1.0
Nodes (0): 

### Community 5 - "TypeScript Env"
Cohesion: 1.0
Nodes (0): 

### Community 6 - "Next.js Config"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "PostCSS Config"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Home Page"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Graphify Setup"
Cohesion: 1.0
Nodes (1): Graphify Knowledge Graph Config

### Community 10 - "File Icon Asset"
Cohesion: 1.0
Nodes (1): File/Document SVG Icon

### Community 11 - "Globe Icon Asset"
Cohesion: 1.0
Nodes (1): Globe/World SVG Icon

### Community 12 - "Window Icon Asset"
Cohesion: 1.0
Nodes (1): Browser Window SVG Icon

## Knowledge Gaps
- **8 isolated node(s):** `Next.js Agent Rules`, `Graphify Knowledge Graph Config`, `app/page.tsx Entry Point`, `Next.js Wordmark Logo SVG`, `Vercel Triangle Logo SVG` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Root Layout`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vercel Platform`** (2 nodes): `Vercel Deployment Platform`, `Vercel Triangle Logo SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TypeScript Env`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Config`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Home Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Graphify Setup`** (1 nodes): `Graphify Knowledge Graph Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File Icon Asset`** (1 nodes): `File/Document SVG Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Globe Icon Asset`** (1 nodes): `Globe/World SVG Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Window Icon Asset`** (1 nodes): `Browser Window SVG Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cromiwOS Frontend Project` connect `App Entry & Fonts` to `Next.js Core`, `Vercel Platform`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `Next.js Framework` connect `Next.js Core` to `App Entry & Fonts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `Vercel Deployment Platform` connect `Vercel Platform` to `App Entry & Fonts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Next.js Framework` (e.g. with `Next.js Wordmark Logo SVG` and `Next.js Agent Rules`) actually correct?**
  _`Next.js Framework` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Next.js Agent Rules`, `Graphify Knowledge Graph Config`, `app/page.tsx Entry Point` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._