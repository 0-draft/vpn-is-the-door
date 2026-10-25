import type { Lang } from "../lib/paths";

export type Scale = "1:500" | "1:100" | "1:5";

export interface Chapter {
  id: string;
  num: number;
  path: string;
  scales: Scale[];
  title: Record<Lang, string>;
  short: Record<Lang, string>;
}

// The story order is fixed: where they came in → what happens next → the doors
// themselves → real cases → engineering depth → what to do.
export const CHAPTERS: Chapter[] = [
  {
    id: "where",
    num: 1,
    path: "/where-they-came-in/",
    scales: ["1:500", "1:100"],
    title: { en: "Where they came in", ja: "侵入口" },
    short: { en: "Entry points", ja: "侵入口" },
  },
  {
    id: "after",
    num: 2,
    path: "/after-the-door/",
    scales: ["1:100"],
    title: { en: "After the door opens", ja: "扉が開いた後" },
    short: { en: "After entry", ja: "侵入後" },
  },
  {
    id: "doors",
    num: 3,
    path: "/the-doors/",
    scales: ["1:100", "1:5"],
    title: { en: "The doors", ja: "建具表" },
    short: { en: "The doors", ja: "建具表" },
  },
  {
    id: "cases",
    num: 4,
    path: "/cases/",
    scales: ["1:500", "1:100"],
    title: { en: "Cases", ja: "事例" },
    short: { en: "Cases", ja: "事例" },
  },
  {
    id: "engineering",
    num: 5,
    path: "/engineering/",
    scales: ["1:5"],
    title: { en: "For engineers", ja: "技術者向け" },
    short: { en: "Engineers", ja: "技術者向け" },
  },
  {
    id: "what",
    num: 6,
    path: "/what-to-do/",
    scales: ["1:500", "1:100", "1:5"],
    title: { en: "What to do", ja: "再発防止策" },
    short: { en: "What to do", ja: "対策" },
  },
];

export function chapterById(id: string): Chapter {
  const c = CHAPTERS.find((x) => x.id === id);
  if (!c) throw new Error(`unknown chapter: ${id}`);
  return c;
}

export function neighbours(id: string): { prev: Chapter | undefined; next: Chapter | undefined } {
  const i = CHAPTERS.findIndex((x) => x.id === id);
  return { prev: CHAPTERS[i - 1], next: CHAPTERS[i + 1] };
}
