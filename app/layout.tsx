import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-schibsted",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arunusampath.me"),
  title: { default: "Arunu Sampath: AI and data science", template: "%s · Arunu Sampath" },
  description:
    "Data science undergraduate at SLIIT building LLM agents, ML models and data warehouses. Looking for an AI or data science internship.",
  icons: { icon: "/favicon-round-modified.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e6dbc7" },
    { media: "(prefers-color-scheme: dark)", color: "#081133" },
  ],
};

// Runs before first paint so a saved theme never flashes the other one.
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={schibsted.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
