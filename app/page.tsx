"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoScene, { type LogoSceneHandle } from "./components/LogoScene";
import ToothJourney from "./components/ToothJourney";

gsap.registerPlugin(ScrollTrigger);

const LOAD_TEXT = "MAKE IT WORK";

export default function Home() {
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [caretOn, setCaretOn] = useState(true);
  const cursorRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const oryzoRef = useRef<HTMLDivElement>(null);
  const [oryzoProgress, setOryzoProgress] = useState(0);
  const [oryzoPhase, setOryzoPhase] = useState(0);
  const logoRef = useRef<LogoSceneHandle>(null);

  const ORYZO_BGS = ["#1A1F36", "#1A2428", "#141825", "#221410"];

  // Typewriter
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(LOAD_TEXT.slice(0, i));
      if (i >= LOAD_TEXT.length) {
        clearInterval(id);
        setTimeout(() => setPhase(1), 650);
        setTimeout(() => setPhase(2), 1650);
      }
    }, 105);
    return () => clearInterval(id);
  }, []);

  // Caret blink
  useEffect(() => {
    const id = setInterval(() => setCaretOn((v) => !v), 500);
    return () => clearInterval(id);
  }, []);

  // Custom cursor — lagged follow
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

  // Cursor expand on interactive elements
  useEffect(() => {
    if (phase !== 2) return;
    const el = cursorRef.current;
    if (!el) return;
    const on = () => el.classList.add("big");
    const off = () => el.classList.remove("big");
    const els = document.querySelectorAll("a, button");
    els.forEach((e) => { e.addEventListener("mouseenter", on); e.addEventListener("mouseleave", off); });
    return () => els.forEach((e) => { e.removeEventListener("mouseenter", on); e.removeEventListener("mouseleave", off); });
  }, [phase]);

  // Hero parallax
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => hero.style.setProperty("--sy", window.scrollY + "px");
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lenis smooth scroll
  useEffect(() => {
    let destroyed = false;
    let lenisInstance: { raf: (t: number) => void; on: (e: string, cb: () => void) => void; destroy: () => void } | null = null;
    const ticker = (time: number) => lenisInstance?.raf(time * 1000);
    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      lenisInstance = new Lenis({ duration: 1.2 }) as typeof lenisInstance;
      lenisInstance!.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    });
    return () => {
      destroyed = true;
      lenisInstance?.destroy();
      gsap.ticker.remove(ticker);
    };
  }, []);


  // Oryzo section — GSAP ScrollTrigger with scrub:1
  useEffect(() => {
    const section = oryzoRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          logoRef.current?.updateScroll(p);
          setOryzoProgress(p);
          setOryzoPhase(Math.min(3, Math.floor(p * 4)));
        },
      });
    });
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll reveals
  useEffect(() => {
    if (phase !== 2) return;
    const els = document.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [phase]);

  return (
    <>
      {/* Custom cursor */}
      <div ref={cursorRef} className="cursor" aria-hidden />

      {/* Loading screen */}
      {phase < 2 && (
        <div className={`loader${phase === 1 ? " loader-out" : ""}`}>
          <p className="loader-word">
            {typed}
            <span className={caretOn ? "caret-on" : "caret-off"}>_</span>
          </p>
          <span className="loader-line" />
        </div>
      )}

      {/* Main site */}
      <div className={`site${phase === 2 ? " site-in" : ""}`}>

        {/* ── NAV ── */}
        <header className="nav">
          <a href="/" className="nav-brand">Cromiw</a>
          <nav className="nav-menu" aria-label="Main navigation" />
          <a href="#vertrieb" className="nav-btn">VERTRIEB KONTAKTIEREN</a>
        </header>

        {/* ── HERO + MONITOR (above the fold) ── */}
        <div ref={heroRef} className="hero-monitor-wrap">

          {/* Hero text */}
          <section className="hero" id="hero">
            <span className="hero-tag">— DENTAL LABOR OS —</span>
            <h1 className="hero-h1">
              <span className="h1-cro">cro</span><span className="h1-miw">miw</span>
            </h1>
          </section>

          {/* Monitor — flat 2D */}
          <div className="monitor-flat-scene">
            <div className="monitor-flat-unit">
            <div className="monitor-flat-wrap">
              <div className="monitor-flat-screen">
                <div className="b-chrome">
                  <span className="dot" style={{ background: "#FF5F57" }} />
                  <span className="dot" style={{ background: "#FFBD2E" }} />
                  <span className="dot" style={{ background: "#28C840" }} />
                  <span className="b-url">app.cromiw.com — Übersicht</span>
                </div>
                <div className="app">
                  <aside className="a-sidebar">
                    <div className="a-logo">cromiw</div>
                    <div className="a-group-label">ARBEITSBEREICH</div>
                    <div className="a-item a-active"><span className="a-dot" />Übersicht</div>
                    <div className="a-item">Fälle</div>
                    <div className="a-item">Workflows</div>
                    <div className="a-item">Kalender</div>
                    <div className="a-group-label" style={{ marginTop: 10 }}>BERICHTE</div>
                    <div className="a-item">Analytik</div>
                    <div className="a-item">Rechnungen</div>
                  </aside>
                  <main className="a-main">
                    <div className="a-topbar">
                      <span className="a-page-title">Übersicht</span>
                      <span className="a-new-case">+ NEUER FALL</span>
                    </div>
                    <div className="a-stats">
                      {[
                        ["142", "AKTIVE FÄLLE",        "+ 12 heute"],
                        ["98%", "PÜNKTLICHKEITSRATE", "+ 3% diesen Monat"],
                        ["4.2h","DURCHSCHN. BEARB.",  "+ 0.8h gespart"],
                        ["31",  "HEUTE FÄLLIG",       "8 brauchen Aufmerksamkeit"],
                      ].map(([v, l, s]) => (
                        <div className="a-stat" key={l}>
                          <b>{v}</b><span>{l}</span><small>{s}</small>
                        </div>
                      ))}
                    </div>
                    <div className="a-body">
                      <div className="a-table">
                        <div className="a-th">
                          <span>FALL</span><span>ARZT</span><span>FÄLLIG</span><span>STATUS</span>
                        </div>
                        {[
                          ["Vollbogen-Krone",   "Dr. Martinez","Heute",       "FERTIG",  "#4CAF50"],
                          ["3-gliedrige Brücke","Dr. Kim",     "Morgen",      "AKTIV",   "#E05C34"],
                          ["Implantat-Aufbau",  "Dr. Patel",   "In 3 Tagen",  "WARTEND", "#8A9BA0"],
                          ["Aufbissschiene",    "Dr. Osei",    "In 4 Tagen",  "WARTEND", "#8A9BA0"],
                        ].map(([c, d, due, st, col]) => (
                          <div className="a-tr" key={c}>
                            <span>{c}</span><span>{d}</span><span>{due}</span>
                            <span className="a-badge" style={{ color: col, borderColor: col }}>{st}</span>
                          </div>
                        ))}
                      </div>
                      <div className="a-eff">
                        <div className="a-eff-title">LABOR-EFFIZIENZ</div>
                        {[
                          ["Fräsabteilung", "94%",  "#4CAF50"],
                          ["Ausarbeitung",  "88%",  "#4CAF50"],
                          ["QA-Prüfung",    "100%", "#4CAF50"],
                          ["Versand",       "97%",  "#4CAF50"],
                          ["Retouren",      "12%",  "#E05C34"],
                        ].map(([l, v, c]) => (
                          <div className="a-eff-row" key={l}>
                            <span>{l}</span><span style={{ color: c }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </main>
                </div>
              </div>
            </div>
            </div>
          </div>

        </div>{/* end hero-monitor-wrap */}

        {/* ── TOOTH JOURNEY (Section 2) ── */}
        <ToothJourney />

        {/* ── ORYZO / TOOTH SECTION ── */}
        {(() => {
          const phases = [
            {
              eyebrow: "LERN CROMIW KENNEN",
              heading: "Ein OS.\nFür jedes\nLabor.",
              sub: "Entwickelt für die Art, wie Dentallabore wirklich arbeiten — schnell, präzise und immer pünktlich.",
            },
            {
              eyebrow: "FALLVERFOLGUNG",
              heading: "Jeder\nFall,\nverfolgt.",
              sub: "Echtzeit-Status für jede Restauration. Keine Anrufe, kein Raten, keine verlorenen Aufträge.",
            },
            {
              eyebrow: "AUTOMATISIERUNG",
              heading: "Workflows\neinfach\nlaufen lassen.",
              sub: "Definieren Sie Ihren Prozess einmalig. Cromiw übernimmt Zuweisung, Erinnerungen und Eskalationen automatisch.",
            },
            {
              eyebrow: "ERGEBNISSE",
              heading: "Pünktlich\nliefern.\nJedes Mal.",
              sub: "Labore auf Cromiw erreichen im ersten Monat 98 % Pünktlichkeit.",
            },
          ];
          return (
            <div
              ref={oryzoRef}
              className="oryzo-wrap"
              style={{ backgroundColor: ORYZO_BGS[oryzoPhase], transition: "background-color 0.9s ease" }}
            >
              <div className="oryzo-sticky">
                {/* Left — floating cards */}
                <div className="oryzo-left">
                  {phases.map((p, i) => (
                    <div
                      key={i}
                      className={`oryzo-card${oryzoPhase === i ? " oryzo-card--active" : ""}`}
                    >
                      <span className="oryzo-eyebrow">{p.eyebrow}</span>
                      <h2 className="oryzo-h">
                        {p.heading.split("\n").map((line, j) => (
                          <span key={j}>{line}<br /></span>
                        ))}
                      </h2>
                      <p className="oryzo-p">{p.sub}</p>
                    </div>
                  ))}

                  {/* Scroll progress bar */}
                  <div className="oryzo-bar-wrap">
                    <div
                      className="oryzo-bar-fill"
                      style={{ width: `${oryzoProgress * 100}%` }}
                    />
                  </div>
                  <span className="oryzo-scroll-hint">SCROLLEN ZUM ENTDECKEN</span>
                </div>

                {/* Right — Logo */}
                <div className="oryzo-logo">
                  <LogoScene ref={logoRef} phase={oryzoPhase} />
                </div>
              </div>

            </div>
          );
        })()}

        {/* ── TEAM ── */}
        <section className="team-section">
          <div className="section-inner">
            <div className="team-section-header">
              <span className="team-section-tag">TEAM</span>
              <h2 className="team-section-h2">Unser Team</h2>
            </div>
            <div className="team-members">
              {[
                { name: "Sanzhar", role: "Founder & CEO" },
                { name: "Kaito",   role: "Co-Founder & CTO" },
                { name: "Paul",    role: "Co-Founder & CRO" },
              ].map((m) => (
                <div className="team-member" key={m.name}>
                  <div className="team-photo-box" />
                  <div>
                    <div className="team-member-name">{m.name}</div>
                    <div className="team-member-role">{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VERTRIEB KONTAKTIEREN ── */}
        <section className="contact-section" id="vertrieb">
          <div className="contact-inner">
            <div className="contact-header">
              <span className="contact-tag">VERTRIEB</span>
              <h2 className="contact-h2">Vertrieb Kontaktieren</h2>
              <p className="contact-sub">Unser Team meldet sich innerhalb von 24 Stunden bei Ihnen.</p>
            </div>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="contact-field">
                <label className="contact-label" htmlFor="company">Unternehmensname</label>
                <input className="contact-input" id="company" type="text" placeholder="Ihr Unternehmen" required />
              </div>
              <div className="contact-field">
                <label className="contact-label" htmlFor="fullname">Vollständiger Name</label>
                <input className="contact-input" id="fullname" type="text" placeholder="Vor- und Nachname" required />
              </div>
              <div className="contact-field">
                <label className="contact-label" htmlFor="email">E-Mail-Adresse</label>
                <input className="contact-input" id="email" type="email" placeholder="ihre@email.com" required />
              </div>
              <button type="submit" className="contact-btn">Anfrage senden</button>
            </form>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-cols">
            <div className="footer-col footer-col--brand">
              <span className="footer-brand">Cromiw</span>
              <p className="footer-tagline">Dental Labor OS.<br />Jeder Fall unter Kontrolle.</p>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Produkt</span>
              <a href="#">Übersicht</a>
              <a href="#">Änderungsprotokoll</a>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Unternehmen</span>
              <a href="#">Über uns</a>
              <a href="#">Blog</a>
              <a href="#">Karriere</a>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Kontakt</span>
              <a href="mailto:hello@cromiw.com">hello@cromiw.com</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
              <a href="#" className="footer-cta-link">Zugang anfordern →</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Cromiw. Alle Rechte vorbehalten.</span>
            <div className="footer-legal">
              <a href="#">Datenschutzrichtlinie</a>
              <a href="#">Nutzungsbedingungen</a>
              <a href="#">Cookie-Einstellungen</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
