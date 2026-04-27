"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  scrollProgress: number;
  phase: number;
}

export default function ToothScene({ scrollProgress, phase }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(scrollProgress);
  const phaseRef = useRef(phase);

  useEffect(() => { progressRef.current = scrollProgress; }, [scrollProgress]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.3, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);

    // ── Lights ─────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xfff8f0, 0.7));

    const keyLight = new THREE.DirectionalLight(0xfffaf2, 3.0);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc03a12, 1.6); // brand red
    rimLight.position.set(-6, 0, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xede8dd, 1.0); // brand cream
    fillLight.position.set(-2, -4, 5);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0x8ba0c8, 0.6);
    backLight.position.set(0, -6, -4);
    scene.add(backLight);

    // ── Materials ──────────────────────────────────────────────
    const enamel = new THREE.MeshStandardMaterial({
      color: 0xf7f2ea,
      roughness: 0.14,
      metalness: 0.02,
    });
    const dentine = new THREE.MeshStandardMaterial({
      color: 0xeaddc8,
      roughness: 0.38,
      metalness: 0.0,
    });

    // ── Tooth geometry ─────────────────────────────────────────
    const toothGroup = new THREE.Group();
    scene.add(toothGroup);

    // Crown body
    const crownGeo = new THREE.SphereGeometry(1.0, 64, 64);
    const crownMesh = new THREE.Mesh(crownGeo, enamel);
    crownMesh.scale.set(0.88, 0.72, 0.80);
    crownMesh.position.y = 0.38;
    toothGroup.add(crownMesh);

    // 4 cusps on top (molar bumps)
    const cuspData: [number, number, number][] = [
      [-0.38, 0.93, -0.30],
      [ 0.38, 0.93, -0.30],
      [-0.38, 0.93,  0.30],
      [ 0.38, 0.93,  0.30],
    ];
    cuspData.forEach(([x, y, z]) => {
      const g = new THREE.SphereGeometry(0.27, 32, 32);
      const m = new THREE.Mesh(g, enamel);
      m.position.set(x, y, z);
      toothGroup.add(m);
    });

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.56, 0.50, 0.28, 32);
    const neckMesh = new THREE.Mesh(neckGeo, enamel);
    neckMesh.position.set(0, -0.22, 0);
    toothGroup.add(neckMesh);

    // Roots (2)
    const rootData: [number, number] = [-0.32, 0.32];
    rootData.forEach((xOff) => {
      const g = new THREE.CylinderGeometry(0.19, 0.04, 1.55, 24);
      const m = new THREE.Mesh(g, dentine);
      m.position.set(xOff, -1.18, 0);
      m.rotation.z = xOff * 0.3;
      toothGroup.add(m);
    });

    // Center root (slightly behind)
    const cRootGeo = new THREE.CylinderGeometry(0.15, 0.03, 1.35, 24);
    const cRoot = new THREE.Mesh(cRootGeo, dentine);
    cRoot.position.set(0, -1.10, -0.18);
    cRoot.rotation.x = -0.08;
    toothGroup.add(cRoot);

    toothGroup.position.y = 0.2;
    toothGroup.scale.setScalar(1.0);

    // ── Mouse ──────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };
    const currentRot = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRot.y = mouse.x * 0.55;
      targetRot.x = mouse.y * 0.28;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Animate ────────────────────────────────────────────────
    let t = 0;
    let raf: number;
    let prevPhase = 0;
    let phaseRotOffset = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.007;

      // Smooth mouse
      currentRot.x += (targetRot.x - currentRot.x) * 0.04;
      currentRot.y += (targetRot.y - currentRot.y) * 0.04;

      // Scroll-driven extra rotation
      const sp = progressRef.current;
      const ph = phaseRef.current;

      // Snap rotation 90° per phase
      if (ph !== prevPhase) {
        phaseRotOffset += Math.PI * 0.5;
        prevPhase = ph;
      }

      toothGroup.rotation.y = t * 0.35 + currentRot.y + phaseRotOffset;
      toothGroup.rotation.x = currentRot.x * 0.4 - 0.08;

      // Subtle float
      toothGroup.position.y = 0.2 + Math.sin(t * 0.65) * 0.14;

      // Scale up slightly as user scrolls in
      const sc = 0.92 + sp * 0.18;
      toothGroup.scale.setScalar(sc);

      renderer.render(scene, camera);
    };
    tick();

    // ── Resize ─────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="tooth-canvas" />;
}
