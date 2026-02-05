import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   NEIGHBORHOOD SOLAR EXPERTS — Associate / Concierge Solar Website
   Backed by Centurion Solar Energy, LLC
   
   Architecture: Single-page React app with section-based navigation
   Design System: "Quiet Luxury" — calm, premium, honest
   Compliance: All credentials attributed to Centurion Solar
   Last verified: February 2026
   ═══════════════════════════════════════════════════════════ */

// ── Design Tokens ──────────────────────────────────────────
const T = {
  // Palette: Warm neutrals + deep teal accent (trust, calm, nature)
  bg:        "#FAFAF7",      // warm off-white, less clinical
  bgAlt:     "#F2F0EB",      // section alternation
  bgDark:    "#1A2B2E",      // deep teal-charcoal for dark sections
  bgCard:    "#FFFFFF",
  text:      "#2D3436",      // near-black, high readability
  textMuted: "#6B7B7D",      // secondary text
  textLight: "#9AACAE",      // tertiary / captions
  accent:    "#2E7D6F",      // deep teal-green — nature, trust, calm
  accentSoft:"#E8F4F0",      // accent tint for badges/backgrounds
  accentHov: "#256B5E",      // hover state
  warm:      "#D4A574",      // warm terracotta accent (subtle warmth)
  warmSoft:  "#FDF5EE",      // warm tint
  border:    "#E5E2DB",      // warm gray border
  white:     "#FFFFFF",
  error:     "#C0392B",
  // Typography
  fontDisplay: "'Instrument Serif', Georgia, serif",
  fontBody:    "'DM Sans', 'Helvetica Neue', sans-serif",
  // Spacing scale (8px base)
  s1: "8px", s2: "16px", s3: "24px", s4: "32px", s5: "40px",
  s6: "48px", s7: "64px", s8: "80px", s9: "96px", s10: "120px",
  // Radius
  r1: "6px", r2: "12px", r3: "16px", r4: "24px",
  // Shadows
  shadow1: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
  shadow2: "0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
  shadow3: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
  // Transitions
  ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
};

// ── Shared Styles ──────────────────────────────────────────
const container = { maxWidth: "1200px", margin: "0 auto", padding: `0 ${T.s3}` };
const sectionPad = { padding: `${T.s9} 0` };

// ── Icon Components (inline SVG, no deps) ──────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    clipboard: <><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    building: <><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01"/></>,
    dollar: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    tool: <><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></>,
    award: <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
    mapPin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
    chevDown: <><polyline points="6 9 12 15 18 9"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    fileText: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    headphones: <><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ── Intersection Observer Hook ─────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.15, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isVisible];
}

// ── Fade-In Wrapper ────────────────────────────────────────
const FadeIn = ({ children, delay = 0, style = {} }) => {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.7s ${T.ease} ${delay}s, transform 0.7s ${T.ease} ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
};

