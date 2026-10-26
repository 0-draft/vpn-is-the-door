import { z } from "zod";
import type { Lang } from "../lib/paths";
import raw from "./glossary.json";

const Both = z.object({ en: z.string().min(1), ja: z.string().min(1) });

export const TermSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  // Hiragana reading used for 五十音 order on the Japanese page.
  kana: z.string().regex(/^[ぁ-ゖー]+$/),
  term: Both,
  short: Both,
  long: Both,
  sources: z.array(z.string()).optional(),
});

export type Term = z.infer<typeof TermSchema>;

export const GLOSSARY: Term[] = z.array(TermSchema).parse(raw);

const collators: Record<Lang, Intl.Collator> = {
  en: new Intl.Collator("en", { sensitivity: "base" }),
  ja: new Intl.Collator("ja"),
};

// EN: alphabetical by term. JA: 五十音 by reading.
export function sortedTerms(lang: Lang, terms: Term[] = GLOSSARY): Term[] {
  const c = collators[lang];
  return [...terms].sort((a, b) => (lang === "ja" ? c.compare(a.kana, b.kana) : c.compare(a.term.en, b.term.en)));
}
