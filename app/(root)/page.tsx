"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PayPalStandardCheckoutButton from "../_components/PayPalStandardCheckoutButton";
import { trackBeginCheckout, trackGenerateLead } from "../_lib/tracking";

const whatsappNumber = "27733110149";
const classPrice = "R950";
const classDate = "Saturday, 1 August";
const classTime = "10:00 AM — 1:00 PM SAST";
const seatsRemaining = "Limited seats available!";

const bankDetails = {
  bank: "FNB",
  accountName: process.env.NEXT_PUBLIC_BODILUM_FNB_ACCOUNT_NAME || "Bodilum",
  accountNumber:
    process.env.NEXT_PUBLIC_BODILUM_FNB_ACCOUNT_NUMBER ||
    "Add FNB account number",
  accountType: process.env.NEXT_PUBLIC_BODILUM_FNB_ACCOUNT_TYPE || "Business",
  branchCode:
    process.env.NEXT_PUBLIC_BODILUM_FNB_BRANCH_CODE || "Add branch code",
};

const painPoints = [
  "Competitors are already using AI to reply faster, post more consistently and make better decisions.",
  "Customer messages are slipping through WhatsApp, Instagram and email because there is no simple response system.",
  "Weak visuals, inconsistent captions and slow follow-ups make good businesses look less trustworthy than they are.",
  "You are leaving time, leads, reviews and repeat sales on the table by doing every small task manually.",
];

const aiUses = [
  "Create a 30-day content plan for your actual business.",
  "Write better customer replies without sounding robotic.",
  "Use design principles to create more polished AI-assisted brand images and illustrations.",
  "Turn messy notes into simple SOPs, checklists, lead trackers and review-request systems.",
];

const whoThisIsFor = [
  {
    title: "Small business owners",
    text: "You sell services or products and need practical AI systems for content, customer replies, follow-ups and everyday admin.",
  },
  {
    title: "Solo founders and lean teams",
    text: "You do not have a full marketing, sales or operations team, so you need AI to help you move faster without lowering quality.",
  },
  {
    title: "Service providers",
    text: "Coaches, consultants, beauty studios, repairers, creatives, tutors, agencies and local service businesses that rely on enquiries and trust.",
  },
  {
    title: "Businesses that use WhatsApp",
    text: "You speak to customers through WhatsApp, Instagram DM, email or phone and want better reply templates and follow-up systems.",
  },
];

const whoThisIsNotFor = [
  {
    title: "People looking for an AI engineering course",
    text: "This is not machine learning, coding, model training or a technical developer class.",
  },
  {
    title: "People who want passive theory",
    text: "This is a working sprint. You will write prompts, build templates and create assets for your actual business during the class.",
  },
  {
    title: "Businesses unwilling to use AI responsibly",
    text: "You still need judgement, privacy awareness and quality control. AI should assist your business, not fake expertise or mislead customers.",
  },
  {
    title: "Anyone expecting done-for-you implementation",
    text: "You leave with assets and a plan. Bodilum can help implement deeper systems separately, but the class itself is training plus guided creation.",
  },
];

const leaveWith = [
  {
    title: "Business AI Profile Prompt",
    text: "A reusable prompt customized to your business, audience, offers, tone and goals.",
  },
  {
    title: "30-Day Content Plan",
    text: "A full month of post ideas, WhatsApp Status ideas, captions and CTAs.",
  },
  {
    title: "10 Customer Reply Templates",
    text: "WhatsApp-ready replies for enquiries, pricing, objections, complaints and thank-you messages.",
  },
  {
    title: "3 Sales Follow-Ups",
    text: "Messages designed to convert warm leads, revive old enquiries and bring back past customers.",
  },
  {
    title: "1 Workflow / SOP",
    text: "A repeatable business process for enquiries, onboarding, complaints, content or follow-up.",
  },
  {
    title: "AI Tool Stack",
    text: "A simple recommended setup for writing, visuals, tracking, customer replies and admin.",
  },
  {
    title: "30-Day Action Plan",
    text: "What to do after the workshop so AI becomes part of your daily and weekly business routine.",
  },
  {
    title: "Bonus Prompt Pack",
    text: "Reusable prompts for content, replies, sales follow-up, planning, SOPs and weekly reviews.",
  },
  {
    title: "Lead Tracker",
    text: "A Google Sheets template to track enquiries, source, status, follow-up dates and notes.",
  },
  {
    title: "Certificate",
    text: "Attendance proof for completing the imaginelabs AI Business Sprint.",
  },
  {
    title: "5 On-Brand AI Images",
    text: "AI-generated content images or illustrations created using simple design principles and your brand direction.",
  },
  {
    title: "Review Request Setup",
    text: "A practical setup for sending customers your review link after a service, purchase or completed project.",
  },
];

const packageItems = [
  "3-hour live online workshop",
  "Business AI profile prompt",
  "30-day content plan",
  "10 WhatsApp-ready customer replies",
  "3 sales follow-up messages",
  "1 workflow / SOP",
  "AI tool stack",
  "30-day action plan",
  "Bonus prompt pack",
  "Lead tracker Google Sheet",
  "5 on-brand AI content images",
  "Review request setup",
  "Certificate of attendance",
  "7-day replay access",
];

const schedule = [
  ["10:00", "AI reality check + business profile prompt"],
  ["10:25", "30-day content plan + content angles"],
  ["10:55", "Design principles for better AI brand images"],
  ["11:30", "Customer replies, objections and sales follow-up"],
  ["12:05", "Workflow/SOP, lead tracker and review request setup"],
  ["12:40", "AI tool stack, 30-day action plan + Q&A"],
];

const testimonials = [
  {
    quote:
      "Bodilum helped us simplify our offer and communicate it clearly. The biggest shift was speed — we could plan content and respond to customers without starting from zero every day.",
    name: "Lerato M.",
    business: "Beauty studio owner, Johannesburg",
  },
  {
    quote:
      "The session made AI feel practical, not intimidating. We left with actual templates our team could use for enquiries, follow-ups and promotions.",
    name: "Thabo K.",
    business: "Local services business, Sandton",
  },
  {
    quote:
      "The value was in the structure. We finally had a clean way to turn messy ideas into content, workflows and client messages that sound like our brand.",
    name: "Amina O.",
    business: "Consulting founder, Lagos",
  },
];

const upsells = [
  {
    title: "Growth Systems",
    text: "Google Business Profile, review requests, social setup, reporting and monthly growth assets.",
    href: "https://www.bodilum.com/products/growth-systems",
  },
  {
    title: "Web Xperiences",
    text: "A conversion-focused one-page or 3–5 page website with premium motion and strong storytelling.",
    href: "https://www.bodilum.com/products/web-xperiences",
  },
  {
    title: "Design Direction",
    text: "A sharper brand direction, visual language and campaign system for a business ready to look premium.",
    href: "https://www.bodilum.com/products/design-directions",
  },
];

