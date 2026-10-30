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
  updated: "[Month 2026]",
  items: [
    { status: "Building", title: "[Project you are building now]", detail: "[One sentence: what it does and what is new about it.]", since: "[Month]" },
    { status: "Learning", title: "[Course, paper or skill]", detail: "[One sentence: why, and what you will build with it.]" },
    { status: "Looking for", title: "An AI or data science internship", detail: "[From which month, full or part time, on site or remote.]" },
  ] satisfies NowItem[],
};

export type TimelineEntry = { when: string; title: string; where: string; detail: string };

/** About → "Path so far", newest first. */
export const timeline: TimelineEntry[] = [
  {
    when: "[Year]",
    title: "Entity Extractor and responsible-AI assessment",
    where: "DefenseOSINT, team of four",
    detail: "Built the spaCy-based entity and relation extraction service, then red-teamed the whole system: 16 test cases, 6 vulnerabilities found.",
  },
  {
    when: "[Year] – now",
    title: "Freelance developer",
    where: "Fiverr and direct clients",
    detail: "Flutter apps and a React admin for MyHelper Lanka, a WordPress and Stripe site for Africa Travel & Life, a POS with inventory.",
  },
  {
    when: "[Start year] – 2027",
    title: "BSc (Hons) in IT, specialising in Data Science",
    where: "SLIIT, Colombo",
    detail: "GPA 3.54. [Modules or a project you want to name.]",
  },
];

/** Certificates, awards, hackathons. The section stays hidden while this list is empty.
 *  Example: { title: "[Certificate name]", by: "[Issuer]", when: "[Year]", link: "[URL]" } */
export const achievements: { title: string; by: string; when: string; link?: string }[] = [];

export const hero = {
  title: "I build agents that check their work.",
  lead: "Data science undergraduate at SLIIT, looking for an AI or data science internship. On DefenseOSINT I built the service that pulls people, organisations and the links between them out of raw evidence, then red-teamed the whole system.",
};

export type Stage = { id: string; name: string; text: string; tech: string; mine?: boolean };

// Source: DefenseOSINT handover guide and viva companion.
export const pipeline = {
  title: "DefenseOSINT, as a switchboard",
  caption: "Six services that talk over A2A, turning a plain-language question into a cited intelligence brief. Only the Planner dispatches and only the Planner remembers. When the Critic rejects a brief its flag goes up, and the Planner sends one targeted follow-up round instead of starting over. The animation replays a real investigation trace.",
  hint: "Click a station",
  repo: "https://github.com/SanujaRubasinghe/DefenseOSINT",
  stages: [
    {
      id: "gateway",
      name: "Gateway",
      text: "The front door. Authenticates each request before it reaches any agent.",
      tech: "Python",
    },
    {
      id: "planner",
      name: "Planner",
      text: "Splits the question into research tasks, calls every other agent, and is the only service that remembers anything. It stops on an iteration, call and time budget.",
      tech: "Python · qwen2.5:3b on Ollama",
    },
    {
      id: "collector",
      name: "Collector",
      text: "Runs the searches across web, news and image sources. Every record it returns carries its source, URL and retrieval time.",
      tech: "Python",
    },
    {
      id: "entity",
      name: "Entity Extractor",
      text: "Finds the people, organisations, places and events in every document, and the relations between them. “The Sri Lanka Air Force’s” and “Sri Lanka Air Force” become one entity, and confidence grows with independent sources, not repetition.",
      tech: "Python · spaCy · coreferee · qwen2.5:7b retype pass",
      mine: true,
    },
    {
      id: "analyst",
      name: "Analyst",
      text: "Writes the brief and cites evidence for every claim. A citation that isn’t in the evidence is removed in code, not by asking the model nicely.",
      tech: "Python · gpt-4o-mini",
    },
    {
      id: "critic",
      name: "Critic",
      text: "Checks the brief for missing citations and contradictions. Each finding comes with search queries the Planner turns into follow-up tasks.",
      tech: "Python · qwen2.5:3b on Ollama",
    },
  ] satisfies Stage[],
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
  link: "#", // [Link to the report or harness, if public]
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
  body: "A Kimball star schema built on the H&M Kaggle dataset, millions of transactions. Four SSIS packages load it, including an accumulating-snapshot fact for fulfilment. An SSAS cube and four Power BI reports sit on top.",
  meta: "Individual project · SQL Server, SSIS, SSAS, Power BI",
  link: "#", // [GitHub link for the warehouse project]
  tables: {
    article: ["article_key", "product_type_name", "colour_group_name", "department_name"],
    customer: ["customer_key", "club_member_status", "age", "valid_from · valid_to"],
    sales: ["date_key", "article_key", "customer_key", "sales_channel_id", "price"],
    date: ["date_key", "week · month", "season"],
    // [Confirm the real fulfilment snapshot columns]
    fulfilment: ["ordered_date_key", "shipped_date_key", "delivered_date_key", "days_to_deliver"],
  },
};

