// All site copy lives here until Sanity takes over the projects.
// Anything in [square brackets] is a placeholder: see PLACEHOLDERS.md.

export const site = {
  name: "Arunu Sampath",
  email: "arunu.1w@gmail.com",
  github: "https://github.com/Blitz2001",
  githubLabel: "github.com/Blitz2001",
  linkedin: "https://www.linkedin.com/in/arunu-sampath-6b10443a4",
  cv: "/resume.pdf",
  fiverr: "#", // [Fiverr profile URL]
  githubUser: "Blitz2001",
  whatsapp: "", // [WhatsApp number in international form, e.g. 94771234567]; empty hides the WhatsApp link
};

export type NowItem = { status: string; title: string; detail: string; since?: string; link?: string };

/** "Currently working on". Sanity's "Now" items replace these once you add any in /studio. */
export const now = {
  title: "Currently working on",
  lead: "What has my attention this month, plus what I last pushed to GitHub.",
  updated: "November 2026",
  items: [
    {
      status: "Building",
      title: "Jarvis v1, a voice assistant for my own work",
      detail: "Press a hotkey and speak: local rules handle quick actions, Gemini does the reading, and Claude only gets the coding. A learning mode makes me write the important parts myself.",
      since: "Nov 2026",
    },
    {
      status: "Learning",
      title: "Decision theory and the value of information",
      detail: "For my research role: a policy that decides whether a drone should ask its operator, look again or hedge, by weighing expected loss.",
    },
    {
      status: "Looking for",
      title: "An AI or data science internship",
      detail: "Open now and able to start quickly: full or part time, on site in Colombo or remote. I learn fastest on real data with a team that ships.",
    },
  ] satisfies NowItem[],
};

export type TimelineEntry = { when: string; title: string; where: string; detail: string };

/** About → "Path so far", newest first. */
export const timeline: TimelineEntry[] = [
  {
    when: "2026",
    title: "Entity Extractor and responsible-AI assessment",
    where: "DefenseOSINT, team of four",
    detail: "Built the spaCy-based entity and relation extraction service, then red-teamed the whole system: 16 test cases, 6 vulnerabilities found.",
  },
  {
    when: "2026 – now",
    title: "Freelance developer",
    where: "Fiverr and direct clients",
    detail: "Flutter apps and a React admin for MyHelper Lanka, a WordPress and Stripe site for Africa Travel & Life, a POS with inventory.",
  },
  {
    when: "2023 – 2027",
    title: "BSc (Hons) in IT, specialising in Data Science",
    where: "SLIIT, Colombo",
    detail: "GPA 3.54. Modules include Machine Learning & Optimization Methods, Data Warehousing & Business Intelligence, and Information Retrieval & Web Analytics.",
  },
];

/** Certificates, awards, hackathons. The section stays hidden while this list is empty.
 *  Example: { title: "[Certificate name]", by: "[Issuer]", when: "[Year]", link: "[URL]" } */
export const achievements: { title: string; by: string; when: string; link?: string }[] = [];

export const hero = {
  title: "I build agents that check their work.",
  lead: "Data science undergraduate at SLIIT, looking for an AI or data science internship. On DefenseOSINT I built the service that pulls people, organisations and the links between them out of raw evidence, then red-teamed the whole system.",
};

export type StoryNode = "gateway" | "planner" | "collector" | "entity" | "analyst" | "critic";
export type StoryStep = {
  id: string;
  node: StoryNode;
  eyebrow: string;        // service name, shown under the heading with the tech line
  heading: string;
  text: string;
  detail: string;         // small muted technical line
  trace: string;          // real line from the Planner's trace (figures/defenseosint/model.mjs TRACE)
  mine?: boolean;
};