// ── Global Styles (injected once) ──────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Instrument+Serif:ital@0;1&display=swap');
    
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    
    html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
    
    body {
      font-family: ${T.fontBody};
      color: ${T.text};
      background: ${T.bg};
      line-height: 1.7;
      font-size: 16px;
      overflow-x: hidden;
    }
    
    ::selection { background: ${T.accentSoft}; color: ${T.accent}; }
    
    a { color: ${T.accent}; text-decoration: none; transition: color 0.2s ${T.ease}; }
    a:hover { color: ${T.accentHov}; }
    
    img { max-width: 100%; display: block; }

    /* Smooth scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: ${T.bgAlt}; }
    ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${T.textMuted}; }
    
    /* Focus styles for accessibility */
    :focus-visible {
      outline: 2px solid ${T.accent};
      outline-offset: 2px;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      body { font-size: 15px; }
    }
  `}</style>
);

// ── Button Component ───────────────────────────────────────
const Button = ({ children, variant = "primary", size = "md", onClick, href, style: sx = {}, ...props }) => {
  const isPrimary = variant === "primary";
  const isLg = size === "lg";
  const baseStyle = {
    display: "inline-flex", alignItems: "center", gap: T.s1,
    fontFamily: T.fontBody, fontWeight: 500, fontSize: isLg ? "16px" : "14px",
    letterSpacing: "0.01em",
    padding: isLg ? `${T.s2} ${T.s4}` : `12px ${T.s3}`,
    borderRadius: T.r4, border: "none", cursor: "pointer",
    transition: `all 0.3s ${T.ease}`,
    background: isPrimary ? T.accent : "transparent",
    color: isPrimary ? T.white : T.accent,
    border: isPrimary ? "none" : `1.5px solid ${T.border}`,
    ...sx,
  };
  const handleHover = (e, enter) => {
    if (isPrimary) {
      e.target.style.background = enter ? T.accentHov : T.accent;
      e.target.style.transform = enter ? "translateY(-1px)" : "translateY(0)";
      e.target.style.boxShadow = enter ? T.shadow2 : "none";
    } else {
      e.target.style.borderColor = enter ? T.accent : T.border;
      e.target.style.background = enter ? T.accentSoft : "transparent";
    }
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} onClick={onClick} style={baseStyle}
      onMouseEnter={e => handleHover(e, true)}
      onMouseLeave={e => handleHover(e, false)}
      {...props}>
      {children}
    </Tag>
  );
};

// ── Badge Component ────────────────────────────────────────
const Badge = ({ icon, children }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "6px 14px", borderRadius: T.r4,
    background: T.accentSoft, color: T.accent,
    fontSize: "13px", fontWeight: 500, letterSpacing: "0.01em",
  }}>
    {icon && <Icon name={icon} size={14} />}
    {children}
  </span>
);

// ── Section Label ──────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: T.s1,
    marginBottom: T.s3,
  }}>
    <div style={{ width: "24px", height: "1.5px", background: T.accent }} />
    <span style={{
      fontFamily: T.fontBody, fontSize: "12px", fontWeight: 600,
      letterSpacing: "0.12em", textTransform: "uppercase", color: T.accent,
    }}>
      {children}
    </span>
  </div>
);

// ── Trust Strip (used in hero + footer) ────────────────────
const trustItems = [
  { num: "10,000+", label: "Systems Installed" },
  { num: "Platinum", label: "NYSERDA Status" },
  { num: "A+", label: "BBB Rating" },
  { num: "13+", label: "Years in Business" },
  { num: "Top 4%", label: "NY Contractors" },
];

const TrustStrip = ({ dark = false }) => (
  <div style={{
    display: "flex", flexWrap: "wrap", justifyContent: "center", gap: T.s4,
    padding: `${T.s3} 0`,
  }}>
    {trustItems.map((item, i) => (
      <div key={i} style={{ textAlign: "center", minWidth: "120px" }}>
        <div style={{
          fontFamily: T.fontDisplay, fontSize: "24px", fontWeight: 400,
          color: dark ? T.white : T.accent, lineHeight: 1.2,
        }}>
          {item.num}
        </div>
        <div style={{
          fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em",
          textTransform: "uppercase", color: dark ? T.textLight : T.textMuted,
          marginTop: "4px",
        }}>
          {item.label}
        </div>
      </div>
    ))}
  </div>
);

// ── Navigation ─────────────────────────────────────────────
const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(250,250,247,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
        transition: `all 0.4s ${T.ease}`,
        padding: scrolled ? "12px 0" : "20px 0",
      }}>
        <div style={{ ...container, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="#home" style={{
            fontFamily: T.fontDisplay, fontSize: "19px", color: T.text,
            textDecoration: "none", display: "flex", alignItems: "center", gap: T.s1,
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: `linear-gradient(135deg, ${T.accent}, ${T.warm})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="sun" size={16} color={T.white} />
            </div>
            <span>Neighborhood Solar Experts</span>
          </a>

          {/* Desktop links */}
          <div style={{
            display: "flex", alignItems: "center", gap: T.s4,
          }} className="nav-desktop">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} style={{
                fontSize: "14px", fontWeight: 500, color: T.textMuted,
                textDecoration: "none", letterSpacing: "0.01em",
                transition: `color 0.2s ${T.ease}`,
              }}
                onMouseEnter={e => e.target.style.color = T.accent}
                onMouseLeave={e => e.target.style.color = T.textMuted}>
                {link.label}
              </a>
            ))}
            <Button href="#contact" size="md">Get Started</Button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="nav-mobile-toggle"
            aria-label="Toggle navigation menu"
            style={{
              display: "none", background: "none", border: "none", cursor: "pointer",
              padding: T.s1, color: T.text,
            }}>
            <div style={{ width: "22px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <span style={{
                display: "block", height: "2px", background: T.text, borderRadius: "1px",
                transition: `all 0.3s ${T.ease}`,
                transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
              }} />
              <span style={{
                display: "block", height: "2px", background: T.text, borderRadius: "1px",
                transition: `all 0.3s ${T.ease}`,
                opacity: mobileOpen ? 0 : 1,
              }} />
              <span style={{
                display: "block", height: "2px", background: T.text, borderRadius: "1px",
                transition: `all 0.3s ${T.ease}`,
                transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
              }} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999,
          background: "rgba(250,250,247,0.98)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: T.s4,
        }}>
          {navLinks.map(link => (
            <a key={link.label} href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: T.fontDisplay, fontSize: "28px", color: T.text,
                textDecoration: "none",
              }}>
              {link.label}
            </a>
          ))}
          <Button href="#contact" size="lg" onClick={() => setMobileOpen(false)}>
            Get Started
          </Button>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
};

// ════════════════════════════════════════════════════════════
// SECTION: HERO (Home)
// ════════════════════════════════════════════════════════════
const Hero = () => (
  <section id="home" style={{
    ...sectionPad, paddingTop: "160px", paddingBottom: T.s8,
    background: T.bg, position: "relative", overflow: "hidden",
  }}>
    {/* Subtle gradient orb — depth without distraction */}
    <div style={{
      position: "absolute", top: "-200px", right: "-100px",
      width: "600px", height: "600px", borderRadius: "50%",
      background: `radial-gradient(circle, ${T.accentSoft} 0%, transparent 70%)`,
      opacity: 0.6, pointerEvents: "none",
    }} />
    <div style={{
      position: "absolute", bottom: "-100px", left: "-150px",
      width: "400px", height: "400px", borderRadius: "50%",
      background: `radial-gradient(circle, ${T.warmSoft} 0%, transparent 70%)`,
      opacity: 0.5, pointerEvents: "none",
    }} />

    <div style={{ ...container, position: "relative", zIndex: 1 }}>
      <FadeIn>
        <SectionLabel>NYC Solar, Simplified</SectionLabel>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h1 style={{
          fontFamily: T.fontDisplay, fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 400, lineHeight: 1.12, color: T.text,
          maxWidth: "720px", marginBottom: T.s3,
        }}>
          Expert guidance from consultation{" "}
          <span style={{ fontStyle: "italic", color: T.accent }}>to power-on.</span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.2}>
        <p style={{
          fontSize: "18px", lineHeight: 1.7, color: T.textMuted,
          maxWidth: "560px", marginBottom: T.s5,
        }}>
          I coordinate every step of your solar project with New York's most experienced
          installation team. No confusion. No runaround. Just clean energy on your roof.
        </p>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: T.s2, marginBottom: T.s7 }}>
          <Button href="#contact" size="lg">
            Schedule a Free Consultation
            <Icon name="arrowRight" size={16} color={T.white} />
          </Button>
          <Button href="#process" variant="secondary" size="lg">
            See How It Works
          </Button>
        </div>
      </FadeIn>

      {/* Trust strip with attribution */}
      <FadeIn delay={0.4}>
        <div style={{
          background: T.white, borderRadius: T.r3, padding: `${T.s3} ${T.s4}`,
          boxShadow: T.shadow1, border: `1px solid ${T.border}`,
        }}>
          <TrustStrip />
          <p style={{
            textAlign: "center", fontSize: "11px", color: T.textLight,
            marginTop: T.s1, letterSpacing: "0.02em",
          }}>
            Installation &amp; permitting by Centurion Solar Energy, LLC — our execution partner
          </p>
        </div>
      </FadeIn>
    </div>
  </section>
);

