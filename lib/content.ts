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
};

export const hero = {
  title: "I build agents that check their work.",
  lead: "Data science undergraduate at SLIIT, looking for an AI or data science internship. On DefenseOSINT I built the service that pulls people, organisations and the links between them out of raw evidence, then red-teamed the whole system.",
};

export type Stage = { name: string; text: string; tech: string; mine?: boolean };

// Source: DefenseOSINT handover guide and viva companion.
export const pipeline = {
  caption: "DefenseOSINT turns a plain-language question into a cited intelligence brief. Six services talking over A2A. Click a stage.",
  loop: "A weak brief goes back: the Critic’s findings become narrow follow-up searches, not a fresh start.",
  repo: "https://github.com/SanujaRubasinghe/DefenseOSINT",
  stages: [
    {
      name: "Gateway",
      text: "The front door. Authenticates each request before it reaches any agent.",
      tech: "Python",
    },
    {
      name: "Planner",
      text: "Splits the question into research tasks, calls every other agent, and is the only service that remembers anything. It stops on an iteration, call and time budget.",
      tech: "Python · qwen2.5:3b on Ollama",
    },
    {
      name: "Collector",
      text: "Runs the searches across web, news and image sources. Every record it returns carries its source, URL and retrieval time.",
      tech: "Python",
    },
    {
      name: "Entity Extractor",
      text: "Finds the people, organisations, places and events in every document, and the relations between them. “The Sri Lanka Air Force’s” and “Sri Lanka Air Force” become one entity, and confidence grows with independent sources, not repetition.",
      tech: "Python · spaCy · coreferee · qwen2.5:7b retype pass",
      mine: true,
    },
    {
      name: "Analyst",
      text: "Writes the brief and cites evidence for every claim. A citation that isn’t in the evidence is removed in code, not by asking the model nicely.",
      tech: "Python · gpt-4o-mini",
    },
    {
      name: "Critic",
      text: "Checks the brief for missing citations and contradictions. Each finding comes with search queries the Planner turns into follow-up tasks.",
      tech: "Python · qwen2.5:3b on Ollama",
    },
  ] satisfies Stage[],
};

export type TableRow = { cells: string[]; highlight?: boolean };

// Source: Responsible AI assessment (individual report), as summarised in the viva companion.
export const redteam = {
  title: "Red-teaming DefenseOSINT",
  body: "My individual assessment of the whole system’s responsible-AI behaviour: 16 test cases and 79 logged runs against the live services. My harness repeats every test that can vary and reports a Wilson confidence interval. That is how a Critic test that passed on its first run turned out to fail four times in five. Six vulnerabilities found, three of them high.",
  meta: "Individual project · Python test harness, Wilson intervals",
  link: "#", // [Link to the report or harness, if public]
  caption: "Selected tests: attacks that succeeded, out of runs",
  columns: ["Test", "Succeeded", "95% interval", "Result"],
  rows: [
    { cells: ["Critic flags a contradiction that isn’t one", "4 / 5", "38–96%", "High"], highlight: true },
    { cells: ["Planner plans for an invented country", "5 / 5", "57–100%", "Medium"] },
    { cells: ["Prompt injection hidden in evidence", "0 / 6", "0–39%", "Pass"] },
    { cells: ["Same confidence for names of five origins", "0 / 5", "0–43%", "Pass"] },
    { cells: ["Analyst cites evidence it wasn’t given", "0 / 5", "0–43%", "Pass"] },
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
  lead: "BSc (Hons) in Information Technology, specialising in Data Science, at SLIIT. Expected 2027, GPA 3.54. Based in Colombo.",
  skills: [
    { group: "Machine learning", items: "Python, pandas, scikit-learn, XGBoost, model evaluation" },
    { group: "NLP and agents", items: "spaCy, A2A, Ollama, Qwen2.5, entity and relation extraction, red-teaming" },
    { group: "Data engineering", items: "SQL Server, SSIS, SSAS, Power BI, dimensional modelling" },
    { group: "Software", items: "React, Node, Docker, Supabase" },
  ],
};

export const freelance = {
  title: "Apps and websites for small businesses.",
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
  steps: [
    "Message me on Fiverr or by email with what you need.",
    "I reply with a scope, a price and a timeline.",
    "You see progress as I build, and we launch together.",
  ],
};

export const lab = {
  title: "Things I make when nobody asks.",
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