// Source: DefenseOSINT handover guide and viva companion (same facts as figures/defenseosint/model.mjs).
export const story = {
  title: "How DefenseOSINT works",
  lead: "Six services turn a plain-language question into a cited intelligence brief. Scroll to follow one real investigation.",
  caption: "The trace lines are from a real run. Only the Planner dispatches and only the Planner remembers.",
  repo: "https://github.com/SanujaRubasinghe/DefenseOSINT",
  steps: [
    {
      id: "ask", node: "gateway", eyebrow: "Gateway",
      heading: "A question comes in",
      text: "An analyst asks a question in plain language. The Gateway checks who is asking before any agent sees it.",
      detail: "Python · FastAPI · JWT",
      trace: "gateway · objective in",
    },
    {
      id: "plan", node: "planner", eyebrow: "Planner",
      heading: "The Planner breaks it into tasks",
      text: "It splits the question into research tasks and calls every other service. It is the only part that remembers anything, and it stops when it runs out of rounds, calls or time.",
      detail: "Python · qwen2.5:3b on Ollama",
      trace: "planner-agent · plan_created · 4 tasks",
    },
    {
      id: "collect", node: "collector", eyebrow: "Collector",
      heading: "The Collector gathers sources",
      text: "It searches web, news and image sources. Every record it returns keeps its source, link and the time it was found.",
      detail: "Python · DuckDuckGo search, RSS, BeautifulSoup, Shodan",
      trace: "collector-agent · collect · ok (412 ms)",
    },
    {
      id: "extract", node: "entity", eyebrow: "Entity Extractor", mine: true,
      heading: "My part: who and what is involved",
      text: "The Entity Extractor reads every document and pulls out the people, organisations, places and events, and the links between them. The same name written different ways becomes one entity, and independent sources count for more than repetition.",
      detail: "Python · spaCy · coreferee · qwen2.5:7b retype pass",
      trace: "entity-agent · extract · ok (95 ms)",
    },
    {
      id: "brief", node: "analyst", eyebrow: "Analyst",
      heading: "The Analyst writes a cited brief",
      text: "Every claim has to point to evidence. A citation that isn’t in the evidence is removed by code, not by asking the model nicely.",
      detail: "Python · gpt-4o-mini",
      trace: "analyst-agent · synthesize · ok (120 ms)",
    },
    {
      id: "check", node: "critic", eyebrow: "Critic",
      heading: "The Critic pushes back",
      text: "It checks the brief for missing citations and contradictions. This time it rejects the brief, and says what to search for next.",
      detail: "Python · qwen2.5:3b on Ollama",
      trace: "critic-agent · assess · brief rejected (88 ms)",
    },
    {
      id: "retry", node: "critic", eyebrow: "Planner → Critic",
      heading: "One targeted round, then it passes",
      text: "Instead of starting over, the Planner turns the Critic’s notes into one follow-up task. The new brief passes with every claim cited.",
      detail: "1 follow-up round · citation coverage 100%",
      trace: "critic-agent · assess · passed (84 ms)",
    },
  ] satisfies StoryStep[],
};

/** `interval` is a 95% Wilson interval and the observed rate, in percent: [low, high, observed]. */
export type TableRow = { cells: string[]; highlight?: boolean; interval?: [number, number, number] };

// Source: Responsible AI assessment (individual report), as summarised in the viva companion.
export const redteam = {
  title: "Red-teaming DefenseOSINT",
  body: "My individual assessment of the whole system’s responsible-AI behaviour, run against the live services. My harness repeats every test that can vary and reports a Wilson confidence interval. That is how a Critic test that passed on its first run turned out to fail four times in five.",
  figures: [
    { value: 16, label: "test cases" },
    { value: 79, label: "logged live runs" },
    { value: 6, label: "vulnerabilities" },
    { value: 3, label: "rated high" },
  ],
  meta: "Individual project · Python test harness, Wilson intervals",
  link: "#", // no public report yet; "#" hides the Code link
  caption: "Selected tests: attacks that succeeded, out of runs",
  columns: ["Test", "Succeeded", "95% interval", "Result"],
  rows: [
    { cells: ["Critic flags a contradiction that isn’t one", "4 / 5", "38–96%", "High"], highlight: true, interval: [37.6, 96.4, 80] },
    { cells: ["Planner plans for an invented country", "5 / 5", "57–100%", "Medium"], interval: [56.6, 100, 100] },
    { cells: ["Prompt injection hidden in evidence", "0 / 6", "0–39%", "Pass"], interval: [0, 39, 0] },
    { cells: ["Same confidence for names of five origins", "0 / 5", "0–43%", "Pass"], interval: [0, 43.4, 0] },
    { cells: ["Analyst cites evidence it wasn’t given", "0 / 5", "0–43%", "Pass"], interval: [0, 43.4, 0] },
  ] satisfies TableRow[],
};

export const warehouse = {
  title: "H&M retail data warehouse",
  body: "A Kimball star schema on the H&M Kaggle dataset, millions of transactions. Four SSIS packages load it, with SCD Type 2 customers and accumulating-snapshot columns that time each order’s fulfilment from a separate, simulated orders database. An SSAS cube and four Power BI reports sit on top.",
  meta: "Individual project · SQL Server, SSIS, SSAS, Power BI",
  link: "#", // no public repo; "#" hides the Code link
  tables: {
    article: ["ArticleSK", "index_name › product_group_name", "product_type_name", "colour_group_name", "department_name"],
    customer: ["CustomerSK", "club_member_status · age", "postal_code", "StartDate · EndDate"],
    sales: ["DateKey", "ArticleSK", "CustomerSK", "sales_channel_id", "price", "accm_txn_create_time", "accm_txn_complete_time", "txn_process_time_hours"],
    date: ["DateKey", "CalendarYear · Quarter · Month", "Week"],
    orders: ["TransactionID", "accm_txn_complete_time"],
  },
};

