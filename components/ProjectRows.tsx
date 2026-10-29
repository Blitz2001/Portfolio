import Image from "next/image";
import type { Project } from "@/lib/projects";
import { imageUrl } from "@/sanity/client";
import { Shot } from "./Shot";
import { WorkRow } from "./WorkRow";

// Projects added in /studio, each as a 5/7 row with its first image.
export function ProjectRows({ projects }: { projects: Project[] }) {
  return projects.map((p) => {
    const image = p.images?.[0];
    const src = image?.asset ? imageUrl(image)?.width(1400).url() : undefined;
    const meta = [p.meta, p.tech?.join(", ")].filter(Boolean).join(" · ");
    return (
      <WorkRow key={p._id} title={p.title} body={p.summary ?? ""} meta={meta} link={p.github} live={p.live}>
        {src ? (
          <Image
            src={src}
            alt={image?.alt ?? ""}
            width={image?.dimensions?.width ?? 1400}
            height={image?.dimensions?.height ?? 875}
            sizes="(min-width: 768px) 58vw, 100vw"
            className="w-full rounded-[28px] bg-sand-2 object-cover"
          />
        ) : (
          <Shot label={`[Screenshot: ${p.title}]`} />
        )}
      </WorkRow>
    );
  });
}
