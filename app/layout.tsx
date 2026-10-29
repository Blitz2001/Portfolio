import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { SiteNav } from "@/components/SiteNav";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={schibsted.variable}>
      <body>
        <SiteNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
