"use client";

import { useEffect, useRef } from "react";

export default function DemoPage() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    let raf: number;
    let mx = 0, my = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const tick = () => {
      cx += (mx - cx) * 0.13;
      cy += (my - cy) * 0.13;
      el.style.left = cx + "px";
      el.style.top = cy + "px";
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" style={{ borderColor: "#fff" }} aria-hidden />

      <div style={{
        minHeight: "100vh",
        width: "100%",
        background: "var(--navy)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2.5rem",
        padding: "2rem",
        fontFamily: "var(--sans)",
        boxSizing: "border-box",
      }}>
        <p style={{
          fontSize: "0.72rem",
          letterSpacing: "0.22em",
          color: "rgba(237,232,221,0.4)",
        }}>
          — CROMIW DEMO —
        </p>

        <h1 style={{
          fontSize: "clamp(3rem, 10vw, 8rem)",
          fontWeight: 300,
          color: "var(--cream)",
          lineHeight: 1,
          letterSpacing: "-0.03em",
          textAlign: "center",
        }}>
          Coming<br />
          <span style={{ color: "var(--red)" }}>Soon.</span>
        </h1>

        <p style={{
          fontSize: "0.95rem",
          color: "rgba(237,232,221,0.45)",
          lineHeight: 1.8,
          maxWidth: "360px",
          textAlign: "center",
        }}>
          Wir arbeiten daran. Kontaktieren Sie uns für eine persönliche Demo.
        </p>

        <a href="/" className="demo-back-btn">
          ← ZURÜCK ZUR HAUPTSEITE
        </a>
      </div>
    </>
  );
}
