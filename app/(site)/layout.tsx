import { CommandPalette } from "@/components/CommandPalette";
import { RefTracker } from "@/components/RefTracker";
import { Reveal } from "@/components/Reveal";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SiteNav } from "@/components/SiteNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <SmoothScroll />
      <SiteNav />
      <main>{children}</main>
      <RefTracker />
      <Reveal />
      <CommandPalette />
    </>
  );
}
