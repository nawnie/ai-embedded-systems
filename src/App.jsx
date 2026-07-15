import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ChartBar,
  CheckCircle,
  Cpu,
  EnvelopeSimple,
  Factory,
  GithubLogo,
  Hospital,
  House,
  List,
  Lock,
  Robot,
  ShieldCheck,
  Target,
  TreeStructure,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import heroRobot from "./assets/hero-robot.png";

const navItems = [
  { label: "Sprint", href: "#sprint", id: "sprint" },
  { label: "Industries", href: "#industries", id: "industries" },
  { label: "Why us", href: "#about", id: "about" },
  { label: "Contact", href: "#contact", id: "contact" },
];

const consultationHref = `mailto:sohagan.dev@aiembeddedsystems.com?subject=${encodeURIComponent(
  "AI Embedded Systems consultation request",
)}&body=${encodeURIComponent(`Hi Shawn,

Organization:
Main challenge or opportunity:
Current systems or data involved:
Desired timeline:

Best,
`)}`;

const sprintHref = `mailto:sohagan.dev@aiembeddedsystems.com?subject=${encodeURIComponent(
  "Private AI Feasibility Sprint request",
)}&body=${encodeURIComponent(`Hi Shawn,

I am interested in the Private AI Feasibility Sprint.

Organization:
Main operational challenge:
Current systems or data involved:
Preferred kickoff timing:

Best,
`)}`;

const capabilities = [
  { label: "Private and secure by design", icon: ShieldCheck },
  { label: "Embedded systems and robotics", icon: Cpu },
  { label: "Local AI models and edge computing", icon: Lock },
  { label: "Strategy through implementation", icon: TreeStructure },
];

const sprintOutcomes = [
  { label: "Three high-value opportunities", icon: Target },
  { label: "ROI and difficulty ranking", icon: ChartBar },
  { label: "Prototype or technical demonstration", icon: Cpu },
  { label: "90-day implementation plan", icon: TreeStructure },
];

const sprintDeliverables = [
  "Discovery session",
  "Private AI and hardware assessment",
  "Data, security, and risk review",
  "ROI and difficulty ranking",
  "Prototype or workflow demonstration",
  "90-day implementation roadmap",
];

const industries = [
  {
    title: "Hospitality & Resorts",
    text: "Reduce operational friction, improve staff workflows, and support better guest experiences.",
    icon: House,
  },
  {
    title: "Manufacturing",
    text: "Explore quality control, predictive maintenance, and private production intelligence.",
    icon: Factory,
  },
  {
    title: "Property Management",
    text: "Automate maintenance triage, reporting, communication, and repetitive office work.",
    icon: House,
  },
  {
    title: "Robotics & Automation",
    text: "Connect embedded compute, sensing, local models, and control to physical-world systems.",
    icon: Robot,
  },
  {
    title: "Local Government",
    text: "Assess secure internal AI for public services, staff productivity, and operational planning.",
    icon: UsersThree,
  },
  {
    title: "Healthcare Operations",
    text: "Improve administrative workflows while keeping privacy, reliability, and human review central.",
    icon: Hospital,
  },
];

const reasons = [
  "AI and embedded systems expertise",
  "Private and secure by design",
  "Real-world operations experience",
  "Clear recommendations tied to value",
];

