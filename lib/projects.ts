import { defineQuery } from "next-sanity";
import type { NowItem } from "@/lib/content";
import { client } from "@/sanity/client";

export type Section = "hire" | "freelance" | "lab";

export type Project = {
  _id: string;
  title: string;
  slug?: string;
  summary?: string;
  meta?: string;
  tech?: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  images?: { _key: string; alt?: string; asset?: { _ref: string }; dimensions?: { width: number; height: number } }[];
};

const PROJECTS = defineQuery(`*[_type == "project" && published == true && section == $section && !(_id in path("drafts.**"))]
  | order(featured desc, order asc, _createdAt desc) {
    _id, title, "slug": slug.current, summary, meta, tech, github, live, featured,
    images[]{ _key, alt, asset, "dimensions": asset->metadata.dimensions }
  }`);

/** Published projects for one page, or null when Sanity isn't connected (the page then uses lib/content.ts). */
export async function getProjects(section: Section): Promise<Project[] | null> {
  if (!client) return null;
  try {
    return await client.fetch<Project[]>(PROJECTS, { section }, { next: { revalidate: 60, tags: ["project"] } });
  } catch (error) {
    console.error("Sanity fetch failed; falling back to local content", error);
    return null;
  }
}

const NOW = defineQuery(`*[_type == "nowItem" && published == true && !(_id in path("drafts.**"))] | order(order asc, _updatedAt desc) { status, title, detail, since, link }`);

/** Published "Now" items, or null to keep the defaults in lib/content.ts. */
export async function getNowItems(): Promise<NowItem[] | null> {
  if (!client) return null;
  try {
    const items = await client.fetch<NowItem[]>(NOW, {}, { next: { revalidate: 60, tags: ["now"] } });
    return items.length ? items : null;
  } catch {
    return null;
  }
}
