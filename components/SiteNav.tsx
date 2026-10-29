"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/content";

const tabs = [
  { href: "/", label: "Hire me" },
  { href: "/freelance", label: "Freelance" },
  { href: "/lab", label: "Lab" },
];

export function SiteNav() {
  const path = usePathname();
  return (
    <header className="frame flex flex-wrap items-center gap-x-8 gap-y-3 py-5">
      <Link href="/" className="text-xl font-extrabold tracking-[-0.05em] no-underline">
        {site.name}
      </Link>
      <nav aria-label="Sections" className="order-3 flex w-full gap-6 md:order-none md:ml-auto md:w-auto md:gap-7">
        {tabs.map((t) => {
          const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`text-base font-semibold no-underline decoration-2 underline-offset-[6px] hover:underline ${active ? "underline" : ""}`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
      <a href={site.cv} className="btn ml-auto px-4 py-2.5 text-[0.9375rem] md:ml-0">
        Download CV
      </a>
    </header>
  );
}
