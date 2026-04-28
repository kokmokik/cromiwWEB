"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* Waypoints — navy (#1A1F36) → dark forest green (#0A1E12) */
const WP = [
  { p: 0.00, px:  0.2, py:  1.6, rotX: -0.12, rotY: 0.20, bgR: 26, bgG: 31, bgB: 54, kR: 1.00, kG: 0.97, kB: 0.94 },
  { p: 0.17, px: -0.1, py:  0.9, rotX:  0.15, rotY: 0.90, bgR: 22, bgG: 31, bgB: 51, kR: 1.00, kG: 0.97, kB: 0.94 },
  { p: 0.33, px:  0.2, py:  0.2, rotX: -0.22, rotY: 1.80, bgR: 18, bgG: 30, bgB: 46, kR: 1.00, kG: 0.97, kB: 0.94 },
  { p: 0.50, px: -0.2, py: -0.4, rotX:  0.18, rotY: 2.90, bgR: 14, bgG: 30, bgB: 38, kR: 1.00, kG: 0.97, kB: 0.94 },
  { p: 0.67, px:  0.1, py: -0.9, rotX: -0.28, rotY: 4.00, bgR: 12, bgG: 29, bgB: 28, kR: 1.00, kG: 0.97, kB: 0.94 },
  { p: 0.83, px: -0.1, py: -1.3, rotX:  0.10, rotY: 5.20, bgR: 10, bgG: 28, bgB: 21, kR: 1.00, kG: 0.97, kB: 0.94 },
  { p: 1.00, px:  0.0, py: -1.7, rotX: -0.08, rotY: 6.30, bgR: 10, bgG: 30, bgB: 18, kR: 1.00, kG: 0.97, kB: 0.94 },
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function ease(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function sample(prog: number) {
  const n = WP.length - 1;
  const s = clamp(prog, 0, 1) * n;
  const i = Math.min(Math.floor(s), n - 1);
  const lt = ease(s - i);
  const a = WP[i], b = WP[i + 1];
  return {
    px:   lerp(a.px,   b.px,   lt),
    py:   lerp(a.py,   b.py,   lt),
    rotX: lerp(a.rotX, b.rotX, lt),
    rotY: lerp(a.rotY, b.rotY, lt),
    bgR:  Math.round(lerp(a.bgR, b.bgR, lt)),
    bgG:  Math.round(lerp(a.bgG, b.bgG, lt)),
    bgB:  Math.round(lerp(a.bgB, b.bgB, lt)),
    kR:   lerp(a.kR,  b.kR,  lt),
    kG:   lerp(a.kG,  b.kG,  lt),
    kB:   lerp(a.kB,  b.kB,  lt),
  };
}

function parseSTL(buf: ArrayBuffer) {
  const v = new DataView(buf);
  const n = v.getUint32(80, true);
  const pos = new Float32Array(n * 9);
  const nor = new Float32Array(n * 9);
  let off = 84;
  for (let i = 0; i < n; i++) {
    const nx = v.getFloat32(off, true), ny = v.getFloat32(off + 4, true), nz = v.getFloat32(off + 8, true);
    off += 12;
    for (let j = 0; j < 3; j++) {
      const b = i * 9 + j * 3;
      pos[b]     = v.getFloat32(off,     true);
      pos[b + 1] = v.getFloat32(off + 4, true);
      pos[b + 2] = v.getFloat32(off + 8, true);
      nor[b] = nx; nor[b + 1] = ny; nor[b + 2] = nz;
      off += 12;
    }
    off += 2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("normal",   new THREE.BufferAttribute(nor, 3));
  return g;
}

/* Feature panel windows — [progress start, progress end] */
const WINS: [number, number][] = [
  [0.00, 0.18], [0.18, 0.32], [0.32, 0.50],
  [0.50, 0.65], [0.65, 0.82], [0.82, 1.00],
];

export default function ToothJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef  = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);

  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky  = stickyRef.current;
    const canvas  = canvasRef.current;
    if (!section || !sticky || !canvas) return;

    /* ── Three.js ─────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setClearColor(0x1a1f36, 1);

    const scene   = new THREE.Scene();
    const bgColor = new THREE.Color(0x1a1f36);
    scene.background = bgColor;

    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 7);

    /* ── Lights ────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xfff5e8, 0.5));

    const key = new THREE.DirectionalLight(0xfffaf0, 4.0);
    key.position.set(3, 5, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffd8a0, 0.9);
    fill.position.set(-5, 1, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xfff8ee, 0.55);
    rim.position.set(0, -3, 2);
    scene.add(rim);

    const topL = new THREE.DirectionalLight(0xffffff, 0.85);
    topL.position.set(0, 9, 1);
    scene.add(topL);

    const glow = new THREE.PointLight(0xffe0b0, 1.1, 9);
    scene.add(glow);

    /* ── Material ─────────────────────────────────────── */
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xf5f1eb,
      roughness: 0.13,
      metalness: 0,
      clearcoat: 0.75,
      clearcoatRoughness: 0.07,
      ior: 1.5,
    });

    /* ── Placeholder sphere ────────────────────────────── */
    const ph = new THREE.Mesh(new THREE.SphereGeometry(0.85, 48, 48), mat);
    ph.position.set(0.2, 1.6, 0);
    scene.add(ph);
    let toothMesh: THREE.Object3D = ph;
    let baseScale = 1;

    /* ── Load STL ─────────────────────────────────────── */
    fetch("/tooth.stl")
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        const geo = parseSTL(buf);
        geo.computeBoundingBox();
        geo.computeVertexNormals();
        const box = geo.boundingBox!;
        const c = new THREE.Vector3();
        const sz = new THREE.Vector3();
        box.getCenter(c);
        geo.translate(-c.x, -c.y, -c.z);
        box.getSize(sz);
        baseScale = 1.8 / Math.max(sz.x, sz.y, sz.z);
        scene.remove(ph);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.scale.setScalar(baseScale);
        mesh.position.set(cur.px, cur.py, 0);
        scene.add(mesh);
        toothMesh = mesh;
      })
      .catch(() => { /* keep placeholder */ });

    /* ── Animated state ───────────────────────────────── */
    let cur    = { px: 0.2, py: 1.6, rotX: -0.12, rotY: 0.2 };
    let target = { px: 0.2, py: 1.6, rotX: -0.12, rotY: 0.2 };

    /* ── Scroll ───────────────────────────────────────── */
    let prog = 0;

    const onScroll = () => {
      const rect     = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const total    = rect.height - window.innerHeight;
      prog = clamp(scrolled / total, 0, 1);

      if (prog > 0.04) hintRef.current?.classList.add("jy-hint-off");
      else             hintRef.current?.classList.remove("jy-hint-off");

      const s = sample(prog);
      target.px   = s.px;
      target.py   = s.py;
      target.rotX = s.rotX;
      target.rotY = s.rotY;

      key.color.setRGB(s.kR, s.kG, s.kB);

      /* Big stage labels */
      const stage = prog < 0.32 ? 0 : prog < 0.65 ? 1 : 2;
      stageRefs.current.forEach((el, i) => {
        if (!el) return;
        el.classList.toggle("jy-stage-on", i === stage);
      });

      /* Right panels */
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        const [lo, hi] = WINS[i];
        el.classList.toggle("fp-on", prog >= lo && prog < hi);
      });

    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ── Resize ───────────────────────────────────────── */
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    /* ── Render loop ──────────────────────────────────── */
    let tick = 0;
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      tick += 0.007;

      /* Faster lerp — snappier, less watery feel */
      cur.px   += (target.px   - cur.px)   * 0.13;
      cur.py   += (target.py   - cur.py)   * 0.13;
      cur.rotX += (target.rotX - cur.rotX) * 0.13;
      cur.rotY += (target.rotY - cur.rotY) * 0.13;

      toothMesh.position.x = cur.px;
      toothMesh.position.y = cur.py;
      /* Minimal idle micro-oscillation — just enough to feel alive */
      toothMesh.rotation.x = cur.rotX + Math.sin(tick * 0.6) * 0.004;
      toothMesh.rotation.y = cur.rotY + Math.sin(tick * 0.4) * 0.003;
      if (baseScale) toothMesh.scale.setScalar(baseScale);
      glow.position.set(cur.px + 0.4, cur.py + 0.5, 2);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  const panels = [
    { stage: "Zahnarzt",    n: "01", title: "Auftrag\neingegangen.",     body: "Sobald ein Arzt einen Fall einreicht, erfasst Cromiw ihn — Materialien, Spezifikationen, Frist — und leitet ihn sofort ans Labor weiter." },
    { stage: "Zahnarzt",    n: "02", title: "Arzt-\nPortal.",            body: "Überweisende Ärzte haben jederzeit Einblick in jeden Fall. Echtzeit-Updates. Keine Anrufe, kein Raten." },
    { stage: "Dentallabor", n: "03", title: "Intelligente\nFristen.",    body: "Cromiw berechnet realistische Fristen aus Laborkapazität, Komplexität und Technikerlast — und warnt Sie, bevor etwas schiefgeht." },
    { stage: "Dentallabor", n: "04", title: "Fall-\nverfolgung.",        body: "Jede Übergabe dokumentiert. Jeder Schritt protokolliert. Ein vollständiger Prüfpfad vom Eingang bis zum Versand — automatisch." },
    { stage: "Kunde",n: "05", title: "Qualitäts-\nkontrolle.",    body: "Konfigurierbare QA-Prüfpunkte vor dem Versand jedes Falls. Fehler früh erkennen, Befunde dokumentieren, kontinuierlich verbessern." },
    { stage: "Kunde",n: "06", title: "Versand &\nRechnung.",      body: "Fall freigegeben — Rechnung automatisch versendet. Richtige Positionen, richtiger Arzt, richtiger Preis. Null manuelle Schritte." },
  ];

  const stages = [
    { label: "Zahnarzt"     },
    { label: "Dentallabor"  },
    { label: "Kunde" },
  ];

  return (
    <div ref={sectionRef} className="jy-section">
      <div ref={stickyRef} className="jy-sticky">

        {/* Three.js canvas */}
        <canvas ref={canvasRef} className="jy-canvas" />

        {/* Big stage labels */}
        {stages.map((s, i) => (
          <div
            key={i}
            ref={(el) => { stageRefs.current[i] = el; }}
            className={`jy-stage${i === 0 ? " jy-stage-on" : ""}`}
          >
            {s.label}
          </div>
        ))}

        {/* Feature panels — title only, no description */}
        {panels.map((p, i) => (
          <div
            key={i}
            ref={(el) => { panelRefs.current[i] = el; }}
            className="jy-fp jy-fp-r"
          >
            <span className="jy-fp-n">{p.n}</span>
            <div className="jy-fp-rule" />
            <div className="jy-fp-title">
              {p.title.split("\n").map((line, j) => (
                <span key={j}>{line}{j < p.title.split("\n").length - 1 && <br />}</span>
              ))}
            </div>
          </div>
        ))}

        {/* Scroll hint */}
        <div ref={hintRef} className="jy-hint">
          <div className="jy-hint-line" />
          <div className="jy-hint-txt">Scrollen</div>
        </div>

      </div>
    </div>
  );
}
