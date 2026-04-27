"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

export interface LogoSceneHandle {
  updateScroll: (progress: number) => void;
}

interface Props {
  phase: number;
}

const RING_STROKE = ["#EDE8DD", "#C8D8DA", "#B8C5D8", "#E8B0A0"];
const ARC_STROKE  = ["#E05C34", "#E05C34", "#C03A12", "#EDE8DD"];
const DOT_FILL    = ["#E05C34", "#E05C34", "#C03A12", "#EDE8DD"];

const LogoScene = forwardRef<LogoSceneHandle, Props>(function LogoScene({ phase }, ref) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<SVGCircleElement>(null);
  const arcRef   = useRef<SVGPathElement>(null);
  const dotRef   = useRef<SVGCircleElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const quickRotateRef = useRef<gsap.QuickToFunc | null>(null);
  const quickScaleRef  = useRef<gsap.QuickToFunc | null>(null);

  // Init GSAP quickTo setters + idle float
  useEffect(() => {
    const wrap  = wrapRef.current;
    const group = groupRef.current;
    if (!wrap || !group) return;

    gsap.set(group, { svgOrigin: "100 100" });
    quickRotateRef.current = gsap.quickTo(group, "rotation", { duration: 0.18, ease: "none" });
    quickScaleRef.current  = gsap.quickTo(group, "scale",    { duration: 0.18, ease: "none" });

    const floatTween = gsap.to(wrap, {
      y: -20,
      duration: 3.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => { floatTween.kill(); };
  }, []);

  // Expose scroll updater to parent (bypasses React re-render on every frame)
  useImperativeHandle(ref, () => ({
    updateScroll: (progress: number) => {
      quickRotateRef.current?.(progress * 300);
      quickScaleRef.current?.(0.82 + progress * 0.28);
    },
  }));

  // Phase → color morph
  useEffect(() => {
    const p = Math.min(phase, 3);
    gsap.to(ringRef.current, { attr: { stroke: RING_STROKE[p] }, duration: 1, ease: "power2.out" });
    gsap.to(arcRef.current,  { attr: { stroke: ARC_STROKE[p]  }, duration: 1, ease: "power2.out" });
    gsap.to(dotRef.current,  { attr: { fill:   DOT_FILL[p]    }, duration: 1, ease: "power2.out" });
  }, [phase]);

  return (
    <div ref={wrapRef} className="logo-scene-wrap">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <g ref={groupRef}>
          {/* Outer ring */}
          <circle ref={ringRef} cx="100" cy="100" r="72" stroke="#EDE8DD" strokeWidth="20" fill="none" />
          {/* Coral accent arc — top-right quadrant (12 o'clock → 3 o'clock) */}
          <path
            ref={arcRef}
            d="M 100 28 A 72 72 0 0 1 172 100"
            stroke="#E05C34"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
          />
          {/* Center dot */}
          <circle ref={dotRef} cx="100" cy="100" r="11" fill="#E05C34" />
        </g>
      </svg>
    </div>
  );
});

export default LogoScene;
