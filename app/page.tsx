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
          <nav className="nav-menu" aria-label="Main navigation">
            <a href="#product">PRODUCT</a>
            <a href="#how-it-works">HOW IT WORKS</a>
            <a href="#team">TEAM</a>
            <a href="#pricing">PRICING</a>
          </nav>
          <button className="nav-btn">REQUEST ACCESS</button>
        </header>

        {/* ── HERO + MONITOR (above the fold) ── */}
        <div ref={heroRef} className="hero-monitor-wrap">

          {/* Hero text */}
          <section className="hero" id="hero">
            <span className="hero-tag">— DENTAL LAB OS —</span>
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
                  <span className="b-url">app.cromiw.com — Overview</span>
                </div>
                <div className="app">
                  <aside className="a-sidebar">
                    <div className="a-logo">cromiw</div>
                    <div className="a-group-label">WORKSPACE</div>
                    <div className="a-item a-active"><span className="a-dot" />Overview</div>
                    <div className="a-item">Cases</div>
                    <div className="a-item">Workflows</div>
                    <div className="a-item">Calendar</div>
                    <div className="a-group-label" style={{ marginTop: 10 }}>REPORTS</div>
                    <div className="a-item">Analytics</div>
                    <div className="a-item">Invoicing</div>
                  </aside>
                  <main className="a-main">
                    <div className="a-topbar">
                      <span className="a-page-title">Overview</span>
                      <span className="a-new-case">+ NEW CASE</span>
                    </div>
                    <div className="a-stats">
                      {[
                        ["142", "ACTIVE CASES",   "+ 12 today"],
                        ["98%", "ON-TIME RATE",   "+ 3% this month"],
                        ["4.2h","AVG TURNAROUND", "+ 0.8h saved"],
                        ["31",  "DUE TODAY",      "8 need attention"],
                      ].map(([v, l, s]) => (
                        <div className="a-stat" key={l}>
                          <b>{v}</b><span>{l}</span><small>{s}</small>
                        </div>
                      ))}
                    </div>
                    <div className="a-body">
                      <div className="a-table">
                        <div className="a-th">
                          <span>CASE</span><span>DOCTOR</span><span>DUE</span><span>STATUS</span>
                        </div>
                        {[
                          ["Full arch crown",  "Dr. Martinez","Today",    "DONE",   "#4CAF50"],
                          ["3-unit bridge",    "Dr. Kim",     "Tomorrow", "ACTIVE", "#E05C34"],
                          ["Implant abutment", "Dr. Patel",   "In 3 days","QUEUE",  "#8A9BA0"],
                          ["Night guard",      "Dr. Osei",    "In 4 days","QUEUE",  "#8A9BA0"],
                        ].map(([c, d, due, st, col]) => (
                          <div className="a-tr" key={c}>
                            <span>{c}</span><span>{d}</span><span>{due}</span>
                            <span className="a-badge" style={{ color: col, borderColor: col }}>{st}</span>
                          </div>
                        ))}
                      </div>
                      <div className="a-eff">
                        <div className="a-eff-title">LAB EFFICIENCY</div>
                        {[
                          ["Milling dept.", "94%",  "#4CAF50"],
                          ["Finishing",     "88%",  "#4CAF50"],
                          ["QA Check",      "100%", "#4CAF50"],
                          ["Dispatch",      "97%",  "#4CAF50"],
                          ["Returns",       "12%",  "#E05C34"],
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
              eyebrow: "MEET CROMIW",
              heading: "One OS.\nFor every\nlab.",
              sub: "Built for the way dental labs actually work — fast, precise, and always on deadline.",
            },
            {
              eyebrow: "CASE TRACKING",
              heading: "Every\ncase,\ntracked.",
              sub: "Real-time status on every restoration. No calls, no guessing, no lost jobs.",
            },
            {
              eyebrow: "AUTOMATION",
              heading: "Let\nworkflows\nrun.",
              sub: "Define your process once. Cromiw handles assignments, reminders, and escalations automatically.",
            },
            {
              eyebrow: "RESULTS",
              heading: "Ship on\ntime.\nEvery time.",
              sub: "Labs on Cromiw hit 98% on-time delivery in the first month.",
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
                  <span className="oryzo-scroll-hint">SCROLL TO EXPLORE</span>
                </div>

                {/* Right — Logo */}
                <div className="oryzo-logo">
                  <LogoScene ref={logoRef} phase={oryzoPhase} />
                </div>
              </div>

              {/* Stats below sticky */}
              <div className="oryzo-stats">
                {[
                  ["98%",  "On-time delivery rate"],
                  ["4.2h", "Average time saved per case"],
                  ["142+", "Cases managed per lab per month"],
                  ["< 1d", "Time to onboard your team"],
                ].map(([val, label]) => (
                  <div className="oryzo-stat" key={label}>
                    <span className="oryzo-stat-val">{val}</span>
                    <span className="oryzo-stat-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── FEATURES ── */}
        <section className="features" id="product">
          <div className="section-inner">
            <div className="section-header" data-reveal>
              <span className="section-tag">PRODUCT</span>
              <h2 className="section-h2">
                Everything your lab<br />needs to perform.
              </h2>
            </div>
            <div className="feat-grid">
              {[
                {
                  n: "01",
                  title: "Smart Case Tracking",
                  copy: "Every case auto-assigned, deadline-aware, and status-synced across your entire team in real time.",
                },
                {
                  n: "02",
                  title: "Workflow Automation",
                  copy: "Build custom workflows that run without manual intervention — from intake to final dispatch.",
                },
                {
                  n: "03",
                  title: "Lab Analytics",
                  copy: "Know your throughput, efficiency, and bottlenecks at a glance. Data that actually drives decisions.",
                },
              ].map((f, i) => (
                <div
                  key={f.n}
                  className="feat-card"
                  data-reveal
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <span className="feat-num">{f.n}</span>
                  <h3 className="feat-title">{f.title}</h3>
                  <p className="feat-copy">{f.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="how" id="how-it-works">
          <div className="section-inner">
            <div className="section-header" data-reveal>
              <span className="section-tag">HOW IT WORKS</span>
              <h2 className="section-h2">
                Up and running<br />in one afternoon.
              </h2>
            </div>
            <div className="how-steps">
              {[
                {
                  n: "01",
                  title: "Connect your lab",
                  copy: "Import existing cases from your current system. No complex setup, no lost data, no disruption to your team.",
                },
                {
                  n: "02",
                  title: "Set your workflows",
                  copy: "Define stages, assign teams, and configure deadline rules that match your exact process — down to the last step.",
                },
                {
                  n: "03",
                  title: "Ship on time",
                  copy: "Cromiw handles reminders, escalations, and reporting automatically so you can stay focused on the work that matters.",
                },
              ].map((s, i) => (
                <div
                  key={s.n}
                  className="how-step"
                  data-reveal
                  style={{ transitionDelay: `${i * 0.14}s` }}
                >
                  <span className="step-num">{s.n}</span>
                  <div className="step-content">
                    <h3>{s.title}</h3>
                    <p>{s.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="team" id="team">
          <div className="section-inner">
            <div className="section-header" data-reveal>
              <span className="section-tag">TEAM</span>
              <h2 className="section-h2">Built by people who<br />know dental labs.</h2>
            </div>
            <div className="team-grid">
              {[
                { initials: "AK", name: "Aliya Kenzhe",  role: "CO-FOUNDER & CEO" },
                { initials: "MR", name: "Marcos Rueda",  role: "CO-FOUNDER & CTO" },
                { initials: "SL", name: "Sona Levin",    role: "HEAD OF PRODUCT"  },
              ].map((m, i) => (
                <div
                  key={m.name}
                  className="team-card"
                  data-reveal
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <div className="team-avatar">{m.initials}</div>
                  <div className="team-name">{m.name}</div>
                  <div className="team-role">{m.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="pricing" id="pricing">
          <div className="section-inner">
            <div className="section-header" data-reveal>
              <span className="section-tag">PRICING</span>
              <h2 className="section-h2">Simple, honest pricing.</h2>
            </div>
            <div className="price-grid">
              {[
                {
                  name: "STARTER",
                  price: "$99",
                  period: "/ month",
                  features: [
                    "Up to 3 technicians",
                    "100 cases / month",
                    "Core workflows",
                    "Email support",
                  ],
                  cta: "Start Free Trial",
                  featured: false,
                },
                {
                  name: "PRO",
                  price: "$249",
                  period: "/ month",
                  features: [
                    "Unlimited technicians",
                    "Unlimited cases",
                    "Custom workflows",
                    "Priority support",
                    "Advanced analytics",
                  ],
                  cta: "Request Access",
                  featured: true,
                },
              ].map((p, i) => (
                <div
                  key={p.name}
                  className={`price-card${p.featured ? " price-card-featured" : ""}`}
                  data-reveal
                  style={{ transitionDelay: `${i * 0.14}s` }}
                >
                  <div className="price-name">{p.name}</div>
                  <div className="price-amount">
                    {p.price}<span>{p.period}</span>
                  </div>
                  <ul className="price-features">
                    {p.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  <button className={p.featured ? "btn-solid-light" : "btn-ghost"}>
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <section className="cta-band" data-reveal>
          <h2 className="cta-text">
            Ready to <span>make</span><br />it work?
          </h2>
          <button className="btn-solid-light">START FREE TRIAL</button>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-cols">
            <div className="footer-col footer-col--brand">
              <span className="footer-brand">Cromiw</span>
              <p className="footer-tagline">Dental Lab OS.<br />Every case under control.</p>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Product</span>
              <a href="#product">Overview</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Changelog</a>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Company</span>
              <a href="#team">Team</a>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Connect</span>
              <a href="mailto:hello@cromiw.com">hello@cromiw.com</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
              <a href="#" className="footer-cta-link">Request Access →</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Cromiw. All rights reserved.</span>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Settings</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
