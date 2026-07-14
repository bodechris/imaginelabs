"use client";

import Link from "next/link";
import { useState } from "react";
import type { PlanId, ProgrammeConfig } from "../_lib/programmes";
import type { PricingContext } from "../_lib/pricing";
import BookingPanel from "./BookingPanel";
import BrandHeader, { Arrow } from "./BrandHeader";
import MotionLayer from "./MotionLayer";
import SiteFooter from "./SiteFooter";
import styles from "./programmes.module.css";

export default function ProgrammePage({
  programme,
  pricing,
}: {
  programme: ProgrammeConfig;
  pricing: PricingContext;
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("four");

  function openBooking(plan: PlanId = "four") {
    setSelectedPlan(plan);
    setBookingOpen(true);
  }

  return (
    <main className={`${styles.page} ${styles[`accent${capitalize(programme.accent)}`]}`}>
      <MotionLayer />
      <BrandHeader onBook={() => openBooking()} />

      <section className={styles.programmeHero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow} data-reveal>
            <span /> {programme.eyebrow}
          </div>
          <h1 data-reveal>
            {programme.heroWords.map((word, index) => (
              <span key={word} className={index === 1 ? styles.heroOutline : ""}>{word}</span>
            ))}
          </h1>
          <p className={styles.heroLead} data-reveal>{programme.summary}</p>
          <div className={styles.heroActions} data-reveal>
            <button className={styles.primaryButton} type="button" onClick={() => openBooking()}>
              Book this programme <Arrow />
            </button>
            <a href="#how-it-works" className={styles.secondaryLink}>See how it works <span>↓</span></a>
          </div>
          <div className={styles.heroMeta} data-reveal>
            <div><span>Who</span><strong>{programme.audience}</strong></div>
            <div><span>Format</span><strong>{programme.format}</strong></div>
            <div><span>Session</span><strong>{programme.sessionLength}</strong></div>
          </div>
        </div>

        <div className={styles.heroArtwork} data-reveal>
          <div className={styles.artHalo} />
          <div className={styles.artCardMain}>
            <div className={styles.artToolbar}><i /><i /><i /><span>imaginelabs / project</span></div>
            <div className={styles.artCanvas}>
              <div className={styles.artShapeOne} />
              <div className={styles.artShapeTwo} />
              <div className={styles.artShapeThree} />
              <div className={styles.artCode}>
                <span>01 / imagine</span>
                <span>02 / design</span>
                <span>03 / build</span>
              </div>
            </div>
          </div>
          <div className={styles.artSticker}>PROJECT<br />BASED</div>
          <div className={styles.artMiniCard}>
            <span>live online</span>
            <strong>small groups<br />real feedback</strong>
          </div>
        </div>
      </section>

      <section className={styles.promiseSection} id="how-it-works">
        <div className={styles.sectionIntro} data-reveal>
          <span className={styles.sectionKicker}>The Imaginelabs difference</span>
          <h2>{programme.promise}</h2>
        </div>
        <div className={styles.outcomeStrip} data-reveal>
          {programme.outcomes.map((outcome, index) => (
            <div key={outcome}><span>0{index + 1}</span><p>{outcome}</p></div>
          ))}
        </div>
      </section>

      <section className={styles.pillarsSection}>
        <div className={styles.stickyIntro} data-reveal>
          <span className={styles.sectionKicker}>What happens inside</span>
          <h2>Learning that becomes visible.</h2>
          <p>Each concept is introduced through a challenge, applied immediately and improved through feedback.</p>
        </div>
        <div className={styles.pillarList}>
          {programme.pillars.map((pillar) => (
            <article key={pillar.number} data-reveal>
              <span>{pillar.number}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.projectsSection}>
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionKicker}>Build something worth showing</span>
          <h2>Real outcomes, not classroom exercises.</h2>
        </div>
        <div className={styles.projectGrid}>
          {programme.projects.map((project, index) => (
            <article key={project.title} data-reveal>
              <div className={styles.projectVisual}>
                {project.image ? (
                  // Add the supplied image path to the programme data when final photography is ready.
                  <img src={project.image} alt={project.imageAlt} />
                ) : (
                  <div className={styles.projectPhotoPlaceholder} role="img" aria-label={project.imageAlt}>
                    <span>Photo placeholder</span>
                    <strong>{project.placeholder}</strong>
                    <small>Recommended: horizontal image, 1600 × 1100 px</small>
                  </div>
                )}
                <div className={styles.projectVisualOverlay}>
                  <span>{project.type}</span>
                  <strong>0{index + 1}</strong>
                </div>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.ageSection}>
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionKicker}>Age-appropriate pathways</span>
          <h2>One philosophy. Three different learning experiences.</h2>
        </div>
        <div className={styles.ageGrid}>
          {programme.ageTracks.map((track) => (
            <article key={track.ages} data-reveal>
              <div className={styles.ageTop}><span>{track.ages}</span><small>{track.name}</small></div>
              <p>{track.description}</p>
              <dl>
                <div><dt>Tools</dt><dd>{track.tools}</dd></div>
                <div><dt>Expected outcome</dt><dd>{track.outcome}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.onlineSection}>
        <div className={styles.onlineArtwork} data-reveal>
          <div className={styles.videoFrame}>
            <div className={styles.videoPerson}><span /></div>
            <div className={styles.videoShare}>
              <div />
              <p>Live project feedback</p>
            </div>
            <span className={styles.liveBadge}>● LIVE</span>
          </div>
        </div>
        <div className={styles.onlineCopy} data-reveal>
          <span className={styles.sectionKicker}>Online, not passive</span>
          <h2>Live guidance changes everything.</h2>
          <p>
            Children already learn from digital sources. Imaginelabs adds the missing layer: structure, supervision, feedback, accountability and a real project to finish.
          </p>
          <ul>
            <li>Small live cohorts with screen sharing</li>
            <li>Direct feedback while the child is building</li>
            <li>Age-appropriate tools and safeguarded AI use</li>
            <li>Parent progress updates and project showcases</li>
          </ul>
          {programme.id === "math-lab" && (
            <div className={styles.inPersonNote}>
              <strong>Prefer in-person maths?</strong>
              <span>Optional sessions are available around Sandton, Randburg, Fourways, Rosebank, Hyde Park and nearby areas, subject to schedule.</span>
            </div>
          )}
        </div>
      </section>

      <section className={styles.pricingSection} id="pricing">
        <div className={styles.priceIntro} data-reveal>
          <span className={styles.sectionKicker}>Monthly learning plans</span>
          <h2>A small commitment. A finished body of work.</h2>
          <p>
            Prices shown for <strong>{pricing.locationLabel}</strong>. Exchange rates are calculated on the server and rounded for clarity.
          </p>
        </div>
        <div className={styles.priceCards}>
          {pricing.options.map((option, index) => (
            <article key={option.planId} className={index === 1 ? styles.featuredPrice : ""} data-reveal>
              {index === 1 && <span className={styles.bestValue}>Best momentum</span>}
              <span>{option.sessions} sessions / month</span>
              <h3>{option.localFormatted}</h3>
              <p>{option.note}</p>
              <ul>
                <li>Live small-group teaching</li>
                <li>Project files and learning materials</li>
                <li>Feedback and progress summary</li>
                <li>Typing + digital fluency where relevant</li>
              </ul>
              <button type="button" onClick={() => openBooking(option.planId)}>
                Book this plan <Arrow />
              </button>
            </article>
          ))}
        </div>
        <div className={styles.priceFootnote} data-reveal>
          <span>Full payment reserves the monthly place.</span>
          <span>PayPal is processed in USD; South African families may choose FNB transfer.</span>
          <span>No separate PayPal surcharge is added.</span>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.faqIntro} data-reveal>
          <span className={styles.sectionKicker}>Parent questions</span>
          <h2>Clear before you commit.</h2>
        </div>
        <div className={styles.faqList}>
          {programme.faq.map((item) => (
            <details key={item.question} data-reveal>
              <summary>{item.question}<span>+</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
          <details data-reveal>
            <summary>Why is full payment required when booking?<span>+</span></summary>
            <p>Class capacity is intentionally small and each monthly project is planned around the enrolled learners. Full payment secures the place, reduces missed bookings and allows materials and group schedules to be prepared properly.</p>
          </details>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalMark} aria-hidden="true" />
        <div data-reveal>
          <span>One month can change how a child sees technology.</span>
          <h2>Let them make something real.</h2>
          <button type="button" onClick={() => openBooking()} className={styles.lightButton}>
            Book {programme.title} <Arrow />
          </button>
        </div>
        <Link href="/future-creators" className={styles.backLink}>Explore all programmes →</Link>
      </section>

      <SiteFooter />
      <BookingPanel
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        programme={programme}
        pricing={pricing}
        initialPlan={selectedPlan}
      />
    </main>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
