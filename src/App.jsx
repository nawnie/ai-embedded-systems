import React from "react";
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
  Lock,
  Robot,
  ShieldCheck,
  Target,
  TreeStructure,
  UsersThree,
} from "@phosphor-icons/react";
import heroRobot from "./assets/hero-robot.png";

const navItems = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Sprint", href: "#sprint" },
  { label: "Industries", href: "#industries" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const capabilities = [
  { label: "Private & secure by design", icon: ShieldCheck },
  { label: "Embedded systems & robotics", icon: Cpu },
  { label: "Local AI models & edge computing", icon: Lock },
  { label: "Strategy through implementation", icon: TreeStructure },
];

const sprintOutcomes = [
  { label: "3 high-value opportunities", icon: Target },
  { label: "ROI & difficulty ranking", icon: ChartBar },
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

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="AI Embedded Systems home">
          <span className="brand-mark" aria-hidden="true">
            <span>愛</span>
          </span>
          <span className="brand-copy">
            <strong>AI EMBEDDED</strong>
            <span>SYSTEMS</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item, index) => (
            <a className={index === 0 ? "active" : ""} href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="button button-primary header-button"
          href="mailto:sohagan.dev@aiembeddedsystems.com?subject=AI%20Embedded%20Systems%20Consultation"
        >
          Book a consultation
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">Private AI. Real-world impact.</p>
        <h1>AI &amp; embedded systems that solve real problems.</h1>
        <p className="hero-summary">
          We help organizations design secure, practical AI and embedded systems that
          automate operations, protect sensitive data, and create measurable results.
        </p>

        <div className="hero-actions">
          <a
            className="button button-primary"
            href="mailto:sohagan.dev@aiembeddedsystems.com?subject=AI%20Embedded%20Systems%20Consultation"
          >
            Book a consultation
            <ArrowRight size={17} weight="bold" />
          </a>
          <a className="button button-secondary" href="#services">
            Our services
          </a>
        </div>

        <div className="capability-row" aria-label="Core capabilities">
          {capabilities.map(({ label, icon: Icon }) => (
            <div className="capability" key={label}>
              <Icon size={23} weight="regular" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-image" aria-label="RNV1 robotics platform">
        <img src={heroRobot} alt="RNV1 embedded robotics platform" />
        <div className="hero-image-caption">
          <span>Built close to the hardware.</span>
          <strong>Private, local, practical.</strong>
        </div>
      </div>
    </section>
  );
}

function Sprint() {
  return (
    <section className="sprint-band" id="sprint">
      <div className="sprint-inner">
        <div className="sprint-copy">
          <p className="eyebrow">Start smart. Build with confidence.</p>
          <h2>Private AI Feasibility Sprint</h2>
          <p className="section-summary">
            A focused engagement to identify high-impact AI and automation opportunities,
            assess what is practical, and turn the strongest ideas into a clear plan.
          </p>

          <div className="outcome-row">
            {sprintOutcomes.map(({ label, icon: Icon }) => (
              <div className="outcome" key={label}>
                <Icon size={22} weight="regular" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="sprint-card" aria-label="Private AI Feasibility Sprint pricing">
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
                <CheckCircle size={18} weight="regular" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <a
            className="button button-primary button-full"
            href="mailto:sohagan.dev@aiembeddedsystems.com?subject=Private%20AI%20Feasibility%20Sprint"
          >
            Book your sprint
            <ArrowRight size={17} weight="bold" />
          </a>
          <p className="payment-note">50% upfront, 50% at delivery</p>
        </aside>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section className="industries" id="industries">
      <div className="section-heading">
        <p className="eyebrow">Industries we serve</p>
        <h2>AI solutions built around your operation</h2>
      </div>

      <div className="industry-grid">
        {industries.map(({ title, text, icon: Icon }) => (
          <article className="industry-card" key={title}>
            <Icon size={38} weight="regular" />
            <h3>{title}</h3>
            <p>{text}</p>
            <a href="#contact">
              Learn more
              <ArrowRight size={14} weight="bold" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-band" id="about">
      <div className="about-inner" id="services">
        <div className="about-copy">
          <p className="eyebrow eyebrow-light">Why work with us</p>
          <h2>Deep technical work, grounded in real operations.</h2>
          <p>
            We are not selling AI theater. We help teams find the work worth doing,
            understand the technical tradeoffs, and build a path that people can actually use.
          </p>

          <div className="reason-grid">
            {reasons.map((reason) => (
              <div className="reason" key={reason}>
                <CheckCircle size={19} weight="regular" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="contact-card" id="contact">
          <p className="contact-kicker">Ready to get started?</p>
          <h3>Tell us where the friction is.</h3>
          <p>
            We will help you sort useful opportunities from expensive distractions and
            identify a practical first move.
          </p>
          <a
            className="button button-cream button-full"
            href="mailto:sohagan.dev@aiembeddedsystems.com?subject=AI%20Embedded%20Systems%20Consultation"
          >
            Book a consultation
            <ArrowRight size={17} weight="bold" />
          </a>
          <a className="contact-line" href="mailto:sohagan.dev@aiembeddedsystems.com">
            <EnvelopeSimple size={18} />
            sohagan.dev@aiembeddedsystems.com
          </a>
          <a className="contact-line" href="mailto:robert@aiembeddedsystems.com">
            <EnvelopeSimple size={18} />
            robert@aiembeddedsystems.com
          </a>
        </aside>
      </div>
    </section>
  );
}

function FooterBanner() {
  return (
    <section className="footer-banner">
      <div>
        <ShieldCheck size={34} weight="regular" />
        <span>
          <strong>Your data. Your systems. Your advantage.</strong>
          <small>Private AI solutions that keep you in control.</small>
        </span>
      </div>
      <a
        className="button button-outline-light"
        href="mailto:sohagan.dev@aiembeddedsystems.com?subject=AI%20Embedded%20Systems%20Consultation"
      >
        Book a consultation
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
          <h3>Solutions</h3>
          <a href="#services">Private AI</a>
          <a href="#services">Embedded systems</a>
          <a href="#services">Robotics &amp; automation</a>
          <a href="#services">Edge computing</a>
        </div>

        <div className="footer-column">
          <h3>Company</h3>
          <a href="#about">About us</a>
          <a href="#sprint">Our process</a>
          <a href="#industries">Industries</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-column">
          <h3>Resources</h3>
          <a href="https://github.com/nawnie/ai-embedded-systems">Public repository</a>
          <a href="https://github.com/nawnie">
            <GithubLogo size={15} />
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
    <main>
      <Header />
      <Hero />
      <Sprint />
      <Industries />
      <About />
      <FooterBanner />
      <Footer />
    </main>
  );
}

export default App;
