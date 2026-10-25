import { z } from "zod";
import { type Source, SourceSchema } from "./source-schema";

// One JSON file per chapter under ./sources so parallel edits don't collide.
const files = import.meta.glob<{ default: unknown }>("./sources/*.json", { eager: true });

export const SOURCES: Source[] = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b))
  .flatMap(([, m]) => z.array(SourceSchema).parse(m.default));

const byId = new Map(SOURCES.map((s) => [s.id, s]));

export function source(id: string): Source {
  const s = byId.get(id);
  if (!s) throw new Error(`unknown source id: ${id}`);
  return s;
}
