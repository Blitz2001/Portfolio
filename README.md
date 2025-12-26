# Portfolio Website

A minimal, performance-focused portfolio for a Software Engineer (MERN Stack), built with React, Vite, and Tailwind CSS.
Designed to be clean, professional, and deployed effortlessly.

## Tech Stack
- **Framework**: React 18 + Vite (SWC)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React

## Project Structure
```
src/
├── components/
│   ├── sections/    # Individual page sections (Hero, Projects, Skills...)
│   └── ui/          # Shared UI components (Button, Section wrapper)
├── data/
│   └── index.js     # Centralized content - EDIT THIS file to change text/projects
├── App.jsx          # Main application layout
├── index.css        # Global styles & Tailwind directives
└── main.jsx         # Entry point
```

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start local development server:**
    ```bash
    npm run dev
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```

## Customization
- **Content**: Edit `src/data/index.js` to update your bio, projects, skills, and contact info.
- **Design**: The `src/data/index.js` file also contains the "Design" section content.
- **Colors/Fonts**: configuration is in `tailwind.config.js`.

## Deployment (Vercel)
This project is optimized for Vercel.
1. Push to GitHub.
2. Import project in Vercel.
3. Framework preset: **Vite**.
4. Deploy.