// ════════════════════════════════════════════════════════════
// SECTION: INCENTIVE REALITY (2026 Honest Messaging)
// ════════════════════════════════════════════════════════════
const IncentiveReality = () => (
  <section style={{ ...sectionPad, background: T.bgAlt }}>
    <div style={container}>
      <FadeIn>
        <SectionLabel>2026 Incentive Landscape</SectionLabel>
        <h2 style={{
          fontFamily: T.fontDisplay, fontSize: "clamp(28px, 3.5vw, 42px)",
          fontWeight: 400, lineHeight: 1.2, maxWidth: "600px",
          marginBottom: T.s2,
        }}>
          The incentive landscape changed.{" "}
          <span style={{ fontStyle: "italic", color: T.accent }}>Here's what's real.</span>
        </h2>
        <p style={{ color: T.textMuted, maxWidth: "560px", marginBottom: T.s6 }}>
          The federal residential solar tax credit expired at the end of 2025. But NYC
          homeowners still have access to significant state and city incentives. We'll walk
          you through exactly what applies to your situation.
        </p>
      </FadeIn>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: T.s3,
      }}>
        {[
          {
            icon: "building",
            title: "NYC Property Tax Abatement",
            desc: "30% of installation cost, applied over 4 years. Extended through 2035. Available to property owners in all five boroughs.",
            status: "Active",
          },
          {
            icon: "award",
            title: "NYS Solar Equipment Tax Credit",
            desc: "25% of qualified solar equipment costs, up to $5,000. File with Form IT-255.",
            status: "Active",
          },
          {
            icon: "zap",
            title: "NY-Sun Megawatt Block Rebate",
            desc: "Upfront rebate (~$0.20/W in ConEd region) applied directly by the installer. Blocks are depleting — earlier action means higher rebates.",
            status: "Active",
          },
          {
            icon: "grid",
            title: "ConEd Net Metering",
            desc: "1-to-1 retail rate credits for excess solar energy. Lock in today for a 20-year grandfathered rate.",
            status: "Active",
          },
        ].map((item, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div style={{
              background: T.white, borderRadius: T.r3, padding: T.s4,
              border: `1px solid ${T.border}`, height: "100%",
              transition: `box-shadow 0.3s ${T.ease}`,
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadow2}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
              <div style={{
                width: "44px", height: "44px", borderRadius: T.r2,
                background: T.accentSoft, display: "flex",
                alignItems: "center", justifyContent: "center",
                marginBottom: T.s2,
              }}>
                <Icon name={item.icon} size={20} color={T.accent} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: T.s1, marginBottom: T.s1 }}>
                <h3 style={{ fontFamily: T.fontBody, fontSize: "16px", fontWeight: 600 }}>
                  {item.title}
                </h3>
                <Badge>{item.status}</Badge>
              </div>
              <p style={{ fontSize: "14px", color: T.textMuted, lineHeight: 1.7 }}>
                {item.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.4}>
        <div style={{
          marginTop: T.s5, padding: `${T.s3} ${T.s4}`,
          background: T.warmSoft, borderRadius: T.r3,
          border: `1px solid ${T.warm}33`,
          display: "flex", alignItems: "flex-start", gap: T.s2,
        }}>
          <div style={{ flexShrink: 0, marginTop: "2px" }}>
            <Icon name="eye" size={18} color={T.warm} />
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: T.text, marginBottom: "4px" }}>
              Important Note on Lease &amp; PPA Options
            </p>
            <p style={{ fontSize: "13px", color: T.textMuted, lineHeight: 1.7 }}>
              While the direct homeowner federal tax credit is no longer available, lease and PPA
              arrangements may still benefit from business-level tax credits (Section 48E) through 2027.
              This can result in competitive monthly pricing. We'll explain the tradeoffs clearly during
              your consultation — no pressure, just information.
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  </section>
);

