import { z } from "zod";
import raw from "./sources.json" with { type: "json" };

export const SourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  publisher: z.object({ en: z.string().min(1), ja: z.string().min(1) }),
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/),
  url: z.url().startsWith("https://"),
  locator: z.string().optional(),
});

export type Source = z.infer<typeof SourceSchema>;

export const SOURCES: Source[] = z.array(SourceSchema).parse(raw);

const byId = new Map(SOURCES.map((s) => [s.id, s]));

export function source(id: string): Source {
  const s = byId.get(id);
  if (!s) throw new Error(`unknown source id: ${id}`);
  return s;
}
