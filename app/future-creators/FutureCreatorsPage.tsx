"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type AgeGroup = "8-10" | "11-13" | "14-17";

const ageGroups: Record<
  AgeGroup,
  {
    name: string;
    eyebrow: string;
    description: string;
    skills: string[];
    project: string;
    tools: string;
    fluency: string;
  }
> = {
  "8-10": {
    name: "Young Explorers",
    eyebrow: "Imagine through play",
    description:
      "Children discover visual thinking, game logic, patterns and storytelling by creating colourful interactive experiences.",
    skills: [
      "Creative coding",
      "Colour + composition",
      "Logic + patterns",
      "Confident presenting",
    ],
    project: "An interactive game or digital story",
    tools: "Scratch, MakeCode, drawing and guided AI activities",
    fluency: "Letter keys, accuracy, simple shortcuts and confident saving",
  },
  "11-13": {
    name: "Digital Makers",
    eyebrow: "Turn ideas into products",
    description:
      "Students combine interface design, structured programming and mathematical reasoning to create polished games and websites.",
    skills: [
      "UI design",
      "Python foundations",
      "Web basics",
      "Testing + iteration",
    ],
    project: "A designed game or responsive website",
    tools: "Figma, Python, HTML, CSS and creative AI tools",
    fluency: "Touch typing, coding symbols, shortcuts and file organisation",
  },
  "14-17": {
    name: "Teen Innovators",
    eyebrow: "Build like a junior creator",
    description:
      "Teenagers work through a real digital-product process - from research and design systems to code, testing and presentation.",
    skills: [
      "Product thinking",
      "UI/UX",
      "Modern development",
      "Portfolio storytelling",
    ],
    project: "A web product or app prototype",
    tools: "Figma, JavaScript, React, Python, Unity and GitHub",
    fluency: "Efficient typing, developer shortcuts, folders and version habits",
  },
};

const tracks = [
  {
    number: "01",
    title: "Design + Coding",
    label: "Flagship studio",
    description:
      "Children learn to think visually before they code - then build games, websites and interactive products with purpose.",
    outcome: "Design it. Code it. Present it.",
    tone: "yellow",
  },
  {
    number: "02",
    title: "Design Lab",
    label: "Standalone pathway",
    description:
      "Colour, typography, composition, branding, storytelling and interface design taught through practical creative briefs.",
    outcome: "A growing visual portfolio.",
    tone: "pink",
  },
  {
    number: "03",
    title: "Maths Lab",
    label: "Standalone pathway",
    description:
      "Build stronger foundations through visual problem-solving, curriculum support and projects that make maths useful.",
    outcome: "Confidence that transfers to school.",
    tone: "blue",
  },
  {
    number: "04",
    title: "AI Creators",
    label: "Guided pathway",
    description:
      "Responsible AI literacy: thinking first, prompting clearly, checking answers and using AI to create - not replace effort.",
    outcome: "Future-ready judgement and creativity.",
    tone: "green",
  },
] as const;

const fluencySkills = [
  {
    number: "01",
    title: "Touch typing",
    text: "Correct finger placement, steady rhythm and accuracy before speed.",
  },
  {
    number: "02",
    title: "Coding keys",
    text: "Confidence with brackets, quotation marks, slashes and symbols used in code.",
  },
  {
    number: "03",
    title: "Smart shortcuts",
    text: "Copy, paste, undo, search, switch windows and navigate with less friction.",
  },
  {
    number: "04",
    title: "File confidence",
    text: "Create folders, name work clearly, save versions and find projects independently.",
  },
] as const;

const steps = [
  ["01", "Think", "Understand the challenge and generate original ideas."],
  [
    "02",
    "Design",
    "Sketch the experience and define how it should look and feel.",
  ],
  ["03", "Build", "Use code, maths and creative tools to make the idea work."],
  ["04", "Test", "Let someone use it, find problems and improve the solution."],
  ["05", "Show", "Present the finished work with confidence and pride."],
] as const;

const outcomes = [
  {
    title: "A playable game",
    text: "Designed from an original concept with rules, scoring, visual identity and working interactions.",
    meta: "Game design / coding / maths",
  },
  {
    title: "A useful website",
    text: "Planned for a real audience, arranged with clear visual hierarchy and built for different screens.",
    meta: "UI/UX / web / communication",
  },
  {
    title: "An AI-assisted tool",
    text: "Created with responsible prompting, fact-checking and a clear explanation of where human thinking matters.",
    meta: "AI literacy / product thinking",
  },
] as const;