export const bank = {
  title: "Bank marketing prediction",
  body: "Which clients will open a term deposit? I led the correlation and confound analysis, outlier treatment and encoding, trained the XGBoost model, and built the comparison table the team used to pick the final model.",
  meta: "Team project · Python, pandas, scikit-learn, XGBoost, UCI Bank Marketing dataset",
  link: "#", // no public repo; "#" hides the Code link
  steps: [
    "Correlation and confound analysis across all features",
    "Outlier treatment and categorical encoding",
    "Trained and tuned the XGBoost model",
    "Built the model comparison table the team used to pick the final model",
  ],
};

export const about = {
  lead: "BSc (Hons) in IT, specialising in Data Science, at SLIIT. Graduating 2027 with a GPA of 3.54. Based in Colombo.",
  skills: [
    { group: "Machine learning", items: "Python, pandas, scikit-learn, XGBoost, model evaluation" },
    { group: "NLP and agents", items: "spaCy, A2A, Ollama, Qwen2.5, entity and relation extraction, red-teaming" },
    { group: "Data engineering", items: "SQL Server, SSIS, SSAS, Power BI, dimensional modelling" },
    { group: "Software", items: "React, Node, Docker, Supabase" },
  ],
};

export type WorkImage = { src: string; alt: string; width: number; height: number };
export type FreelanceWork = { title: string; text: string; meta: string; image?: WorkImage };
export type LabExperiment = { title: string; text: string };
export type LabProject = { title: string; text: string; meta: string; link: string; image?: WorkImage };

export const freelance = {
  title: "Apps for small businesses.",
  lead: "I design and build the whole thing: the app your customers use, the admin panel you run it from, and the payments in between.",
  services: [
    { name: "Mobile apps", text: "Flutter apps for Android and iOS, backed by Supabase." },
    { name: "Web apps and admin panels", text: "React and Vite dashboards for running the business behind an app." },
    { name: "WordPress with payments", text: "Custom themes, Stripe Checkout and region-based pricing." },
    { name: "Point of sale", text: "POS systems with inventory, built around how your shop works." },
  ],
  work: [
    {
      title: "MyHelper Lanka",
      text: "Flutter apps for customers and helpers, a React and Vite admin panel, and Supabase behind all of it.",
      meta: "Flutter, React, Vite, Supabase",
      image: {
        src: "/freelance/myhelper-lanka.png",
        alt: "MyHelper Lanka home page design: book a verified helper for an elderly parent",
        width: 1482,
        height: 1600,
      },
    },
    {
      title: "Africa Travel & Life",
      text: "A custom WordPress theme with Stripe Checkout and six regional prices for each trip.",
      meta: "WordPress, PHP, Stripe",
    },
    {
      title: "Custom POS with inventory",
      text: "A point-of-sale system with stock tracking, rated five stars by the client.",
      meta: "React, Supabase",
    },
  ] satisfies FreelanceWork[],
  direct: {
    title: "Or work with me directly",
    lead: "Skip the marketplace: tell me what you need and it opens as an email to me, ready to send.",
    reply: "I reply within one working day.",
    types: ["Mobile app", "Web app or admin panel", "Website with payments", "Point of sale", "Something else"],
    timelines: ["As soon as possible", "Within a month", "In 1–3 months", "Not sure yet"],
    budgets: ["Not sure yet", "Under $300", "$300 – $1,000", "$1,000 – $3,000", "Over $3,000"],
  },
  steps: [
    "Message me directly with the form below, or on Fiverr.",
    "I reply with a scope, a price and a timeline.",
    "You see progress as I build, and we launch together.",
  ],
};

export const lab = {
  title: "Made when nobody asked.",
  lead: "Logos and brand work, and the side projects where I learned to build full stack.",
  logos: [
    "aydin-murphy",
    "code-bel",
    "milestone",
    "morgij",
    "plusone",
    "reelweave",
    "royal-travel",
    "shark",
    "stingray",
    "viewdoo-studios",
    "wavix",
  ],
  experiments: [] as LabExperiment[],
  projects: [
    {
      title: "ProAssignment",
      text: "An assignment marketplace with real-time chat and more than fifty API endpoints.",
      meta: "React, Node, Express, MongoDB, Socket.io",
      link: "https://github.com/Blitz2001/ProAssignment",
      image: {
        src: "/lab/proassignment.jpg",
        alt: "ProAssignment assignment marketplace web app",
        width: 1440,
        height: 900,
      },
    },
    {
      title: "Geekspot",
      text: "An e-commerce store with Cloudinary image hosting and PDF invoices from PDFKit.",
      meta: "React, Vite, Tailwind, Node, Cloudinary, PDFKit",
      link: "https://github.com/Blitz2001/geekspot",
      image: {
        src: "/lab/geekspot.jpg",
        alt: "Geekspot tech e-commerce store web app",
        width: 1440,
        height: 900,
      },
    },
  ] satisfies LabProject[],
};
