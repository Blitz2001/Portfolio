import { RefTracker } from "@/components/RefTracker";
import { Reveal } from "@/components/Reveal";
import { SiteNav } from "@/components/SiteNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
      <RefTracker />
      <Reveal />
    </>
  );
}
