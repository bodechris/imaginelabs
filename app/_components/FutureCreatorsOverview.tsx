"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProgrammeConfig } from "../_lib/programmes";
import type { PricingContext } from "../_lib/pricing";
import BrandHeader, { Arrow } from "./BrandHeader";
import MotionLayer from "./MotionLayer";
import SiteFooter from "./SiteFooter";
import styles from "./programmes.module.css";

type ProgrammeWithPrice = {
  programme: ProgrammeConfig;
  pricing: PricingContext;
};

export default function FutureCreatorsOverview({
  items,
}: {
  items: ProgrammeWithPrice[];
}) {
  return (
    <main className={`${styles.page} ${styles.overviewPage}`}>
      <MotionLayer />
      <BrandHeader />

      <section className={styles.overviewHeroV2}>
        <div className={styles.overviewHeroCopyV2}>
          <div className={styles.eyebrow} data-reveal>
            <span /> Live creative technology programmes · Ages 8–17
          </div>
          <h1 data-reveal>
            Give them the confidence to
            <em>create the future.</em>
          </h1>
          <p data-reveal>
            Design-led online classes where children turn ideas into games,
            websites, visual systems and responsible AI projects—with live
            guidance and work they can proudly show.
          </p>
          <div className={styles.heroActions} data-reveal>
            <Link href="#programmes" className={styles.primaryButton}>
              Explore all programmes <Arrow />
            </Link>
            <Link
              href="/future-creators/design-coding"
              className={styles.secondaryLink}
            >
              Start with Design + Coding <span>→</span>
            </Link>
          </div>
          <div className={styles.heroProofV2} data-reveal>
            <div><strong>Live</strong><span>small online cohorts</span></div>
            <div><strong>Project-led</strong><span>something real every cycle</span></div>
            <div><strong>Design-first</strong><span>thinking before tools</span></div>
          </div>
        </div>

        <div className={styles.heroStudioV2} data-reveal aria-label="A visual example of a student creative technology workspace">
          <div className={styles.heroStudioGlow} />
          <div className={styles.heroStudioWindow}>
            <div className={styles.studioToolbar}>
              <div><i /><i /><i /></div>
              <span>future-creators / project-04</span>
              <b>LIVE</b>
            </div>
            <div className={styles.studioWorkspace}>
              <aside className={styles.studioSidebar}>
                <span>LAYERS</span>
                <i className={styles.layerActive} />
                <i />
                <i />
                <i />
              </aside>
              <div className={styles.studioCanvas}>
                <span className={styles.canvasLabel}>INTERACTIVE SCIENCE QUEST</span>
                <div className={styles.canvasCard}>
                  <small>LEVEL 02</small>
                  <strong>Build a world<br />that reacts.</strong>
                  <div className={styles.canvasControls}>
                    <span>PLAY</span><span>TEST</span>
                  </div>
                </div>
                <div className={styles.canvasOrb} />
                <div className={styles.canvasGrid} />
              </div>
              <aside className={styles.studioCode}>
                <span>PROJECT.JS</span>
                <code><b>const</b> idea = <i>"curiosity"</i>;</code>
                <code><b>function</b> buildWorld() {'{'}</code>
                <code>&nbsp;&nbsp;design();</code>
                <code>&nbsp;&nbsp;code();</code>
                <code>&nbsp;&nbsp;test();</code>
                <code>{'}'}</code>
              </aside>
            </div>
          </div>
          <div className={styles.studioNoteOne}>
            <span>01</span><strong>DESIGN</strong><small>Make choices intentionally</small>
          </div>
          <div className={styles.studioNoteTwo}>
            <span>02</span><strong>BUILD</strong><small>Turn thinking into a working project</small>
          </div>
        </div>

        <div className={styles.overviewHeroFooterV2} data-reveal>
          <span>South Africa + Nigeria</span>
          <span>Online-first</span>
          <span>Math Lab also offers selected in-person sessions</span>
        </div>
      </section>

      <section className={styles.manifestoSection}>
        <div data-reveal>
          <span className={styles.sectionKicker}>The Imaginelabs difference</span>
          <h2>Design is how children learn to think before they build.</h2>
        </div>
        <div data-reveal>
          <p>
            Students do not jump straight into software or syntax. They first
            understand the problem, explore ideas, organise information and make
            visual choices. Code, maths and AI then become tools for bringing a
            thoughtful idea to life.
          </p>
          <div className={styles.manifestoSteps}>
            <span>01 Understand</span>
            <span>02 Imagine</span>
            <span>03 Design</span>
            <span>04 Build</span>
            <span>05 Test</span>
            <span>06 Present</span>
          </div>
        </div>
      </section>

      <section className={styles.programmeOverviewSection} id="programmes">
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionKicker}>Four focused programmes</span>
          <h2>Different starting points. One future-ready foundation.</h2>
        </div>
        <div className={styles.programmeOverviewGrid}>
          {items.map(({ programme, pricing }, index) => (
            <Link
              href={programme.slug}
              key={programme.id}
              className={`${styles.programmeOverviewCard} ${styles[`card${programme.accent.charAt(0).toUpperCase()}${programme.accent.slice(1)}`]}`}
              data-reveal
            >
              <div className={styles.programmeCardTop}>
                <span>0{index + 1}</span>
                <small>{programme.eyebrow}</small>
              </div>
              <h3>{programme.title}</h3>
              <p>{programme.summary}</p>
              <div className={styles.programmeCardMeta}>
                <span>From {pricing.options[0].localFormatted} / month</span>
                <strong>Explore <Arrow /></strong>
              </div>
              <div className={styles.programmeCardShape} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.flagshipSectionV2}>
        <div className={styles.flagshipCopyV2} data-reveal>
          <span className={styles.sectionKicker}>The flagship · Start here</span>
          <h2>One programme. Four abilities that compound.</h2>
          <p>
            Design + Coding is the most complete starting point. Learners plan
            interfaces, build games and websites, use AI responsibly and develop
            the digital fluency needed to work independently.
          </p>
          <div className={styles.flagshipSkillsV2}>
            <div><span>01</span><strong>Design</strong><small>Visual thinking, UI and communication</small></div>
            <div><span>02</span><strong>Code</strong><small>Games, web, Python and product logic</small></div>
            <div><span>03</span><strong>AI</strong><small>Research, creation, verification and ethics</small></div>
            <div><span>04</span><strong>Fluency</strong><small>Typing, files, shortcuts and presentation</small></div>
          </div>
          <Link href="/future-creators/design-coding" className={styles.lightButton}>
            Explore Design + Coding <Arrow />
          </Link>
        </div>

        <div className={styles.flagshipVisualV2} data-reveal>
          <div className={styles.flagshipProjectTop}>
            <span>MONTHLY PROJECT</span><strong>04 / 08</strong>
          </div>
          <div className={styles.flagshipProjectBody}>
            <div className={styles.flagshipProjectTitle}>
              <small>PROJECT BRIEF</small>
              <h3>Design and build a smarter study companion.</h3>
            </div>
            <div className={styles.flagshipProjectPreview}>
              <div className={styles.previewNav}><span>focus.ai</span><i /><i /></div>
              <div className={styles.previewContent}>
                <span>Today’s focus</span>
                <strong>Fractions,<br />made visual.</strong>
                <button type="button">Start challenge →</button>
              </div>
              <div className={styles.previewMetric}><span>PROGRESS</span><strong>78%</strong></div>
            </div>
          </div>
          <div className={styles.flagshipProjectFooter}>
            <span>Brief</span><span>Research</span><span>Design</span><span>Build</span><span>Present</span>
          </div>
        </div>
      </section>

      <section className={styles.onlineFirstSection}>
        <div className={styles.onlineFirstIntro} data-reveal>
          <span className={styles.sectionKicker}>Online by design</span>
          <h2>Digital learning works when children are guided, challenged and seen.</h2>
        </div>
        <div className={styles.onlineFirstGrid}>
          <article data-reveal>
            <span>01</span>
            <h3>Live supervision</h3>
            <p>A teacher sees the learner&apos;s screen, asks questions and intervenes before confusion becomes frustration.</p>
          </article>
          <article data-reveal>
            <span>02</span>
            <h3>Small cohorts</h3>
            <p>Children learn socially, share ideas and receive direct feedback without disappearing inside a large online class.</p>
          </article>
          <article data-reveal>
            <span>03</span>
            <h3>Visible outcomes</h3>
            <p>Every cycle is organised around something tangible: a game, design, prototype, maths project or AI experiment.</p>
          </article>
          <article data-reveal>
            <span>04</span>
            <h3>Parent visibility</h3>
            <p>Parents see progress through project links, summaries, showcases and clear next-step recommendations.</p>
          </article>
        </div>
        <div className={styles.mathInPersonBanner} data-reveal>
          <div>
            <span>One thoughtful exception</span>
            <h3>Math Lab can also be taken in person.</h3>
          </div>
          <p>
            Optional in-person maths support is available around Sandton, Randburg,
            Fourways, Rosebank, Hyde Park and nearby areas, subject to scheduling.
          </p>
          <Link href="/future-creators/math-lab">See Math Lab <Arrow /></Link>
        </div>
      </section>

      <section className={styles.ageOverviewSection}>
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionKicker}>Three developmental stages</span>
          <h2>The challenge grows with the learner.</h2>
        </div>
        <div className={styles.ageOverviewRows}>
          <article data-reveal>
            <span>8–10</span>
            <h3>Explore through play</h3>
            <p>Visual thinking, interactive stories, game logic, patterns, confidence and foundational digital habits.</p>
          </article>
          <article data-reveal>
            <span>11–13</span>
            <h3>Turn ideas into projects</h3>
            <p>Structured design, Python, web basics, mathematical reasoning, research and guided AI creation.</p>
          </article>
          <article data-reveal>
            <span>14–17</span>
            <h3>Work like a junior creator</h3>
            <p>Professional tools, product thinking, deeper code, critique, collaboration, deployment and portfolio presentation.</p>
          </article>
        </div>
      </section>

      <section className={styles.overviewFinalCta}>
        <div data-reveal>
          <span>Not sure where to begin?</span>
          <h2>Start with Design + Coding.</h2>
          <p>It combines the broadest range of future-ready skills while still producing one clear, finished project at a time.</p>
          <Link href="/future-creators/design-coding#pricing" className={styles.lightButton}>
            View plans and pricing <Arrow />
          </Link>
        </div>
        <Image src="/images/logo-mark.svg" alt="" width={349} height={278} />
      </section>

      <SiteFooter />
    </main>
  );
}