// ════════════════════════════════════════════════════════════
// SECTION: SERVICES
// ════════════════════════════════════════════════════════════
const services = [
  {
    icon: "phone",
    title: "Solar Consultation & Site Assessment",
    desc: "We evaluate your roof, energy usage, and goals to determine if solar makes sense for your home — and which path is best for you financially.",
    handler: "Our Team",
    proof: "Assessments informed by data from 10,000+ completed installations",
  },
  {
    icon: "fileText",
    title: "System Design & Engineering",
    desc: "Custom PV system design optimized for your roof geometry, shading patterns, and energy offset targets.",
    handler: "Centurion Solar",
    proof: "Engineered by NABCEP-certified professionals",
  },
  {
    icon: "clipboard",
    title: "Permitting & DOB Filing",
    desc: "Full management of NYC Department of Buildings applications, plan filings, inspection scheduling, and PTA4 abatement paperwork.",
    handler: "Centurion Solar",
    proof: "4,759 NYC DOB permits filed and approved",
  },
  {
    icon: "tool",
    title: "Professional Installation",
    desc: "Installation by licensed, insured crews with OSHA 30 certification. Tier-1 equipment from globally recognized manufacturers.",
    handler: "Centurion Solar",
    proof: "NYSERDA Platinum-rated installation quality",
  },
  {
    icon: "dollar",
    title: "Financing & Incentive Navigation",
    desc: "We help you understand ownership vs. lease vs. PPA, and identify every available incentive for your specific situation.",
    handler: "Our Team",
    proof: "Access to established financing channels including Sungage and PosiGen",
  },
  {
    icon: "headphones",
    title: "Monitoring & Ongoing Support",
    desc: "Ongoing system performance monitoring and a clear support escalation path. You'll always know who to call.",
    handler: "Centurion Solar",
    proof: "Dedicated support team with Spanish-language availability",
  },
];

const Services = () => (
  <section id="services" style={{ ...sectionPad, background: T.bg }}>
    <div style={container}>
      <FadeIn>
        <SectionLabel>What We Handle</SectionLabel>
        <h2 style={{
          fontFamily: T.fontDisplay, fontSize: "clamp(28px, 3.5vw, 42px)",
          fontWeight: 400, lineHeight: 1.2, maxWidth: "540px",
          marginBottom: T.s2,
        }}>
          Every step, clearly{" "}
          <span style={{ fontStyle: "italic", color: T.accent }}>assigned.</span>
        </h2>
        <p style={{ color: T.textMuted, maxWidth: "520px", marginBottom: T.s6 }}>
          You'll always know who's handling what. Our team guides the relationship.
          Centurion Solar executes the build.
        </p>
      </FadeIn>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: T.s3,
      }}>
        {services.map((svc, i) => {
          const isOurTeam = svc.handler === "Our Team";
          return (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{
                background: T.white, borderRadius: T.r3,
                border: `1px solid ${T.border}`, overflow: "hidden",
                height: "100%", display: "flex", flexDirection: "column",
                transition: `box-shadow 0.3s ${T.ease}`,
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadow2}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                {/* Handler tag at top */}
                <div style={{
                  padding: `8px ${T.s3}`,
                  background: isOurTeam ? T.warmSoft : T.accentSoft,
                  borderBottom: `1px solid ${isOurTeam ? T.warm + "30" : T.accent + "20"}`,
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                  <div style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: isOurTeam ? T.warm : T.accent,
                  }} />
                  <span style={{
                    fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isOurTeam ? T.warm : T.accent,
                  }}>
                    {isOurTeam ? "Handled by Our Team" : "Handled by Centurion Solar"}
                  </span>
                </div>

                <div style={{ padding: T.s3, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: T.r2,
                    background: isOurTeam ? T.warmSoft : T.accentSoft,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: T.s2,
                  }}>
                    <Icon name={svc.icon} size={18} color={isOurTeam ? T.warm : T.accent} />
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: 600, marginBottom: T.s1, lineHeight: 1.3 }}>
                    {svc.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: T.textMuted, lineHeight: 1.7, flex: 1 }}>
                    {svc.desc}
                  </p>
                  <div style={{
                    marginTop: T.s2, paddingTop: T.s2,
                    borderTop: `1px solid ${T.border}`,
                    display: "flex", alignItems: "center", gap: "6px",
                  }}>
                    <Icon name="check" size={14} color={T.accent} />
                    <span style={{ fontSize: "12px", color: T.textMuted, fontStyle: "italic" }}>
                      {svc.proof}
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  </section>
);

// ════════════════════════════════════════════════════════════
// SECTION: PROCESS (6-Step NYC Journey)
// ════════════════════════════════════════════════════════════
const processSteps = [
  { num: "01", title: "Free Consultation", who: "Our Team", time: "1–2 days", you: "Share a recent electric bill",
    desc: "We assess your roof, energy usage, and goals. No commitment — just honest information about whether solar makes sense for you." },
  { num: "02", title: "Custom Design & Proposal", who: "Our Team + Centurion Engineering", time: "3–5 business days", you: "Review and approve design",
    desc: "A PV layout tailored to your roof, with production estimates and financial modeling based on current 2026 incentives." },
  { num: "03", title: "Financing & Contracts", who: "Our Team + Finance Partners", time: "1–2 weeks", you: "Choose financing path, sign agreement",
    desc: "We walk you through ownership, lease, and PPA options. You choose what fits your budget and goals — no pressure." },
  { num: "04", title: "Permitting & DOB Filing", who: "Centurion Solar", time: "4–12 weeks (NYC variable)", you: "Nothing — we handle it",
    desc: "Plans submitted to NYC DOB, abatement paperwork filed, inspections coordinated. This is where experience matters most." },
  { num: "05", title: "Professional Installation", who: "Centurion Solar", time: "1–3 days (typical residential)", you: "Provide roof / property access",
    desc: "Licensed, insured crews install your panels, inverter, and monitoring system. OSHA 30 certified, Tier-1 equipment." },
  { num: "06", title: "Interconnection & PTO", who: "Centurion Solar", time: "2–6 weeks (utility dependent)", you: "Nothing — we handle it",
    desc: "Utility meter swap, final inspection, Permission to Operate. Once PTO is issued, your system goes live." },
];