const founders = [
  {
    name: "Shawn O'Hagan",
    role: "Co-Founder, Software & AI",
    email: "sohagan.dev@aiembeddedsystems.com",
  },
  {
    name: "Robert Delgado",
    role: "Co-Founder, Robotics",
    email: "robert@aiembeddedsystems.com",
  },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!("IntersectionObserver" in window) || sections.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-24% 0px -64% 0px",
        threshold: [0.01, 0.2, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1241px)");
    const closeDesktopMenu = (event) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    desktopQuery.addEventListener("change", closeDesktopMenu);
    return () => desktopQuery.removeEventListener("change", closeDesktopMenu);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="AI Embedded Systems home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <span>愛</span>
          </span>
          <span className="brand-copy">
            <strong>AI EMBEDDED</strong>
            <span>SYSTEMS</span>
          </span>
        </a>

        <nav
          className={`nav-links${isMenuOpen ? " is-open" : ""}`}
          id="primary-navigation"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                className={isActive ? "is-active" : undefined}
                href={item.href}
                key={item.href}
                aria-current={isActive ? "location" : undefined}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            );
          })}
          <a className="button button-primary mobile-nav-cta" href={consultationHref} onClick={closeMenu}>
            Request a consultation
          </a>
        </nav>

        <a className="button button-primary header-button" href={consultationHref}>
          Request a consultation
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Private AI. Real-world impact.</p>
        <h1 id="hero-title">
          <span>AI &amp; embedded systems</span>
          <span>that solve real problems.</span>
        </h1>
        <p className="hero-summary">
          We help operations-heavy organizations design practical AI and embedded systems
          that protect sensitive data, reduce repetitive work, and create a credible path to deployment.
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href={consultationHref}>
            Request a consultation
            <ArrowRight size={17} weight="bold" aria-hidden="true" />
          </a>
          <a className="button button-secondary" href="#sprint">
            Explore the sprint
          </a>
        </div>

        <div className="capability-row" aria-label="Core capabilities">
          {capabilities.map(({ label, icon: Icon }) => (
            <div className="capability" key={label}>
              <Icon size={23} weight="regular" aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-image">
        <img
          src={heroRobot}
          alt="RNV1 embedded robotics platform"
          decoding="async"
          fetchPriority="high"
        />
        <div className="hero-image-caption">
          <span>Grounded in physical systems.</span>
          <strong>Private, local, practical.</strong>
        </div>
      </div>
    </section>
  );
}

function Sprint() {
  return (
    <section className="sprint-band" id="sprint" aria-labelledby="sprint-title">
      <div className="sprint-inner">
        <div className="sprint-copy">
          <p className="eyebrow">Start smart. Build with confidence.</p>
          <h2 id="sprint-title">Private AI Feasibility Sprint</h2>
          <p className="section-summary">
            A focused engagement to identify high-impact AI and automation opportunities,
            assess what is practical, and turn the strongest ideas into a clear implementation plan.
          </p>

          <div className="outcome-row" aria-label="Sprint outcomes">
            {sprintOutcomes.map(({ label, icon: Icon }) => (
              <div className="outcome" key={label}>
                <Icon size={22} weight="regular" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="sprint-card" aria-label="Private AI Feasibility Sprint pricing and scope">
          <div className="sprint-card-heading">
            <div>
              <span>Feasibility Sprint</span>
              <strong>$3,500</strong>
            </div>
            <span className="founding-note">Founding client pricing</span>
          </div>

          <ul>
            {sprintDeliverables.map((item) => (
              <li key={item}>
                <CheckCircle size={18} weight="regular" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <a className="button button-primary button-full" href={sprintHref}>
            Request your sprint
            <ArrowRight size={17} weight="bold" aria-hidden="true" />
          </a>
          <p className="payment-note">50% upfront, 50% at delivery. Scope confirmed before kickoff.</p>
        </aside>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section className="industries" id="industries" aria-labelledby="industries-title">
      <div className="section-heading">
        <p className="eyebrow">Industries we serve</p>
        <h2 id="industries-title">AI solutions built around your operation</h2>
        <p>
          The technology changes. The starting point does not: understand the workflow,
          the constraints, and the business value before building.
        </p>
      </div>

      <div className="industry-grid">
        {industries.map(({ title, text, icon: Icon }) => (
          <article className="industry-card" key={title}>
            <Icon size={38} weight="regular" aria-hidden="true" />
            <h3>{title}</h3>
            <p>{text}</p>
            <a href={consultationHref}>
              Discuss your use case
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-band" id="about" aria-labelledby="about-title">
      <div className="about-inner">
        <div className="about-copy">
          <p className="eyebrow eyebrow-light">Why work with us</p>
          <h2 id="about-title">Deep technical work, grounded in real operations.</h2>
          <p>
            We are not selling AI theater. We help teams find the work worth doing,
            understand the technical tradeoffs, and build a path people can actually use.
            Our RNV1 robotics development keeps that advice anchored to real hardware,
            real constraints, and real failure modes.
          </p>

          <div className="reason-grid">
            {reasons.map((reason) => (
              <div className="reason" key={reason}>
                <CheckCircle size={19} weight="regular" aria-hidden="true" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          <div className="founder-list" aria-label="Founders">
            {founders.map((founder) => (
              <article className="founder-card" key={founder.email}>
                <span>{founder.role}</span>
                <strong>{founder.name}</strong>
                <a href={`mailto:${founder.email}`}>{founder.email}</a>
              </article>
            ))}
          </div>
        </div>

        <aside className="contact-card" id="contact" aria-labelledby="contact-title">
          <p className="contact-kicker">Ready to get started?</p>
          <h3 id="contact-title">Tell us where the friction is.</h3>
          <p>
            We will help you separate useful opportunities from expensive distractions
            and identify a practical first move.
          </p>
          <a className="button button-cream button-full" href={consultationHref}>
            Request a consultation
            <ArrowRight size={17} weight="bold" aria-hidden="true" />
          </a>
          <a className="contact-line" href="mailto:sohagan.dev@aiembeddedsystems.com">
            <EnvelopeSimple size={18} aria-hidden="true" />
            <span>sohagan.dev@aiembeddedsystems.com</span>
          </a>
          <a className="contact-line" href="mailto:robert@aiembeddedsystems.com">
            <EnvelopeSimple size={18} aria-hidden="true" />
            <span>robert@aiembeddedsystems.com</span>
          </a>
        </aside>
      </div>
    </section>
  );
}

function FooterBanner() {
  return (
    <section className="footer-banner" aria-label="Private AI consultation call to action">
      <div>
        <ShieldCheck size={34} weight="regular" aria-hidden="true" />
        <span>
          <strong>Your data. Your systems. Your advantage.</strong>
          <small>Private AI solutions that keep you in control.</small>
        </span>
      </div>
      <a className="button button-outline-light" href={consultationHref}>
        Request a consultation
      </a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a className="brand" href="#top" aria-label="AI Embedded Systems home">
            <span className="brand-mark" aria-hidden="true">
              <span>愛</span>
            </span>
            <span className="brand-copy">
              <strong>AI EMBEDDED</strong>
              <span>SYSTEMS</span>
            </span>
          </a>
          <p>Secure, private AI and embedded systems for real-world operations.</p>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <a href="#sprint">Feasibility Sprint</a>
          <a href="#industries">Industries</a>
          <a href="#about">Why us</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-column">
          <h3>Technical work</h3>
          <a href="/rnv1-robotics/">RNV1 robotics</a>
          <a href="/embedded-ai-systems/">Embedded AI systems</a>
          <a href="/sensor-fusion/">Sensor fusion</a>
          <a href="/ros2-robotics/">ROS 2 robotics</a>
        </div>

        <div className="footer-column">
          <h3>Connect</h3>
          <a href="https://github.com/nawnie/ai-embedded-systems" target="_blank" rel="noreferrer">
            Public repository
          </a>
          <a href="https://github.com/nawnie" target="_blank" rel="noreferrer">
            <GithubLogo size={15} aria-hidden="true" />
            GitHub
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 AI Embedded Systems.</span>
        <span>Shawn O&apos;Hagan, Software &amp; AI · Robert Delgado, Robotics</span>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <Sprint />
        <Industries />
        <About />
        <FooterBanner />
      </main>
      <Footer />
    </>
  );
}

export default App;