type PaymentMethod = "paypal" | "bank";
type PayPalStatus = "checking" | "available" | "unavailable";

type FormState = {
  firstName: string;
  lastName: string;
  companyName: string;
  businessType: string;
  jobTitle: string;
  workEmail: string;
  workPhone: string;
  country: string;
  city: string;
  websiteOrSocial: string;
  goal: string;
  consent: boolean;
  marketingConsent: boolean;
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  companyName: "",
  businessType: "",
  jobTitle: "",
  workEmail: "",
  workPhone: "",
  country: "South Africa",
  city: "",
  websiteOrSocial: "",
  goal: "",
  consent: false,
  marketingConsent: false,
};

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M4 10h11M11 5l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function Mark() {
  return (
    <div className="mark3d" aria-hidden="true">
      <span className="sun" />
      <span className="base" />
      <i className="piece one" />
      <i className="piece two" />
      <i className="piece three" />
      <i className="piece four" />
      <i className="piece five" />
    </div>
  );
}

export default function AiBusinessSprintPage() {
  const pageRef = useRef<HTMLElement | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal");
  const [paypalStatus, setPaypalStatus] = useState<PayPalStatus>("checking");
  const [paypalAmountUsd, setPaypalAmountUsd] = useState<number | null>(null);
  const [paypalClientId, setPaypalClientId] = useState("");
  const [paypalOrderId, setPaypalOrderId] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [reference, setReference] = useState("");
  const [submittedMethod, setSubmittedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadPaymentConfiguration() {
      try {
        const response = await fetch("/api/ai-business-sprint/config", {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          paypalConfigured?: boolean;
          paypalAmountUsd?: number;
          paypalClientId?: string | null;
        };

        if (!active) return;

        if (response.ok && data.paypalConfigured) {
          setPaypalStatus("available");
          setPaypalAmountUsd(
            typeof data.paypalAmountUsd === "number"
              ? data.paypalAmountUsd
              : null,
          );
          setPaypalClientId(data.paypalClientId || "");
          return;
        }

        setPaypalStatus("unavailable");
        setPaymentMethod("bank");
      } catch {
        if (!active) return;
        setPaypalStatus("unavailable");
        setPaymentMethod("bank");
      }
    }

    void loadPaymentConfiguration();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const page = pageRef.current;

    if (!page || prefersReducedMotion) {
      return;
    }

    const premiumEase = "cubic-bezier(0.16, 1, 0.3, 1)";

    const ctx = gsap.context(() => {
      gsap.set(
        [
          ".hero .brand",
          ".hero nav",
          ".heroCopy .eyebrow",
          ".heroCopy h1",
          ".heroLead",
          ".heroActions",
          ".heroCard",
        ],
        { autoAlpha: 0 },
      );

      const heroTl = gsap.timeline({ defaults: { ease: premiumEase } });

      heroTl
        .fromTo(
          ".heroRibbon",
          { autoAlpha: 0, scale: 0.82, rotate: "-=8deg" },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: "+=8deg",
            duration: 1.8,
            stagger: 0.08,
          },
          0,
        )
        .fromTo(
          ".ghostObject",
          { autoAlpha: 0, xPercent: 8, yPercent: 5, scale: 0.92 },
          {
            autoAlpha: 0.22,
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            duration: 1.6,
          },
          0.12,
        )
        .fromTo(
          ".hero .brand",
          { y: -24 },
          { autoAlpha: 1, y: 0, duration: 0.9 },
          0.18,
        )
        .fromTo(
          ".hero nav",
          { y: -18 },
          { autoAlpha: 1, y: 0, duration: 0.9 },
          0.24,
        )
        .fromTo(
          ".heroCopy .eyebrow",
          { y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.72 },
          0.36,
        )
        .fromTo(
          ".heroCopy h1",
          { y: 74, clipPath: "inset(0 0 100% 0)" },
          { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 1.16 },
          0.46,
        )
        .fromTo(
          ".heroLead",
          { y: 44 },
          { autoAlpha: 1, y: 0, duration: 0.96 },
          0.78,
        )
        .fromTo(
          ".heroActions",
          { y: 34 },
          { autoAlpha: 1, y: 0, duration: 0.92 },
          0.92,
        )
        .fromTo(
          ".heroCard",
          { x: 82, y: 36, rotate: 1.5 },
          { autoAlpha: 1, x: 0, y: 0, rotate: 0, duration: 1.18 },
          0.7,
        );

      const revealGroups = [
        { selector: ".sectionIntro", y: 64, stagger: 0.08, start: "top 84%" },
        { selector: ".splitGrid > *", y: 54, stagger: 0.12, start: "top 84%" },
        { selector: ".audienceCard", y: 54, stagger: 0.07, start: "top 88%" },
        { selector: ".notForCard", y: 54, stagger: 0.07, start: "top 88%" },
        { selector: ".outcomeCard", y: 54, stagger: 0.055, start: "top 88%" },
        { selector: ".priceCard", y: 66, stagger: 0, start: "top 84%" },
        { selector: ".packageItem", y: 38, stagger: 0.035, start: "top 88%" },
        { selector: ".wideCta", y: 38, stagger: 0, start: "top 90%" },
        {
          selector: ".scheduleList > div",
          y: 38,
          stagger: 0.06,
          start: "top 88%",
        },
        { selector: ".registrationCopy", y: 62, stagger: 0, start: "top 82%" },
        { selector: ".registrationForm", y: 62, stagger: 0, start: "top 82%" },
        { selector: ".testimonialShell", y: 64, stagger: 0, start: "top 84%" },
        { selector: ".upsellCard", y: 48, stagger: 0.075, start: "top 88%" },
        {
          selector: ".finalCta > img, .finalCta > h2, .finalCta > a",
          y: 44,
          stagger: 0.1,
          start: "top 86%",
        },
      ];

      revealGroups.forEach(({ selector, y, stagger, start }) => {
        const elements = gsap.utils.toArray<HTMLElement>(selector);

        if (!elements.length) return;

        gsap.set(elements, {
          autoAlpha: 0,
          y,
          willChange: "transform, opacity",
        });

        ScrollTrigger.batch(elements, {
          start,
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 1.05,
              stagger,
              ease: premiumEase,
              clearProps: "willChange,transform,opacity,visibility",
            });
          },
        });
      });

      gsap.utils
        .toArray<HTMLElement>(".darkPanel, .registrationCopy")
        .forEach((element) => {
          gsap.fromTo(
            element,
            { x: -38 },
            {
              x: 0,
              duration: 1.1,
              ease: premiumEase,
              scrollTrigger: {
                trigger: element,
                start: "top 84%",
                once: true,
              },
            },
          );
        });

      gsap.utils
        .toArray<HTMLElement>(".lightPanel, .registrationForm")
        .forEach((element) => {
          gsap.fromTo(
            element,
            { x: 38 },
            {
              x: 0,
              duration: 1.1,
              ease: premiumEase,
              scrollTrigger: {
                trigger: element,
                start: "top 84%",
                once: true,
              },
            },
          );
        });

      gsap.utils.toArray<HTMLElement>(".mark3d").forEach((mark) => {
        gsap.to(mark, {
          yPercent: -5,
          rotate: 1.4,
          ease: "none",
          scrollTrigger: {
            trigger: mark,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        });
      });

      gsap.utils
        .toArray<HTMLElement>(".heroRibbon, .heroGlow")
        .forEach((shape) => {
          gsap.to(shape, {
            yPercent: -9,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        });
    }, page);

    return () => ctx.revert();
  }, []);

  const whatsappLink = useMemo(() => {
    const message = [
      "Hi imaginelabs, I would like to register for the AI Business Sprint.",
      `Reference: ${reference || "Pending"}`,
      `Name: ${form.firstName} ${form.lastName}`.trim(),
      `Company: ${form.companyName}`,
      form.businessType ? `Business type: ${form.businessType}` : "",
      form.jobTitle ? `Role: ${form.jobTitle}` : "",
      `Email: ${form.workEmail}`,
      `Phone: ${form.workPhone}`,
      form.city || form.country
        ? `Location: ${[form.city, form.country].filter(Boolean).join(", ")}`
        : "",
      form.websiteOrSocial ? `Website / social: ${form.websiteOrSocial}` : "",
      `Payment: ${(submittedMethod || paymentMethod) === "paypal" ? "PayPal Standard Checkout" : "FNB bank deposit"}`,
      form.goal ? `Goal: ${form.goal}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [form, paymentMethod, reference, submittedMethod]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (paymentMethod === "paypal" && paypalStatus !== "available") {
      setFormMessage(
        paypalStatus === "checking"
          ? "PayPal configuration is still being checked. Please wait a moment."
          : "PayPal checkout is not configured yet. Select FNB deposit or add the PayPal credentials to .env.local and restart the server.",
      );
      return;
    }

    setSubmitting(true);
    setSubmitted(false);
    setSubmittedMethod(null);
    setReference("");
    setPaypalOrderId("");
    setFormMessage("");

    try {
      const response = await fetch("/api/ai-business-sprint/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, paymentMethod }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        reference?: string;
        paypalCheckoutMode?: string | null;
        paypalOrderId?: string | null;
        currency?: string;
        value?: number;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to submit registration.");
      }

      if (!data.reference) {
        throw new Error("The order reference could not be created.");
      }

      setReference(data.reference);
      setFormMessage(data.message || "Registration received.");

      trackGenerateLead({
        reference: data.reference,
        paymentMethod,
      });

      if (paymentMethod === "paypal") {
        if (
          data.paypalCheckoutMode !== "standard_paypal_button" ||
          !data.paypalOrderId
        ) {
          throw new Error(
            "PayPal Standard Checkout could not be prepared for this order.",
          );
        }

        const checkoutCurrency = data.currency || "USD";
        const checkoutValue = Number(data.value);

        if (!Number.isFinite(checkoutValue) || checkoutValue <= 0) {
          throw new Error("The PayPal checkout amount is invalid.");
        }

        trackBeginCheckout({
          orderId: data.paypalOrderId,
          reference: data.reference,
          currency: checkoutCurrency,
          value: checkoutValue,
        });

        setPaypalOrderId(data.paypalOrderId);
        setSubmittedMethod("paypal");
        setSubmitted(true);
        return;
      }

      setSubmittedMethod("bank");
      setSubmitted(true);
    } catch (error) {
      setFormMessage(
        error instanceof Error
          ? error.message
          : "Registration could not be submitted. Please try WhatsApp instead.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="aiPage" ref={pageRef}>
      <section className="hero" id="top">
        <div className="navBar">
          <Link href="/" className="brand" aria-label="imaginelabs home">
            <Image
              src="/images/logo-horizontal.svg"
              alt="imaginelabs"
              width={896}
              height={177}
              priority
              style={{ width: "100%", height: "auto" }}
            />
          </Link>
          <nav aria-label="Page navigation">
            <a href="#who">Who it's for</a>
            <a href="#outcomes">Outcomes</a>
            <a href="#price">Price</a>
            <a href="#register">Register</a>
          </nav>
        </div>

        <div className="heroGlow" aria-hidden="true" />
        <div className="heroRibbon heroRibbonOne" aria-hidden="true" />
        <div className="heroRibbon heroRibbonTwo" aria-hidden="true" />
        <div className="heroObject ghostObject" aria-hidden="true">
          <Mark />
        </div>

        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">
              Monthly online class · Limited seats available
            </p>
            <h1>
              Use AI to make your small business feel{" "}
              <span>unfairly prepared.</span>
            </h1>
            <p className="heroLead">
              A live, practical sprint where you leave with your AI profile
              prompt, 30-day content plan, customer reply templates, five
              on-brand AI images and a simple review-request setup.
            </p>
            <div className="heroActions">
              <a href="#register" className="primaryButton">
                Reserve a seat <Arrow />
              </a>
              <a href="#outcomes" className="secondaryButton">
                See what you leave with
              </a>
            </div>
          </div>

          <aside className="heroCard" aria-label="Class summary">
            <div className="cardTopline">
              <span>AI Business Sprint</span>
              <strong>{classPrice}</strong>
            </div>
            <div className="hero-image">
              <img
                src="/images/imaginelabs-hero-1.webp"
                alt="Smiling female business owner in her store"
              />
            </div>
            <div className="cardRows">
              <span>{classDate}</span>
              <span>{classTime}</span>
              <span>Live on Zoom / Google Meet</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section adversity" id="why">
        <div className="sectionIntro">
          <p className="eyebrow">Why this matters now</p>
          <h2>
            The businesses that learn AI early will move faster with smaller
            teams.
          </h2>
        </div>
        <div className="splitGrid">
          <div className="darkPanel">
            <h3>What happens if you ignore it?</h3>
            <div className="pointList">
              {painPoints.map((point) => (
                <p key={point}>{point}</p>
              ))}
            </div>
          </div>
          <div className="lightPanel">
            <h3>What AI can start doing with you</h3>
            <div className="pointList">
              {aiUses.map((point) => (
                <p key={point}>{point}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section audience" id="who">
        <div className="sectionIntro narrow">
          <p className="eyebrow">Who is this class for?</p>
          <h2>
            Built for owners who need practical AI inside the business now.
          </h2>
          <p>
            The sprint is for people who want usable outputs, not vague
            inspiration. You should come with your real business, real customers
            and real bottlenecks.
          </p>
        </div>
        <div className="audienceGrid">
          {whoThisIsFor.map((item, index) => (
            <article key={item.title} className="audienceCard">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section notAudience" id="not-for">
        <div className="sectionIntro narrow">
          {/* <p className="eyebrow">Who this class is not for</p> */}
          <h2>Who this class is not for</h2>
        </div>
        <div className="notForGrid">
          {whoThisIsNotFor.map((item) => (
            <article key={item.title} className="notForCard">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section outcomes" id="outcomes">
        <div className="sectionIntro narrow">
          <p className="eyebrow">Actual outcomes. Usable business assets</p>
          <h2>This is not a lecture. You leave with usable business assets.</h2>
        </div>
        <div className="outcomeGrid">
          {leaveWith.map((item, index) => (
            <article key={item.title} className="outcomeCard">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section package" id="price">
        <div className="priceCard">
          <div>
            <p className="eyebrow">Cost + what you get</p>
            <h2>One class. One price. Practical assets included.</h2>
            <p className="priceLead">
              The sprint is intentionally limited to 25 people so there is
              enough time for guided exercises, content image creation,
              review-link setup and questions.
            </p>
          </div>
          <div className="priceBlock">
            <span>Monthly class seat</span>
            <strong>{classPrice}</strong>
            <small>{seatsRemaining}</small>
          </div>
        </div>
        <div className="packageGrid">
          {packageItems.map((item) => (
            <div key={item} className="packageItem">
              <i />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <a href="#register" className="wideCta">
          Register for August 1 <Arrow />
        </a>
      </section>

      <section className="section schedule" id="schedule">
        <div className="sectionIntro">
          <p className="eyebrow">Next class</p>
          <h2>Saturday, 1 August · 10:00 AM — 1:00 PM SAST</h2>
          {/* <p>
            Recommended format: 3 hours. Two hours is enough for inspiration, but not enough for every participant to build their prompt profile, content ideas, customer replies and workflow plan.
          </p> */}
        </div>
        <div className="scheduleList">
          {schedule.map(([time, title]) => (
            <div key={time}>
              <span>{time}</span>
              <p>{title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section register" id="register">
        <div className="registrationCopy">
          <p className="eyebrow">Reserve your seat</p>
          <h2>
            Complete your details. We create the order reference securely.
          </h2>
          <p>
            Your reference is generated on the server after validation. Your
            class item and secure reference are attached to the PayPal order,
            then you continue to the same PayPal-hosted checkout flow used for
            Bodilum design-direction orders.
          </p>
          <div className="paymentNote">
            <strong>Order reference</strong>
            <span>{reference || "Generated after form submission"}</span>
          </div>
        </div>

        <form
          className="registrationForm"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="formGrid">
            <label>
              First name
              <input
                name="firstName"
                required
                value={form.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
                autoComplete="given-name"
              />
            </label>
            <label>
              Last name
              <input
                name="lastName"
                required
                value={form.lastName}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
                autoComplete="family-name"
              />
            </label>
            <label>
              Business name
              <input
                name="companyName"
                required
                value={form.companyName}
                onChange={(event) =>
                  updateField("companyName", event.target.value)
                }
                autoComplete="organization"
              />
            </label>
            <label>
              Business type
              <select
                name="businessType"
                required
                value={form.businessType}
                onChange={(event) =>
                  updateField("businessType", event.target.value)
                }
              >
                <option value="" disabled>
                  Select your business type
                </option>
                <option value="Beauty / wellness">Beauty / wellness</option>
                <option value="Retail / ecommerce">Retail / ecommerce</option>
                <option value="Food / hospitality">Food / hospitality</option>
                <option value="Professional services">
                  Professional services
                </option>
                <option value="Creative / agency">Creative / agency</option>
                <option value="Education / coaching">
                  Education / coaching
                </option>
                <option value="Repairs / local services">
                  Repairs / local services
                </option>
                <option value="Technology">Technology</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Your role / title (optional)
              <input
                name="jobTitle"
                value={form.jobTitle}
                onChange={(event) =>
                  updateField("jobTitle", event.target.value)
                }
                autoComplete="organization-title"
                placeholder="Owner, founder, manager..."
              />
            </label>
            <label>
              Work email
              <input
                name="workEmail"
                required
                type="email"
                value={form.workEmail}
                onChange={(event) =>
                  updateField("workEmail", event.target.value)
                }
                autoComplete="email"
              />
            </label>
            <label>
              Phone / WhatsApp
              <input
                name="workPhone"
                required
                type="tel"
                value={form.workPhone}
                onChange={(event) =>
                  updateField("workPhone", event.target.value)
                }
                autoComplete="tel"
                placeholder="Include country code"
              />
            </label>
            <label>
              Country
              <input
                name="country"
                required
                value={form.country}
                onChange={(event) => updateField("country", event.target.value)}
                autoComplete="country-name"
              />
            </label>
            <label>
              City
              <input
                name="city"
                required
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                autoComplete="address-level2"
              />
            </label>
            <label className="fullField">
              Website or social profile (optional)
              <input
                name="websiteOrSocial"
                value={form.websiteOrSocial}
                onChange={(event) =>
                  updateField("websiteOrSocial", event.target.value)
                }
                placeholder="Website, Instagram, Facebook or Google Business Profile link"
                inputMode="url"
              />
            </label>
            <label className="fullField">
              What do you want AI to help your business achieve?
              <textarea
                name="goal"
                required
                value={form.goal}
                onChange={(event) => updateField("goal", event.target.value)}
                placeholder="Example: reply faster to customers, create better brand content, generate on-brand images, send review links, improve admin, follow up with leads..."
              />
            </label>
          </div>

          <div
            className="paymentToggle"
            role="radiogroup"
            aria-label="Payment method"
          >
            <label
              className={[
                paymentMethod === "paypal" ? "active" : "",
                paypalStatus === "unavailable" ? "disabled" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "paypal"}
                disabled={hasHydrated && paypalStatus === "unavailable"}
                onChange={() => setPaymentMethod("paypal")}
              />
              <span>Pay securely with PayPal</span>
              <small>
                {paypalStatus === "checking"
                  ? "Checking PayPal configuration..."
                  : paypalStatus === "unavailable"
                    ? "Payment through PayPal is currently unavailable."
                    : `Pay through PayPal${paypalAmountUsd ? ` · USD $${paypalAmountUsd.toFixed(2)}` : ""}. PayPal opens its own secure checkout and may offer debit or credit card to eligible buyers.`}
              </small>
            </label>
            <label className={paymentMethod === "bank" ? "active" : ""}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "bank"}
                onChange={() => setPaymentMethod("bank")}
              />
              <span>FNB deposit</span>
              <small>
                Generate a unique reference for the {classPrice} bank transfer.
              </small>
            </label>
          </div>

          {paymentMethod === "bank" && (
            <div className="bankBox">
              <dl>
                <div>
                  <dt>Bank</dt>
                  <dd>{bankDetails.bank}</dd>
                </div>
                <div>
                  <dt>Account name</dt>
                  <dd>{bankDetails.accountName}</dd>
                </div>
                <div>
                  <dt>Account number</dt>
                  <dd>{bankDetails.accountNumber}</dd>
                </div>
                <div>
                  <dt>Account type</dt>
                  <dd>{bankDetails.accountType}</dd>
                </div>
                <div>
                  <dt>Branch code</dt>
                  <dd>{bankDetails.branchCode}</dd>
                </div>
                <div>
                  <dt>Reference</dt>
                  <dd>{reference || "Generated after submission"}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="consentGroup">
            <label className="consentRow">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) =>
                  updateField("consent", event.target.checked)
                }
                required
              />
              <span>
                I agree to be contacted about this registration, payment, class
                onboarding and attendance information.
              </span>
            </label>
            <label className="consentRow optional">
              <input
                type="checkbox"
                checked={form.marketingConsent}
                onChange={(event) =>
                  updateField("marketingConsent", event.target.checked)
                }
              />
              <span>
                Send me occasional practical AI and small-business updates.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="submitButton"
            disabled={
              !hasHydrated ||
              submitting ||
              submitted ||
              (paymentMethod === "paypal" && paypalStatus !== "available")
            }
          >
            {submitted
              ? "Order reference created"
              : submitting
                ? paymentMethod === "paypal"
                  ? "Preparing PayPal checkout..."
                  : "Generating reference..."
                : paymentMethod === "paypal"
                  ? "Create reference and continue to PayPal"
                  : "Generate bank payment reference"}{" "}
            <Arrow />
          </button>

          {formMessage && !submitted && (
            <div className="submittedBox" role="status">
              <strong>Registration note</strong>
              <p>{formMessage}</p>
            </div>
          )}

          {submitted && (
            <div className="submittedBox" role="status">
              <strong>
                {submittedMethod === "paypal"
                  ? "Your PayPal checkout is ready."
                  : "Your bank payment reference is ready."}
              </strong>
              <p>{formMessage}</p>
              <p className="referenceRepeat">{reference}</p>
              {submittedMethod === "paypal" &&
              paypalClientId &&
              paypalAmountUsd &&
              paypalOrderId ? (
                <PayPalStandardCheckoutButton
                  clientId={paypalClientId}
                  orderId={paypalOrderId}
                  amountUsd={paypalAmountUsd}
                  reference={reference}
                  customer={{
                    email: form.workEmail,
                    name: `${form.firstName} ${form.lastName}`.trim(),
                  }}
                />
              ) : null}
              <div className="submittedActions">
                {submittedMethod === "bank" ? (
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    Send details and proof on WhatsApp
                  </a>
                ) : null}
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  Ask a question on WhatsApp
                </a>
                <button
                  type="button"
                  className="resetOrder"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmittedMethod(null);
                    setReference("");
                    setPaypalOrderId("");
                    setFormMessage("");
                  }}
                >
                  Edit details / create a new order
                </button>
              </div>
            </div>
          )}
        </form>
      </section>

      <section className="section testimonials" id="testimonials">
        <div className="sectionIntro">
          <p className="eyebrow">Proof of approach</p>
          <h2>Built from practical business work, not AI hype.</h2>
        </div>
        <div className="testimonialShell">
          <blockquote>“{testimonials[activeTestimonial].quote}”</blockquote>
          <div className="testimonialMeta">
            <strong>{testimonials[activeTestimonial].name}</strong>
            <span>{testimonials[activeTestimonial].business}</span>
          </div>
          <div className="testimonialControls">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                className={activeTestimonial === index ? "active" : ""}
                aria-label={`Show testimonial ${index + 1}`}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section upsells" id="bodilum">
        <div className="sectionIntro narrow">
          <p className="eyebrow">After the class</p>
          <h2>
            Need implementation help? Bodilum can build the system around the
            skills.
          </h2>
        </div>
        <div className="upsellGrid">
          {upsells.map((item) => (
            <a key={item.title} href={item.href} className="upsellCard">
              <span>Bodilum</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <em>
                Explore <Arrow />
              </em>
            </a>
          ))}
        </div>
      </section>

      <section className="finalCta">
        <div className="final-cta-img">
          <Image
            src="/images/logo-horizontal.svg"
            alt="imaginelabs"
            width={896}
            height={177}
            className="finalCtaLogo"
          />
        </div>
        <h2>
          Come with your business. Leave with an AI toolkit, brand content
          assets and review system.
        </h2>
        <a href="#register" className="primaryButton">
          Reserve your seat <Arrow />
        </a>
      </section>

      <style>{`
        .aiPage {
          --purple-deep: #32145f;
          --purple: #582998;
          --lilac: #8b5fd3;
          --mint: #1feac1;
          --aqua: #51e6e3;
          --yellow: #ffe01b;
          --cream: #fffdf2;
          --ink: #15101e;
          --soft: rgba(255, 255, 255, 0.72);
          min-height: 100vh;
          overflow: hidden;
          background: var(--cream);
          color: var(--ink);
          font-family: var(--il-body, Arial, sans-serif);
        }

        .aiPage a,
        .aiPage button,
        .aiPage input,
        .aiPage textarea {
          font: inherit;
        }

        .aiPage svg {
          width: 1em;
          height: 1em;
        }

        .aiPage * {
          box-sizing: border-box;
        }

        @media (prefers-reduced-motion: reduce) {
          .aiPage *,
          .aiPage *::before,
          .aiPage *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }


        .hero {
          position: relative;
          min-height: 100svh;
          padding: 34px clamp(18px, 4vw, 72px) 72px;
          isolation: isolate;
          color: white;
          background:
            radial-gradient(circle at 92% 10%, rgba(139, 95, 211, 0.58), transparent 30%),
            radial-gradient(circle at 20% 80%, rgba(31, 234, 193, 0.18), transparent 34%),
            linear-gradient(135deg, #130a2a 0%, #32145f 44%, #582998 100%);
        }

        .navBar {
          position: relative;
          z-index: 5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .brand {
          display: inline-flex;
          width: clamp(132px, 12vw, 178px);
        }

        .navBar nav {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 9px 12px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(18px);
        }

        .navBar nav a {
          color: rgba(255, 255, 255, 0.76);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .heroGrid {
          position: relative;
          z-index: 2;
          min-height: calc(100svh - 120px);
          display: grid;
          grid-template-columns: minmax(0, 1.06fr) minmax(360px, 0.74fr);
          align-items: end;
          gap: clamp(30px, 5vw, 80px);
          padding-top: clamp(80px, 13vw, 170px);
        }

        .heroGlow,
        .heroRibbon,
        .ghostObject {
          position: absolute;
          pointer-events: none;
        }

        .heroGlow {
          inset: 0;
          z-index: -4;
          opacity: 0.42;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.12'/%3E%3C/svg%3E");
        }

        .heroRibbon {
          z-index: -2;
          border: clamp(42px, 6vw, 92px) solid rgba(81, 230, 227, 0.26);
          border-radius: 999px;
          filter: blur(0.2px);
          mix-blend-mode: screen;
        }

        .heroRibbonOne {
          width: 70vw;
          height: 34vw;
          right: -24vw;
          top: -5vw;
          transform: rotate(42deg);
        }

        .heroRibbonTwo {
          width: 72vw;
          height: 28vw;
          left: -28vw;
          bottom: 2vw;
          border-color: rgba(139, 95, 211, 0.38);
          transform: rotate(-18deg);
        }

        .ghostObject {
          right: 6vw;
          bottom: 15vh;
          z-index: -1;
          width: min(31vw, 440px);
          opacity: 0.22;
          filter: saturate(0.7);
        }

        .eyebrow {
          color: var(--mint);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin: 0;
        }

        .hero h1 {
          max-width: 980px;
          margin-top: 24px;
          font-family: var(--il-display, Arial, sans-serif);
          font-size: clamp(64px, 9.9vw, 158px);
          line-height: 0.86;
          letter-spacing: -0.08em;
          font-weight: 800;
          text-wrap: balance;
        }

        .hero h1 span {
          color: var(--yellow);
        }

        .heroLead {
          max-width: 670px;
          margin-top: 28px;
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 700;
          line-height: 1.32;
          letter-spacing: -0.035em;
        }

        .heroActions,
        .heroActions a,
        .primaryButton,
        .secondaryButton,
        .wideCta,
        .submitButton {
          display: flex;
          align-items: center;
        }

        .heroActions {
          margin-top: 40px;
          gap: 14px;
          flex-wrap: wrap;
        }

        .primaryButton,
        .secondaryButton,
        .wideCta,
        .submitButton {
          width: max-content;
          justify-content: center;
          gap: 12px;
          min-height: 54px;
          padding: 16px 24px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 900;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), background 0.28s ease;
        }

        .primaryButton,
        .wideCta,
        .submitButton {
          background: var(--yellow);
          color: var(--purple-deep);
        }

        .secondaryButton {
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.08);
        }

        .primaryButton:hover,
        .secondaryButton:hover,
        .wideCta:hover,
        .submitButton:hover {
          transform: translateY(-3px);
        }

        .heroCard {
          position: relative;
          overflow: hidden;
          min-height: 560px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 42px;
          padding: 28px;
          background: linear-gradient(150deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
          box-shadow: 0 50px 150px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(22px);

          .hero-image {
            width: 100%;
            height: auto;
            position: relative;
            overflow: hidden;
            border-radius: 20px;
          }
        }

        .cardTopline {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          color: rgba(255, 255, 255, 0.76);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .cardTopline strong {
          color: var(--yellow);
        }

        .cardMark {
          position: absolute;
          right: -11%;
          top: 16%;
          width: 86%;
        }

        .cardRows {
          position: absolute;
          left: 28px;
          right: 28px;
          bottom: 28px;
          display: grid;
          gap: 10px;
        }

        .cardRows span {
          padding: 16px 18px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 14px;
          font-weight: 900;
        }

        .mark3d {
          position: relative;
          width: 100%;
          aspect-ratio: 1.04;
          filter: drop-shadow(0 38px 38px rgba(0, 0, 0, 0.28));
        }

        .mark3d span,
        .mark3d i {
          position: absolute;
          display: block;
        }

        .mark3d .sun {
          z-index: 2;
          left: 32%;
          top: 22%;
          width: 42%;
          aspect-ratio: 1;
          border-radius: 50%;
          background:
            radial-gradient(circle at 32% 25%, rgba(255,255,255,.55), transparent 18%),
            linear-gradient(145deg, #ffef58 0%, #ffcf00 52%, #e39a00 100%);
          box-shadow: inset -12px -18px 28px rgba(102, 58, 0, 0.2), inset 10px 10px 18px rgba(255,255,255,.32);
        }

        .mark3d .base {
          z-index: 1;
          left: 16%;
          right: 6%;
          bottom: 18%;
          height: 36%;
          border-radius: 999px 999px 42px 42px;
          background:
            radial-gradient(circle at 30% 20%, rgba(255,255,255,.45), transparent 22%),
            linear-gradient(145deg, #56f1ec 0%, #20d8c0 48%, #0f958d 100%);
          box-shadow: inset -18px -22px 32px rgba(0, 68, 78, 0.26), inset 12px 16px 28px rgba(255,255,255,.26);
        }

        .piece {
          z-index: 3;
          border-radius: 30px;
          background: var(--yellow);
          box-shadow: inset -4px -5px 9px rgba(100, 48, 0, .2), inset 4px 4px 8px rgba(255,255,255,.42);
        }

        .piece.one {
          left: 25%;
          top: 20%;
          width: 9%;
          height: 9%;
          transform: rotate(42deg);
          background: white;
        }

        .piece.two {
          right: 21%;
          top: 14%;
          width: 5%;
          height: 20%;
        }

        .piece.three {
          left: 21%;
          top: 47%;
          width: 9%;
          height: 9%;
          transform: rotate(36deg);
          clip-path: polygon(50% 0, 100% 100%, 0 100%);
        }

        .piece.four {
          right: 12%;
          top: 35%;
          width: 11%;
          height: 7%;
          border-radius: 999px 999px 999px 12px;
          background: var(--aqua);
        }

        .piece.five {
          left: 18%;
          bottom: 31%;
          width: 13%;
          height: 5%;
          background: var(--mint);
        }

        .section {
          padding: clamp(78px, 10vw, 148px) clamp(18px, 4vw, 72px);
        }

        .sectionIntro {
          display: grid;
          grid-template-columns: minmax(160px, 0.35fr) minmax(0, 1fr);
          gap: clamp(22px, 6vw, 96px);
          align-items: start;
          margin-bottom: clamp(34px, 6vw, 72px);
        }

        .sectionIntro.narrow {
          max-width: 1080px;
          display: block;
        }

        .sectionIntro h2,
        .priceCard h2,
        .finalCta h2 {
          font-family: var(--il-display, Arial, sans-serif);
          font-size: clamp(44px, 7.4vw, 112px);
          line-height: 0.92;
          letter-spacing: -0.065em;
          font-weight: 800;
        }

        .sectionIntro p:not(.eyebrow) {
          max-width: 740px;
          margin-top: 24px;
          color: rgba(21, 16, 30, 0.66);
          font-size: 20px;
          font-weight: 700;
          line-height: 1.45;
          letter-spacing: -0.03em;
        }

        .splitGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .darkPanel,
        .lightPanel,
        .priceCard,
        .testimonialShell,
        .registrationForm,
        .registrationCopy,
        .upsellCard,
        .audienceCard,
        .notForCard,
        .outcomeCard {
          border-radius: clamp(24px, 3vw, 46px);
        }

        .darkPanel,
        .lightPanel {
          padding: clamp(28px, 4vw, 56px);
        }

        .darkPanel {
          color: white;
          background: var(--ink);
        }

        .lightPanel {
          background: #f4eee3;
        }

        .darkPanel h3,
        .lightPanel h3 {
          font-size: clamp(26px, 3vw, 44px);
          letter-spacing: -0.045em;
          margin-bottom: 32px;
        }

        .pointList {
          display: grid;
          gap: 12px;
        }

        .pointList p {
          padding: 18px 0;
          border-top: 1px solid currentColor;
          color: inherit;
          opacity: 0.78;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.34;
          letter-spacing: -0.03em;
        }

        .audience {
          background:
            radial-gradient(circle at 82% 20%, rgba(81, 230, 227, 0.18), transparent 28%),
            linear-gradient(180deg, #fffdf2 0%, #f6efe2 100%);
        }

        .audienceGrid,
        .notForGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .audienceCard,
        .notForCard {
          min-height: 280px;
          padding: clamp(24px, 3vw, 34px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(21, 16, 30, 0.1);
          background: rgba(255, 255, 255, 0.62);
          box-shadow: 0 32px 90px rgba(50, 20, 95, 0.08);
        }

        .audienceCard span {
          color: var(--mint);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.18em;
        }

        .audienceCard h3,
        .notForCard h3 {
          margin-top: auto;
          color: var(--purple-deep);
          font-size: clamp(24px, 2.4vw, 34px);
          line-height: 0.96;
          letter-spacing: -0.055em;
        }

        .audienceCard p,
        .notForCard p {
          margin-top: 18px;
          color: rgba(21, 16, 30, 0.7);
          font-size: 16px;
          font-weight: 800;
          line-height: 1.38;
          letter-spacing: -0.03em;
        }

        .notAudience {
          color: white;
          background:
            radial-gradient(circle at 88% 8%, rgba(139, 95, 211, 0.28), transparent 30%),
            linear-gradient(135deg, #15101e, #32145f 60%, #1b0b34);
        }

        .notAudience .sectionIntro h2,
        .notAudience .sectionIntro .eyebrow {
          color: white;
        }

        .notForCard {
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 34px 100px rgba(0, 0, 0, 0.18);
        }

        .notForCard h3 {
          color: white;
        }

        .notForCard p {
          color: rgba(255, 255, 255, 0.72);
        }

        .outcomes {
          color: white;
          background:
            radial-gradient(circle at 80% 10%, rgba(31, 234, 193, 0.18), transparent 28%),
            linear-gradient(135deg, #15101e, #32145f 55%, #1b0b34);
        }

        .outcomes .sectionIntro h2,
        .outcomes .sectionIntro .eyebrow {
          color: white;
        }

        .outcomeGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .outcomeCard {
          min-height: 260px;
          padding: 28px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.07);
        }

        .outcomeCard span {
          color: var(--yellow);
          font-weight: 900;
        }

        .outcomeCard h3 {
          margin-top: 48px;
          color: white;
          font-size: 26px;
          letter-spacing: -0.04em;
        }

        .outcomeCard p {
          margin-top: 12px;
          color: rgba(255, 255, 255, 0.68);
          font-weight: 700;
          line-height: 1.45;
          letter-spacing: -0.02em;
        }

        .package {
          background: var(--cream);
        }

        .priceCard {
          display: grid;
          grid-template-columns: 1fr minmax(260px, 360px);
          gap: 32px;
          padding: clamp(28px, 4vw, 56px);
          background: linear-gradient(135deg, #fff, #f4eee3);
          border: 1px solid rgba(21, 16, 30, 0.08);
        }

        .priceLead {
          max-width: 720px;
          margin-top: 22px;
          color: rgba(21, 16, 30, 0.64);
          font-size: 20px;
          font-weight: 700;
          line-height: 1.45;
        }

        .priceBlock {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px;
          border-radius: 32px;
          background: var(--purple-deep);
          color: white;
        }

        .priceBlock span,
        .priceBlock small {
          font-size: 14px;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.75);
        }

        .priceBlock strong {
          color: var(--yellow);
          font-family: var(--il-display, Arial, sans-serif);
          font-size: clamp(74px, 8vw, 118px);
          letter-spacing: -0.08em;
          line-height: 0.8;
        }

        .packageGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 16px;
        }

        .packageItem {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 86px;
          padding: 18px;
          border-radius: 22px;
          background: white;
          border: 1px solid rgba(21, 16, 30, 0.08);
          font-size: 15px;
          font-weight: 900;
          letter-spacing: -0.025em;
        }

        .packageItem i {
          flex: 0 0 auto;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--mint);
        }

        .wideCta {
          width: 100%;
          margin-top: 16px;
          min-height: 72px;
          border-radius: 24px;
        }

        .schedule {
          background: var(--yellow);
        }

        .schedule .eyebrow {
          color: var(--purple-deep);
        }

        .scheduleList {
          display: grid;
          border-top: 1px solid rgba(21, 16, 30, 0.22);
        }

        .scheduleList div {
          display: grid;
          grid-template-columns: 170px 1fr;
          gap: 24px;
          padding: 28px 0;
          border-bottom: 1px solid rgba(21, 16, 30, 0.22);
        }

        .scheduleList span,
        .scheduleList p {
          font-size: clamp(22px, 2.5vw, 34px);
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 1.05;
        }

        .scheduleList span {
          color: var(--purple);
        }

        .register {
          display: grid;
          grid-template-columns: 0.82fr 1.18fr;
          gap: 18px;
          background:
            radial-gradient(circle at 90% 0%, rgba(255, 224, 27, 0.16), transparent 34%),
            linear-gradient(135deg, #15101e, #32145f 60%, #582998);
          color: white;
        }

        .registrationCopy,
        .registrationForm {
          padding: clamp(26px, 4vw, 48px);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .registrationCopy h2 {
          margin-top: 18px;
          color: white;
          font-family: var(--il-display, Arial, sans-serif);
          font-size: clamp(44px, 6vw, 88px);
          line-height: 0.9;
          letter-spacing: -0.065em;
        }

        .registrationCopy p {
          margin-top: 24px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 18px;
          font-weight: 700;
          line-height: 1.5;
        }

        .paymentNote {
          margin-top: 28px;
          padding: 18px;
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.16);
        }

        .paymentNote strong,
        .paymentNote span {
          display: block;
        }

        .paymentNote strong {
          color: var(--mint);
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .paymentNote span {
          margin-top: 8px;
          color: white;
          font-weight: 900;
          word-break: break-word;
        }

        .formGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .registrationForm label {
          display: grid;
          gap: 8px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .fullField {
          grid-column: 1 / -1;
        }

        .registrationForm input,
        .registrationForm select,
        .registrationForm textarea {
          width: 100%;
          min-height: 52px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 16px;
          padding: 14px 15px;
          background: rgba(255, 255, 255, 0.08);
          color: white;
          outline: none;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .registrationForm textarea {
          min-height: 126px;
          resize: vertical;
        }

        .registrationForm select {
          appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, rgba(255, 255, 255, 0.74) 50%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.74) 50%, transparent 50%);
          background-position:
            calc(100% - 20px) 22px,
            calc(100% - 14px) 22px;
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
        }

        .registrationForm select option {
          background: #32145f;
          color: white;
        }

        .registrationForm input:focus,
        .registrationForm select:focus,
        .registrationForm textarea:focus {
          border-color: var(--mint);
        }

        .paymentToggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 18px;
        }

        .paymentToggle label {
          position: relative;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.06);
          cursor: pointer;
        }

        .paymentToggle label.active {
          border-color: var(--yellow);
          background: rgba(255, 224, 27, 0.12);
        }

        .paymentToggle label.disabled {
          cursor: not-allowed;
          opacity: 0.52;
        }

        .paymentToggle label.disabled span {
          text-decoration: line-through;
          text-decoration-thickness: 1px;
        }

        .paymentToggle input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .paymentToggle span,
        .paymentToggle small {
          display: block;
          text-transform: none;
        }

        .paymentToggle span {
          color: white;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -0.03em;
        }

        .paymentToggle small {
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.62);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .bankBox,
        .submittedBox {
          margin-top: 16px;
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.18);
          padding: 18px;
        }

        .bankBox dl {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .bankBox dt {
          color: var(--mint);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .bankBox dd {
          margin: 4px 0 0;
          color: white;
          font-weight: 900;
          word-break: break-word;
        }

        .consentGroup {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .registrationForm .consentRow {
          display: grid;
          grid-template-columns: 22px 1fr;
          align-items: start;
          gap: 10px;
          padding: 14px 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          cursor: pointer;
          text-transform: none;
        }

        .registrationForm .consentRow.optional {
          background: transparent;
        }

        .registrationForm .consentRow input {
          width: 20px;
          min-height: 20px;
          height: 20px;
          margin: 1px 0 0;
          padding: 0;
          accent-color: var(--yellow);
        }

        .registrationForm .consentRow span {
          color: rgba(255, 255, 255, 0.72);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0;
          line-height: 1.45;
        }

        .submitButton {
          width: 100%;
          margin-top: 18px;
          min-height: 64px;
          border: 0;
        }

        .submitButton:disabled {
          opacity: 0.62;
          cursor: wait;
          transform: none;
        }

        .submittedBox strong {
          color: white;
          font-size: 18px;
        }

        .submittedBox p {
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.68);
          font-weight: 700;
        }

        .submittedBox .referenceRepeat {
          color: var(--yellow);
          font-size: 20px;
          font-weight: 900;
          letter-spacing: 0.04em;
          word-break: break-word;
        }

        .submittedBox .submittedActions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .submittedBox .submittedActions a,
        .submittedBox .submittedActions button {
          padding: 12px 14px;
          border: 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font: inherit;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
        }

        .submittedBox .resetOrder {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: rgba(255, 255, 255, 0.72);
        }

        .testimonials {
          background: var(--cream);
        }

        .testimonialShell {
          padding: clamp(28px, 5vw, 72px);
          background: #15101e;
          color: white;
        }

        .testimonialShell blockquote {
          max-width: 1100px;
          font-family: var(--il-display, Arial, sans-serif);
          font-size: clamp(34px, 5.5vw, 86px);
          line-height: 0.98;
          letter-spacing: -0.06em;
          font-weight: 750;
        }

        .testimonialMeta {
          display: grid;
          gap: 4px;
          margin-top: 42px;
        }

        .testimonialMeta strong {
          color: var(--yellow);
          font-size: 20px;
        }

        .testimonialMeta span {
          color: rgba(255, 255, 255, 0.64);
          font-weight: 700;
        }

        .testimonialControls {
          display: flex;
          gap: 10px;
          margin-top: 32px;
        }

        .testimonialControls button {
          width: 44px;
          height: 8px;
          border: 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.2);
        }

        .testimonialControls button.active {
          background: var(--mint);
        }

        .upsells {
          background: #f4eee3;
        }

        .upsellGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .upsellCard {
          min-height: 340px;
          display: flex;
          flex-direction: column;
          padding: 28px;
          background: white;
          border: 1px solid rgba(21, 16, 30, 0.08);
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .upsellCard:hover {
          transform: translateY(-5px);
        }

        .upsellCard span {
          color: var(--purple);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .upsellCard h3 {
          margin-top: 48px;
          font-size: 34px;
          letter-spacing: -0.055em;
        }

        .upsellCard p {
          margin-top: 14px;
          color: rgba(21, 16, 30, 0.62);
          font-weight: 700;
          line-height: 1.5;
        }

        .upsellCard em {
          display: inline-flex;
          gap: 10px;
          align-items: center;
          margin-top: auto;
          color: var(--purple-deep);
          font-style: normal;
          font-weight: 900;
        }

        .finalCta {
          padding: clamp(78px, 12vw, 172px) clamp(18px, 4vw, 72px);
          display: grid;
          justify-items: center;
          text-align: center;
          background: var(--yellow);
        }
        .finalCta .final-cta-img {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          border-radius: 3rem;
          background: var(--purple-deep);
        }

        .finalCta .finalCtaLogo {
          display: block;
          width: clamp(160px, 18vw, 270px);
          height: auto;
          flex: 0 0 auto;
        }

        .finalCta h2 {
          max-width: 980px;
          margin-top: 34px;
          color: var(--purple-deep);
        }

        .finalCta .primaryButton {
          margin-top: 34px;
          background: var(--purple-deep);
          color: white;
        }

        @media (max-width: 980px) {
          .navBar nav {
            display: none;
          }

          .heroGrid,
          .splitGrid,
          .priceCard,
          .register,
          .upsellGrid {
            grid-template-columns: 1fr;
          }

          .heroGrid {
            align-items: start;
          }

          .heroCard {
            min-height: 460px;
          }

          .outcomeGrid,
          .packageGrid,
          .audienceGrid,
          .notForGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sectionIntro {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .hero {
            padding-top: 24px;
          }

          .hero h1 {
            font-size: clamp(58px, 18vw, 92px);
          }

          .heroCard {
            min-height: 380px;
            border-radius: 30px;
          }

          .cardMark {
            width: 92%;
            top: 18%;
          }

          .section,
          .register {
            padding-left: 16px;
            padding-right: 16px;
          }

          .outcomeGrid,
          .packageGrid,
          .audienceGrid,
          .notForGrid,
          .formGrid,
          .paymentToggle,
          .bankBox dl {
            grid-template-columns: 1fr;
          }

          .scheduleList div {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
      `}</style>
    </main>
  );
}
