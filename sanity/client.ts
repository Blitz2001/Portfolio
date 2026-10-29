import { createClient } from "next-sanity";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId, sanityReady } from "./env";

export const client = sanityReady ? createClient({ projectId, dataset, apiVersion, useCdn: true }) : null;

const builder = sanityReady ? createImageUrlBuilder({ projectId, dataset }) : null;
export const imageUrl = (source: SanityImageSource) => builder?.image(source).auto("format").fit("max");
