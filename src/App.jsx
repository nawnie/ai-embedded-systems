import React from "react";
import {
  ArrowRight,
  Brain,
  ChatCircleText,
  Cpu,
  Cube,
  Database,
  EnvelopeSimple,
  Eye,
  GithubLogo,
  Lightning,
  Network,
  Radio,
  Robot,
  ShieldCheck,
} from "@phosphor-icons/react";
import heroRobot from "./assets/hero-robot.png";
import telemetryPanel from "./assets/telemetry-panel.png";
import stackDiagram from "./assets/stack-diagram.png";

const navItems = ["Technology", "Platform", "Roadmap", "Builders", "About", "Contact"];

const capabilityItems = [
  { label: "Sensor-driven perception", icon: Eye },
  { label: "Local AI", icon: Cpu },
  { label: "Robust control", icon: Cube },
  { label: "Real-world action", icon: Lightning },
];

const layers = [
  {
    name: "Applications",
    detail: "Behaviors, autonomy, teleop",
    system: "Missions · Apps · Interfaces",
    icon: Network,
  },
  {
    name: "AI & Reasoning",
    detail: "Perception, prediction, planning",
    system: "Atlas cognition · Local agents",
    icon: Brain,
  },
  {
    name: "Data & Memory",
    detail: "Maps, features, experience",
    system: "Vector DB · Graph Store · Logs",
    icon: Database,
  },
  {
    name: "Perception",
    detail: "Sensor fusion, SLAM, detection",
    system: "Aeshoryn Perception Stack",
    icon: Eye,
  },
  {
    name: "Platform",
    detail: "Compute, I/O, middleware",
    system: "Linux RT · ROS 2 · DDS · Drivers",
    icon: Cpu,
  },
  {
    name: "Hardware",
    detail: "Sensors, compute, power, actuators",
    system: "Rnv1 base · Modules",
    icon: Robot,
  },
];

const roadmap = [
  {
    date: "Q3 2026",
    title: "Rnv1 prototype build",
    items: ["Co-founder-led system architecture", "Sensor suite validation", "Rnv1 base platform"],
  },
  {
    date: "Q4 2026",
    title: "Perception V1",
    items: ["Aeshoryn perception stack", "Sensor fusion", "Local mapping & tracking"],
  },
  {
    date: "Q1 2027",
    title: "Local AI V1",
    items: ["Onboard inference", "Behavior primitives", "Memory & logging"],
  },
  {
    date: "Q2 2027",
    title: "Field testing",
    items: ["Outdoor trials", "Autonomy evaluation", "Reliability hardening"],
    warm: true,
  },
  {
    date: "Q3 2027+",
    title: "Partner pilots",
    items: ["Domain pilots", "Fleet tools", "Developer enablement"],
    warm: true,
  },
];

