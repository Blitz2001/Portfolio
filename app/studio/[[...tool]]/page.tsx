import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { sanityReady } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!sanityReady) {
    return (
      <main className="frame section-gap">
        <h1 className="text-section">Studio isn’t connected yet</h1>
        <p className="mt-6 max-w-[60ch] text-lead">
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and optionally <code>NEXT_PUBLIC_SANITY_DATASET</code>) in Vercel, then redeploy. DEPLOY.md
          has the steps.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