export const bank = {
  title: "Bank marketing prediction",
  body: "Which clients will open a term deposit? I led the correlation and confound analysis, outlier treatment and encoding, trained the XGBoost model, and built the comparison table the team used to pick the final model.",
  meta: "Team project · Python, pandas, scikit-learn, XGBoost",
  link: "#", // [GitHub link for the bank marketing project]
  caption: "Model comparison, held-out test set",
  columns: ["Model", "Precision", "Recall", "F1", "ROC AUC"],
  // [Fill in real models and metrics; highlight the model you picked]
  rows: [
    { cells: ["[Logistic regression]", "[0.00]", "[0.00]", "[0.00]", "[0.00]"] },
    { cells: ["[Random forest]", "[0.00]", "[0.00]", "[0.00]", "[0.00]"] },
    { cells: ["XGBoost", "[0.00]", "[0.00]", "[0.00]", "[0.00]"], highlight: true },
  ] satisfies TableRow[],
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
      image: "[Screenshot: MyHelper Lanka app and admin]",
    },
    {
      title: "Africa Travel & Life",
      text: "A custom WordPress theme with Stripe Checkout and six regional prices for each trip.",
      meta: "WordPress, PHP, Stripe",
      image: "[Screenshot: Africa Travel & Life site]",
    },
    {
      title: "Custom POS with inventory",
      text: "A point-of-sale system with stock tracking, rated five stars by the client.",
      meta: "[Stack used for the POS]",
      image: "[Screenshot: POS screen]",
    },
  ],
  direct: {
    title: "Or work with me directly",
    lead: "Skip the marketplace: tell me what you need and it opens as an email to me, ready to send.",
    reply: "[I reply within one working day.]",
    types: ["Mobile app", "Web app or admin panel", "Website with payments", "Point of sale", "Something else"],
    timelines: ["As soon as possible", "Within a month", "In 1–3 months", "Not sure yet"],
    budgets: ["Not sure yet", "[Budget range 1]", "[Budget range 2]", "[Budget range 3]"],
  },
  steps: [
    "Message me on Fiverr, or directly with the form below.",
    "I reply with a scope, a price and a timeline.",
    "You see progress as I build, and we launch together.",
  ],
};

export const lab = {
  title: "Made when nobody asked.",
  lead: "Logos and brand work, 3D experiments in the browser, and the side projects where I learned to build full stack.",
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
  experiments: [
    { title: "[Three.js experiment one]", text: "[One line on what it does]" },
    { title: "[Three.js experiment two]", text: "[One line on what it does]" },
  ],
  projects: [
    {
      title: "ProAssignment",
      text: "An assignment marketplace with real-time chat and more than fifty API endpoints.",
      meta: "React, Node, Express, MongoDB, Socket.io",
      link: "#", // [GitHub link]
    },
    {
      title: "Geekspot",
      text: "An e-commerce store with Cloudinary image hosting and PDF invoices from PDFKit.",
      meta: "React, Node, MongoDB, Cloudinary, PDFKit",
      link: "#", // [GitHub link]
    },
  ],
};
