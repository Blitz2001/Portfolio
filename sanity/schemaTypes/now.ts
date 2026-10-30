import { defineField, defineType } from "sanity";

// One line of "Currently working on". Published items replace the defaults in lib/content.ts.
export const nowItem = defineType({
  name: "nowItem",
  title: "Now (currently working on)",
  type: "document",
  fields: [
    defineField({
      name: "status",
      type: "string",
      options: { list: ["Building", "Learning", "Reading", "Looking for", "Writing"] },
      initialValue: "Building",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "detail", type: "text", rows: 2, description: "One sentence." }),
    defineField({ name: "since", type: "string", description: "For example: October 2026" }),
    defineField({ name: "link", type: "url" }),
    defineField({ name: "order", type: "number", initialValue: 10 }),
    defineField({ name: "published", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "title", subtitle: "status" } },
});
