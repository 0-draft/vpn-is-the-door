import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One MDX file per page per language: content/chapters/{en,ja}/<slug>.mdx.
// Both languages must exist with the same slug and path (tests/unit/content.test.ts).
const chapters = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/chapters" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(220),
    chapter: z.enum(["where", "after", "doors", "cases", "engineering", "what", "sources", "glossary"]),
    path: z.string().regex(/^\/[a-z0-9-/]+\/$/),
    parent: z.string().optional(),
    order: z.number().int().default(0),
  }),
});

export const collections = { chapters };
