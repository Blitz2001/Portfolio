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
  lead: "Data science undergraduate at SLIIT, looking for an AI or data science internship. On DefenseOSINT I built the stage that turns raw reports into people, places and events, and the tests that prove it works.",
};

export type Stage = { name: string; text: string; tech: string; mine?: boolean };

export const pipeline = {
  caption: "DefenseOSINT: six services talking over A2A. Click a stage.",
  loop: "Weak brief? The Critic sends it back to the Planner for more evidence.",
  repo: "https://github.com/SanujaRubasinghe/DefenseOSINT",
  stages: [
    {
      name: "Planner",
      text: "[Confirm] Breaks the analyst’s question into collection tasks, and re-plans when the Critic sends a brief back.",
      tech: "Python · A2A",
    },
    {
      name: "Collector",
      text: "[Confirm] Gathers open-source material for each task and hands it down the line.",
      tech: "Python · Docker",
    },
    {
      name: "Entity Extractor",
      text: "Reads every collected document and pulls out people, organisations, locations and events, plus the relations between them. Scored against a labelled dataset I built for it.",
      tech: "Python · Qwen2.5 on Ollama · Docker",
      mine: true,
    },
    {
      name: "Analyst",
      text: "[Confirm] Writes the intelligence brief from the extracted entities and relations.",
      tech: "Qwen2.5 on Ollama",
    },
    {
      name: "Critic",
      text: "Checks the brief against its evidence. A weak brief goes back to the Planner instead of out the door.",
      tech: "Qwen2.5 on Ollama · A2A",
    },
    {
      name: "Gateway",
      text: "[Confirm] The single way in and out: takes requests from the React front end and returns finished briefs.",
      tech: "Python · React",
    },
  ] satisfies Stage[],
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
  columns: ["Precision", "Recall", "F1", "ROC AUC"],
  // [Fill in real models and metrics; `picked` marks the final model]
  rows: [
    { model: "[Logistic regression]", values: ["[0.00]", "[0.00]", "[0.00]", "[0.00]"] },
    { model: "[Random forest]", values: ["[0.00]", "[0.00]", "[0.00]", "[0.00]"] },
    { model: "XGBoost", values: ["[0.00]", "[0.00]", "[0.00]", "[0.00]"], picked: true },
  ],
};

export const about = {
  lead: "BSc (Hons) in Information Technology, specialising in Data Science, at SLIIT. Expected 2027, GPA 3.54. Based in Colombo.",
  skills: [
    { group: "Machine learning", items: "Python, pandas, scikit-learn, XGBoost, model evaluation" },
    { group: "LLM agents", items: "A2A, Ollama, Qwen2.5, entity and relation extraction" },
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
