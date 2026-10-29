// Sanity is optional until you create the project: with no project id the site uses lib/content.ts.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2025-10-01";
export const sanityReady = /^[a-z0-9-]+$/.test(projectId);