const faqs = [
  [
    "Does my child need previous coding or design experience?",
    "No. The founding programme is designed to meet children at their current level. Learners are grouped by age, then supported according to confidence and experience.",
  ],
  [
    "Why combine design and coding?",
    "Because great technology starts before the first line of code. Design teaches children to understand people, organise ideas, communicate clearly and make deliberate choices. Coding then gives those ideas behaviour and life.",
  ],
  [
    "What will my child finish in four weeks?",
    "Every learner completes one age-appropriate digital project, documents part of the process and presents the result during the final showcase. Their parent summary also includes a snapshot of digital-fluency progress.",
  ],
  [
    "How are typing lessons included?",
    "Typing is built into the Design + Coding experience as a short, guided digital-fluency warm-up. Learners practise touch typing, coding symbols, useful shortcuts and confident file organisation. Accuracy and progress are observed without turning the class into a typing exam.",
  ],
  [
    "Can we take only Maths or Design?",
    "Yes. Design Lab and Maths Lab are standalone pathways. The first public intake is focused on the Design + Coding Challenge, while families can register interest in the additional labs.",
  ],
  [
    "Are classes online or physical?",
    "The founding programme is delivered as small physical classes in Randburg, Johannesburg. Each learner attends one two-hour session per week for four weeks.",
  ],
  [
    "Does my child need a laptop?",
    "A laptop is recommended for the older groups. Device requirements vary by age and project, so the exact setup will be confirmed before the first session.",
  ],
] as const;