const delayReasons = [
  { title: "DOB Plan Review Backlogs", desc: "NYC DOB review times fluctuate seasonally. During peak periods (spring/summer), plan review can extend 6–8 weeks beyond typical timelines." },
  { title: "Utility Interconnection Queue", desc: "ConEd processes applications sequentially. High-demand periods create additional 2–4 week delays." },
  { title: "Property-Specific Issues", desc: "Older buildings may require structural engineering review. Historic districts add landmark commission approval steps." },
  { title: "Inspection Scheduling", desc: "NYC DOB inspections are scheduled by the department, not the installer. Timing is outside anyone's direct control." },
];

const Process = () => (
  <section id="process" style={{ ...sectionPad, background: T.bgAlt }}>
    <div style={container}>
      <FadeIn>
        <SectionLabel>Your Solar Journey</SectionLabel>
        <h2 style={{
          fontFamily: T.fontDisplay, fontSize: "clamp(28px, 3.5vw, 42px)",
          fontWeight: 400, lineHeight: 1.2, maxWidth: "560px",
          marginBottom: T.s2,
        }}>
          Six steps from consultation{" "}
          <span style={{ fontStyle: "italic", color: T.accent }}>to power-on.</span>
        </h2>
        <p style={{ color: T.textMuted, maxWidth: "520px", marginBottom: T.s7 }}>
          Solar in NYC involves real complexity. Here's exactly what happens, who does it,
          and how long it actually takes.
        </p>
      </FadeIn>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute", left: "23px", top: "8px", bottom: "8px",
          width: "2px", background: T.border,
        }} className="process-line" />

        {processSteps.map((step, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div style={{
              display: "flex", gap: T.s4, marginBottom: T.s5,
              position: "relative",
            }}>
              {/* Number circle */}
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                background: T.white, border: `2px solid ${T.accent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: T.fontBody, fontSize: "14px", fontWeight: 600,
                color: T.accent, flexShrink: 0, zIndex: 1,
              }}>
                {step.num}
              </div>

              {/* Content card */}
              <div style={{
                flex: 1, background: T.white, borderRadius: T.r3,
                padding: T.s3, border: `1px solid ${T.border}`,
              }}>
                <div style={{
                  display: "flex", flexWrap: "wrap", alignItems: "center",
                  gap: T.s1, marginBottom: T.s1,
                }}>
                  <h3 style={{ fontSize: "17px", fontWeight: 600 }}>{step.title}</h3>
                </div>
                <p style={{ fontSize: "14px", color: T.textMuted, lineHeight: 1.7, marginBottom: T.s2 }}>
                  {step.desc}
                </p>
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: T.s2,
                  paddingTop: T.s2, borderTop: `1px solid ${T.border}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Icon name="users" size={13} color={T.textLight} />
                    <span style={{ fontSize: "12px", color: T.textMuted }}>{step.who}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Icon name="clock" size={13} color={T.textLight} />
                    <span style={{ fontSize: "12px", color: T.textMuted }}>{step.time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Icon name="home" size={13} color={T.textLight} />
                    <span style={{ fontSize: "12px", color: T.textMuted }}>Your role: {step.you}</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* What Causes Delays */}
      <FadeIn delay={0.3}>
        <div style={{
          marginTop: T.s7, background: T.bgDark, borderRadius: T.r3,
          padding: `${T.s5} ${T.s4}`, color: T.white,
        }}>
          <h3 style={{
            fontFamily: T.fontDisplay, fontSize: "24px",
            fontWeight: 400, marginBottom: T.s1,
          }}>
            What causes delays in NYC?
          </h3>
          <p style={{ fontSize: "14px", color: T.textLight, marginBottom: T.s4, maxWidth: "560px" }}>
            We won't tell you your system will be running in 30 days. In NYC, permitting
            alone typically takes 4–12 weeks. Here's why — and why our execution partner's
            experience matters.
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: T.s3,
          }}>
            {delayReasons.map((reason, i) => (
              <div key={i} style={{
                padding: T.s3, borderRadius: T.r2,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "6px", color: T.white }}>
                  {reason.title}
                </h4>
                <p style={{ fontSize: "13px", color: T.textLight, lineHeight: 1.7 }}>
                  {reason.desc}
                </p>
              </div>
            ))}
          </div>
          <p style={{
            marginTop: T.s4, fontSize: "13px", color: T.textLight,
            fontStyle: "italic", maxWidth: "600px",
          }}>
            Our execution partner, Centurion Solar, has filed over 4,700 NYC permits and
            knows exactly how to move projects through the system as efficiently as possible.
          </p>
        </div>
      </FadeIn>
    </div>

    <style>{`
      @media (max-width: 640px) {
        .process-line { display: none; }
      }
    `}</style>
  </section>
);

