import { z } from "zod";

export const SourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  publisher: z.object({ en: z.string().min(1), ja: z.string().min(1) }),
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/),
  url: z.url().startsWith("https://"),
  locator: z.string().optional(),
});

export type Source = z.infer<typeof SourceSchema>;