const whatsappLink =
  "https://wa.me/27733110149?text=Hi%20imaginelabs%2C%20I%27d%20like%20to%20reserve%20a%20Future%20Creators%20founding%20place%20for%20my%20child.";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M4 10h11M11 5l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path
        d="M14 1.5c.9 7.4 5.1 11.6 12.5 12.5C19.1 14.9 14.9 19.1 14 26.5 13.1 19.1 8.9 14.9 1.5 14 8.9 13.1 13.1 8.9 14 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function FutureCreatorsPage() {
  const [activeAge, setActiveAge] = useState<AgeGroup>("8-10");
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const activeData = useMemo(() => ageGroups[activeAge], [activeAge]);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? (window.scrollY / height) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.dataset.visible = "true";
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.page}>
      <div
        className={styles.progress}
        style={{ transform: `scaleX(${progress / 100})` }}
      />

      <header className={styles.header}>
        <a className={styles.logo} href="#top" aria-label="imaginelabs home">
          <span className={styles.logoMark} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>imaginelabs</span>
        </a>
        <button
          className={styles.menuButton}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open: boolean) => !open)}
        >
          <span />
          <span />
        </button>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          <a href="#programme" onClick={() => setMenuOpen(false)}>
            Programme
          </a>
          <a href="#digital-fluency" onClick={() => setMenuOpen(false)}>
            Digital fluency
          </a>
          <a href="#age-groups" onClick={() => setMenuOpen(false)}>
            Age groups
          </a>
          <a href="#investment" onClick={() => setMenuOpen(false)}>
            Investment
          </a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>
            Questions
          </a>
        </nav>
        <a
          className={styles.headerCta}
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          Reserve a place <ArrowIcon />
        </a>
      </header>

      <section className={styles.hero} id="top">
        <div className={styles.heroNoise} aria-hidden="true" />
        <div className={styles.heroOrbOne} aria-hidden="true" />
        <div className={styles.heroOrbTwo} aria-hidden="true" />

        <div className={styles.heroCopy}>
          <div className={styles.eyebrow} data-reveal>
            <span className={styles.eyebrowDot} />
            20 founding places / Randburg
          </div>
          <h1 data-reveal>
            Design the future.
            <span>Then build it.</span>
          </h1>
          <p className={styles.heroLead} data-reveal>
            Project-based{" "}
            <strong>design, coding, maths and responsible AI</strong> for young
            creators aged 8-17.
          </p>
          <div className={styles.heroFluency} data-reveal>
            <span>Included in every flagship session</span>
            <strong>Typing + digital fluency</strong>
          </div>
          <div className={styles.heroActions} data-reveal>
            <a
              className={styles.primaryButton}
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
            >
              Reserve a founding place <ArrowIcon />
            </a>
            <a className={styles.textLink} href="#programme">
              Explore the programme <span>down</span>
            </a>
          </div>
          <div className={styles.heroFacts} data-reveal>
            <div>
              <strong>4</strong>
              <span>project weeks</span>
            </div>
            <div>
              <strong>8</strong>
              <span>guided hours</span>
            </div>
            <div>
              <strong>1</strong>
              <span>finished project</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual} data-reveal>
          <div className={styles.projectWindow}>
            <div className={styles.windowTop}>
              <div className={styles.windowDots}>
                <span />
                <span />
                <span />
              </div>
              <span>PROJECT_01 / SPACE DASH</span>
              <span>86%</span>
            </div>
            <div className={styles.projectCanvas}>
              <div className={styles.canvasGrid} />
              <div className={styles.planet} />
              <div className={styles.orbit} />
              <div className={styles.rocket}>
                <span />
              </div>
              <div className={styles.scoreCard}>
                <span>SCORE</span>
                <strong>0240</strong>
              </div>
              <div className={styles.mathChip}>x + 24 = 60</div>
              <div className={styles.designChip}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.typingChip}>
                <span>typing</span>
                <strong>accuracy first</strong>
              </div>
            </div>
            <div className={styles.windowBottom}>
              <div>
                <span>DESIGN SYSTEM</span>
                <strong>Electric Play</strong>
              </div>
              <div className={styles.codeSnippet}>
                <code>if (score &gt; target) launch();</code>
              </div>
            </div>
          </div>
          <div className={styles.floatingNoteOne}>
            <span>01</span>Think before you code.
          </div>
          <div className={styles.floatingNoteTwo}>
            <SparkIcon />
            Made by a young creator
          </div>
        </div>
      </section>

      <section className={styles.statement}>
        <div className={styles.sectionLabel} data-reveal>
          <span>Why imaginelabs</span>
          <span>01 / 08</span>
        </div>
        <div className={styles.statementGrid}>
          <h2 data-reveal>Not another coding class.</h2>
          <div className={styles.statementBody} data-reveal>
            <p>
              Most classes begin with syntax. We begin with an idea - and teach
              children how to make deliberate creative decisions before
              technology enters the room.
            </p>
            <p>
              Design becomes the bridge between imagination, mathematics and
              code. The result is deeper understanding and work children are
              genuinely proud to show.
            </p>
          </div>
        </div>
        <div
          className={styles.statementTicker}
          aria-label="Programme principles"
        >
          <span>Think visually</span>
          <i>*</i>
          <span>Solve confidently</span>
          <i>*</i>
          <span>Build independently</span>
          <i>*</i>
          <span>Present proudly</span>
          <i>*</i>
        </div>
      </section>

      <section className={styles.methodSection} id="programme">
        <div className={styles.sectionLabel} data-reveal>
          <span>The learning method</span>
          <span>02 / 08</span>
        </div>
        <div className={styles.methodHeader}>
          <h2 data-reveal>
            One idea.
            <br />
            Five creative moves.
          </h2>
          <p data-reveal>
            Every project follows a repeatable process that helps learners
            become thoughtful, independent creators - not tutorial followers.
          </p>
        </div>
        <div className={styles.steps}>
          {steps.map(([number, title, description]) => (
            <article key={title} className={styles.step} data-reveal>
              <span className={styles.stepNumber}>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className={styles.stepArrow}>-&gt;</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.fluencySection} id="digital-fluency">
        <div className={styles.sectionLabel} data-reveal>
          <span>Included digital fluency</span>
          <span>03 / 08</span>
        </div>
        <div className={styles.fluencyGrid}>
          <div className={styles.fluencyCopy}>
            <span className={styles.fluencyKicker} data-reveal>
              A practical advantage in every session
            </span>
            <h2 data-reveal>
              The keyboard should never
              <br />
              slow down the idea.
            </h2>
            <p data-reveal>
              Young creators often understand the concept but struggle to express
              it quickly on a computer. Every flagship class therefore begins
              with a short, guided typing and digital-skills warm-up.
            </p>
            <p data-reveal>
              It is not a separate theory lesson. Learners immediately use the
              same keys, shortcuts and file habits while designing and coding
              their project.
            </p>
          </div>

          <div className={styles.keyboardLab} data-reveal>
            <div className={styles.keyboardTop}>
              <span>DIGITAL_FLUENCY / INCLUDED</span>
              <span>PROGRESS TRACKED</span>
            </div>
            <div className={styles.keyboardScreen}>
              <span className={styles.cursorLine}>
                ideas.move<span>(</span>faster<span>)</span>
              </span>
              <div className={styles.fluencyReadout}>
                <span>ACCURACY BEFORE SPEED</span>
                <strong>⌨</strong>
              </div>
            </div>
            <div className={styles.keyboard} aria-hidden="true">
              <div>Q</div><div>W</div><div>E</div><div>R</div><div>T</div><div>Y</div><div>U</div><div>I</div><div>O</div><div>P</div>
              <div>A</div><div>S</div><div>D</div><div>F</div><div>G</div><div>H</div><div>J</div><div>K</div><div>L</div><div>;</div>
              <div className={styles.wideKey}>SHIFT</div><div>Z</div><div>X</div><div>C</div><div>V</div><div>B</div><div>N</div><div>M</div><div>ENTER</div>
              <div className={styles.spaceKey}>SPACE / CREATE / SAVE</div>
            </div>
          </div>
        </div>

        <div className={styles.fluencyList}>
          {fluencySkills.map((skill) => (
            <article key={skill.title} data-reveal>
              <span>{skill.number}</span>
              <h3>{skill.title}</h3>
              <p>{skill.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.tracksSection} id="pathways">
        <div className={styles.sectionLabel} data-reveal>
          <span>The learning universe</span>
          <span>04 / 08</span>
        </div>
        <div className={styles.tracksIntro}>
          <h2 data-reveal>
            Four pathways.
            <br />
            One fluent creator.
          </h2>
          <p data-reveal>
            Learners can enter through the flagship studio or take Design and
            Maths as standalone pathways. Typing and digital fluency strengthen
            every creative route rather than competing with them.
          </p>
        </div>
        <div className={styles.trackGrid}>
          {tracks.map((track) => (
            <article
              key={track.title}
              className={`${styles.trackCard} ${styles[track.tone]}`}
              data-reveal
            >
              <div className={styles.trackTop}>
                <span>{track.number}</span>
                <span>{track.label}</span>
              </div>
              <div className={styles.trackGraphic} aria-hidden="true">
                <span className={styles.shapeA} />
                <span className={styles.shapeB} />
                <span className={styles.shapeC} />
              </div>
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <strong>{track.outcome}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.ageSection} id="age-groups">
        <div className={styles.sectionLabel} data-reveal>
          <span>Built for every stage</span>
          <span>05 / 08</span>
        </div>
        <div className={styles.ageHeader}>
          <h2 data-reveal>
            Different ages.
            <br />
            The right challenge.
          </h2>
          <p data-reveal>
            Children are never placed in one broad 8-17 class. Each group
            receives age-appropriate tools, language, projects and expectations.
          </p>
        </div>
        <div className={styles.ageTabs} data-reveal>
          {(Object.keys(ageGroups) as AgeGroup[]).map((age) => (
            <button
              key={age}
              type="button"
              className={activeAge === age ? styles.activeAge : ""}
              onClick={() => setActiveAge(age)}
            >
              Ages {age}
            </button>
          ))}
        </div>
        <div className={styles.agePanel} data-reveal>
          <div className={styles.agePanelMain}>
            <span className={styles.ageEyebrow}>{activeData.eyebrow}</span>
            <h3>{activeData.name}</h3>
            <p>{activeData.description}</p>
            <div className={styles.skillList}>
              {activeData.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
          <div className={styles.agePanelSide}>
            <div>
              <span>FOUR-WEEK OUTCOME</span>
              <strong>{activeData.project}</strong>
            </div>
            <div>
              <span>TOOLS MAY INCLUDE</span>
              <strong>{activeData.tools}</strong>
            </div>
            <div>
              <span>DIGITAL FLUENCY</span>
              <strong>{activeData.fluency}</strong>
            </div>
            <div className={styles.ageNumber}>{activeAge}</div>
          </div>
        </div>
      </section>

      <section className={styles.outcomesSection}>
        <div className={styles.sectionLabel} data-reveal>
          <span>Proof, not promises</span>
          <span>06 / 08</span>
        </div>
        <div className={styles.outcomesHeader}>
          <h2 data-reveal>
            They leave with work
            <br />
            worth talking about.
          </h2>
          <p data-reveal>
            Every brief ends in a real outcome. No endless tutorials. No folder
            full of half-finished exercises.
          </p>
        </div>
        <div className={styles.outcomeGrid}>
          {outcomes.map((outcome, index) => (
            <article
              className={styles.outcomeCard}
              key={outcome.title}
              data-reveal
            >
              <div className={styles.outcomeVisual}>
                {index === 0 && (
                  <div className={styles.miniGame}>
                    <span />
                    <span />
                    <i />
                    <b>320</b>
                  </div>
                )}
                {index === 1 && (
                  <div className={styles.miniWeb}>
                    <span />
                    <strong />
                    <i />
                    <i />
                    <i />
                  </div>
                )}
                {index === 2 && (
                  <div className={styles.miniAi}>
                    <span>AI</span>
                    <i />
                    <i />
                    <i />
                  </div>
                )}
              </div>
              <span className={styles.outcomeMeta}>{outcome.meta}</span>
              <h3>{outcome.title}</h3>
              <p>{outcome.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.offerSection} id="investment">
        <div className={styles.sectionLabel} data-reveal>
          <span>The founding challenge</span>
          <span>07 / 08</span>
        </div>
        <div className={styles.offerGrid}>
          <div className={styles.offerCopy} data-reveal>
            <span className={styles.offerKicker}>
              FIRST INTAKE / 20 LEARNERS
            </span>
            <h2>
              Four weeks from
              <br />
              idea to launch.
            </h2>
            <p>
              One focused introduction to the imaginelabs way of learning. Your
              child will imagine, design, build, test and present an
              age-appropriate digital project.
            </p>
            <ul>
              <li>
                <span>01</span>Four weekly two-hour physical sessions
              </li>
              <li>
                <span>02</span>Small age-based groups of 6-8 learners
              </li>
              <li>
                <span>03</span>Typing + digital-fluency warm-up in every session
              </li>
              <li>
                <span>04</span>All guided design and coding project materials
              </li>
              <li>
                <span>05</span>Parent progress summary with a fluency snapshot
              </li>
              <li>
                <span>06</span>Final showcase, certificate + next-step pathway
              </li>
            </ul>
          </div>
          <div className={styles.priceCard} data-reveal>
            <div className={styles.priceTop}>
              <span>FOUNDING FEE</span>
              <span>RAND</span>
            </div>
            <div className={styles.price}>
              <sup>R</sup>2,250
            </div>
            <p>Once-off for the complete four-week challenge.</p>
            <div className={styles.deposit}>
              <span>Reserve today</span>
              <strong>R500</strong>
              <small>credited toward the full fee</small>
            </div>
            <a
              className={styles.priceButton}
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
            >
              Reserve via WhatsApp <ArrowIcon />
            </a>
            <span className={styles.priceFootnote}>
              Physical classes / Randburg, Johannesburg
            </span>
          </div>
        </div>
      </section>

      <section className={styles.founderSection}>
        <div className={styles.founderVisual} data-reveal>
          <div className={styles.founderMonogram}>BC</div>
          <div className={styles.founderBadge}>
            <SparkIcon />
            <span>
              20+ years
              <br />
              building digitally
            </span>
          </div>
        </div>
        <div className={styles.founderCopy} data-reveal>
          <span>Led by a working creative technologist</span>
          <h2>Professional thinking, translated for young minds.</h2>
          <p>
            imaginelabs is led by Bode Chris, a designer and software engineer
            with more than 20 years of experience across visual design, UI/UX,
            websites, applications, programming, animation and digital products.
          </p>
          <p>
            Children learn the same foundational habits used in real creative
            work: understand the problem, make clear choices, build carefully
            and explain the result.
          </p>
        </div>
      </section>

      <section className={styles.faqSection} id="faq">
        <div className={styles.sectionLabel} data-reveal>
          <span>Parent questions</span>
          <span>08 / 08</span>
        </div>
        <div className={styles.faqGrid}>
          <div className={styles.faqIntro} data-reveal>
            <h2>
              Good questions.
              <br />
              Clear answers.
            </h2>
            <p>
              Still unsure about fit? Start the conversation directly on
              WhatsApp.
            </p>
          </div>
          <div className={styles.faqList} data-reveal>
            {faqs.map(([question, answer], index) => (
              <details key={question} open={index === 0}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {question}
                  <i>+</i>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalOrb} aria-hidden="true" />
        <span data-reveal>FOUNDING COHORT / LIMITED TO 20</span>
        <h2 data-reveal>
          Give their ideas
          <br />
          somewhere to go.
        </h2>
        <p data-reveal>
          Help your child become a confident creator of technology - not only a
          consumer of it.
        </p>
        <a
          className={styles.finalButton}
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          data-reveal
        >
          Reserve a founding place <ArrowIcon />
        </a>
      </section>

      <footer className={styles.footer}>
        <a className={styles.logo} href="#top">
          <span className={styles.logoMark} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>imaginelabs</span>
        </a>
        <div className={styles.footerContact}>
          <a href="mailto:imaginelabs@bodilum.com">imaginelabs@bodilum.com</a>
          <a href={whatsappLink} target="_blank" rel="noreferrer">
            073 311 0149
          </a>
        </div>
        <div className={styles.footerMeta}>
          <span>Randburg, Johannesburg</span>
          <span>Future Creators / 2026</span>
        </div>
      </footer>
    </main>
  );
}