// ════════════════════════════════════════════════════════════
// SECTION: ABOUT
// ════════════════════════════════════════════════════════════
const About = () => (
  <section id="about" style={{ ...sectionPad, background: T.bg }}>
    <div style={container}>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: T.s7, alignItems: "start",
      }}>
        {/* Left: Our story */}
        <FadeIn>
          <div>
            <SectionLabel>About Us</SectionLabel>
            <h2 style={{
              fontFamily: T.fontDisplay, fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 400, lineHeight: 1.2, marginBottom: T.s3,
            }}>
              Your solar guides,{" "}
              <span style={{ fontStyle: "italic", color: T.accent }}>not salespeople.</span>
            </h2>

            <p style={{ color: T.textMuted, marginBottom: T.s3, lineHeight: 1.8 }}>
              We started Neighborhood Solar Experts because we saw how confusing the solar
              process is for NYC homeowners — especially now that incentives have changed.
              Too many people get pressured into decisions they don't understand, by companies
              that won't be around to support them in year five.
            </p>
            <p style={{ color: T.textMuted, marginBottom: T.s3, lineHeight: 1.8 }}>
              Our role is simple: we're your advocates. We help you understand every option,
              every incentive, and every tradeoff — then we coordinate the entire project with
              an execution team that has over 10,000 installations behind them.
            </p>
            <p style={{ color: T.textMuted, marginBottom: T.s4, lineHeight: 1.8 }}>
              We don't install panels. We don't file permits. We make sure you have the right
              information and the right team — and that nothing falls through the cracks.
            </p>

            <div style={{
              padding: T.s3, background: T.accentSoft, borderRadius: T.r3,
              borderLeft: `3px solid ${T.accent}`,
            }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: T.accent, marginBottom: "4px" }}>
                The Associate Model
              </p>
              <p style={{ fontSize: "13px", color: T.textMuted, lineHeight: 1.7 }}>
                Neighborhood Solar Experts handles education, coordination, and advocacy.
                Centurion Solar Energy, LLC handles engineering, permitting, installation,
                and PTO. This separation ensures you get dedicated attention from both
                sides — without conflicts of interest.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Right: Photo placeholder + Execution Partner */}
        <div>
          <FadeIn delay={0.15}>
            {/* ═══════════════════════════════════════════════════
               PHOTO PLACEHOLDER — Replace with team / founder portrait
               
               To swap in a real photo:
               1. Replace this entire div with an <img> tag
               2. Recommended: 400x500px minimum, warm lighting
               3. Style: professional but approachable
               ═══════════════════════════════════════════════════ */}
            <div style={{
              width: "100%", aspectRatio: "4/5",
              background: `linear-gradient(135deg, ${T.accentSoft} 0%, ${T.warmSoft} 100%)`,
              borderRadius: T.r3, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              border: `1px dashed ${T.border}`, marginBottom: T.s4,
              position: "relative", overflow: "hidden",
            }}>
              {/* Decorative pattern */}
              <div style={{
                position: "absolute", inset: 0, opacity: 0.15,
                backgroundImage: `radial-gradient(${T.accent} 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }} />
              <div style={{ position: "relative", textAlign: "center", padding: T.s4 }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: T.white, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto", marginBottom: T.s2,
                  boxShadow: T.shadow1,
                }}>
                  <Icon name="users" size={28} color={T.accent} />
                </div>
                <p style={{
                  fontFamily: T.fontDisplay, fontSize: "20px",
                  color: T.text, marginBottom: "4px",
                }}>
                  Our Team
                </p>
                <p style={{ fontSize: "13px", color: T.textMuted }}>
                  Team Photo Coming Soon
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Centurion Solar attribution card */}
          <FadeIn delay={0.25}>
            <div style={{
              background: T.white, borderRadius: T.r3, padding: T.s3,
              border: `1px solid ${T.border}`,
            }}>
              <p style={{
                fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "uppercase", color: T.textLight,
                marginBottom: T.s2,
              }}>
                Our Execution Partner
              </p>
              <h3 style={{
                fontFamily: T.fontDisplay, fontSize: "20px",
                fontWeight: 400, marginBottom: T.s2,
              }}>
                Centurion Solar Energy, LLC
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  "NYSERDA Quality Platinum Status (2024)",
                  "10,000+ solar systems installed",
                  "BBB Accredited with A+ rating since 2013",
                  "55+ MW deployed across US & Mexico",
                  "Founded 2012 — 13+ years in operation",
                  "Licensed across NYC, Westchester, Rockland, CT, NJ, MA",
                  "NABCEP-certified professionals on every project",
                  "Master E1 electrician leadership",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <Icon name="check" size={14} color={T.accent} />
                    <span style={{ fontSize: "13px", color: T.textMuted, lineHeight: 1.5 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  </section>
);

// ════════════════════════════════════════════════════════════
// SECTION: CONTACT
// ════════════════════════════════════════════════════════════
const Contact = () => {
  const [formData, setFormData] = useState({ name: "", zip: "", phone: "", email: "", bill: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    /* ═══════════════════════════════════════════════════════
       FORM HANDLER — Connect to your backend
       
       Options:
       1. Supabase insert (recommended)
       2. Webhook to Airtable / HubSpot
       3. Email via Resend API
       
       Replace this with your actual submission logic.
       ═══════════════════════════════════════════════════════ */
    console.log("Form submission:", formData);
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px",
    fontFamily: T.fontBody, fontSize: "15px", color: T.text,
    background: T.white, border: `1.5px solid ${T.border}`,
    borderRadius: T.r2, outline: "none",
    transition: `border-color 0.2s ${T.ease}`,
  };

  return (
    <section id="contact" style={{
      ...sectionPad, background: T.bgAlt,
    }}>
      <div style={container}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: T.s7, alignItems: "start",
        }}>
          {/* Left: Copy */}
          <FadeIn>
            <div>
              <SectionLabel>Get Started</SectionLabel>
              <h2 style={{
                fontFamily: T.fontDisplay, fontSize: "clamp(28px, 3.5vw, 42px)",
                fontWeight: 400, lineHeight: 1.2, marginBottom: T.s2,
              }}>
                Let's talk about{" "}
                <span style={{ fontStyle: "italic", color: T.accent }}>your roof.</span>
              </h2>
              <p style={{ color: T.textMuted, marginBottom: T.s5, maxWidth: "440px", lineHeight: 1.8 }}>
                No commitment. No pressure. Just a conversation about whether solar makes
                sense for your home, your budget, and your goals.
              </p>

              {/* Trust nudges */}
              <div style={{ display: "flex", flexDirection: "column", gap: T.s2 }}>
                {[
                  { icon: "shield", text: "All permitting & installation handled by Centurion Solar Energy, LLC" },
                  { icon: "award", text: "NYSERDA Platinum-rated execution partner" },
                  { icon: "clock", text: "We typically respond within 2 business hours" },
                  { icon: "users", text: "Education first — no sales pressure, ever" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: T.s2 }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: T.r2,
                      background: T.accentSoft, display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon name={item.icon} size={16} color={T.accent} />
                    </div>
                    <span style={{ fontSize: "14px", color: T.textMuted }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right: Form */}
          <FadeIn delay={0.15}>
            <div style={{
              background: T.white, borderRadius: T.r3, padding: T.s4,
              border: `1px solid ${T.border}`, boxShadow: T.shadow2,
            }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: T.s5 }}>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: T.accentSoft, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    margin: "0 auto", marginBottom: T.s3,
                  }}>
                    <Icon name="check" size={28} color={T.accent} />
                  </div>
                  <h3 style={{
                    fontFamily: T.fontDisplay, fontSize: "24px", marginBottom: T.s1,
                  }}>
                    Thank you.
                  </h3>
                  <p style={{ color: T.textMuted, fontSize: "14px" }}>
                    I'll review your information and reach out within 2 business hours
                    to schedule your free consultation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{
                    fontFamily: T.fontDisplay, fontSize: "22px",
                    marginBottom: T.s3,
                  }}>
                    Schedule Your Free Consultation
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: T.s2 }}>
                    <div>
                      <label style={{
                        display: "block", fontSize: "13px", fontWeight: 500,
                        color: T.text, marginBottom: "6px",
                      }}>
                        Full Name *
                      </label>
                      <input type="text" required placeholder="Your name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = T.accent}
                        onBlur={e => e.target.style.borderColor = T.border} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: T.s2 }}>
                      <div>
                        <label style={{
                          display: "block", fontSize: "13px", fontWeight: 500,
                          color: T.text, marginBottom: "6px",
                        }}>
                          ZIP Code *
                        </label>
                        <input type="text" required placeholder="10001"
                          maxLength={5} pattern="[0-9]{5}"
                          value={formData.zip}
                          onChange={e => setFormData({ ...formData, zip: e.target.value })}
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = T.accent}
                          onBlur={e => e.target.style.borderColor = T.border} />
                      </div>
                      <div>
                        <label style={{
                          display: "block", fontSize: "13px", fontWeight: 500,
                          color: T.text, marginBottom: "6px",
                        }}>
                          Phone *
                        </label>
                        <input type="tel" required placeholder="(212) 555-0123"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = T.accent}
                          onBlur={e => e.target.style.borderColor = T.border} />
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: "block", fontSize: "13px", fontWeight: 500,
                        color: T.text, marginBottom: "6px",
                      }}>
                        Email *
                      </label>
                      <input type="email" required placeholder="you@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = T.accent}
                        onBlur={e => e.target.style.borderColor = T.border} />
                    </div>

                    <div>
                      <label style={{
                        display: "block", fontSize: "13px", fontWeight: 500,
                        color: T.text, marginBottom: "6px",
                      }}>
                        Average Monthly Electric Bill
                        <span style={{ fontWeight: 400, color: T.textLight }}> (optional)</span>
                      </label>
                      <input type="text" placeholder="$150"
                        value={formData.bill}
                        onChange={e => setFormData({ ...formData, bill: e.target.value })}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = T.accent}
                        onBlur={e => e.target.style.borderColor = T.border} />
                    </div>
                  </div>

                  <button type="submit" style={{
                    width: "100%", marginTop: T.s3, padding: "16px",
                    fontFamily: T.fontBody, fontSize: "15px", fontWeight: 600,
                    color: T.white, background: T.accent,
                    border: "none", borderRadius: T.r2, cursor: "pointer",
                    transition: `all 0.3s ${T.ease}`,
                    letterSpacing: "0.01em",
                  }}
                    onMouseEnter={e => {
                      e.target.style.background = T.accentHov;
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow = T.shadow2;
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = T.accent;
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}>
                    Schedule My Consultation
                  </button>

                  <p style={{
                    textAlign: "center", fontSize: "12px", color: T.textLight,
                    marginTop: T.s2, lineHeight: 1.6,
                  }}>
                    No spam. No obligation. Your information stays between us.
                  </p>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════
// SECTION: FAQ
// ════════════════════════════════════════════════════════════
const faqs = [
  {
    q: "Is the federal solar tax credit still available?",
    a: "The 30% federal residential tax credit (Section 25D) expired on December 31, 2025. However, lease and PPA arrangements may still benefit from business-level credits through 2027. NYC and NYS incentives remain strong — we'll walk you through what applies to your situation."
  },
  {
    q: "How long does the entire process take in NYC?",
    a: "Installation itself typically takes 1–3 days. The full project — from consultation to power-on — usually takes 3–6 months in NYC, primarily due to DOB permitting timelines. We're transparent about this because honest timelines build trust."
  },
  {
    q: "Who actually installs the panels?",
    a: "All installation, engineering, permitting, and utility coordination is performed by Centurion Solar Energy, LLC — a NYSERDA Platinum-rated installer with 10,000+ systems and 13+ years in business. Neighborhood Solar Experts handles your consultation, education, and project coordination."
  },
  {
    q: "Will solar increase my property taxes?",
    a: "New York State provides a 15-year property tax exemption for solar installations. In NYC, you may also qualify for a 30% property tax abatement on installation costs, spread over 4 years. So solar typically reduces your tax burden, not increases it."
  },
  {
    q: "Can I get solar on a flat roof?",
    a: "Yes. Ballasted racking systems are standard for NYC flat roofs. No roof penetrations are required in most cases. Our engineering team designs systems specifically for NYC roof types."
  },
  {
    q: "What happens if something breaks in year 5?",
    a: "Contact Neighborhood Solar Experts first. We coordinate with Centurion Solar's maintenance and monitoring team. Panels typically carry 25-year manufacturer warranties; inverters carry 12–25 year warranties depending on model. You'll always know who to call."
  },
  {
    q: "What is net metering and is it going away?",
    a: "Net metering lets you send excess solar energy to the grid in exchange for bill credits at the full retail rate. ConEd customers who go solar in 2026 can lock in 1-to-1 net metering for 20 years. The program is transitioning, so earlier adoption means better terms."
  },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section style={{ ...sectionPad, background: T.bg }}>
      <div style={{ ...container, maxWidth: "800px" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: T.s6 }}>
            <SectionLabel>Common Questions</SectionLabel>
            <h2 style={{
              fontFamily: T.fontDisplay, fontSize: "clamp(28px, 3.5vw, 38px)",
              fontWeight: 400, lineHeight: 1.2,
            }}>
              Honest answers to{" "}
              <span style={{ fontStyle: "italic", color: T.accent }}>real questions.</span>
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div style={{
                background: T.white, border: `1px solid ${T.border}`,
                borderRadius: T.r2, overflow: "hidden",
                transition: `box-shadow 0.2s ${T.ease}`,
              }}>
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  aria-expanded={openIdx === i}
                  style={{
                    width: "100%", padding: `${T.s2} ${T.s3}`,
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    fontFamily: T.fontBody, fontSize: "15px", fontWeight: 500,
                    color: T.text, textAlign: "left",
                  }}>
                  <span>{faq.q}</span>
                  <span style={{
                    transform: openIdx === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: `transform 0.3s ${T.ease}`, flexShrink: 0, marginLeft: T.s2,
                  }}>
                    <Icon name="chevDown" size={18} color={T.textMuted} />
                  </span>
                </button>
                <div style={{
                  maxHeight: openIdx === i ? "300px" : "0",
                  overflow: "hidden",
                  transition: `max-height 0.4s ${T.ease}`,
                }}>
                  <p style={{
                    padding: `0 ${T.s3} ${T.s3}`,
                    fontSize: "14px", color: T.textMuted, lineHeight: 1.8,
                  }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════
// SECTION: FOOTER
// ════════════════════════════════════════════════════════════
const Footer = () => (
  <footer style={{
    background: T.bgDark, color: T.white, padding: `${T.s8} 0 ${T.s4}`,
  }}>
    <div style={container}>
      {/* Trust strip in footer */}
      <TrustStrip dark />
      <p style={{
        textAlign: "center", fontSize: "11px", color: T.textLight,
        marginTop: T.s1, marginBottom: T.s6,
      }}>
        Installation &amp; permitting provided by Centurion Solar Energy, LLC
      </p>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: T.s5, paddingTop: T.s5,
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}>
        {/* Brand */}
        <div>
          <div style={{
            fontFamily: T.fontDisplay, fontSize: "20px", marginBottom: T.s2,
            display: "flex", alignItems: "center", gap: T.s1,
          }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: `linear-gradient(135deg, ${T.accent}, ${T.warm})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="sun" size={14} color={T.white} />
            </div>
            Neighborhood Solar Experts
          </div>
          <p style={{ fontSize: "13px", color: T.textLight, lineHeight: 1.7, maxWidth: "280px" }}>
            Your solar concierge for New York City. Education-first guidance,
            backed by the region's most experienced installation team.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textLight, marginBottom: T.s2 }}>
            Navigate
          </h4>
          {navLinks.map(link => (
            <a key={link.label} href={link.href} style={{
              display: "block", fontSize: "14px", color: "rgba(255,255,255,0.6)",
              marginBottom: "8px", textDecoration: "none",
            }}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Contact info */}
        <div>
          <h4 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textLight, marginBottom: T.s2 }}>
            Contact
          </h4>
          {/* ═══════════════════════════════════════════
             TODO: Replace with actual contact info
             ═══════════════════════════════════════════ */}
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
            New York City, NY<br />
            hello@neighborhoodsolarexperts.com<br />
            (212) 555-0100
          </p>
        </div>

        {/* Service area */}
        <div>
          <h4 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textLight, marginBottom: T.s2 }}>
            Service Area
          </h4>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
            Brooklyn · Queens · Bronx<br />
            Manhattan · Staten Island<br />
            Westchester · Rockland<br />
            Long Island · Connecticut
          </p>
        </div>
      </div>

      {/* Compliance footer */}
      <div style={{
        marginTop: T.s6, paddingTop: T.s3,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexWrap: "wrap", justifyContent: "space-between",
        alignItems: "flex-start", gap: T.s2,
      }}>
        <div>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.7, maxWidth: "600px" }}>
            Neighborhood Solar Experts operates as an independent solar associate and
            concierge service. All installation, engineering, permitting, and utility
            coordination services are provided by Centurion Solar Energy, LLC. NYSERDA
            Quality Platinum Status, contractor licenses, certifications, and installation
            history referenced on this site belong to Centurion Solar Energy, LLC and are
            used with attribution. Incentive information is based on publicly available data
            as of February 2026 and may change. Consult a tax professional for individual
            eligibility.
          </p>
        </div>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
          © {new Date().getFullYear()} Neighborhood Solar Experts. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

// ════════════════════════════════════════════════════════════
// APP ROOT
// ════════════════════════════════════════════════════════════
export default function App() {
  return (
    <>
      <GlobalStyles />
      <Nav />
      <main>
        <Hero />
        <IncentiveReality />
        <Services />
        <Process />
        <About />
        <Contact />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