const focusAreas = [
  {
    title: "Rnv1 Robotics",
    href: "/rnv1-robotics/",
    text: "Prototype robotics platform work for perception, onboard compute, sensing, and field-ready control.",
  },
  {
    title: "Embedded AI Systems",
    href: "/embedded-ai-systems/",
    text: "Local AI architecture for systems that reason close to the sensors and keep core decisions onboard.",
  },
  {
    title: "Sensor Fusion",
    href: "/sensor-fusion/",
    text: "Multi-sensor perception pipelines for detection, mapping, tracking, and real-time awareness.",
  },
  {
    title: "Robotics Control",
    href: "/robotics-control/",
    text: "Reliable control layers that connect perception and planning to safe physical-world action.",
  },
  {
    title: "ROS 2 Robotics",
    href: "/ros2-robotics/",
    text: "Robot middleware, Linux RT, DDS, drivers, and integration paths for practical embedded platforms.",
  },
  {
    title: "AI Robotics Consulting",
    href: "/ai-robotics-consulting/",
    text: "Focused technical support for teams building robotics, edge AI, autonomy, and prototype systems.",
  },
];

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="(Ai)^愛 Embedded Systems home">
        <span className="brand-mark">(Ai)^愛</span>
        <span className="brand-name">Embedded Systems</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a href={`#${item.toLowerCase()}`} key={item}>
            {item}
          </a>
        ))}
      </nav>
      <a className="work-button" href="#contact">
        Work With Us
        <ArrowRight size={19} weight="bold" />
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <h1>
          Building intelligent robotics
          <br />
          that turn <span>real-world signals</span>
          <br />
          into <span>awareness, memory,</span>
          <br />
          and <span>action.</span>
        </h1>
        <div className="accent-line" />
        <p>
          We build Rnv1 robotics and embedded AI systems that perceive, reason, and act
          onboard, in real time. Our stack unifies sensors, local AI, and robust control
          to deliver physical-world intelligence you can trust.
        </p>
        <div className="capabilities">
          {capabilityItems.map(({ label, icon: Icon }) => (
            <div className="capability" key={label}>
              <Icon size={34} weight="light" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-machine" aria-label="Rnv1 robotics prototype visual">
        <pre className="code-card" aria-hidden="true">{`perceive() {
  sensors.fuse();
  tracks.update();
  map.build();
}

reason() {
  intent.predict();
  plan.optimize();
}

act() {
  ctrl.execute();
  health.monitor();
}`}</pre>
        <img className="robot-image" src={heroRobot} alt="Rnv1 rover robotics prototype" />
      </div>

      <div className="telemetry-frame" id="platform">
        <img
          src={telemetryPanel}
          alt="Sensor fusion, event stream, and control output telemetry"
        />
      </div>
    </section>
  );
}

function SignalStrip() {
  const signals = ["Built for the physical world", "Rnv1 robotics", "Aeshoryn", "Atlas", "Local AI", "Embedded", "Real-time"];
  return (
    <div className="signal-strip" aria-label="Platform keywords">
      {signals.map((signal, index) => (
        <span key={signal} className={index === 0 ? "signal-lead" : ""}>
          {index === 0 ? "// " : ""}
          {signal}
        </span>
      ))}
    </div>
  );
}

function MissionTechnology() {
  return (
    <section className="mission-tech" id="technology">
      <div className="mission-panel" id="about">
        <h2>Our Mission</h2>
        <div className="small-line" />
        <p>
          Create embedded systems that understand and adapt to the real world using
          onboard perception, local AI, and resilient control.
        </p>
        <ul>
          <li>Keep intelligence close to the sensors.</li>
          <li>Learn from experience. Remember what matters.</li>
          <li>Act safely, reliably, and purposefully.</li>
        </ul>
      </div>

      <div className="layers-panel">
        <h2>Technology Layers</h2>
        <div className="layer-table" role="table" aria-label="Technology layers">
          {layers.map(({ name, detail, system, icon: Icon }) => (
            <div className="layer-row" role="row" key={name}>
              <Icon size={24} weight="light" />
              <strong>{name}</strong>
              <span>{detail}</span>
              <span>{system}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stack-panel" aria-label="Platform stack diagram">
        <img src={stackDiagram} alt="Layered robotics platform architecture" />
      </div>
    </section>
  );
}

function FocusAreas() {
  return (
    <section className="focus-section" id="focus">
      <div className="focus-heading">
        <span>Focused Work</span>
        <h2>Robotics and embedded AI services</h2>
      </div>
      <div className="focus-grid">
        {focusAreas.map((area) => (
          <a className="focus-link" href={area.href} key={area.href}>
            <strong>{area.title}</strong>
            <p>{area.text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function RoadmapContact() {
  return (
    <section className="roadmap-contact">
      <div className="roadmap-panel" id="roadmap">
        <h2>Prototype Roadmap</h2>
        <div className="roadmap-line" aria-hidden="true" />
        <div className="roadmap-items">
          {roadmap.map((phase) => (
            <article className={`phase ${phase.warm ? "warm" : ""}`} key={phase.title}>
              <span className="phase-dot" />
              <span className="phase-date">{phase.date}</span>
              <h3>{phase.title}</h3>
              {phase.items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </article>
          ))}
        </div>
      </div>

      <aside className="contact-panel" id="contact">
        <h2>Work With Us</h2>
        <p>
          We collaborate with builders, researchers, and organizations pushing the
          frontier of embedded intelligence.
        </p>
        <div className="builder-list" id="builders">
          <div>
            <span>Co-Founder, Software & AI</span>
            <strong>Shawn O&apos;Hagan</strong>
          </div>
          <div>
            <span>Co-Founder, Robotics</span>
            <strong>Robert Delgado</strong>
          </div>
        </div>
        <a className="contact-link" href="mailto:sohagan.dev@aiembeddedsystems.com">
          <EnvelopeSimple size={18} />
          sohagan.dev@aiembeddedsystems.com
        </a>
        <a className="contact-link" href="mailto:robert@aiembeddedsystems.com">
          <EnvelopeSimple size={18} />
          robert@aiembeddedsystems.com
        </a>
        <a className="contact-link" href="https://github.com/nawnie">
          <GithubLogo size={18} />
          github.com/nawnie
        </a>
        <div className="contact-link muted">
          <ChatCircleText size={18} />
          Let&apos;s build what&apos;s next together.
        </div>
      </aside>
    </section>
  );
}

function App() {
  return (
    <main>
      <Header />
      <Hero />
      <SignalStrip />
      <MissionTechnology />
      <FocusAreas />
      <RoadmapContact />
    </main>
  );
}

export default App;
