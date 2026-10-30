import { defineArrayMember, defineField, defineType } from "sanity";
import { nowItem } from "./now";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({
      name: "section",
      title: "Shown on",
      type: "string",
      description: "Which page lists this project.",
      options: {
        list: [
          { title: "Hire me (recruiters)", value: "hire" },
          { title: "Freelance (clients)", value: "freelance" },
          { title: "Lab (side projects)", value: "lab" },
        ],
        layout: "radio",
      },
      initialValue: "hire",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "summary", type: "text", rows: 3, description: "Two or three sentences: what it is and what you did." }),
    defineField({ name: "meta", title: "Role line", type: "string", description: "For example: Team project · Python, XGBoost" }),
    defineField({
      name: "images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string", validation: (rule) => rule.required() })],
        }),
      ],
    }),
    defineField({ name: "tech", type: "array", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
    defineField({ name: "github", title: "GitHub link", type: "url" }),
    defineField({ name: "live", title: "Live link", type: "url" }),
    defineField({ name: "featured", type: "boolean", initialValue: false, description: "Featured projects are listed first." }),
    defineField({ name: "order", type: "number", description: "Lower numbers come first.", initialValue: 10 }),
    defineField({ name: "published", type: "boolean", initialValue: false, description: "Only published projects appear on the site." }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", section: "section", published: "published", media: "images.0" },
    prepare: ({ title, section, published, media }) => ({ title, subtitle: `${section ?? ""}${published ? "" : " · draft"}`, media }),
  },
});

export const schemaTypes = [project, nowItem];
