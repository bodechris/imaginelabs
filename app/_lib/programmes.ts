export type ProgrammeId =
  | "design-coding"
  | "design-lab"
  | "math-lab"
  | "ai-creators";

export type PlanId = "four" | "eight";
export type AccentName = "purple" | "mint" | "yellow" | "aqua";

export type ProgrammeConfig = {
  id: ProgrammeId;
  slug: string;
  shortCode: string;
  title: string;
  eyebrow: string;
  summary: string;
  promise: string;
  accent: AccentName;
  audience: string;
  format: string;
  sessionLength: string;
  heroWords: [string, string, string];
  outcomes: string[];
  pillars: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  projects: Array<{
    title: string;
    type: string;
    description: string;
    image?: string;
    imageAlt: string;
    placeholder: string;
  }>;
  ageTracks: Array<{
    ages: string;
    name: string;
    description: string;
    tools: string;
    outcome: string;
  }>;
  faq: Array<{ question: string; answer: string }>;
  baseUsd: Record<PlanId, number>;
};

export const programmes: Record<ProgrammeId, ProgrammeConfig> = {
  "design-coding": {
    id: "design-coding",
    slug: "/future-creators/design-coding",
    shortCode: "DC",
    title: "Design + Coding",
    eyebrow: "The flagship programme",
    summary:
      "Live, project-based classes where children design and build games, websites, AI experiments and digital products.",
    promise:
      "Children do not only learn syntax. They learn how to form an idea, design it clearly, code it thoughtfully and explain what they made.",
    accent: "purple",
    audience: "Ages 8–17, grouped by age and ability",
    format: "Live online, small cohorts",
    sessionLength: "75–90 minutes",
    heroWords: ["Imagine it.", "Design it.", "Build it."],
    outcomes: [
      "A finished project every learning cycle",
      "Stronger design and visual communication",
      "Practical coding and computational thinking",
      "Responsible AI and digital fluency",
    ],
    pillars: [
      {
        number: "01",
        title: "Design first",
        description:
          "Every project begins with a brief, sketches, colour, typography, interface decisions and a clear user experience.",
      },
      {
        number: "02",
        title: "Code with purpose",
        description:
          "Programming concepts are introduced when a project needs them, so loops, functions and logic immediately become useful.",
      },
      {
        number: "03",
        title: "Create with AI",
        description:
          "Students use AI to explore ideas, research, test, debug and create—without outsourcing their thinking.",
      },
      {
        number: "04",
        title: "Work digitally",
        description:
          "Typing, coding symbols, shortcuts, file organisation, presentation and safe online habits are built into the sessions.",
      },
    ],
    projects: [
      {
        title: "Build a complete space adventure",
        type: "Python or JavaScript game",
        description:
          "Design the galaxy, player controls, enemies, scoring, levels and sound—then code a complete playable space game from start screen to game over.",
        imageAlt: "A child coding and testing a colourful space adventure game",
        placeholder: "Replace with a photo of a learner building a space game",
      },
      {
        title: "Recreate—and reinvent—a favourite game",
        type: "Game design + creative coding",
        description:
          "Study what makes a favourite game enjoyable, rebuild its core mechanic and transform it with original characters, visuals, rules and challenges.",
        imageAlt: "Children collaboratively redesigning and programming a favourite game",
        placeholder: "Replace with a photo of children designing or play-testing a game",
      },
      {
        title: "Launch a beautiful website",
        type: "Figma + web development",
        description:
          "Create the visual identity and interface in Figma, code responsive pages and publish a polished website for a personal passion, club or original idea.",
        imageAlt: "A young learner designing a website interface on a laptop",
        placeholder: "Replace with a photo of a learner designing a website in Figma",
      },
    ],
    ageTracks: [
      {
        ages: "8–10",
        name: "Young Explorers",
        description:
          "Visual coding, interactive stories, playful game logic, patterns, characters and confident computer use.",
        tools: "Scratch, MakeCode, guided design tools and supervised AI activities",
        outcome: "An interactive game, story or creative digital experience",
      },
      {
        ages: "11–13",
        name: "Digital Makers",
        description:
          "Interface design, Python foundations, web basics and structured problem-solving through purposeful projects.",
        tools: "Figma, Python, HTML, CSS, JavaScript foundations and creative AI",
        outcome: "A designed game, website or useful digital tool",
      },
      {
        ages: "14–17",
        name: "Teen Innovators",
        description:
          "Professional product thinking, deeper programming, collaboration, deployment and portfolio presentation.",
        tools: "Figma, JavaScript, React, Next.js, Python, C# or Unity by pathway",
        outcome: "A polished digital product, game or portfolio case study",
      },
    ],
    faq: [
      {
        question: "Does my child need previous coding experience?",
        answer:
          "No. Learners are placed by age, confidence and current ability. Experienced learners receive more ambitious briefs and technical stretch goals.",
      },
      {
        question: "Will every child learn all the listed technologies?",
        answer:
          "Not at once. Each learning cycle has a focused pathway. Younger learners begin visually, while older learners progressively move into text-based programming and professional tools.",
      },
      {
        question: "What does my child need for online classes?",
        answer:
          "A laptop or desktop computer, reliable internet, headphones, a webcam where possible and a quiet place to work. A tablet alone is not sufficient for the main coding programme.",
      },
      {
        question: "How will I know my child is progressing?",
        answer:
          "Parents receive project updates, a progress summary and a link or recording showing what the learner designed, built and can now explain independently.",
      },
    ],
    baseUsd: { four: 125, eight: 222 },
  },
  "design-lab": {
    id: "design-lab",
    slug: "/future-creators/design-lab",
    shortCode: "DL",
    title: "Design Lab",
    eyebrow: "Visual thinking for young creators",
    summary:
      "A project-led introduction to design principles, visual communication, Figma and age-appropriate vector design.",
    promise:
      "Students learn to make choices intentionally—why one colour, typeface, layout or interaction communicates better than another.",
    accent: "yellow",
    audience: "Ages 8–17, grouped by age and ability",
    format: "Live online, small cohorts",
    sessionLength: "60–75 minutes",
    heroWords: ["See clearly.", "Think visually.", "Design boldly."],
    outcomes: [
      "A growing portfolio of original design work",
      "Colour, typography and layout confidence",
      "Figma fluency and collaborative critique",
      "Intentional creative problem-solving",
    ],
    pillars: [
      {
        number: "01",
        title: "Design principles",
        description:
          "Colour, contrast, hierarchy, spacing, balance, grids and typography are learned through visible before-and-after decisions.",
      },
      {
        number: "02",
        title: "Figma first",
        description:
          "Figma is the primary tool because it supports interfaces, graphics, prototypes, collaboration and live feedback in one place.",
      },
      {
        number: "03",
        title: "Vectors when ready",
        description:
          "Illustrator or comparable vector workflows are introduced to older learners who are ready for deeper logo, icon and illustration work.",
      },
      {
        number: "04",
        title: "Critique and presentation",
        description:
          "Students learn to receive feedback, improve their work and explain the thinking behind every final design.",
      },
    ],
    projects: [
      {
        title: "Create a complete game identity",
        type: "Brand + visual world",
        description:
          "Name an original game, design its logo, colour system, characters, launch poster and the visual language that makes its world recognisable.",
        imageAlt: "A child presenting a colourful game brand and character system",
        placeholder: "Replace with a photo of a learner presenting a game identity",
      },
      {
        title: "Design an interactive mobile app",
        type: "Figma + UI/UX",
        description:
          "Research a useful idea, map the experience and build a polished clickable prototype with onboarding, navigation and thoughtful interface states.",
        imageAlt: "A young designer creating a mobile app prototype in Figma",
        placeholder: "Replace with a photo of a learner designing an app in Figma",
      },
      {
        title: "Build a character universe",
        type: "Illustration + storytelling",
        description:
          "Create original characters, environments and a campaign across posters, social graphics and motion-ready scenes that tell one coherent story.",
        imageAlt: "Children sketching and designing characters and a visual story world",
        placeholder: "Replace with a photo of children building a character world",
      },
    ],
    ageTracks: [
      {
        ages: "8–10",
        name: "Playful Designers",
        description:
          "Shapes, colour, composition, characters, simple interfaces and storytelling through guided visual challenges.",
        tools: "Figma with guided templates, drawing and simple vector activities",
        outcome: "A poster, character world or interactive visual story",
      },
      {
        ages: "11–13",
        name: "Visual Makers",
        description:
          "Brand identity, layout, interface screens, prototypes and the language needed to explain design choices.",
        tools: "Figma, FigJam and introductory vector workflows",
        outcome: "A mini brand, campaign or app prototype",
      },
      {
        ages: "14–17",
        name: "Junior Designers",
        description:
          "Research, UI/UX, design systems, vector craft, critique and portfolio-ready presentation.",
        tools: "Figma first; Illustrator introduced for advanced vector projects",
        outcome: "A polished visual identity or product-design case study",
      },
    ],
    faq: [
      {
        question: "Should students learn Figma or Illustrator first?",
        answer:
          "Figma first. It is easier to teach live, supports collaboration and covers interface, layout, graphics and prototyping. Illustrator becomes valuable for older learners who want deeper vector illustration, icon or logo craft.",
      },
      {
        question: "Does a child need to be good at drawing?",
        answer:
          "No. Design is broader than drawing. It includes arranging information, selecting type and colour, solving visual problems, testing ideas and communicating clearly.",
      },
      {
        question: "Will students use templates?",
        answer:
          "Templates may support early exercises, but final projects are built from each learner's own ideas and decisions. The aim is not to decorate a ready-made design.",
      },
      {
        question: "Does my child need paid software?",
        answer:
          "Most core work can begin with Figma's available classroom tools. Advanced Illustrator modules may require access to Adobe software; this will always be communicated before enrolment.",
      },
    ],
    baseUsd: { four: 78, eight: 139 },
  },
  "math-lab": {
    id: "math-lab",
    slug: "/future-creators/math-lab",
    shortCode: "ML",
    title: "Math Lab",
    eyebrow: "Strong foundations. Useful mathematics.",
    summary:
      "Curriculum-aware maths support strengthened by visual explanations, problem-solving and practical projects.",
    promise:
      "We close gaps, build confidence and help children understand how mathematics powers games, design, code and everyday decisions.",
    accent: "mint",
    audience: "Ages 8–17, grouped by level and curriculum",
    format: "Live online + optional in-person in selected Johannesburg areas",
    sessionLength: "60–75 minutes",
    heroWords: ["Understand it.", "Use it.", "Own it."],
    outcomes: [
      "Clearer mathematical foundations",
      "Improved confidence and problem-solving",
      "Targeted support based on a diagnostic",
      "Visible links between maths and real projects",
    ],
    pillars: [
      {
        number: "01",
        title: "Diagnose first",
        description:
          "A short starting assessment identifies missing foundations, current strengths and the most useful learning priorities.",
      },
      {
        number: "02",
        title: "Explain visually",
        description:
          "Diagrams, number models, interactive examples and step-by-step reasoning make abstract ideas easier to understand.",
      },
      {
        number: "03",
        title: "Practise deliberately",
        description:
          "Students complete focused practice without being buried in repetitive worksheets that do not address the real gap.",
      },
      {
        number: "04",
        title: "Apply through projects",
        description:
          "Geometry, percentages, probability, algebra and data become tools for designing games, spaces, budgets and experiments.",
      },
    ],
    projects: [
      {
        title: "Plan a mission to another planet",
        type: "Measurement + algebra + data",
        description:
          "Calculate distance, speed, travel time, supplies and fuel constraints, then present a mathematically defensible space-mission plan.",
        imageAlt: "Children using mathematics to plan a space mission",
        placeholder: "Replace with a photo of learners solving a space-mission challenge",
      },
      {
        title: "Engineer a fair game economy",
        type: "Probability + percentages",
        description:
          "Design rewards, chances, scores and virtual prices, simulate hundreds of outcomes and improve the system until it feels fair and fun.",
        imageAlt: "A learner analysing scores and probabilities for a game",
        placeholder: "Replace with a photo of a learner testing game maths",
      },
      {
        title: "Design a real space to scale",
        type: "Geometry + measurement",
        description:
          "Measure, calculate area and cost, create an accurate scale plan and defend every design decision using clear mathematical reasoning.",
        imageAlt: "Children measuring and designing a room or creative studio",
        placeholder: "Replace with a photo of learners measuring and designing a space",
      },
    ],
    ageTracks: [
      {
        ages: "8–10",
        name: "Foundation Builders",
        description:
          "Number sense, arithmetic, multiplication, fractions, patterns, measurement and confidence with mathematical language.",
        tools: "Visual models, guided exercises, games and practical challenges",
        outcome: "Stronger fluency and a clear explanation of how an answer was reached",
      },
      {
        ages: "11–13",
        name: "Problem Solvers",
        description:
          "Fractions, ratios, percentages, geometry, introductory algebra, data and multi-step reasoning.",
        tools: "Digital whiteboards, problem sets, graphs and project activities",
        outcome: "Greater independence in school maths and applied problem-solving",
      },
      {
        ages: "14–17",
        name: "Maths Thinkers",
        description:
          "Targeted curriculum support, algebra, functions, geometry, statistics and exam-oriented reasoning where appropriate.",
        tools: "Learner curriculum materials, diagnostic practice and visual modelling",
        outcome: "Closed knowledge gaps, stronger method and improved mathematical confidence",
      },
    ],
    faq: [
      {
        question: "Is Math Lab aligned to my child's school curriculum?",
        answer:
          "Yes. The diagnostic and parent intake identify the learner's grade, school and curriculum so sessions can support CAPS, Nigerian, British or another relevant pathway while still strengthening universal foundations.",
      },
      {
        question: "Where are in-person sessions available?",
        answer:
          "Subject to schedule and travel, in-person support is available around Sandton, Randburg, Fourways, Rosebank, Hyde Park and nearby areas. Availability is confirmed after the diagnostic.",
      },
      {
        question: "Does in-person learning cost the same?",
        answer:
          "Online programme prices are shown on the page. In-person lessons may include a separate travel or venue amount depending on location, group size and schedule; the exact amount is confirmed before payment.",
      },
      {
        question: "Can my child join only for exam preparation?",
        answer:
          "Yes, but the first session still identifies the underlying gaps. Exam technique works best when the learner also understands the concepts behind the questions.",
      },
    ],
    baseUsd: { four: 78, eight: 139 },
  },
  "ai-creators": {
    id: "ai-creators",
    slug: "/future-creators/ai-creators",
    shortCode: "AI",
    title: "AI Creators",
    eyebrow: "Use AI brilliantly. Think independently.",
    summary:
      "A guided AI-literacy programme for designing, researching, learning, creating content, coding and solving everyday problems responsibly.",
    promise:
      "Children learn that the goal is not to ask AI to think for them. The goal is to ask better questions, verify answers and turn ideas into original work.",
    accent: "aqua",
    audience: "Ages 8–17, with age-appropriate tools and supervision",
    format: "Live online, small cohorts",
    sessionLength: "60–75 minutes",
    heroWords: ["Ask better.", "Check carefully.", "Create originally."],
    outcomes: [
      "Practical and responsible AI literacy",
      "Better prompting and clearer instructions",
      "Verification, privacy and bias awareness",
      "Original projects using AI as a collaborator",
    ],
    pillars: [
      {
        number: "01",
        title: "Understand AI",
        description:
          "Students explore patterns, training data, limitations and why confident-sounding answers can still be incorrect.",
      },
      {
        number: "02",
        title: "Prompt with intention",
        description:
          "They learn to provide context, constraints, examples and evaluation criteria rather than typing vague requests.",
      },
      {
        number: "03",
        title: "Verify and protect",
        description:
          "Every activity reinforces fact-checking, privacy, bias, copyright, attribution and age-appropriate digital safety.",
      },
      {
        number: "04",
        title: "Make original work",
        description:
          "AI supports brainstorming, research, design, code and revision, while the student's judgement and authorship remain central.",
      },
    ],
    projects: [
      {
        title: "Build an AI research detective",
        type: "Research + verification",
        description:
          "Create a repeatable workflow that asks stronger questions, compares sources, catches unsupported claims and produces a trustworthy research brief.",
        imageAlt: "A learner researching and fact-checking information with AI",
        placeholder: "Replace with a photo of a learner using AI for guided research",
      },
      {
        title: "Direct an original AI story world",
        type: "Design + content creation",
        description:
          "Write the concept, define the art direction and create an original illustrated story, campaign or short visual experience with documented human decisions.",
        imageAlt: "Children directing an AI-assisted visual storytelling project",
        placeholder: "Replace with a photo of learners creating an AI-assisted story",
      },
      {
        title: "Prototype a useful AI assistant",
        type: "Product + code",
        description:
          "Define a genuine school or everyday problem, design the experience and build a working prototype that uses AI safely and purposefully.",
        imageAlt: "A teenager designing and coding an AI assistant prototype",
        placeholder: "Replace with a photo of a learner building an AI product",
      },
    ],
    ageTracks: [
      {
        ages: "8–10",
        name: "Curious Creators",
        description:
          "Teacher-led AI demonstrations, pattern games, question-building and supervised creative activities without unsupervised accounts.",
        tools: "Adult-operated AI tools, drawing, storytelling and classification activities",
        outcome: "An AI-assisted story, visual experiment or pattern project",
      },
      {
        ages: "11–13",
        name: "Smart Explorers",
        description:
          "Guided prompting, verification, research, creative workflows and safe use with parent-supported access where required.",
        tools: "Curated AI tools, design platforms and simple coding environments",
        outcome: "A researched creative project or guided AI prototype",
      },
      {
        ages: "14–17",
        name: "AI Innovators",
        description:
          "Advanced prompting, product thinking, AI-assisted code, research synthesis, evaluation and responsible publication.",
        tools: "Generative AI, Figma, coding tools and age-appropriate APIs where suitable",
        outcome: "A useful AI-supported product or portfolio case study",
      },
    ],
    faq: [
      {
        question: "Will AI do the work for the student?",
        answer:
          "No. Students must form the idea, provide direction, evaluate the output, make final decisions and explain their process. AI is treated as a tool, not a substitute for understanding.",
      },
      {
        question: "How do you handle younger children and AI accounts?",
        answer:
          "Younger learners take part through teacher-operated demonstrations and supervised activities. Parent permission and age requirements are respected before any learner uses an external account.",
      },
      {
        question: "Is this only a prompting course?",
        answer:
          "No. Prompting is one part. The programme also covers research, verification, privacy, bias, copyright, creative direction, coding support and product design.",
      },
      {
        question: "Can this help with school learning?",
        answer:
          "Yes. Learners practise using AI to explain difficult ideas, create revision questions, compare sources and organise learning—while checking every important answer independently.",
      },
    ],
    baseUsd: { four: 78, eight: 139 },
  },
};

export const programmeOrder: ProgrammeId[] = [
  "design-coding",
  "design-lab",
  "math-lab",
  "ai-creators",
];

export function isProgrammeId(value: unknown): value is ProgrammeId {
  return typeof value === "string" && value in programmes;
}

export function isPlanId(value: unknown): value is PlanId {
  return value === "four" || value === "eight";
}
